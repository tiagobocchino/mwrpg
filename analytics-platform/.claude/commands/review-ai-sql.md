# Skill: Revisar SQL Gerado pela IA

Revise o SQL: $ARGUMENTS

## Checklist de revisão

1. **Isolamento**: path S3 contém `{tenant_id}` correto? Sem wildcards cross-tenant?
2. **Semântica**: nomes de colunas batem com o catálogo? Tipos compatíveis com operações?
3. **Performance**: tem filtro de data? Usa QUALIFY em vez de subquery? Sem SELECT *?
4. **Compatibilidade DuckDB**: usa `strftime` (não DATE_FORMAT), `INTERVAL '30 days'`, QUALIFY
5. **Shape para visualização**: KPI→1 linha 1 coluna. Line→data+número. Bar→categoria+número.

## Arquivos relevantes

- `services/ai-analytics/app/engine/sql_generator.py`
- `services/ai-analytics/app/engine/sql_validator.py`
- `services/ai-analytics/app/engine/duckdb_executor.py`
