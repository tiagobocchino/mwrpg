'use client'
import { KpiCard, useKpiRefresh } from '@repo/visual-engine'
import type { KpiData } from '@repo/types'

export function KpiGrid({ initialKpis }: { initialKpis: KpiData[] }) {
  const kpis = useKpiRefresh(initialKpis, { intervalMs: 300_000 })
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {kpis.map(kpi => <KpiCard key={kpi.id} {...kpi} />)}
    </div>
  )
}
