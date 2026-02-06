'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, FileText, AlertTriangle } from 'lucide-react'

interface Employee {
  id: string
  firstName: string
  lastName: string
  department: string | null
}

const DEADLINE_TYPES = [
  { value: 'TRAINING_EXPIRY', label: 'Scadenza Formazione', color: 'green' },
  { value: 'MEDICAL_VISIT', label: 'Visita Medica', color: 'red' },
  { value: 'DPI_RENEWAL', label: 'Rinnovo DPI', color: 'orange' },
  { value: 'CONTRACT_EXPIRY', label: 'Scadenza Contratto', color: 'blue' },
  { value: 'PROBATION_END', label: 'Fine Periodo di Prova', color: 'purple' },
  { value: 'DOCUMENT_EXPIRY', label: 'Scadenza Documento', color: 'yellow' },
  { value: 'CUSTOM', label: 'Personalizzata', color: 'gray' },
]

export default function NewDeadlinePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'CUSTOM',
    dueDate: '',
    employeeId: '',
    reminderDays: '7',
  })

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch('/api/employees')
        if (res.ok) {
          const data = await res.json()
          setEmployees(data.employees || data || [])
        }
      } catch (err) {
        console.error('Errore caricamento dipendenti:', err)
      } finally {
        setLoadingEmployees(false)
      }
    }
    fetchEmployees()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Auto-fill title based on type
    if (name === 'type' && !formData.title) {
      const selectedType = DEADLINE_TYPES.find(t => t.value === value)
      if (selectedType && value !== 'CUSTOM') {
        setFormData(prev => ({ ...prev, title: selectedType.label }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/deadlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          employeeId: formData.employeeId || null,
          reminderDays: parseInt(formData.reminderDays) || 7,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore durante il salvataggio')
      }

      router.push('/deadlines')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/deadlines"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alle scadenze
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Nuova Scadenza
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Crea una nuova scadenza per monitorare formazioni, visite mediche, contratti o documenti
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo scadenza */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Tipo di Scadenza *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {DEADLINE_TYPES.map((type) => (
              <label
                key={type.value}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.type === type.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={type.value}
                  checked={formData.type === type.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className={`w-3 h-3 rounded-full bg-${type.color}-500`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Titolo e descrizione */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Titolo *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Es. Corso antincendio Mario Rossi"
              className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrizione (opzionale)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Note aggiuntive sulla scadenza..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-white resize-none"
            />
          </div>
        </div>

        {/* Data e dipendente */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Data Scadenza *
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                min={today}
                className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="reminderDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Promemoria (giorni prima)
              </label>
              <select
                id="reminderDays"
                name="reminderDays"
                value={formData.reminderDays}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              >
                <option value="3">3 giorni prima</option>
                <option value="7">7 giorni prima</option>
                <option value="14">14 giorni prima</option>
                <option value="30">30 giorni prima</option>
                <option value="60">60 giorni prima</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Dipendente (opzionale)
            </label>
            {loadingEmployees ? (
              <div className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-gray-50 dark:bg-zinc-900 text-gray-500">
                Caricamento dipendenti...
              </div>
            ) : (
              <select
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              >
                <option value="">Scadenza aziendale (nessun dipendente)</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                    {emp.department ? ` - ${emp.department}` : ''}
                  </option>
                ))}
              </select>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Lascia vuoto per scadenze aziendali generiche (es. DVR, DUVRI)
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href="/deadlines"
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
          >
            Annulla
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvataggio...' : 'Crea Scadenza'}
          </button>
        </div>
      </form>
    </div>
  )
}
