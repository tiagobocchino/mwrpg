# Agente: Ingest API

## Responsabilidade

Porta de entrada de todos os dados. Recebe registros via HTTP POST e grava como Parquet no S3 (bronze/).

## Stack

- FastAPI (Python 3.12) + PyArrow + Boto3 + AsyncPG

## Arquivos-chave

| Arquivo | Responsabilidade |
|---|---|
| `main.py` | Bootstrap FastAPI |
| `app/routers/ingest.py` | POST /ingest/{dataset} |
| `app/middleware/auth.py` | Valida X-API-Key → tenant |
| `app/models/schemas.py` | Pydantic: payload + response |
| `app/workers/s3_writer.py` | Records → Parquet → S3 |

## Desenvolvimento local

```bash
cd services/ingest-api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

## Testar

```bash
curl -X POST http://localhost:8001/ingest/vendas \
  -H "X-API-Key: anplt_sua_key" \
  -H "Content-Type: application/json" \
  -d '{"records": [{"id": "1", "valor": 100.0}]}'
```
