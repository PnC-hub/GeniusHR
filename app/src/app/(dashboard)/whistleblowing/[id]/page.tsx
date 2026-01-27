'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface WhistleblowingReport {
  id: string
  reporterType: string
  reporterName: string | null
  reporterEmail: string | null
  reporterPhone: string | null
  reporterRole: string | null
  reportDate: string
  category: string
  title: string
  description: string
  personsInvolved: string | null
  evidence: string | null
  status: string
  assignedTo: string | null
  acknowledgedAt: string | null
  investigationStartedAt: string | null
  investigationCompletedAt: string | null
  closedAt: string | null
  outcome: string | null
  actionsTaken: string | null
  lastFeedbackAt: string | null
  accessCode: string
  messages: Message[]
  documents: Document[]
  createdAt: string
}

interface Message {
  id: string
  senderType: string
  content: string
  createdAt: string
}

interface Document {
  id: string
  fileName: string
  filePath: string
  fileSize: number | null
  uploadedBy: string
  createdAt: string
}

const categoryLabels: Record<string, string> = {
  FRAUD: 'Frode',
  CORRUPTION: 'Corruzione',
  SAFETY_VIOLATION: 'Violazioni sicurezza',
  ENVIRONMENTAL: 'Violazioni ambientali',
  DISCRIMINATION: 'Discriminazione',
  HARASSMENT: 'Molestie',
  DATA_BREACH: 'Violazione dati',
  CONFLICT_OF_INTEREST: 'Conflitto interessi',
  FINANCIAL_IRREGULARITY: 'Irregolarità finanziarie',
  OTHER: 'Altro',
}

const statusLabels: Record<string, string> = {
  RECEIVED: 'Ricevuta',
  ACKNOWLEDGED: 'Presa in carico',
  UNDER_INVESTIGATION: 'In indagine',
  ADDITIONAL_INFO_REQUESTED: 'Richieste info',
  SUBSTANTIATED: 'Fondata',
  UNSUBSTANTIATED: 'Non fondata',
  CLOSED: 'Chiusa',
}

const statusColors: Record<string, string> = {
  RECEIVED: 'bg-yellow-100 text-yellow-700',
  ACKNOWLEDGED: 'bg-blue-100 text-blue-700',
  UNDER_INVESTIGATION: 'bg-purple-100 text-purple-700',
  ADDITIONAL_INFO_REQUESTED: 'bg-orange-100 text-orange-700',
  SUBSTANTIATED: 'bg-red-100 text-red-700',
  UNSUBSTANTIATED: 'bg-gray-100 text-gray-700',
  CLOSED: 'bg-green-100 text-green-700',
}

const reporterTypeLabels: Record<string, string> = {
  ANONYMOUS: 'Anonimo',
  CONFIDENTIAL: 'Riservato',
  IDENTIFIED: 'Identificato',
}

