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

const dpiCategories = [
  'Scarpe antinfortunistiche',
  'Guanti protettivi',
  'Occhiali di protezione',
  'Mascherina respiratoria',
  'Casco protettivo',
  'Cuffie antirumore',
  'Camice/Divisa',
  'Dispositivi anticaduta',
  'Altro'
]

export default function NewDpiPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    category: '',
    expiresAt: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/safety/dpi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          filePath: '' // TODO: implement file upload
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore nella creazione')
      }

      router.push('/safety/dpi')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  // Calcola data scadenza suggerita
  const suggestExpiryDate = (category: string) => {
    const today = new Date()
    let months = 12 // Default 12 mesi

    switch (category) {
      case 'Scarpe antinfortunistiche':
        months = 12
        break
      case 'Guanti protettivi':
        months = 6
        break
      case 'Occhiali di protezione':
        months = 24
        break
      case 'Mascherina respiratoria':
        months = 3
        break
      case 'Casco protettivo':
        months = 60
        break
      case 'Cuffie antirumore':
        months = 36
        break
      case 'Camice/Divisa':
        months = 12
        break
      default:
        months = 12
    }

    const expiryDate = new Date(today)
    expiryDate.setMonth(expiryDate.getMonth() + months)
    return expiryDate.toISOString().split('T')[0]
  }

  const handleCategoryChange = (category: string) => {
    setFormData({
      ...formData,
      category,
      expiresAt: suggestExpiryDate(category)
    })
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Link href="/safety" className="hover:text-blue-600">Sicurezza</Link>
          <span>/</span>
          <Link href="/safety/dpi" className="hover:text-blue-600">DPI</Link>
          <span>/</span>
          <span>Nuovo Verbale</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Nuovo Verbale Consegna DPI
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Registra la consegna di Dispositivi di Protezione Individuale
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 dark:text-blue-400 text-xl">ℹ️</span>
          <div>
            <p className="font-medium text-blue-900 dark:text-blue-300 mb-1">
              Verbale di Consegna
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Secondo il D.Lgs. 81/08 il datore di lavoro deve fornire i DPI necessari e conservarne
              traccia della consegna firmata dal lavoratore. Il verbale va conservato per almeno 10 anni.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
        <div className="space-y-6">
          {/* Dipendente */}
          <div>
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

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria DPI *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
            >
              <option value="">Seleziona categoria...</option>
              {dpiCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Nome/Descrizione */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome/Descrizione DPI *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
              placeholder="es. Scarpe antinfortunistiche S3 tg. 42 - Marca XYZ"
            />
          </div>

          {/* Data scadenza */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Scadenza/Rinnovo
              {formData.category && (
                <span className="ml-2 text-xs text-gray-500">
                  (suggerita in base al tipo)
                </span>
              )}
            </label>
            <input
              type="date"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Indicare quando il dispositivo dovrà essere rinnovato/sostituito
            </p>
          </div>

          {/* Periodi raccomandati per tipo */}
          {formData.category && (
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Periodi di rinnovo raccomandati:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Scarpe antinfortunistiche: 12 mesi</li>
                <li>• Guanti protettivi: 6 mesi (variabile in base all'uso)</li>
                <li>• Occhiali di protezione: 24 mesi</li>
                <li>• Mascherine respiratorie: 3 mesi (filtri)</li>
                <li>• Casco protettivo: 5 anni</li>
                <li>• Cuffie antirumore: 3 anni</li>
                <li>• Camici/Divise: 12 mesi</li>
              </ul>
            </div>
          )}

          {/* Note aggiuntive */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-300 mb-2">
              Nota Bene
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Dopo la creazione del verbale digitale, è necessario farlo firmare al dipendente.
              La firma può essere raccolta tramite il sistema di firma documenti oppure conservando
              una copia cartacea firmata.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-zinc-700">
          <Link
            href="/safety/dpi"
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Annulla
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creazione...' : 'Crea Verbale'}
          </button>
        </div>
      </form>
    </div>
  )
}
