# Skill: Onboarding de Novo Tenant

Execute o onboarding completo de um novo tenant: $ARGUMENTS

Argumentos esperados: "nome do tenant | plano (essencial/pro/enterprise) | email admin"

## Passos obrigatórios

1. Gere tenant_id (UUID), API key (`anplt_` + 32 hex chars), senha temporária (16 chars)
2. Insira nas tabelas: `tenants`, `users` (role=TENANT_ADMIN), `apiKeys`
3. Insira no catálogo semântico os datasets padrão do plano
4. Gere rascunho de e-mail de boas-vindas com credenciais

## Verificação pós-criação

- [ ] SELECT retorna o tenant com plano correto
- [ ] API key funciona: `curl -H "X-API-Key: {key}" {INGEST_API_URL}/health`
- [ ] Login funciona no portal web

## Arquivos relevantes

- `packages/shared/db/src/schema.ts`
- `packages/shared/auth/src/index.ts`
- `services/ingest-api/app/middleware/auth.py`
