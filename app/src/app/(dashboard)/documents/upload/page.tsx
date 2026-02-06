'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface Employee {
  id: string
  firstName: string
  lastName: string
}

const documentTypes = [
  { value: 'CONTRACT', label: 'Contratto' },
  { value: 'ID_DOCUMENT', label: 'Documento Identità' },
  { value: 'TRAINING_CERTIFICATE', label: 'Certificato Formazione' },
  { value: 'MEDICAL_CERTIFICATE', label: 'Certificato Medico' },
  { value: 'DPI_RECEIPT', label: 'Ricevuta DPI' },
  { value: 'PAYSLIP', label: 'Cedolino' },
  { value: 'DISCIPLINARY', label: 'Documento Disciplinare' },
  { value: 'GDPR_CONSENT', label: 'Consenso GDPR' },
  { value: 'OTHER', label: 'Altro' },
]

export default function DocumentUploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    type: 'OTHER',
    category: '',
    employeeId: '',
    filePath: '',
    fileSize: '',
    mimeType: '',
    expiresAt: '',
    retentionYears: '',
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
      const payload: Record<string, unknown> = {
        name: formData.name,
        type: formData.type,
        filePath: formData.filePath || `/uploads/documents/${Date.now()}-${formData.name.replace(/\s+/g, '_')}`,
      }

      if (formData.category) payload.category = formData.category
      if (formData.employeeId) payload.employeeId = formData.employeeId
      if (formData.fileSize) payload.fileSize = parseInt(formData.fileSize)
      if (formData.mimeType) payload.mimeType = formData.mimeType
      if (formData.expiresAt) payload.expiresAt = formData.expiresAt
      if (formData.retentionYears) payload.retentionYears = parseInt(formData.retentionYears)

      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore nella creazione')
      }

      router.push('/documents')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Carica Documento
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Aggiungi un nuovo documento al sistema
          </p>
        </div>
        <PageInfoTooltip
          title="Upload Documenti"
          description="Carica documenti aziendali o relativi ai dipendenti. I documenti vengono archiviati in modo sicuro e possono avere una data di scadenza."
          tips={[
            'Specifica sempre il tipo di documento per una migliore organizzazione',
            'Imposta una data di scadenza per documenti come certificati o idoneità',
            'Associa il documento a un dipendente se è personale'
          ]}
        />
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
          )}

          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6 space-y-6">
            {/* Nome Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome Documento *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                placeholder="es. Contratto di lavoro Mario Rossi"
              />
            </div>

            {/* Tipo Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo Documento *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dipendente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dipendente (opzionale)
              </label>
              <select
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                disabled={loadingEmployees}
              >
                <option value="">-- Documento aziendale --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Lascia vuoto per documenti aziendali non legati a un dipendente
              </p>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria (opzionale)
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                placeholder="es. Amministrazione, Sicurezza, HR"
              />
            </div>

            {/* Data Scadenza */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Scadenza (opzionale)
              </label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Per certificati, idoneità o documenti con validità limitata
              </p>
            </div>

            {/* Anni Conservazione */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Anni di Conservazione (opzionale)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.retentionYears}
                onChange={(e) => setFormData({ ...formData, retentionYears: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                placeholder="es. 10"
              />
              <p className="text-xs text-gray-500 mt-1">
                Per documenti soggetti a obblighi di conservazione (es. buste paga 5 anni)
              </p>
            </div>

            {/* Info File (simulato) */}
            <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-zinc-600">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Trascina qui il file o clicca per selezionare
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PDF, DOC, DOCX, JPG, PNG fino a 10MB
                </p>
              </div>
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
              {loading ? 'Caricamento...' : 'Carica Documento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
