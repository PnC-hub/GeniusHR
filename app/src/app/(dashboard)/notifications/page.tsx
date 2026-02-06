'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  entityType: string | null
  entityId: string | null
  isRead: boolean
  readAt: string | null
  createdAt: string
}

const typeLabels: Record<string, string> = {
  LEAVE_REQUEST: 'Richiesta Ferie',
  LEAVE_APPROVED: 'Ferie Approvate',
  LEAVE_REJECTED: 'Ferie Rifiutate',
  EXPENSE_SUBMITTED: 'Nota Spese',
  EXPENSE_APPROVED: 'Spesa Approvata',
  EXPENSE_REJECTED: 'Spesa Rifiutata',
  DOCUMENT_UPLOADED: 'Documento Caricato',
  SIGNATURE_REQUIRED: 'Firma Richiesta',
  PAYSLIP_AVAILABLE: 'Cedolino Disponibile',
  DEADLINE_REMINDER: 'Promemoria Scadenza',
  TRAINING_DUE: 'Formazione in Scadenza',
  GENERAL: 'Notifica',
}

const typeColors: Record<string, string> = {
  LEAVE_REQUEST: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  LEAVE_APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  LEAVE_REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  EXPENSE_SUBMITTED: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  EXPENSE_APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  EXPENSE_REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  DOCUMENT_UPLOADED: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
  SIGNATURE_REQUIRED: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  PAYSLIP_AVAILABLE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  DEADLINE_REMINDER: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  TRAINING_DUE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  GENERAL: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

const typeIcons: Record<string, string> = {
  LEAVE_REQUEST: '🏖️',
  LEAVE_APPROVED: '✅',
  LEAVE_REJECTED: '❌',
  EXPENSE_SUBMITTED: '💰',
  EXPENSE_APPROVED: '✅',
  EXPENSE_REJECTED: '❌',
  DOCUMENT_UPLOADED: '📄',
  SIGNATURE_REQUIRED: '✍️',
  PAYSLIP_AVAILABLE: '💵',
  DEADLINE_REMINDER: '⏰',
  TRAINING_DUE: '📚',
  GENERAL: '🔔',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    fetchNotifications()
  }, [])

  async function fetchNotifications() {
    try {
      setLoading(true)
      const res = await fetch('/api/notifications')
      if (!res.ok) throw new Error('Errore nel caricamento')
      const data = await res.json()
      setNotifications(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id: string) {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
      })
      if (!res.ok) throw new Error('Errore')
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
        )
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  async function markAllAsRead() {
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
      })
      if (!res.ok) throw new Error('Errore')
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    }
  }

  async function deleteNotification(id: string) {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Errore')
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Adesso'
    if (diffMins < 60) return `${diffMins} min fa`
    if (diffHours < 24) return `${diffHours} ore fa`
    if (diffDays < 7) return `${diffDays} giorni fa`
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead
    if (filter === 'read') return n.isRead
    return true
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Notifiche
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {unreadCount > 0 ? `${unreadCount} notifiche non lette` : 'Tutte le notifiche lette'}
            </p>
          </div>
          <PageInfoTooltip
            title="Centro Notifiche"
            description="Visualizza tutte le notifiche relative a richieste ferie, note spese, documenti, firme e scadenze."
            tips={[
              'Clicca su una notifica per visualizzare i dettagli',
              'Le notifiche non lette sono evidenziate',
              'Usa i filtri per trovare notifiche specifiche',
            ]}
          />
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Segna tutte come lette
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
          }`}
        >
          Tutte ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'unread'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
          }`}
        >
          Non lette ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'read'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
          }`}
        >
          Lette ({notifications.length - unreadCount})
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-900 dark:text-red-300">
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Caricamento...</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700">
          <div className="text-6xl mb-4">🔔</div>
          <p className="text-gray-500 dark:text-gray-400">
            {filter === 'unread'
              ? 'Nessuna notifica non letta'
              : filter === 'read'
              ? 'Nessuna notifica letta'
              : 'Nessuna notifica'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white dark:bg-zinc-800 rounded-xl border p-4 transition-all ${
                notification.isRead
                  ? 'border-gray-200 dark:border-zinc-700'
                  : 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">
                  {typeIcons[notification.type] || '🔔'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${
                        typeColors[notification.type] || typeColors.GENERAL
                      }`}
                    >
                      {typeLabels[notification.type] || notification.type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(notification.createdAt)}
                    </span>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {notification.message}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {notification.link && (
                    <Link
                      href={notification.link}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                    >
                      Visualizza
                    </Link>
                  )}
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      title="Segna come letta"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    title="Elimina"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
