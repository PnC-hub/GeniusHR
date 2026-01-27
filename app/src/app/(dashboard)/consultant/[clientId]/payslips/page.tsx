'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import InfoTooltip from '@/components/ui/InfoTooltip'

/**
 * Consultant - Payslip Upload Page
 *
 * Features:
 * - Bulk PDF upload
 * - Automatic distribution to employees
 * - Automatic employee notification
 * - Upload confirmation
 * - Upload history
 */

type Employee = {
  id: string
  firstName: string
  lastName: string
  fiscalCode: string
}

type UploadResult = {
  employeeId: string
  employeeName: string
  status: 'success' | 'error'
  message: string
}

export default function ConsultantPayslipsUploadPage() {
  const params = useParams()
  const clientId = params.clientId as string

  const [tenantName, setTenantName] = useState('')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState(
    new Date().toISOString().slice(0, 7)
  )
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([])
  const [showResults, setShowResults] = useState(false)

  // For manual assignment
  const [manualMode, setManualMode] = useState(false)
  const [fileAssignments, setFileAssignments] = useState<
    Map<string, string>
  >(new Map())

  useEffect(() => {
    loadTenantInfo()
    loadEmployees()
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

  const loadEmployees = async () => {
    try {
      const res = await fetch(`/api/consultant/${clientId}/employees`)
      if (res.ok) {
        const data = await res.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error('Error loading employees:', error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files)
      setShowResults(false)
      setUploadResults([])
    }
  }

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Seleziona almeno un file')
      return
    }

    setUploading(true)
    setShowResults(false)

    try {
      const formData = new FormData()
      formData.append('period', selectedPeriod)
      formData.append('manualMode', manualMode.toString())

      // Add files
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        formData.append('files', file)

        // If manual mode, add employee assignment
        if (manualMode) {
          const employeeId = fileAssignments.get(file.name)
          if (employeeId) {
            formData.append(`assignment_${file.name}`, employeeId)
          }
        }
      }

      const res = await fetch(`/api/consultant/${clientId}/payslips/upload`, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const results = await res.json()
        setUploadResults(results)
        setShowResults(true)
        setSelectedFiles(null)

        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        alert('Errore durante l\'upload')
      }
    } catch (error) {
      console.error('Error uploading:', error)
      alert('Errore durante l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleAssignment = (fileName: string, employeeId: string) => {
    const newAssignments = new Map(fileAssignments)
    newAssignments.set(fileName, employeeId)
    setFileAssignments(newAssignments)
  }

  const successCount = uploadResults.filter((r) => r.status === 'success').length
  const errorCount = uploadResults.filter((r) => r.status === 'error').length

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
          Upload Cedolini - {tenantName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Carica e distribuisci i cedolini ai dipendenti
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Caricamento Cedolini
            </h2>

            {/* Period Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mese di Riferimento
              </label>
              <input
                type="month"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Mode Toggle */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Modalità Assegnazione
                </label>
                <InfoTooltip
                  content="Automatica: assegna in base al nome file (es: 'Mario_Rossi.pdf'). Manuale: assegna manualmente ogni file."
                  position="left"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setManualMode(false)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !manualMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Automatica
                </button>
                <button
                  onClick={() => setManualMode(true)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    manualMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Manuale
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seleziona File PDF
              </label>
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileSelect}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              {selectedFiles && selectedFiles.length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {selectedFiles.length} file selezionati
                </p>
              )}
            </div>

            {/* Manual Assignment */}
            {manualMode && selectedFiles && selectedFiles.length > 0 && (
              <div className="mb-4 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Assegna Dipendente per Ogni File
                </p>
                {Array.from(selectedFiles).map((file, idx) => (
                  <div key={idx} className="mb-3">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {file.name}
                    </label>
                    <select
                      onChange={(e) => handleAssignment(file.name, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Seleziona dipendente...</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={
                uploading ||
                !selectedFiles ||
                selectedFiles.length === 0 ||
                (manualMode && fileAssignments.size !== selectedFiles.length)
              }
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {uploading ? '⏳ Caricamento...' : '📤 Carica e Distribuisci'}
            </button>

            {manualMode && selectedFiles && fileAssignments.size < selectedFiles.length && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                Assegna tutti i file prima di caricare
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              💡 Come Funziona
            </h3>
            <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
              <li>• Nomina i file: Nome_Cognome.pdf</li>
              <li>• Oppure usa modalità manuale</li>
              <li>• I dipendenti ricevono notifica email</li>
              <li>• Accesso tracciato e sicuro</li>
            </ul>
          </div>
        </div>

        {/* Right Column - Results & Employee List */}
        <div className="lg:col-span-2">
          {showResults ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Risultati Upload
              </h2>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Successo</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {successCount}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Errori</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {errorCount}
                  </p>
                </div>
              </div>

              {/* Results List */}
              <div className="space-y-2">
                {uploadResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      result.status === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {result.employeeName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {result.message}
                        </p>
                      </div>
                      <span className="text-2xl">
                        {result.status === 'success' ? '✅' : '❌'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowResults(false)
                  setUploadResults([])
                }}
                className="mt-6 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Nuovo Upload
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Dipendenti ({employees.length})
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                          {employee.fiscalCode || 'CF non disponibile'}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        Pronto per upload
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
