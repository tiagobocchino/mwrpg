# Skill: Adicionar novo tipo de Chart ao Visual Engine

Crie um novo componente de visualização: $ARGUMENTS

## Passos obrigatórios

1. Adicione o tipo à union `VizType` em `packages/visual-engine/src/types.ts`
2. Crie o componente em `packages/visual-engine/src/components/{Nome}.tsx`
3. Registre no switch em `VisualRenderer.tsx`
4. Adicione opção em `VisualSwitcher.tsx` (VIZ_OPTIONS array)
5. Atualize `viz_suggester.py` com a regra de detecção automática
6. Exporte em `src/index.ts`

## Padrão de componente

```tsx
'use client'
import type { ChartData, VizConfig } from '../types'

export function NovoChart({ data, config, height = 280 }: {
  data: ChartData; config: VizConfig; height?: number
}) {
  return <div style={{ height }} className="w-full">{/* impl */}</div>
}
```

## Arquivos relevantes

- `packages/visual-engine/src/types.ts`
- `packages/visual-engine/src/components/VisualRenderer.tsx`
- `packages/visual-engine/src/components/VisualSwitcher.tsx`
- `services/ai-analytics/app/engine/viz_suggester.py`
