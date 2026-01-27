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

export default function NewIncidentPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    employeeId: '',
    incidentDate: '',
    incidentTime: '',
    location: '',
    description: '',
    injuries: '',
    witnesses: '',
    severity: 'MINOR',
    reportedToInail: false,
    inailReportDate: '',
    inailProtocol: '',
    medicalCertificate: '',
    followUp: ''
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
      const res = await fetch('/api/safety/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore nella creazione')
      }

      router.push('/safety/incidents')
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
          <Link href="/safety/incidents" className="hover:text-blue-600">Infortuni</Link>
          <span>/</span>
          <span>Nuova Segnalazione</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Segnala Infortunio
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Compila tutti i dettagli dell'infortunio occorso
        </p>
      </div>

      {/* Alert info */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-amber-600 dark:text-amber-400 text-xl">ℹ️</span>
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-300 mb-1">
              Importante
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Per infortuni con prognosi superiore a 3 giorni è obbligatoria la denuncia INAIL entro 48 ore.
              Per infortuni mortali o molto gravi la denuncia deve essere immediata.
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
        <div className="space-y-8">
          {/* Sezione 1: Dati Generali */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Dati Generali
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dipendente Infortunato *
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Infortunio *
                </label>
                <input
                  type="date"
                  required
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ora Infortunio
                </label>
                <input
                  type="time"
                  value={formData.incidentTime}
                  onChange={(e) => setFormData({ ...formData, incidentTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Luogo Infortunio *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
                  placeholder="es. Sala operativa, Magazzino, In trasferta presso..."
                />
              </div>
            </div>
          </div>

          {/* Sezione 2: Dinamica */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Dinamica dell'Infortunio
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrizione Dettagliata *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
                  placeholder="Descrivi come è avvenuto l'infortunio, le cause, le circostanze..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lesioni Riportate
                </label>
                <textarea
                  value={formData.injuries}
                  onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
                  placeholder="Tipo di lesioni, parti del corpo coinvolte..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Testimoni
                </label>
                <input
                  type="text"
                  value={formData.witnesses}
                  onChange={(e) => setFormData({ ...formData, witnesses: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
                  placeholder="Nomi dei testimoni presenti"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gravità *
                </label>
                <select
                  required
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
                >
                  <option value="MINOR">Lieve (no prognosi o 1-3 giorni)</option>
                  <option value="MODERATE">Moderato (prognosi 4-40 giorni)</option>
                  <option value="SEVERE">Grave (prognosi oltre 40 giorni)</option>
                </select>
                {formData.severity === 'SEVERE' && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    ⚠️ Infortunio grave: richiede denuncia INAIL entro 48 ore
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sezione 3: INAIL */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Denuncia INAIL
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="reportedToInail"
                  checked={formData.reportedToInail}
                  onChange={(e) => setFormData({ ...formData, reportedToInail: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="reportedToInail" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Denuncia INAIL già effettuata
                </label>
              </div>

              {formData.reportedToInail && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data Denuncia INAIL
                    </label>
                    <input
                      type="date"
                      value={formData.inailReportDate}
                      onChange={(e) => setFormData({ ...formData, inailReportDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Numero Protocollo INAIL
                    </label>
                    <input
                      type="text"
                      value={formData.inailProtocol}
                      onChange={(e) => setFormData({ ...formData, inailProtocol: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
                      placeholder="N. protocollo"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sezione 4: Follow-up */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Documentazione e Follow-up
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certificato Medico
                </label>
                <input
                  type="text"
                  value={formData.medicalCertificate}
                  onChange={(e) => setFormData({ ...formData, medicalCertificate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
                  placeholder="Riferimento al certificato medico (path file, n. protocollo, etc.)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Note Follow-up
                </label>
                <textarea
                  value={formData.followUp}
                  onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
                  placeholder="Azioni correttive intraprese, follow-up previsto..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-zinc-700">
          <Link
            href="/safety/incidents"
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Annulla
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Registrazione...' : 'Registra Infortunio'}
          </button>
        </div>
      </form>
    </div>
  )
}
