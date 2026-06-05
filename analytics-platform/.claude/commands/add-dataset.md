# Skill: Adicionar novo Dataset ao Catálogo Semântico

Adicione um novo dataset ao sistema com base nos argumentos: $ARGUMENTS

## Passos obrigatórios

1. Defina o schema: nome (snake_case), colunas, granularidade, métricas vs dimensões
2. Adicione o schema Pydantic em `services/ingest-api/app/models/schemas.py`
3. Registre no catálogo semântico em `packages/shared/db/src/schema.ts`
4. Adicione a regra de transformação em `services/transform/handler.py`
5. Crie fixture de teste em `services/transform/fixtures/{dataset}_sample.json`

## Arquivos relevantes

- `services/ingest-api/app/models/schemas.py`
- `services/transform/handler.py`
- `packages/shared/db/src/schema.ts`
- `services/ai-analytics/app/catalog/store.py`
