'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import InfoTooltip from '@/components/ui/InfoTooltip'

/**
 * Consultant - Attendance Export Page
 *
 * Features:
 * - Period selection (month/custom range)
 * - Preview attendance data before export
 * - Multiple export formats (CSV, Excel)
 * - Export history
 * - Fields: employee, fiscal code, days worked, hours, overtime, absences
 */

type AttendanceRecord = {
  employeeId: string
  employeeName: string
  fiscalCode: string
  department: string
  daysWorked: number
  totalHours: number
  overtimeHours: number
  absences: number
  sickDays: number
  vacationDays: number
}

export default function ConsultantAttendanceExportPage() {
  const params = useParams()
  const router = useRouter()
  const clientId = params.clientId as string

  const [tenantName, setTenantName] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )
  const [customRange, setCustomRange] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [previewData, setPreviewData] = useState<AttendanceRecord[]>([])
  const [exportHistory, setExportHistory] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    // Load tenant info and export history
    loadTenantInfo()
    loadExportHistory()
  }, [clientId])

  const loadTenantInfo = async () => {
    try {
      const res = await fetch(`/api/consultant/${clientId}/info`)
      if (res.ok) {
        const data = await res.json()
        setTenantName(data.name)
      }
    } catch (error) {
      console.error('Error loading tenant info:', error)
    }
  }

  const loadExportHistory = async () => {
    try {
      const res = await fetch(`/api/consultant/${clientId}/attendance/exports`)
      if (res.ok) {
        const data = await res.json()
        setExportHistory(data)
      }
    } catch (error) {
      console.error('Error loading export history:', error)
    }
  }

  const handlePreview = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        month: selectedMonth,
        customRange: customRange.toString(),
        ...(customRange && { startDate, endDate }),
      })

      const res = await fetch(
        `/api/consultant/${clientId}/attendance/preview?${params}`
      )
      if (res.ok) {
        const data = await res.json()
        setPreviewData(data)
        setShowPreview(true)
      } else {
        alert('Errore nel caricamento dei dati')
      }
    } catch (error) {
      console.error('Error loading preview:', error)
      alert('Errore nel caricamento dei dati')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: 'csv' | 'xlsx') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        month: selectedMonth,
        customRange: customRange.toString(),
        format,
        ...(customRange && { startDate, endDate }),
      })

      const res = await fetch(
        `/api/consultant/${clientId}/attendance/export?${params}`
      )

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `presenze_${tenantName}_${selectedMonth}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        // Reload export history
        loadExportHistory()
        alert('Export completato con successo!')
      } else {
        alert('Errore durante l\'export')
      }
    } catch (error) {
      console.error('Error exporting:', error)
      alert('Errore durante l\'export')
    } finally {
      setLoading(false)
    }
  }

  const totalHours = previewData.reduce((sum, r) => sum + r.totalHours, 0)
  const totalOvertime = previewData.reduce((sum, r) => sum + r.overtimeHours, 0)
  const totalDays = previewData.reduce((sum, r) => sum + r.daysWorked, 0)

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href={`/consultant/${clientId}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Torna alla Dashboard Cliente
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Export Presenze - {tenantName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Esporta i dati delle presenze per l'elaborazione delle paghe
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Selezione Periodo
            </h2>

            {/* Period Type Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setCustomRange(false)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !customRange
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Mensile
              </button>
              <button
                onClick={() => setCustomRange(true)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  customRange
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Personalizzato
              </button>
            </div>

            {!customRange ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mese
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Inizio
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Fine
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handlePreview}
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {loading ? 'Caricamento...' : '👁️ Anteprima Dati'}
            </button>

            {showPreview && previewData.length > 0 && (
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => handleExport('csv')}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
                >
                  📊 Esporta CSV
                </button>
                <button
                  onClick={() => handleExport('xlsx')}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-gray-400 transition-colors font-medium"
                >
                  📈 Esporta Excel
                </button>
              </div>
            )}
          </div>

          {/* Export History */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Storico Export
            </h2>
            {exportHistory.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Nessun export precedente
              </p>
            ) : (
              <div className="space-y-2">
                {exportHistory.slice(0, 5).map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {exp.period}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(exp.exportedAt).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Anteprima Dati Presenze
                </h2>
                <InfoTooltip
                  content="Verifica i dati prima dell'export. Include ore lavorate, straordinari e assenze per ogni dipendente."
                  position="bottom"
                />
              </div>
            </div>

            {!showPreview ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📊</span>
                <p className="text-gray-500 dark:text-gray-400">
                  Seleziona un periodo e clicca su "Anteprima Dati" per visualizzare i dati
                </p>
              </div>
            ) : previewData.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📭</span>
                <p className="text-gray-500 dark:text-gray-400">
                  Nessun dato presente per il periodo selezionato
                </p>
              </div>
            ) : (
              <>
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Totale Giorni</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalDays}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Totale Ore</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(totalHours)}h
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Straordinari</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(totalOvertime)}h
                    </p>
                  </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Dipendente
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                          CF
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Giorni
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Ore
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Straord.
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Assenze
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((record, idx) => (
                        <tr
                          key={record.employeeId}
                          className={`border-b border-gray-100 dark:border-gray-800 ${
                            idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {record.employeeName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {record.department}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-sm font-mono text-gray-700 dark:text-gray-300">
                            {record.fiscalCode}
                          </td>
                          <td className="py-3 px-4 text-center text-gray-900 dark:text-white">
                            {record.daysWorked}
                          </td>
                          <td className="py-3 px-4 text-center text-gray-900 dark:text-white">
                            {Math.round(record.totalHours)}h
                          </td>
                          <td className="py-3 px-4 text-center text-yellow-600 dark:text-yellow-400">
                            {Math.round(record.overtimeHours)}h
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="text-xs">
                              <span className="text-red-600 dark:text-red-400">
                                {record.sickDays} mal.
                              </span>
                              {' / '}
                              <span className="text-blue-600 dark:text-blue-400">
                                {record.vacationDays} fer.
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
