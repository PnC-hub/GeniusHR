'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  Circle,
  FileText,
  Calendar,
  AlertCircle,
  CheckCheck,
  ArrowRight,
  Upload
} from 'lucide-react'

interface Timeline {
  id: string
  phase: string
  title: string
  description: string | null
  status: string
  dueDate: string | null
  completedAt: string | null
  notes: string | null
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

interface OnboardingData {
  timelines: Timeline[]
  signatureRequests: SignatureRequest[]
  employee: {
    firstName: string
    lastName: string
    hireDate: string
    probationEndsAt: string | null
  }
}

const phaseLabels: Record<string, string> = {
  DOCUMENTS_COLLECTION: 'Documenti Assunzione',
  PRIVACY_CONSENT: 'Privacy',
  CONTRACT_SIGNING: 'Contratto',
  DISCIPLINARY_CODE: 'Codice Disciplinare',
  DPI_DELIVERY: 'Consegna DPI',
  DVR_ACKNOWLEDGMENT: 'DVR',
  SAFETY_TRAINING_GENERAL: 'Formazione Sicurezza',
  IT_ACCOUNTS: 'Configurazione IT',
  TEAM_INTRODUCTION: 'Presentazione Team',
  TOOLS_TRAINING: 'Formazione',
  PROBATION_REVIEW_30: 'Review 30gg',
  PROBATION_REVIEW_60: 'Review 60gg',
  PROBATION_FINAL: 'Esito Periodo Prova'
}

export default function EmployeeOnboardingPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<OnboardingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.user?.id) {
      fetchOnboarding()
    }
  }, [session])

  async function fetchOnboarding() {
    try {
      const res = await fetch('/api/employee/onboarding')
      if (!res.ok) throw new Error('Errore nel caricamento')
      const result = await res.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
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
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
      default:
        return <Circle className="w-5 h-5 text-gray-300" />
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
          {error || 'Nessun onboarding trovato'}
        </div>
      </div>
    )
  }

  const { timelines, signatureRequests, employee } = data

  const completedCount = timelines.filter(t => t.status === 'COMPLETED').length
  const totalCount = timelines.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const pendingSignatures = signatureRequests.filter(r => r.status === 'PENDING')
  const urgentSignatures = pendingSignatures.filter(r => r.priority === 'URGENT' || r.priority === 'HIGH')

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Il Tuo Onboarding
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Benvenuto! Completa tutte le fasi per finalizzare il tuo inserimento in azienda.
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm mb-1">Progresso Complessivo</p>
            <p className="text-3xl font-bold">{progress}%</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm mb-1">Completate</p>
            <p className="text-2xl font-bold">{completedCount}/{totalCount}</p>
          </div>
        </div>
        <div className="w-full h-3 bg-blue-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-blue-100 text-sm mt-3">
          Assunto il {formatDate(employee.hireDate)}
          {employee.probationEndsAt && ` • Periodo di prova fino al ${formatDate(employee.probationEndsAt)}`}
        </p>
      </div>

      {/* Urgent Actions */}
      {urgentSignatures.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">
                Azioni Urgenti Richieste
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                Hai {urgentSignatures.length} documento{urgentSignatures.length > 1 ? 'i' : ''} da firmare con priorità alta
              </p>
              <Link
                href="/employee/signatures"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Vai ai Documenti da Firmare
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Documenti da Firmare */}
      {pendingSignatures.length > 0 && (
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documenti da Firmare ({pendingSignatures.length})
          </h2>
          <div className="space-y-3">
            {pendingSignatures.slice(0, 3).map((req) => (
              <Link
                key={req.id}
                href="/employee/signatures"
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {req.document.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {req.dueDate ? `Scadenza: ${formatDate(req.dueDate)}` : 'In attesa di firma'}
                    </p>
                  </div>
                </div>
                {req.priority === 'URGENT' || req.priority === 'HIGH' ? (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    Urgente
                  </span>
                ) : null}
              </Link>
            ))}
            {pendingSignatures.length > 3 && (
              <Link
                href="/employee/signatures"
                className="block text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2"
              >
                Vedi tutti i documenti ({pendingSignatures.length})
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Timeline Onboarding */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Fasi di Inserimento
        </h2>
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
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-700 rounded text-xs">
                          {phaseLabels[timeline.phase] || timeline.phase}
                        </span>
                        {timeline.dueDate && (
                          <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
                            <Calendar className="w-3.5 h-3.5" />
                            {isOverdue ? 'Scaduto il' : 'Scadenza'}: {formatDate(timeline.dueDate)}
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
                  </div>

                  {timeline.status === 'PENDING' && timeline.notes && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-900 dark:text-blue-300">
                        <strong>Note:</strong> {timeline.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Hai bisogno di aiuto?
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
          Se hai domande sul processo di onboarding o sui documenti da compilare, contatta il reparto HR.
        </p>
        <a
          href="mailto:hr@example.com"
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Contatta HR →
        </a>
      </div>
    </div>
  )
}
