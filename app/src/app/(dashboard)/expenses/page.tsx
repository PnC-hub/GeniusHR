'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface ExpenseRequest {
  id: string
  type: string
  status: string
  amount: number
  description: string
  date: string
  createdAt: string
  reviewedAt: string | null
  reviewNotes: string | null
  kilometers: number | null
  ratePerKm: number | null
  origin: string | null
  destination: string | null
  vehicleType: string | null
  vehiclePlate: string | null
  tripPurpose: string | null
  employee: {
    id: string
    firstName: string
    lastName: string
    email: string
    department: string | null
  }
  reviewer: {
    id: string
    name: string
  } | null
  receipts: {
    id: string
    fileName: string
    fileUrl: string
    fileSize: number | null
  }[]
}

interface Employee {
  id: string
  firstName: string
  lastName: string
  department: string | null
}

interface MileageRate {
  id: string
  vehicleType: string
  year: number
  ratePerKm: number
  engineCc: string | null
}

const typeLabels: Record<string, string> = {
  MILEAGE: 'Rimborso Km',
  TRAVEL: 'Viaggio',
  ACCOMMODATION: 'Alloggio',
  MEALS: 'Pasti',
  TRANSPORT: 'Trasporto',
  PARKING: 'Parcheggio',
  TOLL: 'Pedaggio',
  FUEL: 'Carburante',
  PHONE: 'Telefono',
  SUPPLIES: 'Materiali',
  TRAINING: 'Formazione',
  CLIENT_GIFT: 'Omaggi Clienti',
  REPRESENTATION: 'Rappresentanza',
  OTHER: 'Altro',
}

const typeColors: Record<string, string> = {
  MILEAGE: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  TRAVEL: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  ACCOMMODATION: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  MEALS: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  TRANSPORT: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
  PARKING: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  OTHER: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Bozza',
  PENDING: 'In attesa',
  APPROVED: 'Approvata',
  REJECTED: 'Rifiutata',
  PAID: 'Rimborsata',
  CANCELLED: 'Annullata',
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  PAID: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
}

const vehicleTypeLabels: Record<string, string> = {
  CAR_PETROL: 'Auto Benzina',
  CAR_DIESEL: 'Auto Diesel',
  CAR_HYBRID: 'Auto Ibrida',
  CAR_ELECTRIC: 'Auto Elettrica',
  CAR_LPG: 'Auto GPL',
  CAR_METHANE: 'Auto Metano',
  MOTORCYCLE: 'Moto',
  SCOOTER: 'Scooter',
}

