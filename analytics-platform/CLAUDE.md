# Analytics Platform — Contexto para Agentes

## O que é este projeto

Plataforma SaaS multi-tenant de analytics que migra dados para um data lake (S3 + DuckDB)
e expõe visualizações inteligentes com IA embarcada (Claude API) via portal web e mobile (PWA).

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend web/admin | Next.js 14 (App Router) + Tailwind + Tremor |
| Componentes de chart | packages/visual-engine (Chart.js + React) |
| API de ingestão | FastAPI (Python) — services/ingest-api |
| Transformação ETL | Python + DuckDB em Lambda — services/transform |
| Motor de IA | FastAPI + Claude API — services/ai-analytics |
| ORM / migrations | Drizzle ORM (TypeScript) — packages/shared/db |
| Auth | JWT httpOnly cookie — packages/shared/auth |
| Storage | AWS S3 (Parquet particionado) |
| Query engine | DuckDB (lê S3 diretamente — sem Athena no MVP) |
| Cache | Upstash Redis (free tier) |

## Estrutura de Diretórios

```
analytics-platform/
├── apps/
│   ├── web/          → portal do cliente final (Next.js + PWA)
│   └── admin/        → painel interno de gestão (Next.js)
├── services/
│   ├── ingest-api/   → recebe dados via POST (FastAPI, Python)
│   ├── transform/    → Bronze→Silver→Gold via DuckDB (Lambda, Python)
│   └── ai-analytics/ → NL→SQL→Chart via Claude (FastAPI, Python)
├── packages/
│   ├── visual-engine/ → componentes de chart compartilhados (React/TS)
│   └── shared/
│       ├── db/        → schema Drizzle + migrations
│       ├── auth/      → JWT helpers + middleware
│       └── types/     → tipos TypeScript compartilhados
└── infra/
    └── terraform/    → S3, Lambda, IAM
```

## Modelo Multi-tenant

Cada tenant tem:
- `tenant_id` (UUID) que prefixia TODOS os paths no S3
- Usuários com roles: TENANT_ADMIN | TENANT_ANALYST | TENANT_VIEWER
- KPIs e análises salvas isoladas por tenant

O isolamento de dados é garantido em 3 camadas:
1. JWT contém `tenant_id` — validado em todo middleware
2. Queries DuckDB sempre recebem `tenant_id` no path do S3
3. SQL gerado pela IA passa por validator que bloqueia cross-tenant access

## Camadas do Data Lake (S3)

```
s3://{bucket}/
├── bronze/{tenant_id}/{dataset}/dt={YYYY/MM/DD}/  → dado bruto
├── silver/{tenant_id}/{dataset}/dt={YYYY/MM/DD}/  → limpo + deduplicado
└── gold/{tenant_id}/{dataset}/                    → agregado para BI
```

## Skills Disponíveis (slash commands)

| Comando | O que faz |
|---|---|
| /add-kpi | Cria novo KPI: SQL + card + rota de API |
| /add-dataset | Adiciona dataset ao catálogo semântico |
| /add-tenant | Onboarding completo de novo tenant |
| /add-chart | Novo tipo de chart no visual-engine |
| /add-migration | Nova migration Drizzle com schema update |
| /debug-ingest | Diagnostica falhas no pipeline de ingestão |
| /review-ai-sql | Revisa e melhora SQL gerado pela IA |
| /add-api-route | Adiciona rota na API correta |
| /optimize-query | Otimiza query DuckDB para custo e performance |
| /add-transform | Nova etapa de transformação Bronze→Silver→Gold |

## Comandos de Desenvolvimento

```bash
npm install
npm run dev
cd services/ingest-api && uvicorn main:app --reload --port 8001
cd services/ai-analytics && uvicorn main:app --reload --port 8002
npm run db:generate && npm run db:migrate
```

## Deploy

- apps/web → Vercel (push para main = deploy automático)
- apps/admin → Vercel (subdomínio admin.)
- services/ingest-api → Railway (Dockerfile)
- services/ai-analytics → Railway (Dockerfile)
- services/transform → AWS Lambda (zip via terraform)
- infra → Terraform apply (uma vez)
