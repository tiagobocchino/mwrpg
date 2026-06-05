import duckdb
import boto3
import os
import re
from io import BytesIO
import pyarrow.parquet as pq

BUCKET = os.environ["S3_BUCKET"]
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")
s3 = boto3.client("s3")

def handler(event, context):
    for record in event.get("Records", []):
        key: str = record["s3"]["object"]["key"]
        match = re.match(r"bronze/([^/]+)/([^/]+)/(dt=[^/]+)/", key)
        if not match:
            print(f"Skipping key with unexpected path: {key}")
            continue
        tenant_id, dataset, date_part = match.groups()
        transform_to_silver(tenant_id, dataset, date_part)

def _setup_duckdb() -> duckdb.DuckDBPyConnection:
    con = duckdb.connect()
    con.execute("INSTALL httpfs; LOAD httpfs;")
    con.execute(f"SET s3_region='{AWS_REGION}';")
    con.execute(f"SET s3_access_key_id='{os.environ['AWS_ACCESS_KEY_ID']}';")
    con.execute(f"SET s3_secret_access_key='{os.environ['AWS_SECRET_ACCESS_KEY']}';")
    return con

def transform_to_silver(tenant_id: str, dataset: str, date_part: str):
    con = _setup_duckdb()
    bronze_path = f"s3://{BUCKET}/bronze/{tenant_id}/{dataset}/{date_part}/*.parquet"
    df = con.execute(f"""
        SELECT * EXCLUDE (_ingested_at, _tenant_id),
               CAST(_ingested_at AS TIMESTAMP) AS _ingested_at,
               CURRENT_TIMESTAMP               AS _transformed_at,
               '{tenant_id}'                   AS _tenant_id
        FROM read_parquet('{bronze_path}')
    """).fetchdf()
    _write_parquet(df, f"silver/{tenant_id}/{dataset}/{date_part}/data.parquet")
    print(f"Transformed {len(df)} rows → silver/{tenant_id}/{dataset}/{date_part}/")

def _write_parquet(df, s3_key: str):
    import pyarrow as pa
    table = pa.Table.from_pandas(df)
    buf = BytesIO()
    pq.write_table(table, buf, compression="snappy")
    buf.seek(0)
    s3.put_object(Bucket=BUCKET, Key=s3_key, Body=buf.getvalue())
