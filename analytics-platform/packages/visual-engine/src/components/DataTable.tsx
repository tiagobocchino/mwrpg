'use client'
import { useState } from 'react'
import type { ChartData } from '../types'

export function DataTable({ data, pageSize=20 }: { data: ChartData; pageSize?: number }) {
  const [page, setPage] = useState(0)
  const [sortCol, setSortCol] = useState<string|null>(null)
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc')
  const sorted = sortCol ? [...data.rows].sort((a,b) => {
    const av=a[sortCol],bv=b[sortCol]
    const cmp=av==null?-1:bv==null?1:av<bv?-1:av>bv?1:0
    return sortDir==='asc'?cmp:-cmp
  }) : data.rows
  const totalPages = Math.ceil(sorted.length/pageSize)
  const visible = sorted.slice(page*pageSize,(page+1)*pageSize)
  function toggleSort(col: string) {
    if (sortCol===col) setSortDir(d=>d==='asc'?'desc':'asc')
    else { setSortCol(col); setSortDir('asc') }
    setPage(0)
  }
  return (
    <div className="overflow-hidden rounded-lg border border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead><tr className="border-b border-slate-800 bg-slate-800/50">
            {data.columns.map(col => (
              <th key={col} onClick={() => toggleSort(col)}
                className="px-3 py-2 font-medium text-slate-400 cursor-pointer hover:text-white select-none whitespace-nowrap">
                {col} {sortCol===col?(sortDir==='asc'?'↑':'↓'):''}
              </th>
            ))}
          </tr></thead>
          <tbody>{visible.map((row,i) => (
            <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
              {data.columns.map(col => <td key={col} className="px-3 py-2 text-slate-300 whitespace-nowrap">{String(row[col]??'')}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-slate-800">
          <span className="text-xs text-slate-500">{data.rowCount} linhas — página {page+1} de {totalPages}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p=>Math.max(0,p-1))} disabled={page===0} className="px-2 py-1 text-xs rounded border border-slate-700 text-slate-400 disabled:opacity-30 hover:text-white">←</button>
            <button onClick={() => setPage(p=>Math.min(totalPages-1,p+1))} disabled={page===totalPages-1} className="px-2 py-1 text-xs rounded border border-slate-700 text-slate-400 disabled:opacity-30 hover:text-white">→</button>
          </div>
        </div>
      )}
    </div>
  )
}
