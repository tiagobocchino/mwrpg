import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJWT } from '@repo/auth'
import { db, kpis, eq } from '@repo/db'
import { KpiGrid } from './KpiGrid'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const session = await verifyJWT(cookieStore.get('session')?.value)
  if (!session) redirect('/login')

  const kpiData = await db.select().from(kpis).where(eq(kpis.tenantId, session.tenantId)).orderBy(kpis.pinned, kpis.createdAt)

  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Atualizado automaticamente a cada 5 minutos</p>
      </div>
      {kpiData.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center">
          <p className="text-slate-400 text-sm">Nenhum KPI configurado ainda.</p>
          <a href="/kpis/new" className="mt-3 inline-block text-indigo-400 hover:text-indigo-300 text-sm">Criar primeiro KPI →</a>
        </div>
      ) : (
        <KpiGrid initialKpis={kpiData as any} />
      )}
    </main>
  )
}
