'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Employee {
  id: string
  firstName: string
  lastName: string
  department: string | null
  jobTitle: string | null
}

const trainingTypes = [
  { value: 'GENERAL', label: 'Formazione Generale (4h)', hours: 4, expires: false },
  { value: 'SPECIFIC_LOW', label: 'Specifica Rischio Basso (4h)', hours: 4, expires: true },
  { value: 'SPECIFIC_MEDIUM', label: 'Specifica Rischio Medio (8h)', hours: 8, expires: true },
  { value: 'SPECIFIC_HIGH', label: 'Specifica Rischio Alto (12h)', hours: 12, expires: true },
  { value: 'FIRST_AID', label: 'Primo Soccorso (12h)', hours: 12, expires: true },
  { value: 'FIRE_PREVENTION', label: 'Antincendio', hours: 4, expires: true },
  { value: 'RLS', label: 'RLS (32h)', hours: 32, expires: true },
  { value: 'PREPOSTO', label: 'Preposto (8h)', hours: 8, expires: true },
  { value: 'DIRIGENTE', label: 'Dirigente (16h)', hours: 16, expires: true },
  { value: 'UPDATE', label: 'Aggiornamento', hours: 6, expires: true },
]

export default function NewTrainingPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    employeeId: '',
    trainingType: '',
    title: '',
    description: '',
    hoursRequired: '',
    provider: '',
    instructor: '',
    location: '',
    startedAt: '',
    completedAt: '',
    expiresAt: '',
    certificateNumber: '',
    status: 'NOT_STARTED'
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

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

  const handleTypeChange = (type: string) => {
    const selected = trainingTypes.find(t => t.value === type)
    if (selected) {
      setFormData({
        ...formData,
        trainingType: type,
        title: selected.label,
        hoursRequired: selected.hours.toString()
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/safety-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore nella creazione')
      }

      router.push('/safety/training')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Link href="/safety" className="hover:text-blue-600">Sicurezza</Link>
          <span>/</span>
          <Link href="/safety/training" className="hover:text-blue-600">Formazione</Link>
          <span>/</span>
          <span>Nuova</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Nuova Formazione Sicurezza
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Registra un nuovo corso di formazione obbligatoria
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dipendente */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dipendente *
            </label>
            <select
              required
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
            >
              <option value="">Seleziona dipendente...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} {emp.department ? `- ${emp.department}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo Formazione */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo Formazione *
            </label>
            <select
              required
              value={formData.trainingType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
            >
              <option value="">Seleziona tipo...</option>
              {trainingTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Titolo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titolo Corso *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
              placeholder="es. Formazione Generale Sicurezza Lavoratori"
            />
          </div>

          {/* Descrizione */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrizione
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
              placeholder="Argomenti trattati, note aggiuntive..."
            />
          </div>

          {/* Ore richieste */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ore Richieste *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.hoursRequired}
              onChange={(e) => setFormData({ ...formData, hoursRequired: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          {/* Ente formatore */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ente Formatore
            </label>
            <input
              type="text"
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
              placeholder="Nome ente"
            />
          </div>

          {/* Docente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Docente/Formatore
            </label>
            <input
              type="text"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
              placeholder="Nome docente"
            />
          </div>

          {/* Luogo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Luogo Formazione
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
              placeholder="Sede, online, ecc."
            />
          </div>

          {/* Data inizio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Inizio
            </label>
            <input
              type="date"
              value={formData.startedAt}
              onChange={(e) => setFormData({ ...formData, startedAt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          {/* Data completamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Completamento
            </label>
            <input
              type="date"
              value={formData.completedAt}
              onChange={(e) => setFormData({ ...formData, completedAt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          {/* Data scadenza */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Scadenza
              <span className="text-xs text-gray-500 ml-2">(rinnovo dopo 5 anni per corsi specifici)</span>
            </label>
            <input
              type="date"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          {/* Numero attestato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Numero Attestato
            </label>
            <input
              type="text"
              value={formData.certificateNumber}
              onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
              placeholder="N. attestato rilasciato"
            />
          </div>

          {/* Stato */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stato
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
            >
              <option value="NOT_STARTED">Non iniziata</option>
              <option value="IN_PROGRESS">In corso</option>
              <option value="COMPLETED">Completata</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-zinc-700">
          <Link
            href="/safety/training"
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Annulla
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creazione...' : 'Crea Formazione'}
          </button>
        </div>
      </form>
    </div>
  )
}
