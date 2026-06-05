'use client'
import type { KpiData } from '../types'

function formatValue(value: number, format: KpiData['format']): string {
  if (format === 'currency') return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  if (format === 'percent') return `${value.toFixed(1)}%`
  if (format === 'duration') { const m = Math.floor(value/60); return `${m}m ${Math.floor(value%60)}s` }
  return new Intl.NumberFormat('pt-BR').format(value)
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data), min = Math.min(...data), range = max-min||1, h=32, w=80
  const points = data.map((v,i) => `${(i/(data.length-1))*w},${h-((v-min)/range)*h}`).join(' ')
  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline points={points} fill="none" stroke={positive?'#34d399':'#f87171'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function KpiCard({ title, value, previousValue, format, sparklineData, pinned }: KpiData) {
  const change = previousValue != null ? ((value-previousValue)/Math.abs(previousValue))*100 : null
  const isPositive = change !== null && change >= 0
  return (
    <div className={`rounded-xl border bg-slate-900 p-4 ${pinned?'border-indigo-500':'border-slate-800'}`}>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{title}</p>
      <p className="mt-2 text-2xl font-bold text-white tabular-nums">{formatValue(value, format)}</p>
      <div className="mt-2 flex items-center justify-between">
        {change !== null && (
          <span className={`text-xs font-medium ${isPositive?'text-emerald-400':'text-red-400'}`}>
            {isPositive?'↑':'↓'} {Math.abs(change).toFixed(1)}%
          </span>
        )}
        {sparklineData && sparklineData.length > 1 && <Sparkline data={sparklineData} positive={isPositive??true} />}
      </div>
    </div>
  )
}
