# Skill: Adicionar Migration de Banco de Dados

Crie uma nova migration Drizzle para a mudança de schema: $ARGUMENTS

## Passos obrigatórios

1. Edite `packages/shared/db/src/schema.ts`
2. Gere a migration: `cd packages/shared/db && npx drizzle-kit generate`
3. LEIA o SQL gerado em `migrations/` antes de continuar
4. Aplique: `npx drizzle-kit migrate`
5. Atualize exports em `src/index.ts` se criou nova tabela

## Convenções

```typescript
export const minhaTabela = pgTable('minha_tabela', {
  id:        uuid('id').primaryKey().defaultRandom(),
  tenantId:  uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, t => ({ tenantIdx: index('minha_tabela_tenant_idx').on(t.tenantId) }))
```
