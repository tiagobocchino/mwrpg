# Agente: Web App (Portal do Cliente)

## Responsabilidade

Portal que o cliente final usa. Next.js 14 App Router + PWA.
Nunca faz chamadas diretas ao banco — tudo via Route Handlers internos.

## Estrutura de rotas

```
app/
├── (auth)/login/     → login sem sidebar
├── (app)/            → layout com sidebar
│   ├── dashboard/    → KPIs (Server Component + KpiGrid client)
│   ├── analytics/    → interface IA (todo client)
│   └── kpis/         → galeria + criador
└── api/
    ├── auth/         → login/logout
    ├── kpis/         → CRUD
    └── ai/query/     → proxy para ai-analytics
```

## Regra Server vs Client

- Server Component: busca dados do banco, verifica sessão
- Client Component ('use client'): interatividade, Chart.js, polling

## Desenvolvimento

```bash
cd apps/web && npm run dev   # http://localhost:3000
```

## Variáveis de ambiente

- DATABASE_URL, JWT_SECRET, AI_API_URL, INTERNAL_SECRET
