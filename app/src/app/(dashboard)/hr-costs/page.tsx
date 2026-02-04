'use client'

import { useEffect, useState } from 'react'
import DashboardHeader from '@/components/DashboardHeader'

type EmployeeCost = {
  id: string
  name: string
  role: string
  ccnlLevel: string
  ral: number
  tfr: number
  contributions: number
  totalCost: number
  benefits: string
  department: string
  hasAlert: boolean
}

type DepartmentCost = {
  department: string
  amount: number
  percentage: number
}

type LevelCost = {
  level: string
  amount: number
  percentage: number
}

type TrendData = {
  month: string
  amount: number
}

type CostData = {
  totalMonthly: number
  totalYearly: number
  avgPerEmployee: number
  revenuePercentage: number
  employees: EmployeeCost[]
  departments: DepartmentCost[]
  levels: LevelCost[]
  trend: TrendData[]
  budget: {
    annual: number
    actual: number
    variance: number
  }
  alerts: Array<{
    employeeName: string
    message: string
  }>
}

export default function HRCostsPage() {
  const [data, setData] = useState<CostData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/hr-costs')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <DashboardHeader
          title="Costi del Personale"
          subtitle="Analisi completa dei costi HR aziendali"
          tooltipTitle="Dashboard Costi HR"
          tooltipDescription="Monitora tutti i costi legati al personale: RAL, contributi, TFR, benefit. Analizza per dipendente, reparto, livello CCNL e confronta con il budget."
          tooltipTips={[
            'Il costo aziendale include RAL + TFR + contributi previdenziali',
            'Gli alert segnalano incoerenze con i livelli CCNL standard',
            'Usa il trend mensile per prevedere l\'andamento annuale'
          ]}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-600 mb-2">Costo Totale Mensile</div>
          <div className="text-3xl font-bold text-gray-900">
            €{data.totalMonthly.toLocaleString('it-IT')}
          </div>
          <div className="text-xs text-gray-500 mt-2">Media mese corrente</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-600 mb-2">Costo Totale Annuale</div>
          <div className="text-3xl font-bold text-gray-900">
            €{data.totalYearly.toLocaleString('it-IT')}
          </div>
          <div className="text-xs text-gray-500 mt-2">Proiezione annua</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-600 mb-2">Costo Medio per Dipendente</div>
          <div className="text-3xl font-bold text-gray-900">
            €{data.avgPerEmployee.toLocaleString('it-IT')}
          </div>
          <div className="text-xs text-gray-500 mt-2">Al mese</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-600 mb-2">Incidenza sul Fatturato</div>
          <div className="text-3xl font-bold text-gray-900">
            {data.revenuePercentage}%
          </div>
          <div className="text-xs text-gray-500 mt-2">Media settore: 35%</div>
        </div>
      </div>

      {/* Alerts */}
      {data.alerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert Coerenza CCNL</h2>
          <div className="space-y-3">
            {data.alerts.map((alert, idx) => (
              <div key={idx} className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-800">
                      <span className="font-semibold">{alert.employeeName}</span> — {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employees Table */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Costi per Dipendente</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ruolo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Livello CCNL
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RAL
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TFR Annuo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contributi
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo Totale
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Benefit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className={emp.hasAlert ? 'bg-amber-50' : 'hover:bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                        {emp.hasAlert && (
                          <svg className="ml-2 h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {emp.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {emp.ccnlLevel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      €{emp.ral.toLocaleString('it-IT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      €{emp.tfr.toLocaleString('it-IT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      €{emp.contributions.toLocaleString('it-IT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                      €{emp.totalCost.toLocaleString('it-IT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {emp.benefits}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900">
                    TOTALE
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    €{data.employees.reduce((sum, e) => sum + e.ral, 0).toLocaleString('it-IT')}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    €{data.employees.reduce((sum, e) => sum + e.tfr, 0).toLocaleString('it-IT')}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    €{data.employees.reduce((sum, e) => sum + e.contributions, 0).toLocaleString('it-IT')}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    €{data.employees.reduce((sum, e) => sum + e.totalCost, 0).toLocaleString('it-IT')}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Departments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Costi per Reparto</h3>
          <div className="space-y-4">
            {data.departments.map((dept) => (
              <div key={dept.department}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      €{dept.amount.toLocaleString('it-IT')}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">({dept.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Levels */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Costi per Livello CCNL</h3>
          <div className="space-y-4">
            {data.levels.filter(l => l.amount > 0).map((level) => (
              <div key={level.level}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{level.level}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      €{level.amount.toLocaleString('it-IT')}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">({level.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600"
                    style={{ width: `${level.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Trend Mensile Ultimi 12 Mesi</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {data.trend.map((item, idx) => {
            const maxAmount = Math.max(...data.trend.map(t => t.amount))
            const height = (item.amount / maxAmount) * 100
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="relative w-full group">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-700 hover:to-blue-500 transition-colors"
                    style={{ height: `${height * 2}px` }}
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    €{item.amount.toLocaleString('it-IT')}
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2 text-center">{item.month}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Budget */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Budget HR Annuale</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Budget Annuale</div>
            <div className="text-2xl font-bold text-gray-900">
              €{data.budget.annual.toLocaleString('it-IT')}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Costo Effettivo</div>
            <div className="text-2xl font-bold text-gray-900">
              €{data.budget.actual.toLocaleString('it-IT')}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Scostamento</div>
            <div className={`text-2xl font-bold ${data.budget.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.budget.variance > 0 ? '+' : ''}€{data.budget.variance.toLocaleString('it-IT')}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Utilizzo Budget</span>
            <span className="font-medium text-gray-900">
              {((data.budget.actual / data.budget.annual) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                data.budget.variance < 0
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}
              style={{ width: `${Math.min((data.budget.actual / data.budget.annual) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
