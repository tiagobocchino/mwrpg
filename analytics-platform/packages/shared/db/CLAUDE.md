# Agente: Shared DB (Drizzle ORM)

## Responsabilidade

Fonte de verdade única do schema do banco. Define tabelas, relacionamentos e índices.
Gera e aplica migrations via Drizzle Kit. Exporta o cliente `db` para os apps TypeScript.

## Tabelas

| Tabela | Propósito |
|---|---|
| `tenants` | Um tenant = um cliente da plataforma |
| `users` | Usuários dos tenants (multi-role) |
| `api_keys` | Chaves de API para ingestão (hash SHA-256) |
| `kpis` | KPIs salvos por tenant + SQL de origem |
| `saved_analyses` | Análises de IA salvas pelos usuários |
| `semantic_catalog` | Metadados das tabelas de dados por tenant (alimenta a IA) |
| `tenant_reports` | Reports Power BI por tenant (fase 2) |

## Workflow

```bash
# 1. Edite src/schema.ts
npx drizzle-kit generate   # gera SQL
# LEIA o SQL gerado antes de continuar
npx drizzle-kit migrate    # aplica
npx drizzle-kit studio     # UI visual
```

## Regras de schema

- Toda tabela: `id uuid primaryKey defaultRandom()`
- Toda tabela com tenantId: `references(() => tenants.id, { onDelete: 'cascade' })`
- Índices em todas as colunas `tenantId`
- `jsonb` para dados estruturados variáveis
