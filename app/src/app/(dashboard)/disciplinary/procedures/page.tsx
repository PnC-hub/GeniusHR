'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface DisciplinaryProcedure {
  id: string
  infractionType: string
  infractionDate: string
  infractionDescription: string
  status: string
  contestationDate: string | null
  defenseDeadline: string | null
  defenseReceivedAt: string | null
  sanctionType: string | null
  decisionDate: string | null
  employee: {
    id: string
    firstName: string
    lastName: string
    department: string | null
    jobTitle: string | null
  }
  documents: Array<{
    id: string
    title: string
    type: string
  }>
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Bozza',
  CONTESTATION_SENT: 'Contestazione Inviata',
  AWAITING_DEFENSE: 'In Attesa Difese',
  DEFENSE_RECEIVED: 'Difese Ricevute',
  HEARING_SCHEDULED: 'Audizione Programmata',
  PENDING_DECISION: 'In Valutazione',
  SANCTION_ISSUED: 'Provvedimento Emesso',
  APPEALED: 'Impugnato',
  CLOSED: 'Chiuso',
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  CONTESTATION_SENT: 'bg-yellow-100 text-yellow-700',
  AWAITING_DEFENSE: 'bg-blue-100 text-blue-700',
  DEFENSE_RECEIVED: 'bg-purple-100 text-purple-700',
  HEARING_SCHEDULED: 'bg-indigo-100 text-indigo-700',
  PENDING_DECISION: 'bg-orange-100 text-orange-700',
  SANCTION_ISSUED: 'bg-red-100 text-red-700',
  APPEALED: 'bg-pink-100 text-pink-700',
  CLOSED: 'bg-green-100 text-green-700',
}

const infractionLabels: Record<string, string> = {
  TARDINESS: 'Ritardo',
  ABSENCE: 'Assenza Ingiustificata',
  INSUBORDINATION: 'Insubordinazione',
  NEGLIGENCE: 'Negligenza',
  MISCONDUCT: 'Comportamento Scorretto',
  POLICY_VIOLATION: 'Violazione Regolamento',
  SAFETY_VIOLATION: 'Violazione Sicurezza',
  HARASSMENT: 'Molestie',
  THEFT: 'Furto',
  FRAUD: 'Frode',
  OTHER: 'Altro',
}

