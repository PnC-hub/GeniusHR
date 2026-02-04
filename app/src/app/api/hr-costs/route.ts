import { NextResponse } from 'next/server'

export async function GET() {
  // Mock data based on Smiledoc seed employees
  const employees = [
    {
      id: '1',
      name: 'Maria Rossi',
      role: 'Igienista Dentale',
      ccnlLevel: '3° Livello',
      ral: 28000,
      tfr: 2074,
      contributions: 8960,
      totalCost: 39034,
      benefits: 'Ticket restaurant',
      department: 'Clinico',
      hasAlert: false
    },
    {
      id: '2',
      name: 'Giuseppe Bianchi',
      role: 'ASO',
      ccnlLevel: '4° Livello',
      ral: 22000,
      tfr: 1630,
      contributions: 7040,
      totalCost: 30670,
      benefits: 'Nessuno',
      department: 'Clinico',
      hasAlert: false
    },
    {
      id: '3',
      name: 'Anna Verdi',
      role: 'ASO',
      ccnlLevel: '4° Livello',
      ral: 22000,
      tfr: 1630,
      contributions: 7040,
      totalCost: 30670,
      benefits: 'Nessuno',
      department: 'Clinico',
      hasAlert: false
    },
    {
      id: '4',
      name: 'Marco Neri',
      role: 'Odontoiatra',
      ccnlLevel: '1° Livello',
      ral: 55000,
      tfr: 4074,
      contributions: 17600,
      totalCost: 76674,
      benefits: 'Auto aziendale',
      department: 'Clinico',
      hasAlert: true
    },
    {
      id: '5',
      name: 'Laura Gialli',
      role: 'Segreteria',
      ccnlLevel: '4° Livello',
      ral: 21000,
      tfr: 1556,
      contributions: 6720,
      totalCost: 29276,
      benefits: 'Ticket restaurant',
      department: 'Segreteria',
      hasAlert: false
    },
    {
      id: '6',
      name: 'Fabio Blu',
      role: 'Amministrazione',
      ccnlLevel: '3° Livello',
      ral: 26000,
      tfr: 1926,
      contributions: 8320,
      totalCost: 36246,
      benefits: 'Nessuno',
      department: 'Amministrazione',
      hasAlert: false
    },
    {
      id: '7',
      name: 'Sara Viola',
      role: 'Segreteria',
      ccnlLevel: '4° Livello',
      ral: 21000,
      tfr: 1556,
      contributions: 6720,
      totalCost: 29276,
      benefits: 'Ticket restaurant',
      department: 'Segreteria',
      hasAlert: false
    },
    {
      id: '8',
      name: 'Luca Arancio',
      role: 'ASO',
      ccnlLevel: '4° Livello',
      ral: 22000,
      tfr: 1630,
      contributions: 7040,
      totalCost: 30670,
      benefits: 'Nessuno',
      department: 'Direzione',
      hasAlert: false
    }
  ]

  // Calculate totals
  const totalYearly = employees.reduce((sum, e) => sum + e.totalCost, 0)
  const totalMonthly = Math.round(totalYearly / 12)
  const avgPerEmployee = Math.round(totalMonthly / employees.length)
  const revenuePercentage = 32 // Mock

  // Department aggregation
  const deptMap: Record<string, number> = {}
  employees.forEach(e => {
    deptMap[e.department] = (deptMap[e.department] || 0) + e.totalCost
  })
  const departments = Object.entries(deptMap).map(([department, amount]) => ({
    department,
    amount,
    percentage: Math.round((amount / totalYearly) * 100)
  })).sort((a, b) => b.amount - a.amount)

  // Level aggregation
  const levelMap: Record<string, number> = {}
  employees.forEach(e => {
    levelMap[e.ccnlLevel] = (levelMap[e.ccnlLevel] || 0) + e.totalCost
  })
  const levels = [
    '1° Livello',
    '2° Livello',
    '3° Livello',
    '4° Livello',
    'Quadro'
  ].map(level => ({
    level,
    amount: levelMap[level] || 0,
    percentage: Math.round(((levelMap[level] || 0) / totalYearly) * 100)
  }))

  // Trend (last 12 months with slight variations)
  const baseAmount = 28450
  const trend = [
    { month: 'Gen', amount: 27800 },
    { month: 'Feb', amount: 28100 },
    { month: 'Mar', amount: 28450 },
    { month: 'Apr', amount: 28200 },
    { month: 'Mag', amount: 28600 },
    { month: 'Giu', amount: 28900 },
    { month: 'Lug', amount: 28450 },
    { month: 'Ago', amount: 27900 },
    { month: 'Set', amount: 28300 },
    { month: 'Ott', amount: 28700 },
    { month: 'Nov', amount: 28450 },
    { month: 'Dic', amount: 29100 }
  ]

  // Budget
  const budget = {
    annual: 350000,
    actual: totalYearly,
    variance: totalYearly - 350000
  }

  // Alerts
  const alerts = [
    {
      employeeName: 'Marco Neri',
      message: 'RAL €55.000 superiore alla media per 1° Livello CCNL Studi Professionali (€35.000-€45.000)'
    }
  ]

  return NextResponse.json({
    totalMonthly,
    totalYearly,
    avgPerEmployee,
    revenuePercentage,
    employees: employees.sort((a, b) => b.totalCost - a.totalCost),
    departments,
    levels,
    trend,
    budget,
    alerts
  })
}
