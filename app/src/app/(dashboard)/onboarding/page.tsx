'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardHeader from '@/components/DashboardHeader'
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  ChevronRight,
  Plus
} from 'lucide-react'

interface EmployeeOnboarding {
  id: string
  firstName: string
  lastName: string
  email: string | null
  department: string | null
  jobTitle: string | null
  hireDate: string
  status: string
  hasUserAccount: boolean
  onboardingStatus: 'not_started' | 'in_progress' | 'completed'
  onboardingProgress: number
  totalPhases: number
  completedPhases: number
  pendingPhases: number
  inProgressPhases: number
}

export default function OnboardingPage() {
  const [employees, setEmployees] = useState<EmployeeOnboarding[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all')

  useEffect(() => {
    fetchEmployees()
  }, [])

  async function fetchEmployees() {
    try {
      const res = await fetch('/api/onboarding')
      if (!res.ok) throw new Error('Errore nel caricamento')
      const data = await res.json()
      setEmployees(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  async function createOnboarding(employeeId: string) {
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore nella creazione')
      }

      // Refresh list
      await fetchEmployees()
      alert('Onboarding creato con successo!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore sconosciuto')
    }
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
    }).format(new Date(dateStr))
  }

  const filteredEmployees = employees.filter(emp => {
    if (filter === 'all') return true
    return emp.onboardingStatus === filter
  })

  const stats = {
    total: employees.length,
    notStarted: employees.filter(e => e.onboardingStatus === 'not_started').length,
    inProgress: employees.filter(e => e.onboardingStatus === 'in_progress').length,
    completed: employees.filter(e => e.onboardingStatus === 'completed').length
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'not_started':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-zinc-700 dark:text-gray-300">
            <AlertCircle className="w-3.5 h-3.5" />
            Non iniziato
          </span>
        )
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <Clock className="w-3.5 h-3.5" />
            In corso
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completato
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <DashboardHeader
          title="Onboarding Dipendenti"
          subtitle="Gestisci il processo di inserimento dei nuovi assunti"
          tooltipTitle="Workflow Onboarding"
          tooltipDescription="Sistema completo per gestire tutte le fasi di onboarding: documenti da firmare, formazione sicurezza, configurazione accessi e monitoraggio periodo di prova."
          tooltipTips={[
            'Crea onboarding automatico da template per ogni nuovo dipendente',
            'Monitora avanzamento in tempo reale con progress bar',
            'Assegna documenti da firmare direttamente alle fasi',
            'Il sistema invia reminder automatici per scadenze'
          ]}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`bg-white dark:bg-zinc-800 rounded-lg p-4 border-2 transition-all ${
            filter === 'all'
              ? 'border-blue-500 dark:border-blue-400'
              : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300'
          }`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Totale Dipendenti</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </button>

        <button
          onClick={() => setFilter('not_started')}
          className={`bg-white dark:bg-zinc-800 rounded-lg p-4 border-2 transition-all ${
            filter === 'not_started'
              ? 'border-gray-500 dark:border-gray-400'
              : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300'
          }`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Non Iniziati</p>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.notStarted}</p>
        </button>

        <button
          onClick={() => setFilter('in_progress')}
          className={`bg-white dark:bg-zinc-800 rounded-lg p-4 border-2 transition-all ${
            filter === 'in_progress'
              ? 'border-blue-500 dark:border-blue-400'
              : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300'
          }`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">In Corso</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</p>
        </button>

        <button
          onClick={() => setFilter('completed')}
          className={`bg-white dark:bg-zinc-800 rounded-lg p-4 border-2 transition-all ${
            filter === 'completed'
              ? 'border-green-500 dark:border-green-400'
              : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300'
          }`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Completati</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="w-8 h-8 mx-auto mb-2 animate-spin" />
          Caricamento...
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium mb-1">Nessun dipendente</p>
              <p className="text-sm">
                {filter === 'all'
                  ? 'Non ci sono dipendenti da mostrare'
                  : `Nessun dipendente con stato "${filter}"`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Dipendente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ruolo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Data Assunzione
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status Onboarding
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Progresso
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                  {filteredEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-750 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                              {employee.firstName[0]}{employee.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {employee.firstName} {employee.lastName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {employee.email || 'Nessuna email'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {employee.jobTitle || '-'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {employee.department || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDate(employee.hireDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(employee.onboardingStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {employee.totalPhases > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-[100px]">
                              <div className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 rounded-full transition-all"
                                  style={{ width: `${employee.onboardingProgress}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                              {employee.completedPhases}/{employee.totalPhases}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {employee.totalPhases > 0 ? (
                          <Link
                            href={`/onboarding/${employee.id}`}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                          >
                            Dettagli
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <button
                            onClick={() => createOnboarding(employee.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Crea Onboarding
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
