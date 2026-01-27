'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface Incident {
  id: string
  employeeId: string
  employee: {
    id: string
    firstName: string
    lastName: string
    department: string | null
    jobTitle: string | null
  }
  author: {
    id: string
    name: string
  }
  createdAt: string
  type: string
  incidentDate: string
  incidentTime?: string
  location?: string
  description: string
  injuries?: string
  witnesses?: string
  severity?: 'MINOR' | 'MODERATE' | 'SEVERE'
  reportedToInail?: boolean
  inailReportDate?: string
  inailProtocol?: string
  status?: string
}

const severityLabels: Record<string, string> = {
  MINOR: 'Lieve',
  MODERATE: 'Moderato',
  SEVERE: 'Grave'
}

const severityColors: Record<string, string> = {
  MINOR: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  MODERATE: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  SEVERE: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showNewIncidentForm, setShowNewIncidentForm] = useState(false)

  useEffect(() => {
    fetchIncidents()
  }, [])

  async function fetchIncidents() {
    try {
      const res = await fetch('/api/safety/incidents')
      if (!res.ok) throw new Error('Errore nel caricamento')
      const data = await res.json()
      setIncidents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
    }).format(new Date(dateStr))
  }

  const formatDateTime = (dateStr: string) => {
    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(dateStr))
  }

  // Stats
  const totalIncidents = incidents.length
  const last12Months = incidents.filter(inc => {
    const date = new Date(inc.incidentDate)
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
    return date >= twelveMonthsAgo
  }).length

  const reportedToInail = incidents.filter(inc => inc.reportedToInail).length
  const pendingInail = incidents.filter(inc => !inc.reportedToInail && inc.severity === 'SEVERE').length

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <Link href="/safety" className="hover:text-blue-600">Sicurezza</Link>
              <span>/</span>
              <span>Infortuni</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Registro Infortuni
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Segnalazioni e denunce INAIL
            </p>
          </div>
          <PageInfoTooltip
            title="Registro Infortuni"
            description="Gestisci tutte le segnalazioni di infortuni sul lavoro. Per infortuni con prognosi superiore a 3 giorni è obbligatoria la denuncia INAIL entro 48 ore."
            tips={[
              'Registra OGNI infortunio, anche se minore',
              'Infortuni gravi (>3gg): denuncia INAIL entro 48h',
              'Infortuni mortali: denuncia immediata',
              'Conserva certificati medici e documentazione',
              'Il registro va tenuto per almeno 4 anni'
            ]}
          />
        </div>
        <Link
          href="/safety/incidents/new"
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          + Segnala Infortunio
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-gray-200 dark:border-zinc-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Totale Infortuni</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalIncidents}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-gray-200 dark:border-zinc-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ultimi 12 mesi</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {last12Months}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-gray-200 dark:border-zinc-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Denunciati INAIL</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {reportedToInail}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 mb-1">Denunce Pendenti</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {pendingInail}
          </p>
          {pendingInail > 0 && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              Richiede azione urgente!
            </p>
          )}
        </div>
      </div>

      {/* Alert pendenti */}
      {pendingInail > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
            <div>
              <p className="font-medium text-red-900 dark:text-red-300 mb-1">
                Denunce INAIL Pendenti
              </p>
              <p className="text-sm text-red-700 dark:text-red-400">
                Ci sono {pendingInail} infortuni gravi che richiedono denuncia INAIL entro 48 ore.
                Compila le denunce al più presto.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Incidents List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Caricamento...</div>
      ) : incidents.length === 0 ? (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Nessun infortunio registrato
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Fortunatamente il registro infortuni è vuoto!
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Data Infortunio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Dipendente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Descrizione
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Gravità
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    INAIL
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                {incidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-gray-50 dark:hover:bg-zinc-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(incident.incidentDate)}
                      </div>
                      {incident.incidentTime && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {incident.incidentTime}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {incident.employee.firstName} {incident.employee.lastName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {incident.employee.jobTitle || incident.employee.department || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-md">
                        {incident.description.length > 100
                          ? incident.description.substring(0, 100) + '...'
                          : incident.description
                        }
                      </div>
                      {incident.location && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          📍 {incident.location}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {incident.severity && (
                        <span className={`px-2 py-1 text-xs font-medium rounded ${severityColors[incident.severity]}`}>
                          {severityLabels[incident.severity]}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {incident.reportedToInail ? (
                        <div>
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded">
                            Denunciato
                          </span>
                          {incident.inailProtocol && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {incident.inailProtocol}
                            </div>
                          )}
                        </div>
                      ) : incident.severity === 'SEVERE' ? (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded">
                          Da denunciare
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Non richiesto
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        href={`/safety/incidents/${incident.id}`}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Dettagli
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
