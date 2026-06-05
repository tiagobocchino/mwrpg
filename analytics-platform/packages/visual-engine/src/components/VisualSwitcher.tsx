'use client'
import { useEffect, useRef } from 'react'
import type { VizType, ChartData } from '../types'

const VIZ_OPTIONS: Array<{ type: VizType; label: string; icon: string; description: string }> = [
  { type: 'bar',     label: 'Barras',    icon: '▐▌', description: 'Comparação por categoria' },
  { type: 'line',    label: 'Linha',     icon: '∿',  description: 'Tendência ao longo do tempo' },
  { type: 'area',    label: 'Área',      icon: '◿',  description: 'Volume ao longo do tempo' },
  { type: 'pie',     label: 'Pizza',     icon: '◔',  description: 'Distribuição proporcional' },
  { type: 'table',   label: 'Tabela',    icon: '▦',  description: 'Dados detalhados em linhas' },
  { type: 'scatter', label: 'Dispersão', icon: '⁙',  description: 'Correlação entre métricas' },
  { type: 'kpi',     label: 'KPI',       icon: '◉',  description: 'Número único em destaque' },
]

interface Props { currentType: VizType; data: ChartData; onSelect: (type: VizType) => void; onClose: () => void }

export function VisualSwitcher({ currentType, onSelect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function h(e: KeyboardEvent) { if (e.key==='Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
         onClick={(e) => e.target===e.currentTarget && onClose()}>
      <div ref={ref} className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-slate-900 border border-slate-700 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Trocar visualização</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">×</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {VIZ_OPTIONS.map(opt => (
            <button key={opt.type} onClick={() => onSelect(opt.type)}
              className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${currentType===opt.type?'border-indigo-500 bg-indigo-500/10 text-white':'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'}`}>
              <span className="text-xl w-6 text-center">{opt.icon}</span>
              <div><p className="text-xs font-medium">{opt.label}</p><p className="text-xs text-slate-500 leading-tight">{opt.description}</p></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
