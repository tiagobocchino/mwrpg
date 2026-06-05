export type Plan = 'essencial' | 'pro' | 'enterprise'
export type UserRole = 'TENANT_ADMIN' | 'TENANT_ANALYST' | 'TENANT_VIEWER' | 'PLATFORM_ADMIN'
export type KpiFormat = 'currency' | 'percent' | 'number' | 'duration'
export type VizType = 'kpi' | 'line' | 'bar' | 'pie' | 'table' | 'scatter' | 'area'

export interface VizConfig {
  type: VizType
  xAxis?: string
  yAxis?: string | string[]
  title?: string
  colors?: string[]
}

export interface ChartData {
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  schema: ColumnSchema[]
}

export interface ColumnSchema {
  name: string
  type: 'string' | 'number' | 'date' | 'boolean'
}

export interface KpiData {
  id: string
  title: string
  value: number
  previousValue?: number
  format: KpiFormat
  sparklineData?: number[]
  refreshEvery: number
  pinned: boolean
}

export interface AIQueryRequest {
  query: string
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
}

export interface AIQueryResponse {
  sql: string
  data: Record<string, unknown>[]
  columns: string[]
  rowCount: number
  visualization: VizConfig
}
