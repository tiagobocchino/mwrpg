# Skill: Diagnosticar Pipeline de Ingestão

Diagnostique e corrija falhas no pipeline: $ARGUMENTS

## Checklist — execute nesta ordem

1. **O dado chegou ao ingest-api?** Erro 401 → API key. 422 → payload. 500 → stack trace.
2. **O arquivo chegou ao S3?** Verifique `bronze/{tenant_id}/{dataset}/dt={data}/`
3. **A Lambda foi disparada?** Verifique o trigger em `infra/terraform/lambda.tf`
4. **A transformação falhou?** Teste localmente com DuckDB + fixture
5. **O dado está consultável?** Query direta no silver/ via DuckDB

## Arquivos relevantes

- `services/ingest-api/app/middleware/auth.py`
- `services/ingest-api/app/workers/s3_writer.py`
- `services/transform/handler.py`
- `infra/terraform/lambda.tf`
