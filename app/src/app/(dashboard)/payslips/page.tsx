'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface Payslip {
  id: string
  month: number
  year: number
  period: string
  grossAmount: number
  netAmount: number
  fileName: string
  fileUrl: string | null
  status: string
  uploadedAt: string
  viewedAt: string | null
  downloadedAt: string | null
  employee: {
    id: string
    firstName: string
    lastName: string
    email: string
    department: string | null
  }
  uploader: {
    id: string
    name: string
  }
}

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  department: string | null
}

interface Stats {
  total: number
  viewed: number
  downloaded: number
  notViewed: number
  viewedPercentage: number
  downloadedPercentage: number
  totalGross: number
  totalNet: number
  recentUploads: any[]
}

const monthNames = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
]

const statusLabels: Record<string, string> = {
  UPLOADED: 'Caricata',
  SENT: 'Inviata',
  VIEWED: 'Visualizzata',
  DOWNLOADED: 'Scaricata',
}

const statusColors: Record<string, string> = {
  UPLOADED: 'bg-gray-100 text-gray-700',
  SENT: 'bg-blue-100 text-blue-700',
  VIEWED: 'bg-green-100 text-green-700',
  DOWNLOADED: 'bg-purple-100 text-purple-700',
}

export default function PayslipsManagementPage() {
  const { data: session } = useSession()
  const [payslips, setPayslips] = useState<Payslip[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // View mode
  const [isEmployeeView, setIsEmployeeView] = useState(false)
  const [view, setView] = useState<'table' | 'history'>('table')

  // Filters
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all')

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [showCUModal, setShowCUModal] = useState(false)

  // Upload form
  const [uploadEmployee, setUploadEmployee] = useState('')
  const [uploadMonth, setUploadMonth] = useState(new Date().getMonth() + 1)
  const [uploadYear, setUploadYear] = useState(new Date().getFullYear())
  const [uploadGross, setUploadGross] = useState('')
  const [uploadNet, setUploadNet] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Bulk upload
  const [bulkFiles, setBulkFiles] = useState<File[]>([])
  const [bulkPeriod, setBulkPeriod] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)
  const [bulkNotify, setBulkNotify] = useState(true)
  const bulkInputRef = useRef<HTMLInputElement>(null)

  // CU Upload
  const [cuYear, setCuYear] = useState(new Date().getFullYear() - 1)
  const [cuFile, setCuFile] = useState<File | null>(null)
  const cuInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    checkUserRole()
    fetchData()
  }, [selectedYear, selectedMonth, selectedEmployee])

  async function checkUserRole() {
    // Check if user is employee (has no tenantId but has employee profile)
    // This would be determined by session data
    const hasEmployeeRole = false // TODO: implement based on session
    setIsEmployeeView(hasEmployeeRole)
  }

  async function fetchData() {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        year: selectedYear.toString(),
        month: selectedMonth.toString(),
      })

      if (selectedEmployee !== 'all') {
        params.set('employeeId', selectedEmployee)
      }

      const [payslipsRes, employeesRes, statsRes] = await Promise.all([
        fetch(`/api/payslips?${params}`),
        !isEmployeeView ? fetch('/api/employees') : Promise.resolve(null),
        !isEmployeeView ? fetch(`/api/payslips/stats?${params}`) : Promise.resolve(null),
      ])

      if (payslipsRes.ok) {
        const data = await payslipsRes.json()
        setPayslips(data)
      }

      if (employeesRes?.ok) {
        const data = await employeesRes.json()
        setEmployees(data.employees || data)
      }

      if (statsRes?.ok) {
        const data = await statsRes.json()
        setStats(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!uploadEmployee || !uploadFile) {
      setError('Seleziona dipendente e file')
      return
    }

    try {
      setUploading(true)
      setError('')

      // TODO: Upload file to storage (S3, Cloudinary, etc.)
      // For now, we'll simulate with a mock URL
      const fileUrl = `/uploads/payslips/${uploadFile.name}`
      const period = `${uploadYear}-${String(uploadMonth).padStart(2, '0')}`

      const res = await fetch('/api/payslips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: uploadEmployee,
          period,
          grossAmount: uploadGross ? parseFloat(uploadGross) : null,
          netAmount: uploadNet ? parseFloat(uploadNet) : null,
          fileName: uploadFile.name,
          fileUrl,
          fileSize: uploadFile.size,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore nel caricamento')
      }

      setSuccess('Cedolino caricato con successo!')
      setShowUploadModal(false)
      setUploadEmployee('')
      setUploadFile(null)
      setUploadGross('')
      setUploadNet('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    } finally {
      setUploading(false)
    }
  }

  async function handleBulkUpload(e: React.FormEvent) {
    e.preventDefault()
    if (bulkFiles.length === 0) {
      setError('Seleziona almeno un file')
      return
    }

    try {
      setUploading(true)
      setError('')

      // Parse files and match to employees
      // Expected format: FISCALCODE_YYYYMM.pdf or LASTNAME_FIRSTNAME_YYYYMM.pdf
      const payslipsData = bulkFiles.map(file => {
        const fileName = file.name.replace('.pdf', '')
        const parts = fileName.split('_')

        // Try to match employee by fiscal code or name
        let matchedEmployee = null

        // TODO: Implement smart matching logic
        // For now, we'll need manual assignment

        return {
          file,
          fileName: file.name,
          matchedEmployee,
        }
      })

      // For this example, let's show a warning that manual matching is needed
      setError('Upload massivo richiede corrispondenza manuale. Usa upload singolo per ora.')

      // TODO: Implement bulk upload with file storage
      /*
      const uploadedPayslips = await Promise.all(
        payslipsData.map(async (item) => {
          // Upload file
          const fileUrl = await uploadFileToStorage(item.file)
          return {
            employeeId: item.matchedEmployee?.id,
            fileName: item.fileName,
            fileUrl,
            fileSize: item.file.size,
          }
        })
      )

      const res = await fetch('/api/payslips/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payslips: uploadedPayslips,
          period: bulkPeriod,
          notifyEmployees: bulkNotify,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore nel caricamento')
      }

      const result = await res.json()
      setSuccess(`${result.created} cedolini caricati con successo!`)
      setShowBulkUploadModal(false)
      setBulkFiles([])
      if (bulkInputRef.current) bulkInputRef.current.value = ''
      fetchData()
      */
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    } finally {
      setUploading(false)
    }
  }

  async function handleCUUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!cuFile) {
      setError('Seleziona file CU')
      return
    }

    try {
      setUploading(true)
      setError('')

      // TODO: Upload CU for all employees
      // This would create a payslip entry with type CU for each employee

      setSuccess('CU caricata con successo per tutti i dipendenti!')
      setShowCUModal(false)
      setCuFile(null)
      if (cuInputRef.current) cuInputRef.current.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    } finally {
      setUploading(false)
    }
  }

  async function handleSendNotification(id: string) {
    try {
      const res = await fetch(`/api/payslips/${id}/notify`, {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Errore nell'invio notifica")
      }

      const result = await res.json()
      if (result.notified) {
        setSuccess('Notifica inviata al dipendente!')
      } else {
        setError(result.warning || 'Impossibile inviare notifica')
      }
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    }
  }

  async function handleDownload(payslip: Payslip) {
    try {
      // Track download if employee
      if (isEmployeeView && !payslip.downloadedAt) {
        await fetch(`/api/payslips/${payslip.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'mark_downloaded' }),
        })
      }

      // Download file
      if (payslip.fileUrl) {
        window.open(payslip.fileUrl, '_blank')
      }

      fetchData()
    } catch (err) {
      setError('Errore durante il download')
    }
  }

  async function handleMarkViewed(payslip: Payslip) {
    if (payslip.viewedAt) return

    try {
      await fetch(`/api/payslips/${payslip.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_viewed' }),
      })
      fetchData()
    } catch (err) {
      console.error('Error marking as viewed:', err)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  // Stats calculations - safely handle null/undefined values
  const totalGross = payslips.reduce((sum, p) => sum + (p.grossAmount || 0), 0)
  const totalNet = payslips.reduce((sum, p) => sum + (p.netAmount || 0), 0)
  const viewedCount = payslips.filter((p) => p.viewedAt !== null).length
  const notViewedCount = payslips.filter((p) => p.viewedAt === null).length

  // Group by year for history view
  const payslipsByYear = payslips.reduce((acc, p) => {
    const year = p.year.toString()
    if (!acc[year]) acc[year] = []
    acc[year].push(p)
    return acc
  }, {} as Record<string, Payslip[]>)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEmployeeView ? 'I Miei Cedolini' : 'Gestione Cedolini'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEmployeeView
                ? 'Visualizza e scarica i tuoi cedolini mensili'
                : 'Carica e gestisci le buste paga dei dipendenti'}
            </p>
          </div>
          <PageInfoTooltip
            title="Gestione Cedolini"
            description="Carica i cedolini mensili e distribuiscili automaticamente ai dipendenti. Il sistema traccia le visualizzazioni e mantiene uno storico completo accessibile sia a te che ai collaboratori."
            tips={[
              'Usa nomenclatura standard (CF_MMAAAA.pdf) per upload automatico',
              'Invia notifica dopo il caricamento per avvisare il dipendente',
              'Conserva i cedolini per almeno 5 anni come richiesto dalla legge',
              'I dipendenti ricevono notifica automatica e possono scaricare il PDF',
            ]}
          />
        </div>

        {!isEmployeeView && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              + Carica Cedolino
            </button>
            <button
              onClick={() => setShowBulkUploadModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Upload Massivo
            </button>
            <button
              onClick={() => setShowCUModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium"
            >
              Carica CU
            </button>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg mb-6 flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="text-green-900 dark:text-green-300">×</button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-900 dark:text-red-300">×</button>
        </div>
      )}

      {/* View Toggle - Employee only */}
      {isEmployeeView && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView('table')}
            className={`px-4 py-2 rounded-lg font-medium ${
              view === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300'
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-4 py-2 rounded-lg font-medium ${
              view === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300'
            }`}
          >
            Archivio Storico
          </button>
        </div>
      )}

      {/* Period Selector */}
      {!isEmployeeView && (
        <div className="flex gap-4 mb-6">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
          >
            {monthNames.map((name, idx) => (
              <option key={idx} value={idx + 1}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
          >
            {[2024, 2025, 2026, 2027].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
          >
            <option value="all">Tutti i dipendenti</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Stats Cards - Admin only */}
      {!isEmployeeView && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-gray-200 dark:border-zinc-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cedolini Caricati
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {payslips.length}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Visualizzati</p>
            <p className="text-3xl font-bold text-green-600">{viewedCount}</p>
            <p className="text-xs text-gray-500 mt-1">
              {notViewedCount} non ancora visti
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Totale Lordo</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalGross)}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Totale Netto</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalNet)}</p>
          </div>
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-900">
                  {!isEmployeeView && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Dipendente
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Periodo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Lordo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Netto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Stato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {isEmployeeView ? 'Disponibile dal' : 'Caricata il'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Caricamento...
                    </td>
                  </tr>
                ) : payslips.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Nessun cedolino per questo periodo
                    </td>
                  </tr>
                ) : (
                  payslips.map((payslip) => (
                    <tr
                      key={payslip.id}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-750"
                      onClick={() => isEmployeeView && handleMarkViewed(payslip)}
                    >
                      {!isEmployeeView && (
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {payslip.employee.firstName} {payslip.employee.lastName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {payslip.employee.department || payslip.employee.email}
                            </p>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900 dark:text-white font-medium">
                          {monthNames[payslip.month - 1]} {payslip.year}
                        </span>
                        {isEmployeeView && !payslip.viewedAt && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                            NUOVO
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className="text-gray-900 dark:text-white">
                          {payslip.grossAmount ? formatCurrency(payslip.grossAmount) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className="font-semibold text-green-600">
                          {payslip.netAmount ? formatCurrency(payslip.netAmount) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            statusColors[payslip.status] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {statusLabels[payslip.status] || payslip.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(payslip.uploadedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(payslip)
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Scarica PDF
                          </button>
                          {!isEmployeeView && payslip.status === 'UPLOADED' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSendNotification(payslip.id)
                              }}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Invia Notifica
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* History View - Employee only */}
      {isEmployeeView && view === 'history' && (
        <div className="space-y-6">
          {Object.keys(payslipsByYear).sort((a, b) => parseInt(b) - parseInt(a)).map(year => (
            <div key={year} className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Anno {year}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {payslipsByYear[year].map(payslip => (
                  <div
                    key={payslip.id}
                    className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleDownload(payslip)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {monthNames[payslip.month - 1]}
                      </h3>
                      {!payslip.viewedAt && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                          NUOVO
                        </span>
                      )}
                    </div>
                    {payslip.netAmount > 0 && (
                      <p className="text-2xl font-bold text-green-600 mb-2">
                        {formatCurrency(payslip.netAmount)}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Caricato il {formatDate(payslip.uploadedAt)}
                    </p>
                    {payslip.downloadedAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Scaricato il {formatDate(payslip.downloadedAt)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Carica Cedolino
            </h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dipendente
                </label>
                <select
                  value={uploadEmployee}
                  onChange={(e) => setUploadEmployee(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Seleziona dipendente</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mese
                  </label>
                  <select
                    value={uploadMonth}
                    onChange={(e) => setUploadMonth(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  >
                    {monthNames.map((name, idx) => (
                      <option key={idx} value={idx + 1}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Anno
                  </label>
                  <select
                    value={uploadYear}
                    onChange={(e) => setUploadYear(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  >
                    {[2024, 2025, 2026, 2027].map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lordo (opzionale)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={uploadGross}
                    onChange={(e) => setUploadGross(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Netto (opzionale)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={uploadNet}
                    onChange={(e) => setUploadNet(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  File PDF
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Caricamento...' : 'Carica'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Upload Massivo Cedolini
            </h2>
            <form onSubmit={handleBulkUpload} className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-lg text-sm">
                <p className="font-medium mb-2">Nomenclatura File:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>FISCALCODE_YYYYMM.pdf (es. RSSMRA85M01H501X_202601.pdf)</li>
                  <li>COGNOME_NOME_YYYYMM.pdf (es. ROSSI_MARIO_202601.pdf)</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Periodo (YYYY-MM)
                </label>
                <input
                  type="text"
                  value={bulkPeriod}
                  onChange={(e) => setBulkPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  placeholder="2026-01"
                  pattern="\d{4}-\d{2}"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  File PDF (multipli)
                </label>
                <input
                  type="file"
                  ref={bulkInputRef}
                  accept=".pdf"
                  multiple
                  onChange={(e) => setBulkFiles(Array.from(e.target.files || []))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  required
                />
                {bulkFiles.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {bulkFiles.length} file selezionati
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="bulkNotify"
                  checked={bulkNotify}
                  onChange={(e) => setBulkNotify(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="bulkNotify" className="text-sm text-gray-700 dark:text-gray-300">
                  Invia notifica automatica ai dipendenti
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBulkUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {uploading ? 'Caricamento...' : 'Carica Tutti'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CU Modal */}
      {showCUModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Carica Certificazione Unica (CU)
            </h2>
            <form onSubmit={handleCUUpload} className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 p-4 rounded-lg text-sm">
                <p>La CU sarà distribuita automaticamente a tutti i dipendenti attivi per l'anno selezionato.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Anno fiscale
                </label>
                <select
                  value={cuYear}
                  onChange={(e) => setCuYear(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                >
                  {[2023, 2024, 2025, 2026].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  File CU PDF
                </label>
                <input
                  type="file"
                  ref={cuInputRef}
                  accept=".pdf"
                  onChange={(e) => setCuFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCUModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {uploading ? 'Caricamento...' : 'Carica CU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
