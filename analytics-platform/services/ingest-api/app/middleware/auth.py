import hashlib
import os
from fastapi import Header, HTTPException
import asyncpg

DATABASE_URL = os.environ["DATABASE_URL"]

async def get_tenant(x_api_key: str = Header(...)) -> dict:
    key_hash = hashlib.sha256(x_api_key.encode()).hexdigest()
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        row = await conn.fetchrow(
            """
            SELECT t.id, t.slug, t.plan, t.active
            FROM api_keys k JOIN tenants t ON t.id = k.tenant_id
            WHERE k.key_hash = $1 AND k.active = true AND t.active = true
            """, key_hash
        )
    finally:
        await conn.close()
    if not row:
        raise HTTPException(status_code=401, detail="API key inválida ou tenant inativo")
    return dict(row)
