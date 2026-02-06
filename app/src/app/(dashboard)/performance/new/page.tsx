'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface Employee {
  id: string
  firstName: string
  lastName: string
  department: string | null
  jobTitle: string | null
}

export default function NewPerformanceReviewPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)

  const [formData, setFormData] = useState({
    employeeId: '',
    reviewDate: new Date().toISOString().split('T')[0],
    technicalSkills: 0,
    teamwork: 0,
    communication: 0,
    reliability: 0,
    growthPotential: 0,
    strengths: '',
    improvements: '',
    goals: '',
    notes: '',
    status: 'DRAFT',
  })

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch('/api/employees')
        if (res.ok) {
          const data = await res.json()
          setEmployees(data)
        }
      } catch (err) {
        console.error('Error fetching employees:', err)
      } finally {
        setLoadingEmployees(false)
      }
    }
    fetchEmployees()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        employeeId: formData.employeeId,
        reviewDate: formData.reviewDate,
        technicalSkills: formData.technicalSkills || null,
        teamwork: formData.teamwork || null,
        communication: formData.communication || null,
        reliability: formData.reliability || null,
        growthPotential: formData.growthPotential || null,
        strengths: formData.strengths || null,
        improvements: formData.improvements || null,
        goals: formData.goals || null,
        notes: formData.notes || null,
        status: formData.status,
      }

      const res = await fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore nella creazione')
      }

      router.push('/performance')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  const renderStarRating = (
    field: 'technicalSkills' | 'teamwork' | 'communication' | 'reliability' | 'growthPotential',
    label: string
  ) => {
    const value = formData[field]
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, [field]: star })}
              className={`text-2xl transition-colors ${
                star <= value ? 'text-yellow-500' : 'text-gray-300 dark:text-zinc-600 hover:text-yellow-300'
              }`}
            >
              ★
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {value > 0 ? `${value}/5` : 'Non valutato'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nuova Valutazione
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Crea una nuova valutazione delle prestazioni
          </p>
        </div>
        <PageInfoTooltip
          title="Valutazione Prestazioni"
          description="Valuta le prestazioni di un dipendente in diverse aree. Puoi salvare come bozza e completare in seguito."
          tips={[
            'Valuta oggettivamente ogni area con le stelle',
            'Usa i campi testuali per feedback dettagliati',
            'Imposta obiettivi chiari e misurabili'
          ]}
        />
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
          )}

          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6 space-y-6">
            {/* Dipendente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dipendente *
              </label>
              <select
                required
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                disabled={loadingEmployees}
              >
                <option value="">-- Seleziona dipendente --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} {emp.jobTitle ? `- ${emp.jobTitle}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Data Valutazione */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Valutazione *
              </label>
              <input
                type="date"
                required
                value={formData.reviewDate}
                onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              />
            </div>

            {/* Valutazioni */}
            <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Punteggi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderStarRating('technicalSkills', 'Competenze Tecniche')}
                {renderStarRating('teamwork', 'Lavoro di Squadra')}
                {renderStarRating('communication', 'Comunicazione')}
                {renderStarRating('reliability', 'Affidabilità')}
                {renderStarRating('growthPotential', 'Potenziale di Crescita')}
              </div>
            </div>

            {/* Feedback Testuali */}
            <div className="border-t border-gray-200 dark:border-zinc-700 pt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Feedback
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Punti di Forza
                </label>
                <textarea
                  value={formData.strengths}
                  onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                  placeholder="Descrivi i punti di forza del dipendente..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Aree di Miglioramento
                </label>
                <textarea
                  value={formData.improvements}
                  onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                  placeholder="Indica le aree dove il dipendente può migliorare..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Obiettivi
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                  placeholder="Definisci gli obiettivi per il prossimo periodo..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Note Aggiuntive
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                  placeholder="Eventuali note aggiuntive..."
                />
              </div>
            </div>

            {/* Stato */}
            <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stato
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="DRAFT"
                    checked={formData.status === 'DRAFT'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Bozza</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="COMPLETED"
                    checked={formData.status === 'COMPLETED'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Completata</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Salva come bozza per completare in seguito
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvataggio...' : 'Salva Valutazione'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
