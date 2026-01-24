'use client'

import { useEffect, useState } from 'react'

interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string
  details: Record<string, unknown> | null
  ipAddress: string | null
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string | null
  } | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const actionLabels: Record<string, string> = {
  CREATE: 'Creazione',
  READ: 'Lettura',
  UPDATE: 'Modifica',
  DELETE: 'Eliminazione',
  EXPORT: 'Esportazione',
  LOGIN: 'Accesso',
  LOGOUT: 'Disconnessione',
  CONSENT_GRANTED: 'Consenso concesso',
  CONSENT_REVOKED: 'Consenso revocato',
  DOCUMENT_SIGNED: 'Documento firmato',
}

const entityLabels: Record<string, string> = {
  Employee: 'Dipendente',
  Document: 'Documento',
  Deadline: 'Scadenza',
  GdprConsent: 'Consenso GDPR',
  PerformanceReview: 'Valutazione',
  User: 'Utente',
  Tenant: 'Studio',
}

const actionColors: Record<string, string> = {
  CREATE: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  UPDATE: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  EXPORT: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  LOGIN: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  LOGOUT: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  CONSENT_GRANTED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  CONSENT_REVOKED: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    entityType: '',
    action: '',
  })

  async function fetchLogs(page = 1) {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '25',
      })
      if (filters.entityType) params.set('entityType', filters.entityType)
      if (filters.action) params.set('action', filters.action)

      const res = await fetch(`/api/audit-log?${params}`)
      if (!res.ok) throw new Error('Errore nel caricamento')
      const data = await res.json()
      setLogs(data.logs)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [filters])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Log</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Registro di tutte le operazioni eseguite nel sistema
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filters.entityType}
          onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
        >
          <option value="">Tutti i tipi</option>
          <option value="Employee">Dipendenti</option>
          <option value="Document">Documenti</option>
          <option value="Deadline">Scadenze</option>
          <option value="GdprConsent">Consensi GDPR</option>
          <option value="User">Utenti</option>
        </select>

        <select
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
        >
          <option value="">Tutte le azioni</option>
          <option value="CREATE">Creazione</option>
          <option value="UPDATE">Modifica</option>
          <option value="DELETE">Eliminazione</option>
          <option value="EXPORT">Esportazione</option>
          <option value="CONSENT_GRANTED">Consenso concesso</option>
          <option value="CONSENT_REVOKED">Consenso revocato</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data/Ora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Utente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Azione
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  IP
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Caricamento...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nessun log trovato
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-zinc-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {log.user?.name || 'Sistema'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {log.user?.email || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          actionColors[log.action] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {actionLabels[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {entityLabels[log.entityType] || log.entityType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {log.ipAddress || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-700 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pagina {pagination.page} di {pagination.totalPages} ({pagination.total} totali)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchLogs(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 dark:border-zinc-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-700"
              >
                Precedente
              </button>
              <button
                onClick={() => fetchLogs(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-zinc-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-700"
              >
                Successiva
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
