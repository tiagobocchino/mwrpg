'use client'
import { useState, useEffect, useRef } from 'react'
import type { KpiData } from '../types'

export function useKpiRefresh(initial: KpiData[], options?: { intervalMs?: number }) {
  const [kpis, setKpis] = useState(initial)
  const intervalMs = options?.intervalMs ?? 300_000
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null)

  useEffect(() => {
    async function refresh() {
      if (document.visibilityState !== 'visible') return
      try {
        const res = await fetch('/api/kpis', { credentials: 'same-origin' })
        if (res.ok) setKpis(await res.json())
      } catch { /* mantém dados anteriores */ }
    }
    timerRef.current = setInterval(refresh, intervalMs)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [intervalMs])

  return kpis
}