export default function ExpensesManagementPage() {
  const [expenses, setExpenses] = useState<ExpenseRequest[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [mileageRates, setMileageRates] = useState<MileageRate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterEmployee, setFilterEmployee] = useState<string>('all')
  const [filterDateFrom, setFilterDateFrom] = useState<string>('')
  const [filterDateTo, setFilterDateTo] = useState<string>('')

  // Modals
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false)
  const [showMileageModal, setShowMileageModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<ExpenseRequest | null>(null)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve')
  const [reviewReason, setReviewReason] = useState('')

  // New expense form
  const [newExpense, setNewExpense] = useState({
    type: 'MEALS',
    description: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    employeeId: '',
  })

  // Mileage form
  const [mileageForm, setMileageForm] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    origin: '',
    destination: '',
    kilometers: '',
    vehicleType: 'CAR_PETROL',
    vehiclePlate: '',
    tripPurpose: '',
    description: '',
  })

  const [uploadedReceipts, setUploadedReceipts] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchData()
    fetchEmployees()
    fetchMileageRates()
  }, [filterStatus, filterType, filterEmployee, filterDateFrom, filterDateTo])

  async function fetchData() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.set('status', filterStatus)
      if (filterType !== 'all') params.set('type', filterType)
      if (filterEmployee !== 'all') params.set('employeeId', filterEmployee)
      if (filterDateFrom) params.set('dateFrom', filterDateFrom)
      if (filterDateTo) params.set('dateTo', filterDateTo)

      const res = await fetch(`/api/expenses?${params}`)
      if (res.ok) {
        const data = await res.json()
        setExpenses(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento')
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

  async function fetchMileageRates() {
    try {
      const res = await fetch('/api/expenses/mileage-rates')
      if (res.ok) {
        const data = await res.json()
        setMileageRates(data)
      }
    } catch (err) {
      console.error('Error fetching mileage rates:', err)
    }
  }

  async function handleFileUpload(file: File) {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/expenses/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore upload')
      }

      const data = await res.json()
      setUploadedReceipts((prev) => [...prev, data.fileUrl])
      return data.fileUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore upload')
      throw err
    } finally {
      setUploading(false)
    }
  }

  async function handleCreateExpense() {
    if (!newExpense.description || !newExpense.date || !newExpense.amount) {
      setError('Compila tutti i campi obbligatori')
      return
    }

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newExpense,
          amount: parseFloat(newExpense.amount),
          receipts: uploadedReceipts,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore nella creazione')
      }

      setShowNewExpenseModal(false)
      setNewExpense({
        type: 'MEALS',
        description: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        employeeId: '',
      })
      setUploadedReceipts([])
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    }
  }

  async function handleCreateMileage() {
    if (
      !mileageForm.date ||
      !mileageForm.kilometers ||
      !mileageForm.origin ||
      !mileageForm.destination
    ) {
      setError('Compila tutti i campi obbligatori')
      return
    }

    try {
      // Calculate amount based on mileage rate
      const rate = mileageRates.find((r) => r.vehicleType === mileageForm.vehicleType)
      const ratePerKm = rate?.ratePerKm || 0.42

      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'MILEAGE',
          ...mileageForm,
          kilometers: parseFloat(mileageForm.kilometers),
          ratePerKm,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore nella creazione')
      }

      setShowMileageModal(false)
      setMileageForm({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        origin: '',
        destination: '',
        kilometers: '',
        vehicleType: 'CAR_PETROL',
        vehiclePlate: '',
        tripPurpose: '',
        description: '',
      })
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    }
  }

  async function handleReview(expense: ExpenseRequest, action: 'approve' | 'reject') {
    setSelectedExpense(expense)
    setReviewAction(action)
    setReviewReason('')
    setShowReviewModal(true)
  }

  async function submitReview() {
    if (!selectedExpense) return

    if (reviewAction === 'reject' && !reviewReason.trim()) {
      setError('Il motivo del rifiuto è obbligatorio')
      return
    }

    try {
      const res = await fetch(`/api/expenses/${selectedExpense.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: reviewAction,
          reason: reviewReason,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore nella revisione')
      }

      setShowReviewModal(false)
      setSelectedExpense(null)
      setReviewReason('')
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    }
  }

  async function handleMarkReimbursed(id: string) {
    try {
      const res = await fetch(`/api/expenses/${id}/reimburse`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Errore nel rimborso')
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    }
  }

  async function handleExport() {
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.set('status', filterStatus)
      if (filterType !== 'all') params.set('type', filterType)
      if (filterEmployee !== 'all') params.set('employeeId', filterEmployee)
      if (filterDateFrom) params.set('dateFrom', filterDateFrom)
      if (filterDateTo) params.set('dateTo', filterDateTo)

      const res = await fetch(`/api/expenses/export?${params}`)
      if (!res.ok) throw new Error('Errore export')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `note-spese-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore export')
    }
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  // Stats
  const pendingCount = expenses.filter((e) => e.status === 'PENDING').length
  const approvedCount = expenses.filter((e) => e.status === 'APPROVED').length
  const pendingTotal = expenses
    .filter((e) => e.status === 'PENDING')
    .reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0)
  const approvedTotal = expenses
    .filter((e) => e.status === 'APPROVED' || e.status === 'PAID')
    .reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Spese e Rimborsi
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestisci note spese e richieste di rimborso chilometrico
            </p>
          </div>
          <PageInfoTooltip
            title="Gestione Note Spese"
            description="Visualizza e approva le richieste di rimborso spese dei collaboratori. Ogni richiesta include documentazione allegata e viene tracciata fino al rimborso effettivo."
            tips={[
              'Verifica sempre che sia allegata la ricevuta originale',
              'Usa il rimborso chilometrico per le trasferte in auto',
              'Il calcolo km usa le tabelle ACI aggiornate',
              'Esporta i dati per inviarli al consulente del lavoro',
            ]}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewExpenseModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Nuova Spesa
          </button>
          <button
            onClick={() => setShowMileageModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
          >
            Rimborso Km
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-gray-200 dark:border-zinc-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Totale Richieste</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{expenses.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Da Approvare</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
          <p className="text-sm text-gray-500">{formatCurrency(pendingTotal)}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Approvate</p>
          <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
          <p className="text-sm text-gray-500">{formatCurrency(approvedTotal)}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Importo Medio</p>
          <p className="text-3xl font-bold text-blue-600">
            {expenses.length > 0
              ? formatCurrency(
                  expenses.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0) /
                    expenses.length
                )
              : '€0'}
          </p>
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

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
        >
          <option value="all">Tutti gli stati</option>
          {Object.entries(statusLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
        >
          <option value="all">Tutte le categorie</option>
          {Object.entries(typeLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={filterEmployee}
          onChange={(e) => setFilterEmployee(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
        >
          <option value="all">Tutti i dipendenti</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filterDateFrom}
          onChange={(e) => setFilterDateFrom(e.target.value)}
          placeholder="Data da"
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
        />

        <input
          type="date"
          value={filterDateTo}
          onChange={(e) => setFilterDateTo(e.target.value)}
          placeholder="Data a"
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
        />
      </div>

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
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Descrizione
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Importo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Data
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
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Caricamento...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Nessuna nota spese trovata
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50 dark:hover:bg-zinc-750">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {exp.employee.firstName} {exp.employee.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {exp.employee.department || exp.employee.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          typeColors[exp.type] || typeColors.OTHER
                        }`}
                      >
                        {typeLabels[exp.type] || exp.type}
                      </span>
                      {exp.type === 'MILEAGE' && exp.kilometers && (
                        <p className="text-xs text-gray-500 mt-1">{exp.kilometers} km</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {exp.description}
                      </p>
                      {exp.receipts && exp.receipts.length > 0 && (
                        <a
                          href={exp.receipts[0].fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Vedi ricevuta
                        </a>
                      )}
                      {exp.origin && exp.destination && (
                        <p className="text-xs text-gray-500 mt-1">
                          {exp.origin} → {exp.destination}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(parseFloat(exp.amount.toString()))}
                      </span>
                      {exp.ratePerKm && (
                        <p className="text-xs text-gray-500">€{exp.ratePerKm}/km</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(exp.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          statusColors[exp.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {statusLabels[exp.status] || exp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {exp.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleReview(exp, 'approve')}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Approva
                            </button>
                            <button
                              onClick={() => handleReview(exp, 'reject')}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Rifiuta
                            </button>
                          </>
                        )}
                        {exp.status === 'APPROVED' && (
                          <button
                            onClick={() => handleMarkReimbursed(exp.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Segna Rimborsato
                          </button>
                        )}
                        <Link
                          href={`/expenses/${exp.id}`}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
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

      {/* New Expense Modal */}
      {showNewExpenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Nuova Nota Spese
            </h2>
            <div className="space-y-4">
              {employees.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dipendente (opzionale)
                  </label>
                  <select
                    value={newExpense.employeeId}
                    onChange={(e) => setNewExpense({ ...newExpense, employeeId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Seleziona dipendente</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Se non selezioni, la spesa sarà creata per il tuo account
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria *
                </label>
                <select
                  value={newExpense.type}
                  onChange={(e) => setNewExpense({ ...newExpense, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                >
                  {Object.entries(typeLabels)
                    .filter(([key]) => key !== 'MILEAGE')
                    .map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrizione *
                </label>
                <textarea
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  rows={3}
                  placeholder="Es: Cena cliente, Biglietto treno Roma-Milano, etc."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data Spesa *
                  </label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Importo (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ricevuta/Scontrino
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP o PDF - Max 5MB</p>
                {uploading && <p className="text-sm text-blue-600 mt-2">Caricamento...</p>}
                {uploadedReceipts.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedReceipts.map((url, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-green-600">
                        <span>✓</span>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          File caricato {idx + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCreateExpense}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crea Nota Spese
              </button>
              <button
                onClick={() => {
                  setShowNewExpenseModal(false)
                  setNewExpense({
                    type: 'MEALS',
                    description: '',
                    date: new Date().toISOString().split('T')[0],
                    amount: '',
                    employeeId: '',
                  })
                  setUploadedReceipts([])
                }}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-zinc-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-zinc-500"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mileage Modal */}
      {showMileageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Rimborso Chilometrico
            </h2>
            <div className="space-y-4">
              {employees.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dipendente (opzionale)
                  </label>
                  <select
                    value={mileageForm.employeeId}
                    onChange={(e) => setMileageForm({ ...mileageForm, employeeId: e.target.value })}
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
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Viaggio *
                </label>
                <input
                  type="date"
                  value={mileageForm.date}
                  onChange={(e) => setMileageForm({ ...mileageForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Partenza *
                  </label>
                  <input
                    type="text"
                    value={mileageForm.origin}
                    onChange={(e) => setMileageForm({ ...mileageForm, origin: e.target.value })}
                    placeholder="Es: Roma"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Arrivo *
                  </label>
                  <input
                    type="text"
                    value={mileageForm.destination}
                    onChange={(e) =>
                      setMileageForm({ ...mileageForm, destination: e.target.value })
                    }
                    placeholder="Es: Milano"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Chilometri *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={mileageForm.kilometers}
                  onChange={(e) => setMileageForm({ ...mileageForm, kilometers: e.target.value })}
                  placeholder="Es: 150"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Inserisci i km totali percorsi (andata + ritorno)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo Veicolo *
                  </label>
                  <select
                    value={mileageForm.vehicleType}
                    onChange={(e) =>
                      setMileageForm({ ...mileageForm, vehicleType: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  >
                    {Object.entries(vehicleTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Targa (opzionale)
                  </label>
                  <input
                    type="text"
                    value={mileageForm.vehiclePlate}
                    onChange={(e) =>
                      setMileageForm({ ...mileageForm, vehiclePlate: e.target.value })
                    }
                    placeholder="Es: AB123CD"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Motivo Trasferta *
                </label>
                <input
                  type="text"
                  value={mileageForm.tripPurpose}
                  onChange={(e) =>
                    setMileageForm({ ...mileageForm, tripPurpose: e.target.value })
                  }
                  placeholder="Es: Visita cliente, Riunione fornitore"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Note Aggiuntive (opzionale)
                </label>
                <textarea
                  value={mileageForm.description}
                  onChange={(e) =>
                    setMileageForm({ ...mileageForm, description: e.target.value })
                  }
                  rows={2}
                  placeholder="Eventuali note aggiuntive..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              {mileageForm.kilometers && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Calcolo Rimborso
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {mileageForm.kilometers} km ×{' '}
                    {mileageRates.find((r) => r.vehicleType === mileageForm.vehicleType)
                      ?.ratePerKm || 0.42}{' '}
                    €/km ={' '}
                    <strong>
                      {formatCurrency(
                        parseFloat(mileageForm.kilometers) *
                          (mileageRates.find((r) => r.vehicleType === mileageForm.vehicleType)
                            ?.ratePerKm || 0.42)
                      )}
                    </strong>
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Tariffa da tabelle ACI 2026
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCreateMileage}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Crea Rimborso Km
              </button>
              <button
                onClick={() => {
                  setShowMileageModal(false)
                  setMileageForm({
                    employeeId: '',
                    date: new Date().toISOString().split('T')[0],
                    origin: '',
                    destination: '',
                    kilometers: '',
                    vehicleType: 'CAR_PETROL',
                    vehiclePlate: '',
                    tripPurpose: '',
                    description: '',
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

      {/* Review Modal */}
      {showReviewModal && selectedExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {reviewAction === 'approve' ? 'Approva Nota Spese' : 'Rifiuta Nota Spese'}
            </h2>
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Dipendente:</strong> {selectedExpense.employee.firstName}{' '}
                {selectedExpense.employee.lastName}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Categoria:</strong> {typeLabels[selectedExpense.type]}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Descrizione:</strong> {selectedExpense.description}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Importo:</strong> {formatCurrency(parseFloat(selectedExpense.amount.toString()))}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Data:</strong> {formatDate(selectedExpense.date)}
              </p>
            </div>

            {reviewAction === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Motivo del rifiuto *
                </label>
                <textarea
                  value={reviewReason}
                  onChange={(e) => setReviewReason(e.target.value)}
                  rows={3}
                  placeholder="Spiega il motivo del rifiuto..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                />
              </div>
            )}

            {reviewAction === 'approve' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Commento (opzionale)
                </label>
                <textarea
                  value={reviewReason}
                  onChange={(e) => setReviewReason(e.target.value)}
                  rows={2}
                  placeholder="Aggiungi un commento..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={submitReview}
                className={`flex-1 px-4 py-2 rounded-lg text-white ${
                  reviewAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {reviewAction === 'approve' ? 'Approva' : 'Rifiuta'}
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(false)
                  setSelectedExpense(null)
                  setReviewReason('')
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
