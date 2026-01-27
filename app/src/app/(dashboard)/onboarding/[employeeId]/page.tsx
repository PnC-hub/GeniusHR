'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  Circle,
  ArrowLeft,
  FileText,
  Calendar,
  User,
  AlertCircle,
  CheckCheck,
  Plus,
  Trash2
} from 'lucide-react'

interface Timeline {
  id: string
  phase: string
  title: string
  description: string | null
  status: string
  dueDate: string | null
  startedAt: string | null
  completedAt: string | null
  assignedTo: string | null
  notes: string | null
  documentId: string | null
  order: number
}

interface SignatureRequest {
  id: string
  status: string
  priority: string
  dueDate: string | null
  signedAt: string | null
  document: {
    id: string
    name: string
    type: string
  }
}

interface EmployeeData {
  id: string
  firstName: string
  lastName: string
  email: string | null
  department: string | null
  jobTitle: string | null
  hireDate: string
  probationEndsAt: string | null
  status: string
  hasUserAccount: boolean
}

interface OnboardingDetail {
  employee: EmployeeData
  timelinesByPhase: {
    phase1: Timeline[]
    phase2: Timeline[]
    phase3: Timeline[]
    phase4: Timeline[]
  }
  signatureRequests: SignatureRequest[]
  probationOutcome: any
}

const phaseConfig = {
  phase1: {
    title: 'Fase 1: Documenti Assunzione',
    subtitle: 'Giorno 1',
    color: 'blue'
  },
  phase2: {
    title: 'Fase 2: Sicurezza',
    subtitle: 'Giorni 1-3',
    color: 'green'
  },
  phase3: {
    title: 'Fase 3: Configurazione',
    subtitle: 'Prima Settimana',
    color: 'purple'
  },
  phase4: {
    title: 'Fase 4: Periodo Prova',
    subtitle: 'Primi 90 giorni',
    color: 'orange'
  }
}

export default function OnboardingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const employeeId = params.employeeId as string

  const [data, setData] = useState<OnboardingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOnboardingDetail()
  }, [employeeId])

  async function fetchOnboardingDetail() {
    try {
      const res = await fetch(`/api/onboarding/${employeeId}`)
      if (!res.ok) throw new Error('Errore nel caricamento')
      const result = await res.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  async function updateTimelineStatus(timelineId: string, status: string, notes?: string) {
    setUpdating(true)
    try {
      const res = await fetch(`/api/onboarding/${employeeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timelineId, status, notes })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore nell\'aggiornamento')
      }

      await fetchOnboardingDetail()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
    }).format(new Date(dateStr))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'SKIPPED':
        return <Circle className="w-5 h-5 text-gray-400" />
      default:
        return <Circle className="w-5 h-5 text-gray-300" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Completato
          </span>
        )
      case 'IN_PROGRESS':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            In Corso
          </span>
        )
      case 'SKIPPED':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-zinc-700 dark:text-gray-300">
            Saltato
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            In Attesa
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Clock className="w-8 h-8 mx-auto mb-2 animate-spin text-gray-400" />
          <p className="text-gray-500">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg">
          {error || 'Dati non trovati'}
        </div>
      </div>
    )
  }

  const { employee, timelinesByPhase, signatureRequests } = data

  // Calculate overall progress
  const allTimelines = [
    ...timelinesByPhase.phase1,
    ...timelinesByPhase.phase2,
    ...timelinesByPhase.phase3,
    ...timelinesByPhase.phase4
  ]
  const totalPhases = allTimelines.length
  const completedPhases = allTimelines.filter(t => t.status === 'COMPLETED').length
  const progress = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla lista
        </Link>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-medium text-xl">
                  {employee.firstName[0]}{employee.lastName[0]}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {employee.firstName} {employee.lastName}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{employee.jobTitle || 'Nessun ruolo'}</span>
                  <span>•</span>
                  <span>{employee.department || 'Nessun reparto'}</span>
                  <span>•</span>
                  <span>Assunto il {formatDate(employee.hireDate)}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Progresso Onboarding</p>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {progress}%
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {completedPhases} di {totalPhases} completate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Documenti da Firmare */}
      {signatureRequests.length > 0 && (
        <div className="mb-6">
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Documenti da Firmare ({signatureRequests.filter(r => r.status === 'PENDING').length})
            </h2>
            <div className="space-y-3">
              {signatureRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {req.document.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {req.status === 'SIGNED' ? `Firmato il ${formatDate(req.signedAt)}` : 'In attesa di firma'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {req.status === 'SIGNED' ? (
                      <CheckCheck className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeline per Fase */}
      <div className="space-y-6">
        {Object.entries(timelinesByPhase).map(([phaseKey, timelines]) => {
          const config = phaseConfig[phaseKey as keyof typeof phaseConfig]
          const phaseCompleted = timelines.filter(t => t.status === 'COMPLETED').length
          const phaseTotal = timelines.length

          return (
            <div key={phaseKey} className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
              {/* Phase Header */}
              <div className={`bg-${config.color}-50 dark:bg-${config.color}-900/20 p-4 border-b border-gray-200 dark:border-zinc-700`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {config.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{config.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {phaseCompleted}/{phaseTotal} completate
                    </p>
                    <div className="w-32 h-2 bg-gray-200 dark:bg-zinc-700 rounded-full mt-1">
                      <div
                        className={`h-full bg-${config.color}-500 rounded-full transition-all`}
                        style={{ width: `${phaseTotal > 0 ? (phaseCompleted / phaseTotal) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Items */}
              <div className="p-4">
                <div className="space-y-4">
                  {timelines.map((timeline, index) => {
                    const isOverdue = timeline.dueDate && new Date(timeline.dueDate) < new Date() && timeline.status !== 'COMPLETED'

                    return (
                      <div key={timeline.id} className="flex gap-4">
                        {/* Timeline Line */}
                        <div className="flex flex-col items-center">
                          {getStatusIcon(timeline.status)}
                          {index < timelines.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 dark:bg-zinc-700 mt-2" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                {timeline.title}
                              </h3>
                              {timeline.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {timeline.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                {timeline.dueDate && (
                                  <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
                                    <Calendar className="w-3.5 h-3.5" />
                                    Scadenza: {formatDate(timeline.dueDate)}
                                  </span>
                                )}
                                {timeline.completedAt && (
                                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Completato il {formatDate(timeline.completedAt)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              {getStatusBadge(timeline.status)}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 mt-3">
                            {timeline.status !== 'COMPLETED' && (
                              <>
                                {timeline.status !== 'IN_PROGRESS' && (
                                  <button
                                    onClick={() => updateTimelineStatus(timeline.id, 'IN_PROGRESS')}
                                    disabled={updating}
                                    className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50"
                                  >
                                    Inizia
                                  </button>
                                )}
                                <button
                                  onClick={() => updateTimelineStatus(timeline.id, 'COMPLETED')}
                                  disabled={updating}
                                  className="px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  Completa
                                </button>
                                <button
                                  onClick={() => updateTimelineStatus(timeline.id, 'SKIPPED')}
                                  disabled={updating}
                                  className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  Salta
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
