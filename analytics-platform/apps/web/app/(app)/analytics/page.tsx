'use client'
import { useState, useRef } from 'react'
import { ChartWrapper } from '@repo/visual-engine'
import type { AIQueryResponse } from '@repo/types'

export default function AnalyticsPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AIQueryResponse|null>(null)
  const [error, setError] = useState<string|null>(null)
  const [history, setHistory] = useState<Array<{role:'user'|'assistant';content:string}>>([])
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim() || loading) return
    setLoading(true); setError(null)
    const userMessage = query; setQuery('')
    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ query: userMessage, history }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error||'Erro inesperado'); return }
      setResult(data as AIQueryResponse)
      setHistory(prev => [...prev, {role:'user',content:userMessage}, {role:'assistant',content:`SQL: ${data.sql}`}])
    } catch { setError('Erro de conexão. Tente novamente.') }
    finally { setLoading(false); inputRef.current?.focus() }
  }

  async function saveAsKpi() {
    if (!result) return
    const title = prompt('Nome do KPI:'); if (!title) return
    await fetch('/api/kpis', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({title, sql:result.sql, format:'number'}) })
    alert('KPI salvo no dashboard!')
  }

  return (
    <main className="p-4 md:p-8 max-w-5xl mx-auto flex flex-col gap-6 min-h-screen">
      <div>
        <h1 className="text-xl font-bold text-white">Analytics com IA</h1>
        <p className="text-sm text-slate-400 mt-1">Faça perguntas em português sobre seus dados</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)}
          placeholder="Ex: quais produtos venderam mais esse mês?" disabled={loading}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" />
        <button type="submit" disabled={loading||!query.trim()}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-40 transition-colors">
          {loading ? '…' : 'Perguntar'}
        </button>
      </form>
      {error && <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">{error}</div>}
      {result && (
        <div className="flex flex-col gap-3">
          <ChartWrapper
            data={{columns:result.columns, rows:result.data, rowCount:result.rowCount, schema:result.columns.map(c=>({name:c,type:'string' as const}))}}
            config={result.visualization as any}
            title={`${result.rowCount} resultado${result.rowCount!==1?'s':''}`}
            showSql sql={result.sql} />
          <div className="flex gap-2 justify-end">
            <button onClick={saveAsKpi} className="text-xs px-3 py-1.5 rounded border border-slate-700 text-slate-400 hover:text-white transition-colors">Salvar como KPI</button>
            <button onClick={() => {setResult(null);setHistory([])}} className="text-xs px-3 py-1.5 rounded border border-slate-700 text-slate-400 hover:text-white transition-colors">Nova análise</button>
          </div>
        </div>
      )}
    </main>
  )
}
