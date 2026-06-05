# Agente: Transform Service (Lambda)

## Responsabilidade

Transforma Bronze→Silver. Roda como AWS Lambda triggerada por S3 Event.
Usa DuckDB para processar Parquet diretamente no S3.

## Fluxo

```
S3 Event: bronze/{tenant_id}/{dataset}/dt=YYYY/MM/DD/arquivo.parquet
  → handler() extrai tenant_id, dataset, date_part
  → transform_to_silver() via DuckDB
  → escreve silver/{tenant_id}/{dataset}/{date_part}/data.parquet
```

## Testar localmente

```python
import duckdb
con = duckdb.connect()
con.register('bronze', [{"id":"1","valor":100}])
print(con.execute('SELECT * FROM bronze').fetchdf())
```

## Deploy

```bash
pip install -r requirements.txt -t ./package/
cp handler.py ./package/
cd package && zip -r ../transform.zip .
cd ../../infra/terraform && terraform apply -target=aws_lambda_function.transform
```
