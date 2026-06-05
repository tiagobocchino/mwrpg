import boto3
import pyarrow as pa
import pyarrow.parquet as pq
from io import BytesIO
from datetime import datetime, timezone
import os

s3 = boto3.client("s3")
BUCKET = os.environ["S3_BUCKET"]

def write_to_bronze(tenant_id: str, dataset: str, records: list[dict], received_at: datetime | None = None) -> str:
    if received_at is None:
        received_at = datetime.now(timezone.utc)
    for r in records:
        r["_ingested_at"] = received_at.isoformat()
        r["_tenant_id"] = tenant_id
    table = pa.Table.from_pylist(records)
    buffer = BytesIO()
    pq.write_table(table, buffer, compression="snappy")
    buffer.seek(0)
    date_str = received_at.strftime("%Y/%m/%d")
    ts = received_at.strftime("%H%M%S%f")
    key = f"bronze/{tenant_id}/{dataset}/dt={date_str}/{ts}.parquet"
    s3.put_object(Bucket=BUCKET, Key=key, Body=buffer.getvalue())
    return key
