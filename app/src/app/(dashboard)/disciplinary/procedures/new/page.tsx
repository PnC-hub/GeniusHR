'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface Employee {
  id: string
  firstName: string
  lastName: string
  department: string | null
  jobTitle: string | null
  email: string | null
}

const infractionTypes = [
  { value: 'TARDINESS', label: 'Ritardo' },
  { value: 'ABSENCE', label: 'Assenza Ingiustificata' },
  { value: 'INSUBORDINATION', label: 'Insubordinazione' },
  { value: 'NEGLIGENCE', label: 'Negligenza' },
  { value: 'MISCONDUCT', label: 'Comportamento Scorretto' },
  { value: 'POLICY_VIOLATION', label: 'Violazione Regolamento' },
  { value: 'SAFETY_VIOLATION', label: 'Violazione Norme Sicurezza' },
  { value: 'HARASSMENT', label: 'Molestie' },
  { value: 'THEFT', label: 'Furto' },
  { value: 'FRAUD', label: 'Frode' },
  { value: 'OTHER', label: 'Altro' },
]

const deliveryMethods = [
  { value: 'raccomandata', label: 'Raccomandata A/R' },
  { value: 'consegna_mano', label: 'Consegna a mano' },
  { value: 'pec', label: 'PEC' },
]

export default function NewDisciplinaryProcedurePage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    employeeId: '',
    infractionType: '',
    infractionDate: new Date().toISOString().split('T')[0],
    infractionDescription: '',
    sendContestation: false,
    contestationText: '',
    contestationDeliveryMethod: 'consegna_mano',
  })

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch('/api/employees')
        if (!res.ok) throw new Error('Errore caricamento dipendenti')
        const data = await res.json()
        setEmployees(data.filter((e: Employee) => e.email)) // Solo con email
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto')
      } finally {
        setLoading(false)
      }
    }
    fetchEmployees()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/disciplinary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: formData.employeeId,
          infractionType: formData.infractionType,
          infractionDate: formData.infractionDate,
          infractionDescription: formData.infractionDescription,
          contestationText: formData.sendContestation
            ? formData.contestationText
            : null,
          contestationDeliveryMethod: formData.sendContestation
            ? formData.contestationDeliveryMethod
            : null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore creazione procedura')
      }

      const procedure = await res.json()
      router.push(`/disciplinary/procedures/${procedure.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setSubmitting(false)
    }
  }

  const generateContestationTemplate = () => {
    const employee = employees.find((e) => e.id === formData.employeeId)
    if (!employee) return ''

    const today = new Date().toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    const infractionLabel =
      infractionTypes.find((t) => t.value === formData.infractionType)?.label ||
      ''

    return `Spett.le
${employee.firstName} ${employee.lastName}
${employee.department || ''}

OGGETTO: Contestazione disciplinare - ${infractionLabel}

Con la presente si contesta formalmente quanto segue:

${formData.infractionDescription}

Ai sensi dell'Art. 7 della Legge 300/1970 (Statuto dei Lavoratori), Le è concesso un termine di 5 (cinque) giorni dalla ricezione della presente per fornire le Sue giustificazioni scritte e/o per chiedere un'audizione.

Le giustificazioni dovranno essere presentate per iscritto e potranno essere inviate tramite:
- Consegna a mano presso l'ufficio del personale
- Email a: [email HR]
- PEC: [pec aziendale]

In mancanza di giustificazioni o qualora le stesse risultino non accoglibili, si procederà all'applicazione delle sanzioni previste dal CCNL applicato e dal Codice Disciplinare aziendale.

Distinti saluti.

${today}
La Direzione`
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Link href="/disciplinary" className="hover:text-blue-600">
            Disciplinare
          </Link>
          <span>/</span>
          <Link href="/disciplinary/procedures" className="hover:text-blue-600">
            Procedimenti
          </Link>
          <span>/</span>
          <span>Nuovo</span>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Nuova Procedura Disciplinare
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Avvia una nuova procedura nel rispetto dell'Art. 7 L. 300/1970
            </p>
          </div>
          <PageInfoTooltip
            title="Nuova Procedura"
            description="Compila tutti i campi richiesti. La contestazione deve essere specifica, dettagliata e tempestiva. Se invii subito la contestazione, partirà il termine di 5 giorni per le difese."
            tips={[
              'Descrivi i fatti in modo preciso con data, ora e luogo',
              'Indica eventuali testimoni o prove',
              'La tempestività è fondamentale per la validità',
            ]}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Dipendente */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            1. Dipendente Interessato
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Seleziona Dipendente *
            </label>
            <select
              required
              value={formData.employeeId}
              onChange={(e) =>
                setFormData({ ...formData, employeeId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
            >
              <option value="">Seleziona...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                  {emp.department && ` - ${emp.department}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Infrazione */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            2. Fatti Contestati
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo Infrazione *
              </label>
              <select
                required
                value={formData.infractionType}
                onChange={(e) =>
                  setFormData({ ...formData, infractionType: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              >
                <option value="">Seleziona...</option>
                {infractionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Infrazione *
              </label>
              <input
                type="date"
                required
                value={formData.infractionDate}
                onChange={(e) =>
                  setFormData({ ...formData, infractionDate: e.target.value })
                }
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrizione Dettagliata Fatti *
              </label>
              <textarea
                required
                rows={6}
                value={formData.infractionDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    infractionDescription: e.target.value,
                  })
                }
                placeholder="Descrivi in modo preciso e dettagliato i fatti: data, ora, luogo, circostanze, eventuali testimoni..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                La contestazione deve essere specifica e circostanziata
              </p>
            </div>
          </div>
        </div>

        {/* Contestazione */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              3. Invio Contestazione
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sendContestation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sendContestation: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Invia contestazione ora
              </span>
            </label>
          </div>

          {formData.sendContestation && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Testo Contestazione *
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        contestationText: generateContestationTemplate(),
                      })
                    }
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Usa Template
                  </button>
                </div>
                <textarea
                  required={formData.sendContestation}
                  rows={12}
                  value={formData.contestationText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contestationText: e.target.value,
                    })
                  }
                  placeholder="Inserisci il testo della lettera di contestazione..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Modalità Consegna *
                </label>
                <select
                  required={formData.sendContestation}
                  value={formData.contestationDeliveryMethod}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contestationDeliveryMethod: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                >
                  {deliveryMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Nota:</strong> Inviando ora la contestazione, inizierà
                  automaticamente il termine di 5 giorni per le giustificazioni del
                  dipendente (Art. 7 comma 5 L. 300/1970).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Azioni */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-750"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={submitting || loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? 'Creazione...'
              : formData.sendContestation
              ? 'Crea e Invia Contestazione'
              : 'Crea Bozza'}
          </button>
        </div>
      </form>
    </div>
  )
}