export default function DisciplinaryProceduresPage() {
  const [procedures, setProcedures] = useState<DisciplinaryProcedure[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function fetchProcedures() {
      try {
        const params = new URLSearchParams()
        if (filter) params.set('status', filter)

        const res = await fetch(`/api/disciplinary?${params}`)
        if (!res.ok) throw new Error('Errore nel caricamento')
        const data = await res.json()
        setProcedures(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto')
      } finally {
        setLoading(false)
      }
    }
    fetchProcedures()
  }, [filter])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
    }).format(new Date(dateStr))
  }

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(dateStr))
  }

  // Filtra per ricerca
  const filteredProcedures = procedures.filter((p) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    const employeeName = `${p.employee.firstName} ${p.employee.lastName}`.toLowerCase()
    return (
      employeeName.includes(search) ||
      (p.employee.department?.toLowerCase().includes(search) || false) ||
      infractionLabels[p.infractionType]?.toLowerCase().includes(search)
    )
  })

  // Conteggi
  const active = procedures.filter((p) => !['CLOSED', 'DRAFT'].includes(p.status))
  const awaiting = procedures.filter((p) => p.status === 'AWAITING_DEFENSE')
  const closed = procedures.filter((p) => p.status === 'CLOSED')

  // Urgenti (scadenza < 2 giorni)
  const urgent = procedures.filter((p) => {
    if (p.status !== 'AWAITING_DEFENSE' || !p.defenseDeadline) return false
    const deadline = new Date(p.defenseDeadline)
    const twoDays = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    return deadline <= twoDays
  })

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <Link href="/disciplinary" className="hover:text-blue-600">
                Disciplinare
              </Link>
              <span>/</span>
              <span>Procedimenti</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Procedimenti Disciplinari
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestione completa delle procedure Art. 7 L. 300/1970
            </p>
          </div>
          <PageInfoTooltip
            title="Procedimenti Disciplinari"
            description="Gestisci tutte le fasi della procedura disciplinare: dalla contestazione alla sanzione finale. Il sistema traccia automaticamente le scadenze e i documenti."
            tips={[
              'Contestazione: deve essere specifica e tempestiva',
              'Difese: 5 giorni obbligatori (Art. 7 comma 5)',
              'Audizione: facoltativa ma consigliata',
              'Sanzione: proporzionata alla gravità',
            ]}
          />
        </div>
        <Link
          href="/disciplinary/procedures/new"
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          + Nuova Procedura
        </Link>
      </div>

      {/* Alert Urgenti */}
      {urgent.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
              <span className="text-red-700 dark:text-red-300 text-xl">⚠</span>
            </div>
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-200 mb-1">
                {urgent.length} {urgent.length === 1 ? 'Procedura Urgente' : 'Procedure Urgenti'}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                Ci sono procedure con scadenza difese entro 2 giorni
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div
          onClick={() => setFilter('')}
          className={`bg-white dark:bg-zinc-800 rounded-lg p-4 border cursor-pointer transition-colors ${
            !filter
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-gray-200 dark:border-zinc-700 hover:border-blue-300'
          }`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Totale</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {procedures.length}
          </p>
        </div>
        <div
          onClick={() => setFilter('AWAITING_DEFENSE')}
          className={`bg-white dark:bg-zinc-800 rounded-lg p-4 border cursor-pointer transition-colors ${
            filter === 'AWAITING_DEFENSE'
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-gray-200 dark:border-zinc-700 hover:border-blue-300'
          }`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Attesa Difese</p>
          <p className="text-3xl font-bold text-blue-600">{awaiting.length}</p>
          {urgent.length > 0 && (
            <p className="text-xs text-red-600 mt-1">
              {urgent.length} urgente{urgent.length !== 1 && 'i'}
            </p>
          )}
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Attive</p>
          <p className="text-3xl font-bold text-orange-600">{active.length}</p>
        </div>
        <div
          onClick={() => setFilter('CLOSED')}
          className={`bg-white dark:bg-zinc-800 rounded-lg p-4 border cursor-pointer transition-colors ${
            filter === 'CLOSED'
              ? 'border-green-500 ring-2 ring-green-200'
              : 'border-gray-200 dark:border-zinc-700 hover:border-green-300'
          }`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Chiuse</p>
          <p className="text-3xl font-bold text-green-600">{closed.length}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cerca per dipendente, reparto o tipo infrazione..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Dipendente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Infrazione
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Stato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Scadenza Difese
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Caricamento...
                  </td>
                </tr>
              ) : filteredProcedures.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm
                      ? 'Nessun procedimento trovato per la ricerca'
                      : 'Nessun procedimento disciplinare'}
                  </td>
                </tr>
              ) : (
                filteredProcedures.map((procedure) => {
                  const isUrgent =
                    procedure.status === 'AWAITING_DEFENSE' &&
                    procedure.defenseDeadline &&
                    new Date(procedure.defenseDeadline) <=
                      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)

                  return (
                    <tr
                      key={procedure.id}
                      className={`hover:bg-gray-50 dark:hover:bg-zinc-750 ${
                        isUrgent ? 'bg-red-50 dark:bg-red-900/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {procedure.employee.firstName} {procedure.employee.lastName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {procedure.employee.jobTitle ||
                            procedure.employee.department ||
                            '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {infractionLabels[procedure.infractionType] ||
                          procedure.infractionType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(procedure.infractionDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            statusColors[procedure.status] ||
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {statusLabels[procedure.status] || procedure.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {procedure.defenseDeadline ? (
                          <div className="flex items-center gap-2">
                            <span
                              className={
                                isUrgent
                                  ? 'text-red-600 font-medium'
                                  : 'text-gray-500 dark:text-gray-400'
                              }
                            >
                              {formatDate(procedure.defenseDeadline)}
                            </span>
                            {isUrgent && (
                              <span className="text-red-600 text-lg">⚠</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/disciplinary/procedures/${procedure.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Dettagli →
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
