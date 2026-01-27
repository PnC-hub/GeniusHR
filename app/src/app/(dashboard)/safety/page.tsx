'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface DashboardStats {
  totalEmployees: number
  compliance: {
    training: { percentage: number; compliant: number; total: number }
    dvr: { percentage: number; compliant: number; total: number }
    dpi: { percentage: number; compliant: number; total: number }
  }
  upcomingDeadlines: {
    next30Days: number
    next60Days: number
    next90Days: number
    list: any[]
  }
  trainingStats: Record<string, number>
  incidents: {
    last12Months: number
  }
}

export default function SafetyPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/safety/dashboard')
        if (!res.ok) throw new Error('Errore nel caricamento')
        const data = await res.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
    }).format(new Date(dateStr))
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12 text-gray-500">Caricamento...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sicurezza sul Lavoro
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Dashboard compliance D.Lgs. 81/2008
            </p>
          </div>
          <PageInfoTooltip
            title="Sicurezza D.Lgs 81/08"
            description="Dashboard completa per la gestione della sicurezza sul lavoro: formazione obbligatoria, DVR, DPI, registro infortuni. Il sistema monitora la compliance e ti avvisa delle scadenze."
            tips={[
              'Formazione generale: 4h obbligatoria per tutti',
              'Formazione specifica: varia da 4h a 16h per rischio',
              'DVR va aggiornato a ogni cambio organizzativo',
              'DPI devono essere rinnovati secondo scadenze produttore'
            ]}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>
      )}

      {/* Compliance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Formazione Sicurezza</h3>
            <div className={`text-2xl font-bold ${
              (stats?.compliance.training.percentage || 0) >= 80 ? 'text-green-600' :
              (stats?.compliance.training.percentage || 0) >= 50 ? 'text-amber-600' :
              'text-red-600'
            }`}>
              {stats?.compliance.training.percentage || 0}%
            </div>
          </div>
          <div className="mb-2">
            <div className="h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  (stats?.compliance.training.percentage || 0) >= 80 ? 'bg-green-600' :
                  (stats?.compliance.training.percentage || 0) >= 50 ? 'bg-amber-600' :
                  'bg-red-600'
                }`}
                style={{ width: `${stats?.compliance.training.percentage || 0}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stats?.compliance.training.compliant || 0} su {stats?.compliance.training.total || 0} dipendenti in regola
          </p>
          <Link
            href="/safety/training"
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium inline-block"
          >
            Gestisci formazione →
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">DVR Firmato</h3>
            <div className={`text-2xl font-bold ${
              (stats?.compliance.dvr.percentage || 0) >= 80 ? 'text-green-600' :
              (stats?.compliance.dvr.percentage || 0) >= 50 ? 'text-amber-600' :
              'text-red-600'
            }`}>
              {stats?.compliance.dvr.percentage || 0}%
            </div>
          </div>
          <div className="mb-2">
            <div className="h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  (stats?.compliance.dvr.percentage || 0) >= 80 ? 'bg-green-600' :
                  (stats?.compliance.dvr.percentage || 0) >= 50 ? 'bg-amber-600' :
                  'bg-red-600'
                }`}
                style={{ width: `${stats?.compliance.dvr.percentage || 0}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stats?.compliance.dvr.compliant || 0} su {stats?.compliance.dvr.total || 0} dipendenti hanno firmato
          </p>
          <Link
            href="/safety/dvr"
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium inline-block"
          >
            Gestisci DVR →
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">DPI Consegnati</h3>
            <div className={`text-2xl font-bold ${
              (stats?.compliance.dpi.percentage || 0) >= 80 ? 'text-green-600' :
              (stats?.compliance.dpi.percentage || 0) >= 50 ? 'text-amber-600' :
              'text-red-600'
            }`}>
              {stats?.compliance.dpi.percentage || 0}%
            </div>
          </div>
          <div className="mb-2">
            <div className="h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  (stats?.compliance.dpi.percentage || 0) >= 80 ? 'bg-green-600' :
                  (stats?.compliance.dpi.percentage || 0) >= 50 ? 'bg-amber-600' :
                  'bg-red-600'
                }`}
                style={{ width: `${stats?.compliance.dpi.percentage || 0}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stats?.compliance.dpi.compliant || 0} su {stats?.compliance.dpi.total || 0} dipendenti con verbale
          </p>
          <Link
            href="/safety/dpi"
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium inline-block"
          >
            Gestisci DPI →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          href="/safety/training"
          className="bg-white dark:bg-zinc-800 rounded-lg p-5 border border-gray-200 dark:border-zinc-700 hover:border-blue-500 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <span className="text-blue-600 dark:text-blue-400 text-xl">📚</span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Formazione</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats?.trainingStats.COMPLETED || 0} completate
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/safety/dvr"
          className="bg-white dark:bg-zinc-800 rounded-lg p-5 border border-gray-200 dark:border-zinc-700 hover:border-amber-500 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
              <span className="text-amber-600 dark:text-amber-400 text-xl">📄</span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">DVR</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Prese visione
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/safety/dpi"
          className="bg-white dark:bg-zinc-800 rounded-lg p-5 border border-gray-200 dark:border-zinc-700 hover:border-green-500 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <span className="text-green-600 dark:text-green-400 text-xl">🦺</span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">DPI</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Verbali consegna
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/safety/incidents"
          className="bg-white dark:bg-zinc-800 rounded-lg p-5 border border-gray-200 dark:border-zinc-700 hover:border-red-500 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Infortuni</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats?.incidents.last12Months || 0} ultimi 12m
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Scadenze Imminenti
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400 mb-1">Prossimi 30 giorni</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
              {stats?.upcomingDeadlines.next30Days || 0}
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Prossimi 60 giorni</p>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {stats?.upcomingDeadlines.next60Days || 0}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Prossimi 90 giorni</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {stats?.upcomingDeadlines.next90Days || 0}
            </p>
          </div>
        </div>

        {stats?.upcomingDeadlines.list && stats.upcomingDeadlines.list.length > 0 ? (
          <div className="space-y-3">
            {stats.upcomingDeadlines.list.map((deadline: any) => (
              <div
                key={deadline.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{deadline.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {deadline.employee ? `${deadline.employee.firstName} ${deadline.employee.lastName}` : 'Generale'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatDate(deadline.dueDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Nessuna scadenza imminente
          </p>
        )}

        <Link
          href="/deadlines"
          className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium inline-block"
        >
          Vedi tutte le scadenze →
        </Link>
      </div>
    </div>
  )
}
