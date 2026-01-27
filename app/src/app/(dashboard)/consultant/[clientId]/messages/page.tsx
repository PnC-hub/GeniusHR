'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

/**
 * Consultant - Messages Page
 *
 * Bidirectional communication with client
 * - Request documents
 * - Notes for specific employees
 * - General communications
 */

type Message = {
  id: string
  type: 'request' | 'note' | 'general'
  subject: string
  content: string
  employeeId?: string
  employeeName?: string
  sentAt: string
  status: 'sent' | 'read' | 'completed'
}

export default function ConsultantMessagesPage() {
  const params = useParams()
  const clientId = params.clientId as string

  const [tenantName, setTenantName] = useState('')
  const [employees, setEmployees] = useState<any[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [showNewMessage, setShowNewMessage] = useState(false)

  // New message form
  const [messageType, setMessageType] = useState<'request' | 'note' | 'general'>('general')
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [clientId])

  const loadData = async () => {
    try {
      const [tenantRes, employeesRes, messagesRes] = await Promise.all([
        fetch(`/api/consultant/${clientId}/info`),
        fetch(`/api/consultant/${clientId}/employees`),
        fetch(`/api/consultant/${clientId}/messages`),
      ])

      if (tenantRes.ok) {
        const data = await tenantRes.json()
        setTenantName(data.name)
      }

      if (employeesRes.ok) {
        const data = await employeesRes.json()
        setEmployees(data)
      }

      if (messagesRes.ok) {
        const data = await messagesRes.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!subject || !content) {
      alert('Compila tutti i campi obbligatori')
      return
    }

    if (messageType !== 'general' && !selectedEmployee) {
      alert('Seleziona un dipendente')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/consultant/${clientId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: messageType,
          employeeId: selectedEmployee || null,
          subject,
          content,
        }),
      })

      if (res.ok) {
        alert('Messaggio inviato con successo')
        setShowNewMessage(false)
        setSubject('')
        setContent('')
        setSelectedEmployee('')
        loadData()
      } else {
        alert('Errore nell\'invio del messaggio')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Errore nell\'invio del messaggio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href={`/consultant/${clientId}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Torna alla Dashboard Cliente
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Messaggi - {tenantName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comunicazioni con l'azienda cliente
            </p>
          </div>
          <button
            onClick={() => setShowNewMessage(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuovo Messaggio
          </button>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Nuovo Messaggio
              </h2>
              <button
                onClick={() => setShowNewMessage(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Message Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo Messaggio
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setMessageType('general')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      messageType === 'general'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Generale
                  </button>
                  <button
                    onClick={() => setMessageType('request')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      messageType === 'request'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Richiesta Doc.
                  </button>
                  <button
                    onClick={() => setMessageType('note')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      messageType === 'note'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Nota Dipendente
                  </button>
                </div>
              </div>

              {/* Employee Selection (if not general) */}
              {messageType !== 'general' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dipendente
                  </label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Seleziona dipendente...</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Oggetto
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Oggetto del messaggio"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Messaggio
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  placeholder="Scrivi il tuo messaggio..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSendMessage}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                >
                  {loading ? 'Invio...' : 'Invia Messaggio'}
                </button>
                <button
                  onClick={() => setShowNewMessage(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Storico Messaggi
        </h2>

        {messages.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">💬</span>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Nessun messaggio ancora
            </p>
            <button
              onClick={() => setShowNewMessage(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Invia Primo Messaggio
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const getTypeLabel = (type: string) => {
                const labels: Record<string, string> = {
                  general: 'Generale',
                  request: 'Richiesta Documenti',
                  note: 'Nota Dipendente',
                }
                return labels[type] || type
              }

              const getTypeColor = (type: string) => {
                const colors: Record<string, string> = {
                  general: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
                  request: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
                  note: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
                }
                return colors[type] || 'bg-gray-100 dark:bg-gray-700'
              }

              return (
                <div
                  key={message.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(
                            message.type
                          )}`}
                        >
                          {getTypeLabel(message.type)}
                        </span>
                        {message.employeeName && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {message.employeeName}
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {message.subject}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        {message.content}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(message.sentAt).toLocaleDateString('it-IT')}
                      </p>
                      <span
                        className={`text-xs ${
                          message.status === 'read'
                            ? 'text-blue-600 dark:text-blue-400'
                            : message.status === 'completed'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {message.status === 'read'
                          ? '✓ Letto'
                          : message.status === 'completed'
                          ? '✓✓ Completato'
                          : 'Inviato'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
