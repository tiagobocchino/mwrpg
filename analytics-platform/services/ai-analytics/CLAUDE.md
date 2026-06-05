# Agente: AI Analytics Service

## Responsabilidade

Motor de IA. Recebe perguntas em linguagem natural, gera SQL via Claude API,
executa com DuckDB lendo Parquet no S3, retorna dados + sugestão de visualização.

## Pipeline

```
POST /query { query: "vendas por região esse mês" }
  → _get_catalog(tenant_id) — catálogo semântico do DB
  → sql_generator.generate_sql() — Claude API → SQL
  → sql_validator.validate() — bloqueia não-SELECT
  → duckdb_executor.execute_query() — lê S3
  → viz_suggester.suggest() — decide tipo de chart
  → retorna { sql, data, columns, rowCount, visualization }
```

## Autenticação

Interno apenas. apps/web injeta X-Tenant-Id + X-Internal-Secret.

## Desenvolvimento local

```bash
cd services/ai-analytics
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8002
```

## Custos

~$0.002 por query (Claude Sonnet). Para MVP com 10 usuários: ~$5/mês.
