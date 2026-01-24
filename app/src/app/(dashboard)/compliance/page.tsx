'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ComplianceStatus {
  score: number
  statusLevel: 'excellent' | 'good' | 'warning' | 'critical'
  metrics: {
    totalEmployees: number
    employeesWithGdprConsent: number
    gdprConsentRate: number
    overdueDeadlines: number
    upcomingDeadlines: number
    documentsExpiringSoon: number
    recentAuditLogs: number
  }
  checklist: {
    id: string
    title: string
    description: string
    completed: boolean
    count: number
    total?: number
    priority: 'high' | 'medium' | 'low'
  }[]
}

export default function ComplianceDashboardPage() {
  const [status, setStatus] = useState<ComplianceStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/compliance/status')
        if (!res.ok) throw new Error('Errore nel caricamento')
        const data = await res.json()
        setStatus(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto')
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [])

  const getScoreColor = (level: string) => {
    switch (level) {
      case 'excellent':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
      case 'good':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300'
      case 'warning':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900 dark:text-amber-300'
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'medium':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
      case 'low':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    )
  }

  if (!status) return null

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Compliance
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitora lo stato di conformità GDPR e normativo del tuo studio
        </p>
      </div>

      {/* Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className={`col-span-1 rounded-xl p-6 ${getScoreColor(status.statusLevel)}`}
        >
          <p className="text-sm font-medium opacity-80">Punteggio Compliance</p>
          <p className="text-5xl font-bold mt-2">{status.score}</p>
          <p className="text-sm mt-1 opacity-80">/100</p>
        </div>

        <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Dipendenti</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {status.metrics.totalEmployees}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Consensi GDPR</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {status.metrics.gdprConsentRate}%
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Scadenze in ritardo</p>
            <p
              className={`text-2xl font-bold ${
                status.metrics.overdueDeadlines > 0
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}
            >
              {status.metrics.overdueDeadlines}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Prossime scadenze</p>
            <p className="text-2xl font-bold text-amber-600">
              {status.metrics.upcomingDeadlines}
            </p>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Checklist Compliance
          </h2>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-zinc-700">
          {status.checklist.map((item) => (
            <li key={item.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.completed
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-400 dark:bg-zinc-700 dark:text-gray-500'
                  }`}
                >
                  {item.completed ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      item.completed
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {item.total !== undefined && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.count}/{item.total}
                  </span>
                )}
                {!item.completed && item.count > 0 && (
                  <span className="text-sm text-red-600 font-medium">
                    {item.count} da gestire
                  </span>
                )}
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${getPriorityBadge(
                    item.priority
                  )}`}
                >
                  {item.priority === 'high'
                    ? 'Alta'
                    : item.priority === 'medium'
                    ? 'Media'
                    : 'Bassa'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/compliance/audit"
          className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Audit Log</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {status.metrics.recentAuditLogs} eventi ultimi 7 giorni
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/deadlines"
          className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700 hover:border-amber-500 dark:hover:border-amber-500 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-amber-600 dark:text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Scadenze</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {status.metrics.upcomingDeadlines} in scadenza
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/employees"
          className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700 hover:border-green-500 dark:hover:border-green-500 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Dipendenti</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {status.metrics.employeesWithGdprConsent}/{status.metrics.totalEmployees}{' '}
                con consenso
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
