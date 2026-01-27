'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface DisciplinaryProcedure {
  id: string
  infractionType: string
  infractionDate: string
  infractionDescription: string
  status: string
  contestationDate: string | null
  contestationText: string | null
  contestationDeliveryMethod: string | null
  contestationDeliveredAt: string | null
  defenseDeadline: string | null
  defenseReceivedAt: string | null
  defenseText: string | null
  defenseRequestedHearing: boolean
  hearingDate: string | null
  hearingNotes: string | null
  decisionDate: string | null
  sanctionType: string | null
  sanctionDetails: string | null
  sanctionDeliveredAt: string | null
  appealedAt: string | null
  appealOutcome: string | null
  employee: {
    id: string
    firstName: string
    lastName: string
    department: string | null
    jobTitle: string | null
    email: string | null
    fiscalCode: string | null
  }
  documents: Array<{
    id: string
    title: string
    type: string
    content: string | null
    createdAt: string
  }>
  createdAt: string
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

const sanctionTypes = [
  { value: 'VERBAL_WARNING', label: 'Richiamo Verbale' },
  { value: 'WRITTEN_WARNING', label: 'Ammonizione Scritta' },
  { value: 'FINE', label: 'Multa (max 4h retribuzione)' },
  { value: 'SUSPENSION', label: 'Sospensione (max 10 giorni)' },
  { value: 'DISMISSAL_NOTICE', label: 'Licenziamento con Preavviso' },
  { value: 'DISMISSAL_IMMEDIATE', label: 'Licenziamento per Giusta Causa' },
  { value: 'NO_SANCTION', label: 'Archiviazione senza Sanzione' },
]

