# Agente: Visual Engine

## Responsabilidade

Package React/TypeScript com todos os componentes de visualização. Funciona em apps/web e apps/mobile.

## Componentes exportados

| Componente | Uso |
|---|---|
| `KpiCard` | Número único com variação % e sparkline |
| `ChartWrapper` | Container com header, botão 'trocar visual' e painel SQL |
| `VisualRenderer` | Switch que renderiza o componente certo pelo config.type |
| `VisualSwitcher` | Bottom sheet para trocar chart |
| `BarChart` | Barras verticais — comparação por categoria |
| `LineChart` | Linha/Área — séries temporais |
| `DataTable` | Tabela com sort e paginação |
| `useKpiRefresh` | Hook de polling dos KPIs |

## Adicionar novo tipo de chart

1. Implemente em `src/components/`
2. Adicione `VizType` em `@repo/types/src/index.ts`
3. Registre em `VisualRenderer.tsx`
4. Adicione em `VisualSwitcher.tsx` (VIZ_OPTIONS)
5. Atualize `viz_suggester.py`
6. Exporte em `src/index.ts`

## Convenções de estilo

- Fundo: bg-slate-900, borda: border-slate-800
- Positivo: text-emerald-400, Negativo: text-red-400
- Accent: indigo-500
- Chart.js: sempre responsive: true, maintainAspectRatio: false
