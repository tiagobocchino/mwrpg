# Skill: Otimizar Query DuckDB

Otimize a query: $ARGUMENTS

## Técnicas por impacto

1. **Filtro de partição** (maior impacto): filtre o glob S3 por data explicitamente
   ```sql
   -- ruim: lê todo histórico
   FROM read_parquet('s3://bucket/silver/t1/vendas/**/*.parquet')
   -- bom: só últimos 30 dias
   FROM read_parquet('s3://bucket/silver/t1/vendas/dt=2026/0{5,6}/*/data.parquet')
   ```

2. **Column pruning**: nunca SELECT * em Parquet — liste colunas necessárias

3. **QUALIFY** em vez de subquery para deduplicação

4. **LIMIT 1000** em queries exploratórias não-agregadas

5. **Materialize** resultados executados 20x/dia em gold/

## Métricas alvo: <10s execução, <500MB lidos, zero timeout

## Arquivos relevantes

- `services/ai-analytics/app/engine/duckdb_executor.py`
- `services/ai-analytics/app/engine/sql_generator.py`
