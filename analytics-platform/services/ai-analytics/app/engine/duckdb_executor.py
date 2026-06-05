import duckdb
import re
import os
from typing import Any

BUCKET = os.environ["S3_BUCKET"]
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")

class QueryExecutionError(Exception):
    pass

def execute_query(sql: str, tenant_id: str) -> dict[str, Any]:
    con = duckdb.connect()
    con.execute("INSTALL httpfs; LOAD httpfs;")
    con.execute(f"SET s3_region='{AWS_REGION}';")
    con.execute(f"SET s3_access_key_id='{os.environ['AWS_ACCESS_KEY_ID']}';")
    con.execute(f"SET s3_secret_access_key='{os.environ['AWS_SECRET_ACCESS_KEY']}';")
    resolved = _resolve_paths(sql, tenant_id)
    try:
        df = con.execute(resolved).fetchdf()
    except Exception as e:
        raise QueryExecutionError(str(e)) from e
    schema = [{"name": col, "type": _infer_type(str(df[col].dtype))} for col in df.columns]
    return {"columns": list(df.columns), "rows": df.to_dict(orient="records"), "rowCount": len(df), "schema": schema}

def _resolve_paths(sql: str, tenant_id: str) -> str:
    def replacer(match: re.Match) -> str:
        kw, table = match.group(1), match.group(2)
        if "read_parquet" in table or table.startswith("("):
            return match.group(0)
        return f"{kw} read_parquet('s3://{BUCKET}/silver/{tenant_id}/{table}/**/*.parquet')"
    return re.sub(r'\b(FROM|JOIN)\s+([a-zA-Z_][a-zA-Z0-9_]*)', replacer, sql, flags=re.IGNORECASE)

def _infer_type(dtype: str) -> str:
    if any(t in dtype for t in ["int","float","decimal","double"]): return "number"
    if any(t in dtype for t in ["date","timestamp","time"]): return "date"
    if "bool" in dtype: return "boolean"
    return "string"
