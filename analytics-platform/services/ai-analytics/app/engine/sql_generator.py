import os
import anthropic

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def generate_sql(catalog: dict, user_query: str, history: list[dict] | None = None) -> str:
    tables_desc = "\n".join([
        f"""
  Tabela: {t['tableName']}
  Descrição: {t['description']}
  Granularidade: {t['grain']}
  Colunas: {', '.join(f"{c['name']} ({c['type']}) — {c['description']}" for c in t['columns'])}"""
        for t in catalog.get("tables", [])
    ])
    bucket = os.environ["S3_BUCKET"]
    tenant_id = catalog["tenantId"]
    system = f"""Você é um gerador de SQL para DuckDB que consulta Parquet no S3.

REGRAS ABSOLUTAS:
1. Apenas SELECT ou WITH...SELECT. Nunca INSERT, UPDATE, DELETE, DROP.
2. Sempre use read_parquet() com path completo: s3://{bucket}/silver/{tenant_id}/{{dataset}}/**/*.parquet
3. Adicione LIMIT 1000 em queries não-agregadas.
4. Se não puder responder com os dados disponíveis, responda: INSUFFICIENT_DATA
5. Responda APENAS com o SQL — sem markdown.

FUNÇÕES DUCKDB: current_date, date_trunc('month', col), INTERVAL '30 days', QUALIFY ROW_NUMBER() OVER (...) = 1

SCHEMA DISPONÍVEL:
{tables_desc}
"""
    messages = []
    if history:
        for msg in history[-6:]: messages.append({"role": msg["role"], "content": msg["content"]})
    messages.append({"role": "user", "content": user_query})
    response = client.messages.create(model="claude-sonnet-4-6", max_tokens=1024, system=system, messages=messages)
    return response.content[0].text.strip()
