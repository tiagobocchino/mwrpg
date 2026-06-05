'use client'
import type { VizConfig, ChartData } from '../types'
import { KpiCard } from './KpiCard'
import { BarChart } from './BarChart'
import { LineChart } from './LineChart'
import { DataTable } from './DataTable'

interface Props { data: ChartData; config: VizConfig; height?: number }

export function VisualRenderer({ data, config, height = 280 }: Props) {
  if (data.rows.length === 0) return (
    <div className="flex items-center justify-center h-32 text-slate-500 text-sm">Nenhum dado encontrado</div>
  )
  switch (config.type) {
    case 'kpi': {
      const col = config.yAxis as string || data.columns.find(c => data.schema.find(s => s.name===c && s.type==='number')) || data.columns[0]
      return <KpiCard id="inline" title="" value={Number(data.rows[0]?.[col]??0)} format="number" pinned={false} refreshEvery={0} />
    }
    case 'bar':   return <BarChart data={data} config={config} height={height} />
    case 'line':
    case 'area':  return <LineChart data={data} config={config} height={height} />
    case 'table': return <DataTable data={data} />
    default:      return <BarChart data={data} config={config} height={height} />
  }
}
