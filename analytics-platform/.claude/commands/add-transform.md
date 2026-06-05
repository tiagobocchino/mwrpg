# Skill: Adicionar Etapa de Transformação

Adicione transformação: $ARGUMENTS ("dataset | silver/gold | descrição")

## Bronze→Silver (obrigatório para todo dataset)

Edite `services/transform/handler.py`:
```python
def transform_to_silver(tenant_id, dataset, date_part):
    if dataset == 'nome': return transform_nome(tenant_id, date_part)

def transform_nome(tenant_id, date_part):
    con = _setup_duckdb()
    df = con.execute(f"""
        SELECT CAST(id AS VARCHAR) AS id, COALESCE(valor, 0.0) AS valor,
               CURRENT_TIMESTAMP AS _transformed_at
        FROM read_parquet('s3://{BUCKET}/bronze/{tenant_id}/nome/{date_part}/*.parquet')
        WHERE id IS NOT NULL
        QUALIFY ROW_NUMBER() OVER (PARTITION BY id ORDER BY _ingested_at DESC) = 1
    """).fetchdf()
    _write_parquet(df, f"silver/{tenant_id}/nome/{date_part}/data.parquet")
```

## Silver→Gold (opcional, para agregações BI)

Crie `services/transform/gold/{nome}.py` — lê silver/, agrega, escreve gold/

## Arquivos relevantes

- `services/transform/handler.py`
- `services/transform/gold/`
- `packages/shared/db/src/schema.ts` (atualizar catálogo após criar Gold)
