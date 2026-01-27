'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Message {
  content: string
  createdAt: string
}

interface Report {
  id: string
  reportDate: string
  category: string
  title: string
  status: string
  statusLabel: string
  acknowledgedAt: string | null
  investigationStartedAt: string | null
  closedAt: string | null
  outcome: string | null
  lastFeedbackAt: string | null
  messages: Message[]
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

const statusColors: Record<string, string> = {
  RECEIVED: 'bg-yellow-100 text-yellow-700',
  ACKNOWLEDGED: 'bg-blue-100 text-blue-700',
  UNDER_INVESTIGATION: 'bg-purple-100 text-purple-700',
  ADDITIONAL_INFO_REQUESTED: 'bg-orange-100 text-orange-700',
  SUBSTANTIATED: 'bg-red-100 text-red-700',
  UNSUBSTANTIATED: 'bg-gray-100 text-gray-700',
  CLOSED: 'bg-green-100 text-green-700',
}

export default function TrackWhistleblowingPage() {
  const [accessCode, setAccessCode] = useState('')
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setReport(null)

    try {
      const res = await fetch('/api/whistleblowing/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: accessCode.toUpperCase() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Errore nella verifica')
      }

      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !report) return

    setSendingMessage(true)
    setError('')

    try {
      const res = await fetch('/api/whistleblowing/track/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessCode: accessCode.toUpperCase(),
          content: newMessage,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Errore nell\'invio del messaggio')
      }

      // Refresh report to show new message
      setNewMessage('')
      handleCheck(e)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setSendingMessage(false)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Traccia la Tua Segnalazione
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Inserisci il codice di tracciamento per verificare lo stato della segnalazione
          </p>
        </div>

        {/* Access Code Form */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-8 mb-8">
          <form onSubmit={handleCheck} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Codice di Tracciamento
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="Es. A1B2C3D4E5F6G7H8"
                maxLength={16}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white font-mono text-lg tracking-wider"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Il codice ti è stato fornito al momento dell'invio della segnalazione
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !accessCode}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                {loading ? 'Verifica in corso...' : 'Verifica Stato'}
              </button>
              <Link
                href="/whistleblowing/report"
                className="px-6 py-3 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
              >
                Nuova Segnalazione
              </Link>
            </div>
          </form>
        </div>

        {/* Report Details */}
        {report && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {report.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Segnalata il {formatDate(report.reportDate)}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    statusColors[report.status] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {report.statusLabel}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Categoria</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {categoryLabels[report.category] || report.category}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Giorni dalla segnalazione</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {getDaysSince(report.reportDate)} giorni
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Timeline</h3>
              <div className="space-y-6">
                {/* Received */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">Segnalazione Ricevuta</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(report.reportDate)}
                    </p>
                  </div>
                </div>

                {/* Acknowledged */}
                {report.acknowledgedAt ? (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">Presa in Carico</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(report.acknowledgedAt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-700 text-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-400">In Attesa di Presa in Carico</p>
                      <p className="text-sm text-gray-500">
                        Conferma entro 7 giorni (D.Lgs. 24/2023)
                      </p>
                    </div>
                  </div>
                )}

                {/* Investigation */}
                {report.investigationStartedAt ? (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">Indagine Avviata</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(report.investigationStartedAt)}
                      </p>
                    </div>
                  </div>
                ) : report.acknowledgedAt ? (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-700 text-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-400">In Attesa di Indagine</p>
                    </div>
                  </div>
                ) : null}

                {/* Closed */}
                {report.closedAt && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">Pratica Chiusa</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(report.closedAt)}
                      </p>
                      {report.outcome && (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{report.outcome}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            {report.messages.length > 0 && (
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                  Messaggi dall'Organizzazione
                </h3>
                <div className="space-y-4">
                  {report.messages.map((message, idx) => (
                    <div key={idx} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {formatDate(message.createdAt)}
                      </p>
                      <p className="text-gray-900 dark:text-white">{message.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Send Message */}
            {report.status !== 'CLOSED' && (
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Invia un Messaggio
                </h3>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={4}
                    placeholder="Scrivi qui eventuali informazioni aggiuntive o risposte..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessage.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    {sendingMessage ? 'Invio...' : 'Invia Messaggio'}
                  </button>
                </form>
              </div>
            )}

            {/* Legal Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                I Tuoi Diritti (D.Lgs. 24/2023)
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Protezione dell'identità garantita per legge</li>
                <li>• Divieto assoluto di ritorsioni o discriminazioni</li>
                <li>• Feedback entro 3 mesi dalla segnalazione</li>
                <li>• Possibilità di fornire informazioni aggiuntive in qualsiasi momento</li>
                <li>• Conservazione riservata dei dati per 5 anni</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
