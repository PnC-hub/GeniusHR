'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface TimeEntry {
  id: string
  date: string
  clockIn: string
  clockOut: string | null
  workedMinutes: number | null
  breakMinutes: number | null
  overtimeMinutes: number | null
  status: string
  notes: string | null
  managerNotes: string | null
  anomalyType: string | null
  clockInLat: string | null
  clockInLng: string | null
  clockInAddress: string | null
  clockOutLat: string | null
  clockOutLng: string | null
  clockOutAddress: string | null
  clockInIp: string | null
  clockOutIp: string | null
  createdAt: string
  updatedAt: string
  approvedAt: string | null
  employee: {
    id: string
    firstName: string
    lastName: string
    department: string | null
    jobTitle: string | null
    email: string | null
  }
  approver: {
    id: string
    name: string
    email: string
  } | null
}

const statusLabels: Record<string, string> = {
  PENDING: 'In attesa',
  APPROVED: 'Approvato',
  REJECTED: 'Rifiutato',
  ANOMALY: 'Anomalia',
  AUTO_APPROVED: 'Auto-approvato',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  ANOMALY: 'bg-orange-100 text-orange-700',
  AUTO_APPROVED: 'bg-blue-100 text-blue-700',
}

const anomalyLabels: Record<string, string> = {
  MISSING_CLOCK_IN: 'Entrata mancante',
  MISSING_CLOCK_OUT: 'Uscita mancante',
  OUT_OF_ZONE: 'Fuori zona',
  UNUSUAL_HOURS: 'Orario insolito',
  OVERTIME_NOT_APPROVED: 'Straordinario non approvato',
  DUPLICATE_ENTRY: 'Timbratura duplicata',
}

export default function AttendanceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [entry, setEntry] = useState<TimeEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEntry()
  }, [params.id])

  async function fetchEntry() {
    try {
      setLoading(true)
      const res = await fetch(`/api/attendance/${params.id}`)
      if (!res.ok) throw new Error('Errore nel caricamento')
      const data = await res.json()
      setEntry(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove() {
    if (!entry) return
    try {
      const res = await fetch(`/api/attendance/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      })
      if (!res.ok) throw new Error('Errore nell\'approvazione')
      fetchEntry()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    }
  }

  async function handleReject() {
    if (!entry) return
    const notes = prompt('Inserisci il motivo del rifiuto:')
    if (!notes) return

    try {
      const res = await fetch(`/api/attendance/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', managerNotes: notes }),
      })
      if (!res.ok) throw new Error('Errore nel rifiuto')
      fetchEntry()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    }
  }

  async function handleDelete() {
    if (!entry) return
    if (!confirm('Sei sicuro di voler eliminare questa timbratura?')) return

    try {
      const res = await fetch(`/api/attendance/${entry.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Errore nell\'eliminazione')
      router.push('/attendance')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '-'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (error || !entry) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error || 'Timbratura non trovata'}
        </div>
        <Link href="/attendance" className="text-blue-600 hover:underline mt-4 inline-block">
          Torna alle presenze
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/attendance"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← Torna alle presenze
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dettaglio Timbratura
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {entry.employee.firstName} {entry.employee.lastName} - {formatDate(entry.date)}
          </p>
        </div>
        <div className="flex gap-2">
          {entry.status === 'PENDING' && (
            <>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                Approva
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Rifiuta
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
          >
            Elimina
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-900 dark:text-red-300">
            ×
          </button>
        </div>
      )}

      {/* Status & Anomaly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Stato Timbratura
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Stato:</span>
              <span
                className={`px-3 py-1 text-sm font-medium rounded ${
                  statusColors[entry.status] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {statusLabels[entry.status] || entry.status}
              </span>
            </div>
            {entry.anomalyType && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Anomalia:</span>
                <span className="px-3 py-1 text-sm font-medium rounded bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                  {anomalyLabels[entry.anomalyType] || entry.anomalyType}
                </span>
              </div>
            )}
            {entry.approver && (
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Approvato da:{' '}
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {entry.approver.name} ({entry.approver.email})
                </span>
              </div>
            )}
            {entry.approvedAt && (
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Data approvazione:{' '}
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatDateTime(entry.approvedAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Employee Info */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informazioni Dipendente
          </h2>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Nome: </span>
              <span className="text-sm text-gray-900 dark:text-white">
                {entry.employee.firstName} {entry.employee.lastName}
              </span>
            </div>
            {entry.employee.email && (
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Email: </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {entry.employee.email}
                </span>
              </div>
            )}
            {entry.employee.department && (
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Reparto: </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {entry.employee.department}
                </span>
              </div>
            )}
            {entry.employee.jobTitle && (
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Ruolo: </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {entry.employee.jobTitle}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Time Details */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Dettagli Orario
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Data</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatDate(entry.date)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Entrata</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatTime(entry.clockIn)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Uscita</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {entry.clockOut ? formatTime(entry.clockOut) : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pausa</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {entry.breakMinutes ? `${entry.breakMinutes} min` : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ore Lavorate</p>
            <p className="text-xl font-bold text-green-600">
              {formatDuration(entry.workedMinutes)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Straordinari</p>
            <p className="text-xl font-bold text-blue-600">
              {entry.overtimeMinutes && entry.overtimeMinutes > 0
                ? formatDuration(entry.overtimeMinutes)
                : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Posizione Entrata
          </h2>
          <div className="space-y-2">
            {entry.clockInAddress && (
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Indirizzo: </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {entry.clockInAddress}
                </span>
              </div>
            )}
            {entry.clockInLat && entry.clockInLng && (
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Coordinate: </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {entry.clockInLat}, {entry.clockInLng}
                </span>
              </div>
            )}
            {entry.clockInIp && (
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">IP: </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {entry.clockInIp}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Posizione Uscita
          </h2>
          <div className="space-y-2">
            {entry.clockOutAddress ? (
              <>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Indirizzo: </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {entry.clockOutAddress}
                  </span>
                </div>
                {entry.clockOutLat && entry.clockOutLng && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Coordinate:{' '}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {entry.clockOutLat}, {entry.clockOutLng}
                    </span>
                  </div>
                )}
                {entry.clockOutIp && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">IP: </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {entry.clockOutIp}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nessuna uscita registrata
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      {(entry.notes || entry.managerNotes) && (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Note</h2>
          <div className="space-y-4">
            {entry.notes && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Note Dipendente:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{entry.notes}</p>
              </div>
            )}
            {entry.managerNotes && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Note Manager:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {entry.managerNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informazioni Sistema
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">ID: </span>
            <span className="text-gray-900 dark:text-white font-mono">{entry.id}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Creata il: </span>
            <span className="text-gray-900 dark:text-white">
              {formatDateTime(entry.createdAt)}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Ultima modifica: </span>
            <span className="text-gray-900 dark:text-white">
              {formatDateTime(entry.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
