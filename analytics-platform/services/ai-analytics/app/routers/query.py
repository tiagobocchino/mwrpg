from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from typing import Any
import asyncpg, os

from ..engine import sql_generator, sql_validator, duckdb_executor, viz_suggester
from ..engine.sql_validator import SQLValidationError
from ..engine.duckdb_executor import QueryExecutionError

router = APIRouter(prefix="/query", tags=["query"])
DATABASE_URL = os.environ["DATABASE_URL"]

class QueryRequest(BaseModel):
    query: str
    history: list[dict[str, str]] | None = None

class QueryResponse(BaseModel):
    sql: str; data: list[dict[str, Any]]; columns: list[str]; rowCount: int; visualization: dict[str, Any]

async def _get_catalog(tenant_id: str) -> dict:
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        rows = await conn.fetch("SELECT table_name, description, grain, columns FROM semantic_catalog WHERE tenant_id = $1", tenant_id)
    finally:
        await conn.close()
    return {"tenantId": tenant_id, "tables": [{"tableName": r["table_name"], "description": r["description"], "grain": r["grain"], "columns": r["columns"]} for r in rows]}

@router.post("/", response_model=QueryResponse)
async def natural_language_query(body: QueryRequest, x_tenant_id: str = Header(...), x_internal_secret: str = Header(...)):
    if x_internal_secret != os.environ["INTERNAL_SECRET"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    catalog = await _get_catalog(x_tenant_id)
    if not catalog["tables"]:
        raise HTTPException(status_code=422, detail="Catálogo semântico vazio para este tenant")
    sql = sql_generator.generate_sql(catalog, body.query, body.history)
    if sql == "INSUFFICIENT_DATA":
        raise HTTPException(status_code=422, detail="Os dados disponíveis não são suficientes para responder essa pergunta")
    try:
        sql_validator.validate(sql)
    except SQLValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    try:
        result = duckdb_executor.execute_query(sql, x_tenant_id)
    except QueryExecutionError as e:
        raise HTTPException(status_code=500, detail=f"Erro na execução: {e}")
    viz = viz_suggester.suggest(result["schema"], result["rows"])
    return QueryResponse(sql=sql, data=result["rows"], columns=result["columns"], rowCount=result["rowCount"], visualization=viz)
