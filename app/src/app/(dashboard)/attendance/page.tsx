'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

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
  employee: {
    id: string
    firstName: string
    lastName: string
    department: string | null
    jobTitle: string | null
  }
}

interface AttendanceStats {
  totalPresent: number
  totalAbsent: number
  lateArrivals: number
  earlyDepartures: number
  pendingApprovals: number
  totalAnomalies: number
}

interface Employee {
  id: string
  firstName: string
  lastName: string
}

const statusLabels: Record<string, string> = {
  PENDING: 'In attesa',
  APPROVED: 'Approvato',
  REJECTED: 'Rifiutato',
  ANOMALY: 'Anomalia',
  AUTO_APPROVED: 'Auto-approvato',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  ANOMALY: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  AUTO_APPROVED: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
}

const anomalyLabels: Record<string, string> = {
  MISSING_CLOCK_IN: 'Entrata mancante',
  MISSING_CLOCK_OUT: 'Uscita mancante',
  OUT_OF_ZONE: 'Fuori zona',
  UNUSUAL_HOURS: 'Orario insolito',
  OVERTIME_NOT_APPROVED: 'Straordinario non approvato',
  DUPLICATE_ENTRY: 'Timbratura duplicata',
}

export default function AttendanceManagementPage() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [filterStatus, setFilterStatus] = useState('')
  const [filterEmployee, setFilterEmployee] = useState('')
  const [filterAnomaly, setFilterAnomaly] = useState(false)

  // Manual entry modal
  const [showManualEntryModal, setShowManualEntryModal] = useState(false)
  const [manualEntry, setManualEntry] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    clockIn: '',
    clockOut: '',
    breakMinutes: 0,
    notes: '',
  })

  useEffect(() => {
    fetchAttendance()
    fetchEmployees()
  }, [selectedDate, filterStatus, filterEmployee, filterAnomaly, view])

  async function fetchAttendance() {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      // Calculate date range based on view
      if (view === 'daily') {
        params.set('dateFrom', selectedDate)
        params.set('dateTo', selectedDate)
      } else if (view === 'weekly') {
        const date = new Date(selectedDate)
        const monday = new Date(date.setDate(date.getDate() - date.getDay() + 1))
        const sunday = new Date(monday)
        sunday.setDate(monday.getDate() + 6)
        params.set('dateFrom', monday.toISOString().split('T')[0])
        params.set('dateTo', sunday.toISOString().split('T')[0])
      } else if (view === 'monthly') {
        const date = new Date(selectedDate)
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        params.set('dateFrom', firstDay.toISOString().split('T')[0])
        params.set('dateTo', lastDay.toISOString().split('T')[0])
      }

      if (filterStatus) params.set('status', filterStatus)
      if (filterEmployee) params.set('employeeId', filterEmployee)
      if (filterAnomaly) params.set('anomalyOnly', 'true')

      const res = await fetch(`/api/attendance?${params}`)
      if (!res.ok) throw new Error('Errore nel caricamento')
      const data = await res.json()
      setEntries(data)

      // Calculate stats
      const pending = data.filter((e: TimeEntry) => e.status === 'PENDING').length
      const anomalies = data.filter((e: TimeEntry) => e.anomalyType).length
      const lateArrivals = data.filter((e: TimeEntry) => {
        if (!e.clockIn) return false
        const clockInTime = new Date(e.clockIn).getHours() * 60 + new Date(e.clockIn).getMinutes()
        return clockInTime > 9 * 60 + 15 // After 9:15 AM
      }).length

      setStats({
        totalPresent: data.length,
        totalAbsent: 0,
        lateArrivals,
        earlyDepartures: 0,
        pendingApprovals: pending,
        totalAnomalies: anomalies,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  async function fetchEmployees() {
    try {
      const res = await fetch('/api/employees')
      if (res.ok) {
        const data = await res.json()
        setEmployees(data)
      }
    } catch (err) {
      console.error('Error fetching employees:', err)
    }
  }

  async function handleApprove(id: string) {
    try {
      const res = await fetch(`/api/attendance/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      })
      if (!res.ok) throw new Error('Errore nell\'approvazione')
      fetchAttendance()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    }
  }

  async function handleReject(id: string) {
    const notes = prompt('Inserisci il motivo del rifiuto:')
    if (!notes) return

    try {
      const res = await fetch(`/api/attendance/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', managerNotes: notes }),
      })
      if (!res.ok) throw new Error('Errore nel rifiuto')
      fetchAttendance()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    }
  }

  async function handleManualEntry() {
    if (!manualEntry.employeeId || !manualEntry.date || !manualEntry.clockIn) {
      setError('Dipendente, data ed entrata sono obbligatori')
      return
    }

    try {
      const res = await fetch('/api/attendance/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualEntry),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore nella creazione')
      }

      setShowManualEntryModal(false)
      setManualEntry({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        clockIn: '',
        clockOut: '',
        breakMinutes: 0,
        notes: '',
      })
      fetchAttendance()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    }
  }

  async function handleExport() {
    try {
      const params = new URLSearchParams()
      params.set('dateFrom', selectedDate)
      params.set('dateTo', selectedDate)
      if (filterEmployee) params.set('employeeId', filterEmployee)

      const res = await fetch(`/api/attendance/export?${params}`)
      if (!res.ok) throw new Error('Errore export')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `presenze-${selectedDate}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore export')
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('it-IT', {
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

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestione Presenze e Timbrature
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitora timbrature, approva presenze e gestisci anomalie
            </p>
          </div>
          <PageInfoTooltip
            title="Monitoraggio Presenze"
            description="Visualizza le timbrature giornaliere, settimanali e mensili. Approva presenze, gestisci anomalie e calcola ore lavorate e straordinari automaticamente."
            tips={[
              'Usa la vista settimanale per avere una panoramica completa',
              'Le anomalie sono evidenziate in arancione e richiedono attenzione',
              'Puoi inserire timbrature manuali per correzioni o dimenticanze',
              'Export i dati per inviarli al consulente del lavoro',
            ]}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowManualEntryModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Timbratura Manuale
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
          >
            Export Foglio Presenze
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-gray-200 dark:border-zinc-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Presenti</p>
            <p className="text-3xl font-bold text-green-600">{stats.totalPresent}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-gray-200 dark:border-zinc-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Assenti</p>
            <p className="text-3xl font-bold text-red-600">{stats.totalAbsent}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Ritardi</p>
            <p className="text-3xl font-bold text-amber-600">{stats.lateArrivals}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Anomalie</p>
            <p className="text-3xl font-bold text-orange-600">{stats.totalAnomalies}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Da Approvare</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingApprovals}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Uscite Anticipate</p>
            <p className="text-3xl font-bold text-blue-600">{stats.earlyDepartures}</p>
          </div>
        </div>
      )}

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setView('daily')}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === 'daily'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
          }`}
        >
          Vista Giornaliera
        </button>
        <button
          onClick={() => setView('weekly')}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === 'weekly'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
          }`}
        >
          Vista Settimanale
        </button>
        <button
          onClick={() => setView('monthly')}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === 'monthly'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
          }`}
        >
          Vista Mensile
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Dipendente
            </label>
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white min-w-[200px]"
            >
              <option value="">Tutti i dipendenti</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stato
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
            >
              <option value="">Tutti</option>
              <option value="PENDING">In attesa</option>
              <option value="APPROVED">Approvati</option>
              <option value="REJECTED">Rifiutati</option>
              <option value="ANOMALY">Anomalie</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filterAnomaly}
                onChange={(e) => setFilterAnomaly(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Solo anomalie
              </span>
            </label>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedDate(new Date().toISOString().split('T')[0])
                setFilterStatus('')
                setFilterEmployee('')
                setFilterAnomaly(false)
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Reset Filtri
            </button>
          </div>
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

      {/* Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Dipendente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Entrata
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Uscita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Ore Lavorate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Straordinari
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Stato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Caricamento...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Nessuna timbratura trovata per il periodo selezionato
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className={`hover:bg-gray-50 dark:hover:bg-zinc-750 ${
                      entry.anomalyType ? 'bg-orange-50 dark:bg-orange-900/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            {entry.employee.firstName[0]}{entry.employee.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {entry.employee.firstName} {entry.employee.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {entry.employee.department || entry.employee.jobTitle || '-'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-900 dark:text-white">{formatTime(entry.clockIn)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                      {entry.clockOut ? formatTime(entry.clockOut) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {formatDuration(entry.workedMinutes)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entry.overtimeMinutes && entry.overtimeMinutes > 0 ? (
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {formatDuration(entry.overtimeMinutes)}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            statusColors[entry.status] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {statusLabels[entry.status] || entry.status}
                        </span>
                        {entry.anomalyType && (
                          <span className="px-2 py-1 text-xs font-medium rounded bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                            {anomalyLabels[entry.anomalyType] || entry.anomalyType}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {entry.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(entry.id)}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Approva
                            </button>
                            <button
                              onClick={() => handleReject(entry.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Rifiuta
                            </button>
                          </div>
                        )}
                        <Link
                          href={`/attendance/${entry.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Dettagli
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showManualEntryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Timbratura Manuale
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dipendente *
                </label>
                <select
                  value={manualEntry.employeeId}
                  onChange={(e) => setManualEntry({ ...manualEntry, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                >
                  <option value="">Seleziona dipendente</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data *
                </label>
                <input
                  type="date"
                  value={manualEntry.date}
                  onChange={(e) => setManualEntry({ ...manualEntry, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ora Entrata *
                  </label>
                  <input
                    type="time"
                    value={manualEntry.clockIn}
                    onChange={(e) => setManualEntry({ ...manualEntry, clockIn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ora Uscita
                  </label>
                  <input
                    type="time"
                    value={manualEntry.clockOut}
                    onChange={(e) => setManualEntry({ ...manualEntry, clockOut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pausa (minuti)
                </label>
                <input
                  type="number"
                  value={manualEntry.breakMinutes}
                  onChange={(e) =>
                    setManualEntry({ ...manualEntry, breakMinutes: parseInt(e.target.value) || 0 })
                  }
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Note
                </label>
                <textarea
                  value={manualEntry.notes}
                  onChange={(e) => setManualEntry({ ...manualEntry, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  placeholder="Motivo della timbratura manuale..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleManualEntry}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Salva Timbratura
              </button>
              <button
                onClick={() => {
                  setShowManualEntryModal(false)
                  setManualEntry({
                    employeeId: '',
                    date: new Date().toISOString().split('T')[0],
                    clockIn: '',
                    clockOut: '',
                    breakMinutes: 0,
                    notes: '',
                  })
                }}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-zinc-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-zinc-500"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
