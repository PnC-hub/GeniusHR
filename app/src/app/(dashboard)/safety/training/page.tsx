'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface SafetyTraining {
  id: string
  trainingType: string
  title: string
  hoursCompleted: number
  hoursRequired: number
  status: string
  expiresAt: string | null
  completedAt: string | null
  employee: {
    id: string
    firstName: string
    lastName: string
    department: string | null
    jobTitle: string | null
  }
}

const trainingTypeLabels: Record<string, string> = {
  GENERAL: 'Formazione Generale',
  SPECIFIC_LOW: 'Specifica Rischio Basso',
  SPECIFIC_MEDIUM: 'Specifica Rischio Medio',
  SPECIFIC_HIGH: 'Specifica Rischio Alto',
  FIRST_AID: 'Primo Soccorso',
  FIRE_PREVENTION: 'Antincendio',
  RLS: 'RLS',
  PREPOSTO: 'Preposto',
  DIRIGENTE: 'Dirigente',
  UPDATE: 'Aggiornamento',
}

const statusLabels: Record<string, string> = {
  NOT_STARTED: 'Non iniziata',
  IN_PROGRESS: 'In corso',
  COMPLETED: 'Completata',
  EXPIRED: 'Scaduta',
}

const statusColors: Record<string, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  EXPIRED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

export default function SafetyTrainingPage() {
  const [trainings, setTrainings] = useState<SafetyTraining[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    async function fetchTrainings() {
      try {
        const params = new URLSearchParams()
        if (filter) params.set('status', filter)

        const res = await fetch(`/api/safety/training?${params}`)
        if (!res.ok) throw new Error('Errore nel caricamento')
        const data = await res.json()
        setTrainings(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto')
      } finally {
        setLoading(false)
      }
    }
    fetchTrainings()
  }, [filter])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
    }).format(new Date(dateStr))
  }

  const getDaysUntilExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return null
    const days = Math.floor((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const statusCounts = trainings.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <Link href="/safety" className="hover:text-blue-600">Sicurezza</Link>
              <span>/</span>
              <span>Formazione</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Formazione Obbligatoria
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestione corsi sicurezza D.Lgs. 81/2008
            </p>
          </div>
          <PageInfoTooltip
            title="Formazione Sicurezza"
            description="Traccia tutti i corsi di formazione obbligatori: generale (4h), specifica per rischio, antincendio, primo soccorso, RLS. Il sistema calcola automaticamente le scadenze."
            tips={[
              'Formazione generale: 4h obbligatoria per tutti i lavoratori',
              'Formazione specifica: 4h (basso), 8h (medio), 12h (alto)',
              'Antincendio: 4h (basso), 8h (medio), 16h (alto)',
              'Primo soccorso: 12h con aggiornamento triennale',
              'Aggiornam ento ogni 5 anni per generale e specifica'
            ]}
          />
        </div>
        <Link
          href="/safety/training/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nuova Formazione
        </Link>
      </div>

      {/* Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div
          onClick={() => setFilter('')}
          className={`bg-white dark:bg-zinc-800 rounded-lg p-4 border cursor-pointer transition-colors ${
            !filter ? 'border-blue-500' : 'border-gray-200 dark:border-zinc-700 hover:border-blue-300'
          }`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Tutte</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {trainings.length}
          </p>
        </div>
        <div
          onClick={() => setFilter('NOT_STARTED')}
          className={`bg-white dark:bg-zinc-800 rounded-lg p-4 border cursor-pointer transition-colors ${
            filter === 'NOT_STARTED' ? 'border-gray-500' : 'border-gray-200 dark:border-zinc-700 hover:border-gray-400'
          }`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Non iniziate</p>
          <p className="text-2xl font-bold text-gray-600">
            {statusCounts['NOT_STARTED'] || 0}
          </p>
        </div>
        <div
          onClick={() => setFilter('IN_PROGRESS')}
          className={`bg-white dark:bg-zinc-800 rounded-lg p-4 border cursor-pointer transition-colors ${
            filter === 'IN_PROGRESS' ? 'border-blue-500' : 'border-gray-200 dark:border-zinc-700 hover:border-blue-300'
          }`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">In corso</p>
          <p className="text-2xl font-bold text-blue-600">
            {statusCounts['IN_PROGRESS'] || 0}
          </p>
        </div>
        <div
          onClick={() => setFilter('COMPLETED')}
          className={`bg-white dark:bg-zinc-800 rounded-lg p-4 border cursor-pointer transition-colors ${
            filter === 'COMPLETED' ? 'border-green-500' : 'border-gray-200 dark:border-zinc-700 hover:border-green-300'
          }`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Completate</p>
          <p className="text-2xl font-bold text-green-600">
            {statusCounts['COMPLETED'] || 0}
          </p>
        </div>
        <div
          onClick={() => setFilter('EXPIRED')}
          className={`bg-white dark:bg-zinc-800 rounded-lg p-4 border cursor-pointer transition-colors ${
            filter === 'EXPIRED' ? 'border-red-500' : 'border-gray-200 dark:border-zinc-700 hover:border-red-300'
          }`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Scadute</p>
          <p className="text-2xl font-bold text-red-600">
            {statusCounts['EXPIRED'] || 0}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Dipendente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Tipo Formazione
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Ore
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Stato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Completata
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Scadenza
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Caricamento...
                  </td>
                </tr>
              ) : trainings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Nessuna formazione trovata
                  </td>
                </tr>
              ) : (
                trainings.map((training) => {
                  const daysUntilExpiry = getDaysUntilExpiry(training.expiresAt)
                  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry < 90 && daysUntilExpiry > 0

                  return (
                    <tr key={training.id} className="hover:bg-gray-50 dark:hover:bg-zinc-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {training.employee.firstName} {training.employee.lastName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {training.employee.jobTitle || training.employee.department || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {trainingTypeLabels[training.trainingType] || training.trainingType}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {training.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {training.hoursCompleted}/{training.hoursRequired}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            statusColors[training.status] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {statusLabels[training.status] || training.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(training.completedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {training.expiresAt ? (
                          <div>
                            <div className={`text-sm ${
                              isExpiringSoon ? 'text-amber-600 dark:text-amber-400 font-medium' :
                              daysUntilExpiry !== null && daysUntilExpiry < 0 ? 'text-red-600 dark:text-red-400 font-medium' :
                              'text-gray-500 dark:text-gray-400'
                            }`}>
                              {formatDate(training.expiresAt)}
                            </div>
                            {isExpiringSoon && (
                              <div className="text-xs text-amber-600 dark:text-amber-400">
                                Scade tra {daysUntilExpiry} giorni
                              </div>
                            )}
                            {daysUntilExpiry !== null && daysUntilExpiry < 0 && (
                              <div className="text-xs text-red-600 dark:text-red-400">
                                Scaduta da {Math.abs(daysUntilExpiry)} giorni
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">Mai</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link
                          href={`/safety/training/${training.id}`}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Dettagli
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
