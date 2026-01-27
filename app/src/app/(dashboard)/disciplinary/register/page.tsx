'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface Employee {
  id: string
  firstName: string
  lastName: string
  department: string | null
}

interface ProcedureRecord {
  id: string
  employeeId: string
  infractionType: string
  infractionDate: string
  sanctionType: string | null
  decisionDate: string | null
  status: string
  employee: Employee
}

const sanctionLabels: Record<string, string> = {
  VERBAL_WARNING: 'Richiamo Verbale',
  WRITTEN_WARNING: 'Ammonizione Scritta',
  FINE: 'Multa',
  SUSPENSION: 'Sospensione',
  DISMISSAL_NOTICE: 'Licenziamento con Preavviso',
  DISMISSAL_IMMEDIATE: 'Licenziamento Giusta Causa',
  NO_SANCTION: 'Archiviato senza Sanzione',
}

const infractionLabels: Record<string, string> = {
  TARDINESS: 'Ritardo',
  ABSENCE: 'Assenza',
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

export default function DisciplinaryRegisterPage() {
  const [procedures, setProcedures] = useState<ProcedureRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')
  const [yearFilter, setYearFilter] = useState<string>(
    new Date().getFullYear().toString()
  )

  useEffect(() => {
    async function fetchProcedures() {
      try {
        const res = await fetch('/api/disciplinary')
        if (!res.ok) throw new Error('Errore caricamento')
        const data = await res.json()
        // Solo procedure con sanzione emessa o chiuse
        const filtered = data.filter(
          (p: ProcedureRecord) =>
            p.status === 'SANCTION_ISSUED' || p.status === 'CLOSED'
        )
        setProcedures(filtered)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto')
      } finally {
        setLoading(false)
      }
    }
    fetchProcedures()
  }, [])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
    }).format(new Date(dateStr))
  }

  // Filtra per dipendente e anno
  const filteredProcedures = procedures.filter((p) => {
    if (selectedEmployee && p.employeeId !== selectedEmployee) return false
    if (yearFilter) {
      const year = new Date(p.infractionDate).getFullYear()
      if (year.toString() !== yearFilter) return false
    }
    return true
  })

  // Raggruppa per dipendente
  const groupedByEmployee = filteredProcedures.reduce((acc, p) => {
    if (!acc[p.employeeId]) {
      acc[p.employeeId] = {
        employee: p.employee,
        procedures: [],
      }
    }
    acc[p.employeeId].procedures.push(p)
    return acc
  }, {} as Record<string, { employee: Employee; procedures: ProcedureRecord[] }>)

  // Identifica recidivi (2+ sanzioni in 2 anni)
  const twoYearsAgo = new Date()
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

  const recidivists = Object.entries(groupedByEmployee).filter(
    ([_, data]) =>
      data.procedures.filter(
        (p) =>
          new Date(p.infractionDate) >= twoYearsAgo &&
          p.sanctionType !== 'NO_SANCTION'
      ).length >= 2
  )

  // Lista dipendenti unici
  const uniqueEmployees = Array.from(
    new Set(procedures.map((p) => p.employeeId))
  ).map((id) => {
    const proc = procedures.find((p) => p.employeeId === id)!
    return {
      id,
      name: `${proc.employee.firstName} ${proc.employee.lastName}`,
    }
  })

  // Anni disponibili
  const availableYears = Array.from(
    new Set(procedures.map((p) => new Date(p.infractionDate).getFullYear()))
  ).sort((a, b) => b - a)

  const exportToCSV = () => {
    const headers = [
      'Dipendente',
      'Reparto',
      'Data Infrazione',
      'Tipo Infrazione',
      'Sanzione',
      'Data Provvedimento',
    ]
    const rows = filteredProcedures.map((p) => [
      `${p.employee.firstName} ${p.employee.lastName}`,
      p.employee.department || '',
      formatDate(p.infractionDate),
      infractionLabels[p.infractionType] || p.infractionType,
      p.sanctionType ? sanctionLabels[p.sanctionType] : '',
      formatDate(p.decisionDate),
    ])

    const csv = [
      headers.join(','),
      ...rows.map((r) => r.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `registro_disciplinare_${yearFilter || 'tutti'}.csv`
    a.click()
  }

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
              <span>Registro</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Registro Provvedimenti Disciplinari
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Storico completo delle sanzioni erogate (conservazione 10 anni)
            </p>
          </div>
          <PageInfoTooltip
            title="Registro Disciplinare"
            description="Registro storico obbligatorio di tutti i provvedimenti disciplinari. Conservare per almeno 10 anni. Utilizzato per verificare recidiva (2 anni) e per audit."
            tips={[
              'Recidiva: 2+ sanzioni negli ultimi 2 anni',
              'Consulente può richiedere export per paghe',
              'Dati sensibili: accesso limitato',
            ]}
          />
        </div>
        <button
          onClick={exportToCSV}
          disabled={filteredProcedures.length === 0}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export CSV
        </button>
      </div>

      {/* Alerts */}
      {recidivists.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center flex-shrink-0">
              <span className="text-orange-700 dark:text-orange-300 text-lg">!</span>
            </div>
            <div>
              <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                {recidivists.length} Dipendente/i in Recidiva
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Hanno ricevuto 2 o più sanzioni negli ultimi 2 anni
              </p>
              <div className="mt-2 space-y-1">
                {recidivists.map(([employeeId, data]) => (
                  <div key={employeeId} className="text-sm">
                    <button
                      onClick={() => setSelectedEmployee(employeeId)}
                      className="text-orange-700 dark:text-orange-300 hover:underline"
                    >
                      {data.employee.firstName} {data.employee.lastName}
                    </button>
                    <span className="text-orange-600 ml-2">
                      (
                      {
                        data.procedures.filter(
                          (p) =>
                            new Date(p.infractionDate) >= twoYearsAgo &&
                            p.sanctionType !== 'NO_SANCTION'
                        ).length
                      }{' '}
                      sanzioni)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Totale Provvedimenti
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {procedures.length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Dipendenti Coinvolti
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {Object.keys(groupedByEmployee).length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Recidivi (2 anni)</p>
          <p className="text-3xl font-bold text-orange-600">
            {recidivists.length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Anno {yearFilter}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {
              procedures.filter(
                (p) =>
                  new Date(p.infractionDate).getFullYear().toString() === yearFilter
              ).length
            }
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
          >
            <option value="">Tutti i dipendenti</option>
            {uniqueEmployees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-48">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
          >
            <option value="">Tutti gli anni</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
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
                  Data Infrazione
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Tipo Infrazione
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Sanzione
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Data Provvedimento
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
                    Nessun provvedimento nel registro
                  </td>
                </tr>
              ) : (
                filteredProcedures.map((proc) => {
                  const employeeProcedures = procedures.filter(
                    (p) => p.employeeId === proc.employeeId
                  )
                  const recentSanctions = employeeProcedures.filter(
                    (p) =>
                      new Date(p.infractionDate) >= twoYearsAgo &&
                      p.sanctionType !== 'NO_SANCTION'
                  )
                  const isRecidivist = recentSanctions.length >= 2

                  return (
                    <tr
                      key={proc.id}
                      className={`hover:bg-gray-50 dark:hover:bg-zinc-750 ${
                        isRecidivist ? 'bg-orange-50 dark:bg-orange-900/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {proc.employee.firstName} {proc.employee.lastName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {proc.employee.department || '-'}
                            </div>
                          </div>
                          {isRecidivist && (
                            <span
                              className="px-2 py-0.5 text-xs bg-orange-600 text-white rounded"
                              title={`${recentSanctions.length} sanzioni negli ultimi 2 anni`}
                            >
                              Recidivo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(proc.infractionDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {infractionLabels[proc.infractionType] ||
                          proc.infractionType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            proc.sanctionType === 'NO_SANCTION'
                              ? 'bg-gray-100 text-gray-700'
                              : proc.sanctionType === 'VERBAL_WARNING'
                              ? 'bg-yellow-100 text-yellow-700'
                              : proc.sanctionType === 'WRITTEN_WARNING'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {proc.sanctionType
                            ? sanctionLabels[proc.sanctionType]
                            : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(proc.decisionDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/disciplinary/procedures/${proc.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Dettagli
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

      {/* Info Footer */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Nota:</strong> Il registro deve essere conservato per almeno 10 anni
          ai fini della conservazione documentale obbligatoria. La recidiva è
          calcolata su un periodo di 2 anni.
        </p>
      </div>
    </div>
  )
}
