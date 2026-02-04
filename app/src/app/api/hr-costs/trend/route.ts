import { NextResponse } from 'next/server'

export async function GET() {
  // Mock 12-month trend with realistic variations
  const trend = [
    { month: 'Gennaio 2025', amount: 27800, variance: -2.3 },
    { month: 'Febbraio 2025', amount: 28100, variance: -1.2 },
    { month: 'Marzo 2025', amount: 28450, variance: 0 },
    { month: 'Aprile 2025', amount: 28200, variance: -0.9 },
    { month: 'Maggio 2025', amount: 28600, variance: 0.5 },
    { month: 'Giugno 2025', amount: 28900, variance: 1.6 },
    { month: 'Luglio 2025', amount: 28450, variance: 0 },
    { month: 'Agosto 2025', amount: 27900, variance: -1.9 },
    { month: 'Settembre 2025', amount: 28300, variance: -0.5 },
    { month: 'Ottobre 2025', amount: 28700, variance: 0.9 },
    { month: 'Novembre 2025', amount: 28450, variance: 0 },
    { month: 'Dicembre 2025', amount: 29100, variance: 2.3 }
  ]

  const average = Math.round(trend.reduce((sum, t) => sum + t.amount, 0) / trend.length)
  const min = Math.min(...trend.map(t => t.amount))
  const max = Math.max(...trend.map(t => t.amount))

  return NextResponse.json({
    trend,
    stats: {
      average,
      min,
      max,
      volatility: ((max - min) / average * 100).toFixed(2) + '%'
    }
  })
}
