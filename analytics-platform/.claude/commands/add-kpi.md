# Skill: Adicionar novo KPI

Crie um novo KPI para o tenant com base nos argumentos fornecidos: $ARGUMENTS

## O que um KPI precisa

Um KPI é um número calculado por SQL que aparece no dashboard do cliente.
Ele tem: título, SQL que retorna 1 linha com 1 número, formato (currency/percent/number), e intervalo de refresh.

## Passos obrigatórios

1. **Valide o SQL antes de tudo**
   Leia `services/ai-analytics/app/engine/sql_validator.py` e verifique se o SQL dos argumentos
   passa pela validação (somente SELECT, sem mutations, tenant_id isolado).

2. **Verifique se a tabela existe no catálogo semântico**
   Leia `packages/shared/db/src/schema.ts` — tabela `semanticCatalog`.
   Se a tabela referenciada pelo SQL não estiver no catálogo, pare e avise o usuário.

3. **Adicione a rota de API**
   Em `apps/web/app/api/kpis/route.ts`, garanta que o endpoint POST aceita o novo formato.

4. **Teste o SQL localmente**
   Execute com DuckDB lendo os arquivos de fixture em `services/transform/fixtures/`.

## Padrão do SQL de KPI

```sql
SELECT SUM(receita) as value
FROM read_parquet('s3://{bucket}/silver/{tenant_id}/vendas/**/*.parquet')
WHERE date_trunc('month', data_venda) = date_trunc('month', current_date)
```

## Arquivos relevantes

- `packages/shared/db/src/schema.ts` → tabela kpis
- `apps/web/app/(app)/kpis/page.tsx` → galeria de KPIs
- `apps/web/app/api/kpis/route.ts` → CRUD de KPIs
- `packages/visual-engine/src/components/KpiCard.tsx` → card visual
- `services/ai-analytics/app/engine/sql_validator.py` → validação de SQL
