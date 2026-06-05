'use client'
import { useState } from 'react'
import { VisualSwitcher } from './VisualSwitcher'
import { VisualRenderer } from './VisualRenderer'
import type { VizConfig, ChartData } from '../types'

interface Props {
  data: ChartData; config: VizConfig; title: string
  onConfigChange?: (config: VizConfig) => Promise<void>
  showSql?: boolean; sql?: string
}

export function ChartWrapper({ data, config: initialConfig, title, onConfigChange, showSql, sql }: Props) {
  const [config, setConfig] = useState(initialConfig)
  const [showSwitcher, setShowSwitcher] = useState(false)
  const [showSqlPanel, setShowSqlPanel] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleVizChange(type: VizConfig['type']) {
    const newConfig = { ...config, type }
    setConfig(newConfig)
    setShowSwitcher(false)
    if (onConfigChange) { setSaving(true); await onConfigChange(newConfig).finally(() => setSaving(false)) }
  }

  return (
    <div className="relative rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-slate-200 truncate">{title}</h3>
        <div className="flex items-center gap-2 shrink-0">
          {saving && <span className="text-xs text-slate-500">salvando…</span>}
          {showSql && sql && (
            <button onClick={() => setShowSqlPanel(v => !v)}
              className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded border border-slate-700">SQL</button>
          )}
          <button onClick={() => setShowSwitcher(true)}
            className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded border border-slate-700">Trocar visual</button>
        </div>
      </div>
      {showSqlPanel && sql && <pre className="mb-4 rounded-lg bg-slate-800 p-3 text-xs text-slate-300 overflow-x-auto">{sql}</pre>}
      <VisualRenderer data={data} config={config} />
      {showSwitcher && <VisualSwitcher currentType={config.type} data={data} onSelect={handleVizChange} onClose={() => setShowSwitcher(false)} />}
    </div>
  )
}