export default function WhistleblowingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [report, setReport] = useState<WhistleblowingReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [outcome, setOutcome] = useState('')
  const [actionsTaken, setActionsTaken] = useState('')

  useEffect(() => {
    fetchReport()
  }, [resolvedParams.id])

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/whistleblowing/${resolvedParams.id}`)
      if (!res.ok) throw new Error('Errore nel caricamento')
      const data = await res.json()
      setReport(data)
      setNewStatus(data.status)
      setOutcome(data.outcome || '')
      setActionsTaken(data.actionsTaken || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSendingMessage(true)
    setError('')

    try {
      const res = await fetch(`/api/whistleblowing/${resolvedParams.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      })

      if (!res.ok) throw new Error('Errore nell\'invio del messaggio')

      setNewMessage('')
      fetchReport()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setSendingMessage(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!newStatus) return

    setUpdatingStatus(true)
    setError('')

    try {
      const res = await fetch(`/api/whistleblowing/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          outcome,
          actionsTaken,
        }),
      })

      if (!res.ok) throw new Error('Errore nell\'aggiornamento')

      fetchReport()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateStr))
  }

  const getDaysSince = (dateStr: string) => {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Caricamento...</p>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">{error || 'Segnalazione non trovata'}</div>
        <Link href="/whistleblowing" className="text-blue-600 hover:underline">
          Torna alle segnalazioni
        </Link>
      </div>
    )
  }

  // Check if needs urgent attention (7 days without acknowledgment)
  const needsUrgentAttention =
    report.status === 'RECEIVED' && getDaysSince(report.reportDate) >= 7

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/whistleblowing"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            ← Indietro
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {report.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Segnalazione {reporterTypeLabels[report.reporterType]} - {formatDate(report.reportDate)}
            </p>
          </div>
          <PageInfoTooltip
            title="Dettaglio Segnalazione"
            description="Gestisci la segnalazione whistleblowing nel rispetto del D.Lgs. 24/2023. Ricorda i tempi di legge: conferma entro 7 giorni, feedback entro 3 mesi."
            tips={[
              'Proteggi sempre l\'identità del segnalante',
              'Documenta tutte le azioni intraprese',
              'Comunica regolarmente gli sviluppi',
            ]}
          />
        </div>
      </div>

      {/* Urgent Alert */}
      {needsUrgentAttention && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-red-600 text-xl">!</span>
            <div>
              <p className="font-medium text-red-800">
                Attenzione: Obbligo di conferma ricezione
              </p>
              <p className="text-sm text-red-600">
                Sono trascorsi {getDaysSince(report.reportDate)} giorni dalla segnalazione. Il D.Lgs. 24/2023 richiede
                conferma entro 7 giorni.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Details */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Dettagli Segnalazione
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Categoria</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {categoryLabels[report.category] || report.category}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Descrizione</p>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {report.description}
                </p>
              </div>

              {report.personsInvolved && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Persone Coinvolte</p>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {report.personsInvolved}
                  </p>
                </div>
              )}

              {report.evidence && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prove/Documenti</p>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {report.evidence}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reporter Info (only if not anonymous) */}
          {report.reporterType !== 'ANONYMOUS' && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Informazioni Segnalante
                </h2>
                {report.reporterType === 'CONFIDENTIAL' && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                    RISERVATO
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {report.reporterName && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nome</p>
                    <p className="text-gray-900 dark:text-white">{report.reporterName}</p>
                  </div>
                )}
                {report.reporterEmail && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                    <p className="text-gray-900 dark:text-white">{report.reporterEmail}</p>
                  </div>
                )}
                {report.reporterPhone && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Telefono</p>
                    <p className="text-gray-900 dark:text-white">{report.reporterPhone}</p>
                  </div>
                )}
                {report.reporterRole && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ruolo</p>
                    <p className="text-gray-900 dark:text-white">{report.reporterRole}</p>
                  </div>
                )}
              </div>

              {report.reporterType === 'CONFIDENTIAL' && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-xs text-yellow-800 dark:text-yellow-400">
                    Attenzione: Queste informazioni sono riservate e protette per legge. Non divulgare
                    l'identità del segnalante senza autorizzazione esplicita.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Messaggistica Sicura
            </h2>

            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {report.messages.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nessun messaggio</p>
              ) : (
                report.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.senderType === 'manager'
                        ? 'bg-blue-50 dark:bg-blue-900/20 ml-8'
                        : 'bg-gray-50 dark:bg-zinc-900 mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {message.senderType === 'manager' ? 'Tu' : 'Segnalante'}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                    </div>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {report.status !== 'CLOSED' && (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                  placeholder="Scrivi un messaggio al segnalante..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !newMessage.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  {sendingMessage ? 'Invio...' : 'Invia Messaggio'}
                </button>
              </form>
            )}
          </div>

          {/* Outcome & Actions (if closed) */}
          {(report.status === 'CLOSED' || report.status === 'SUBSTANTIATED' || report.status === 'UNSUBSTANTIATED') && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Esito e Azioni Intraprese
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Esito
                  </label>
                  <textarea
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    rows={3}
                    placeholder="Descrivi l'esito dell'indagine..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Azioni Intraprese
                  </label>
                  <textarea
                    value={actionsTaken}
                    onChange={(e) => setActionsTaken(e.target.value)}
                    rows={3}
                    placeholder="Descrivi le azioni correttive intraprese..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  {updatingStatus ? 'Salvataggio...' : 'Salva Esito'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Stato</h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white mb-3"
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {newStatus !== report.status && (
              <button
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
              >
                {updatingStatus ? 'Aggiornamento...' : 'Aggiorna Stato'}
              </button>
            )}
          </div>

          {/* Info */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Informazioni</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Codice Tracking</p>
                <p className="text-sm font-mono text-gray-900 dark:text-white">{report.accessCode}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tipo Segnalante</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {reporterTypeLabels[report.reporterType]}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Giorni dalla segnalazione</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {getDaysSince(report.reportDate)} giorni
                </p>
              </div>
              {report.acknowledgedAt && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Presa in carico</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatDate(report.acknowledgedAt)}
                  </p>
                </div>
              )}
              {report.lastFeedbackAt && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ultimo feedback</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatDate(report.lastFeedbackAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Compliance */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 text-sm">
              Obblighi D.Lgs. 24/2023
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
              <li>✓ Conferma entro 7 giorni</li>
              <li>✓ Feedback entro 3 mesi</li>
              <li>✓ Protezione identità</li>
              <li>✓ Divieto ritorsioni</li>
              <li>✓ Conservazione 5 anni</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
