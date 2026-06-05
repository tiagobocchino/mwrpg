'use client'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { VizConfig, ChartData } from '../types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)
const COLORS = ['#6366f1','#22d3ee','#34d399','#f59e0b']

export function LineChart({ data, config, height=280 }: { data: ChartData; config: VizConfig; height?: number }) {
  const xCol = config.xAxis || data.columns[0]
  const yCols = Array.isArray(config.yAxis) ? config.yAxis : config.yAxis ? [config.yAxis]
    : data.columns.filter(c => c!==xCol && data.schema.find(s => s.name===c && s.type==='number'))
  const isArea = config.type==='area'
  const labels = data.rows.map(r => String(r[xCol]??''))
  const datasets = yCols.map((col,i) => ({
    label:col, data:data.rows.map(r=>Number(r[col]??0)), borderColor:COLORS[i%COLORS.length],
    backgroundColor:isArea?COLORS[i%COLORS.length]+'22':'transparent',
    fill:isArea, tension:0.4, pointRadius:data.rows.length>60?0:3, borderWidth:2
  }))
  return <Line height={height} data={{labels,datasets}} options={{
    responsive:true, maintainAspectRatio:false,
    plugins:{legend:{labels:{color:'#94a3b8',font:{size:11}}}},
    scales:{x:{ticks:{color:'#64748b',font:{size:11},maxTicksLimit:8},grid:{color:'#1e293b'}},y:{ticks:{color:'#64748b',font:{size:11}},grid:{color:'#1e293b'}}}
  }} />
}