export default function DisciplinaryProcedureDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [procedure, setProcedure] = useState<DisciplinaryProcedure | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'timeline' | 'documents'>('timeline')

  // Form states
  const [showDefenseForm, setShowDefenseForm] = useState(false)
  const [showHearingForm, setShowHearingForm] = useState(false)
  const [showSanctionForm, setShowSanctionForm] = useState(false)

  const [defenseData, setDefenseData] = useState({
    defenseText: '',
    requestedHearing: false,
  })

  const [hearingData, setHearingData] = useState({
    hearingDate: '',
    hearingNotes: '',
  })

  const [sanctionData, setSanctionData] = useState({
    sanctionType: '',
    sanctionDetails: '',
  })

  useEffect(() => {
    async function fetchProcedure() {
      try {
        const res = await fetch(`/api/disciplinary/${params.id}`)
        if (!res.ok) throw new Error('Errore caricamento procedura')
        const data = await res.json()
        setProcedure(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto')
      } finally {
        setLoading(false)
      }
    }
    fetchProcedure()
  }, [params.id])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Intl.DateTimeFormat('it-IT', { dateStyle: 'medium' }).format(new Date(dateStr))
  }

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateStr))
  }

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  const handleSendContestation = async () => {
    if (!confirm('Confermi l\'invio della contestazione? Inizierà il termine di 5 giorni.')) return

    try {
      const res = await fetch(`/api/disciplinary/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contestationDeliveredAt: new Date().toISOString(),
          status: 'AWAITING_DEFENSE',
        }),
      })

      if (!res.ok) throw new Error('Errore invio contestazione')
      const data = await res.json()
      setProcedure(data)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore sconosciuto')
    }
  }

  const handleSubmitDefense = async () => {
    try {
      const res = await fetch(`/api/disciplinary/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defenseReceivedAt: new Date().toISOString(),
          defenseText: defenseData.defenseText,
          defenseRequestedHearing: defenseData.requestedHearing,
          status: defenseData.requestedHearing ? 'HEARING_SCHEDULED' : 'DEFENSE_RECEIVED',
        }),
      })

      if (!res.ok) throw new Error('Errore registrazione difese')
      const data = await res.json()
      setProcedure(data)
      setShowDefenseForm(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore sconosciuto')
    }
  }

  const handleScheduleHearing = async () => {
    try {
      const res = await fetch(`/api/disciplinary/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hearingDate: hearingData.hearingDate,
          status: 'HEARING_SCHEDULED',
        }),
      })

      if (!res.ok) throw new Error('Errore programmazione audizione')
      const data = await res.json()
      setProcedure(data)
      setShowHearingForm(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore sconosciuto')
    }
  }

  const handleCompleteHearing = async () => {
    try {
      const res = await fetch(`/api/disciplinary/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hearingNotes: hearingData.hearingNotes,
          status: 'PENDING_DECISION',
        }),
      })

      if (!res.ok) throw new Error('Errore completamento audizione')
      const data = await res.json()
      setProcedure(data)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore sconosciuto')
    }
  }

  const handleIssueSanction = async () => {
    if (!sanctionData.sanctionType) {
      alert('Seleziona il tipo di sanzione')
      return
    }

    try {
      const res = await fetch(`/api/disciplinary/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionDate: new Date().toISOString(),
          sanctionType: sanctionData.sanctionType,
          sanctionDetails: sanctionData.sanctionDetails,
          sanctionDeliveredAt: new Date().toISOString(),
          status: 'SANCTION_ISSUED',
        }),
      })

      if (!res.ok) throw new Error('Errore emissione provvedimento')
      const data = await res.json()
      setProcedure(data)
      setShowSanctionForm(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore sconosciuto')
    }
  }

  const handleClose = async () => {
    if (!confirm('Chiudere la procedura?')) return

    try {
      const res = await fetch(`/api/disciplinary/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CLOSED' }),
      })

      if (!res.ok) throw new Error('Errore chiusura procedura')
      const data = await res.json()
      setProcedure(data)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore sconosciuto')
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12 text-gray-500">Caricamento...</div>
      </div>
    )
  }

  if (error || !procedure) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error || 'Procedura non trovata'}</div>
      </div>
    )
  }

  const daysRemaining = getDaysRemaining(procedure.defenseDeadline)
  const isUrgent = daysRemaining !== null && daysRemaining <= 2

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Link href="/disciplinary" className="hover:text-blue-600">Disciplinare</Link>
          <span>/</span>
          <Link href="/disciplinary/procedures" className="hover:text-blue-600">Procedimenti</Link>
          <span>/</span>
          <span>#{procedure.id.slice(0, 8)}</span>
        </div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Procedimento Disciplinare - {procedure.employee.firstName} {procedure.employee.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {procedure.employee.jobTitle || procedure.employee.department || 'Dipendente'}
              </p>
            </div>
            <PageInfoTooltip
              title="Dettaglio Procedura"
              description="Gestisci tutte le fasi della procedura. Ogni azione è tracciata e documentata per garantire la conformità normativa."
            />
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-lg ${
            procedure.status === 'CLOSED' ? 'bg-green-100 text-green-700' :
            procedure.status === 'SANCTION_ISSUED' ? 'bg-red-100 text-red-700' :
            procedure.status === 'AWAITING_DEFENSE' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {statusLabels[procedure.status]}
          </span>
        </div>
      </div>

      {/* Urgent Alert */}
      {isUrgent && procedure.status === 'AWAITING_DEFENSE' && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-red-600 text-2xl">⚠</span>
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-200 mb-1">
                Scadenza Imminente
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                Rimangono {daysRemaining} giorni per le giustificazioni del dipendente.
                Scadenza: {formatDate(procedure.defenseDeadline)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Data Infrazione</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatDate(procedure.infractionDate)}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contestazione</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {procedure.contestationDeliveredAt ? formatDate(procedure.contestationDeliveredAt) : 'Non inviata'}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Scadenza Difese</p>
          <p className={`text-xl font-bold ${isUrgent ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
            {procedure.defenseDeadline ? (
              <>
                {formatDate(procedure.defenseDeadline)}
                {daysRemaining !== null && daysRemaining > 0 && (
                  <span className="text-sm font-normal ml-2">({daysRemaining}gg)</span>
                )}
              </>
            ) : '-'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-zinc-700">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'timeline'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Timeline Procedura
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'documents'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Documenti ({procedure.documents.length})
        </button>
      </div>

      {activeTab === 'timeline' ? (
        <div className="space-y-6">
          {/* Timeline Steps */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Workflow Procedura</h2>

            <div className="space-y-6">
              {/* Step 1: Contestazione */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    procedure.contestationDeliveredAt
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {procedure.contestationDeliveredAt ? '✓' : '1'}
                  </div>
                  <div className="w-0.5 h-16 bg-gray-200 dark:bg-zinc-700 mt-2"></div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Contestazione Scritta</h3>
                  {procedure.contestationDeliveredAt ? (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Inviata il {formatDateTime(procedure.contestationDeliveredAt)}</p>
                      <p>Modalità: {procedure.contestationDeliveryMethod}</p>
                    </div>
                  ) : procedure.status === 'DRAFT' ? (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">In attesa di invio</p>
                      <button
                        onClick={handleSendContestation}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Invia Contestazione
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Step 2: Difese */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    procedure.defenseReceivedAt
                      ? 'bg-green-100 text-green-600'
                      : procedure.status === 'AWAITING_DEFENSE'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {procedure.defenseReceivedAt ? '✓' : '2'}
                  </div>
                  <div className="w-0.5 h-16 bg-gray-200 dark:bg-zinc-700 mt-2"></div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Termine Difese (5 giorni)
                  </h3>
                  {procedure.defenseReceivedAt ? (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Ricevute il {formatDateTime(procedure.defenseReceivedAt)}</p>
                      {procedure.defenseRequestedHearing && (
                        <p className="text-blue-600 mt-1">Richiesta audizione</p>
                      )}
                    </div>
                  ) : procedure.status === 'AWAITING_DEFENSE' ? (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Scadenza: {formatDate(procedure.defenseDeadline)}
                        {daysRemaining !== null && ` (${daysRemaining} giorni)`}
                      </p>
                      {!showDefenseForm ? (
                        <button
                          onClick={() => setShowDefenseForm(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                        >
                          Registra Difese
                        </button>
                      ) : (
                        <div className="mt-2 space-y-2">
                          <textarea
                            rows={4}
                            value={defenseData.defenseText}
                            onChange={(e) => setDefenseData({ ...defenseData, defenseText: e.target.value })}
                            placeholder="Testo giustificazioni dipendente..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-sm"
                          />
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={defenseData.requestedHearing}
                              onChange={(e) => setDefenseData({ ...defenseData, requestedHearing: e.target.checked })}
                            />
                            <span>Richiesta audizione</span>
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={handleSubmitDefense}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                            >
                              Conferma
                            </button>
                            <button
                              onClick={() => setShowDefenseForm(false)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                              Annulla
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">In attesa contestazione</p>
                  )}
                </div>
              </div>

              {/* Step 3: Audizione (opzionale) */}
              {(procedure.defenseRequestedHearing || procedure.hearingDate) && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      procedure.hearingNotes
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {procedure.hearingNotes ? '✓' : '3'}
                    </div>
                    <div className="w-0.5 h-16 bg-gray-200 dark:bg-zinc-700 mt-2"></div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Audizione</h3>
                    {procedure.hearingNotes ? (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>Completata il {formatDate(procedure.hearingDate)}</p>
                      </div>
                    ) : procedure.hearingDate ? (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Programmata: {formatDateTime(procedure.hearingDate)}
                        </p>
                        <div className="space-y-2">
                          <textarea
                            rows={4}
                            value={hearingData.hearingNotes}
                            onChange={(e) => setHearingData({ ...hearingData, hearingNotes: e.target.value })}
                            placeholder="Verbale audizione..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-sm"
                          />
                          <button
                            onClick={handleCompleteHearing}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                          >
                            Completa Audizione
                          </button>
                        </div>
                      </div>
                    ) : !showHearingForm ? (
                      <button
                        onClick={() => setShowHearingForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Programma Audizione
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="datetime-local"
                          value={hearingData.hearingDate}
                          onChange={(e) => setHearingData({ ...hearingData, hearingDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleScheduleHearing}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                          >
                            Conferma
                          </button>
                          <button
                            onClick={() => setShowHearingForm(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            Annulla
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Provvedimento */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    procedure.sanctionDeliveredAt
                      ? 'bg-green-100 text-green-600'
                      : ['DEFENSE_RECEIVED', 'PENDING_DECISION'].includes(procedure.status)
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {procedure.sanctionDeliveredAt ? '✓' : '4'}
                  </div>
                  <div className="w-0.5 h-16 bg-gray-200 dark:bg-zinc-700 mt-2"></div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Provvedimento</h3>
                  {procedure.sanctionDeliveredAt ? (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Emesso il {formatDateTime(procedure.sanctionDeliveredAt)}</p>
                      <p className="mt-1 font-medium text-red-600">
                        {sanctionTypes.find(s => s.value === procedure.sanctionType)?.label}
                      </p>
                    </div>
                  ) : ['DEFENSE_RECEIVED', 'PENDING_DECISION', 'HEARING_SCHEDULED'].includes(procedure.status) ? (
                    <div>
                      {!showSanctionForm ? (
                        <button
                          onClick={() => setShowSanctionForm(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                        >
                          Emetti Provvedimento
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <select
                            value={sanctionData.sanctionType}
                            onChange={(e) => setSanctionData({ ...sanctionData, sanctionType: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-sm"
                          >
                            <option value="">Seleziona sanzione...</option>
                            {sanctionTypes.map(s => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                          <textarea
                            rows={6}
                            value={sanctionData.sanctionDetails}
                            onChange={(e) => setSanctionData({ ...sanctionData, sanctionDetails: e.target.value })}
                            placeholder="Motivazioni del provvedimento..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-sm"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleIssueSanction}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                            >
                              Emetti Provvedimento
                            </button>
                            <button
                              onClick={() => setShowSanctionForm(false)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                              Annulla
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">In attesa valutazione</p>
                  )}
                </div>
              </div>

              {/* Step 5: Chiusura */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    procedure.status === 'CLOSED'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {procedure.status === 'CLOSED' ? '✓' : '5'}
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Chiusura</h3>
                  {procedure.status === 'CLOSED' ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Procedura completata</p>
                  ) : procedure.status === 'SANCTION_ISSUED' ? (
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      Chiudi Procedura
                    </button>
                  ) : (
                    <p className="text-sm text-gray-400">In attesa provvedimento</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Infraction Details */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fatti Contestati</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{procedure.infractionDescription}</p>
            </div>
          </div>

          {/* Defense if received */}
          {procedure.defenseText && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Giustificazioni Dipendente</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{procedure.defenseText}</p>
              </div>
            </div>
          )}

          {/* Sanction if issued */}
          {procedure.sanctionDetails && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Provvedimento</h2>
              <div className="mb-3">
                <span className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium">
                  {sanctionTypes.find(s => s.value === procedure.sanctionType)?.label}
                </span>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{procedure.sanctionDetails}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Documents Tab
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documenti Procedura</h2>
            {procedure.documents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nessun documento disponibile</p>
            ) : (
              <div className="space-y-4">
                {procedure.documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{doc.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDateTime(doc.createdAt)}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded">
                        {doc.type}
                      </span>
                    </div>
                    {doc.content && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-zinc-900 rounded text-sm">
                        <pre className="whitespace-pre-wrap font-sans">{doc.content}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
