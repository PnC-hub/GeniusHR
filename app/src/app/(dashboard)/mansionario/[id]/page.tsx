'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Mansionario {
  id: string
  title: string
  ccnlLevel: string
  department: string
  status: 'draft' | 'active'
  duties: string[]
  skills: string[]
  responsibilities: string[]
  kpis: string[]
  assignedEmployees: string[]
  signedBy: string[]
  createdAt: string
  updatedAt: string
}

// Mock employee data
const mockEmployees = [
  { id: 'emp-1', name: 'Mario Rossi', jobTitle: 'Direttore Sanitario' },
  { id: 'emp-2', name: 'Laura Bianchi', jobTitle: 'Vice Direttore' },
  { id: 'emp-3', name: 'Giovanni Verdi', jobTitle: 'Odontoiatra' },
  { id: 'emp-4', name: 'Sara Neri', jobTitle: 'Odontoiatra' },
  { id: 'emp-5', name: 'Marco Gialli', jobTitle: 'Odontoiatra' },
  { id: 'emp-6', name: 'Francesca Blu', jobTitle: 'Igienista Dentale' },
  { id: 'emp-7', name: 'Andrea Viola', jobTitle: 'ASO' },
  { id: 'emp-8', name: 'Chiara Rosa', jobTitle: 'ASO' },
  { id: 'emp-9', name: 'Giulia Arancio', jobTitle: 'Responsabile Amministrativa' },
  { id: 'emp-10', name: 'Paolo Verde', jobTitle: 'Segretaria' }
]

export default function MansionarioDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [mansionario, setMansionario] = useState<Mansionario | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchMansionario(params.id as string)
    }
  }, [params.id])

  const fetchMansionario = async (id: string) => {
    try {
      const res = await fetch(`/api/mansionario/${id}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setMansionario(data)
    } catch (error) {
      console.error('Error fetching mansionario:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSign = async (employeeId: string) => {
    if (!mansionario) return

    try {
      const res = await fetch(`/api/mansionario/${mansionario.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId })
      })

      if (!res.ok) throw new Error('Failed to sign')

      // Refresh data
      fetchMansionario(mansionario.id)
      alert('Mansionario firmato con successo!')
    } catch (error) {
      console.error('Error signing:', error)
      alert('Errore durante la firma')
    }
  }

  const handleExportPDF = async () => {
    if (!mansionario) return

    try {
      const res = await fetch(`/api/mansionario/${mansionario.id}/export-pdf`)
      if (!res.ok) throw new Error('Failed to export')
      const data = await res.json()
      alert(data.message)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Errore durante l\'export')
    }
  }

  const handleDelete = async () => {
    if (!mansionario) return

    try {
      const res = await fetch(`/api/mansionario/${mansionario.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete')

      router.push('/mansionario')
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Errore durante l\'eliminazione')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Caricamento...</div>
        </div>
      </div>
    )
  }

  if (!mansionario) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Mansionario non trovato</div>
      </div>
    )
  }

  const getEmployeeName = (empId: string) => {
    const emp = mockEmployees.find(e => e.id === empId)
    return emp ? emp.name : empId
  }

  const isSigned = (empId: string) => mansionario.signedBy.includes(empId)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/mansionario" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Torna ai Mansionari
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{mansionario.title}</h1>
            <div className="flex items-center gap-3 text-gray-600">
              <span className="font-medium">{mansionario.ccnlLevel}</span>
              <span>•</span>
              <span>{mansionario.department}</span>
              {mansionario.status === 'draft' && (
                <>
                  <span>•</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Bozza</span>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              📄 Esporta PDF
            </button>
            <Link
              href={`/mansionario/${mansionario.id}/edit`}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              ✏️ Modifica
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
            >
              🗑️ Elimina
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mansioni Principali */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mansioni Principali</h2>
            <ul className="space-y-2">
              {mansionario.duties.map((duty, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">{duty}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Competenze Richieste */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Competenze Richieste</h2>
            <ul className="space-y-2">
              {mansionario.skills.map((skill, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Responsabilità */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsabilità</h2>
            <ul className="space-y-2">
              {mansionario.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">⚠️</span>
                  <span className="text-gray-700">{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* KPI di Ruolo */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">KPI di Ruolo</h2>
            <ul className="space-y-2">
              {mansionario.kpis.map((kpi, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">📊</span>
                  <span className="text-gray-700">{kpi}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar - Assigned Employees */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Dipendenti Assegnati ({mansionario.assignedEmployees.length})
            </h2>

            {mansionario.assignedEmployees.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-3xl mb-2">👤</div>
                <div className="text-sm">Nessun dipendente assegnato</div>
              </div>
            ) : (
              <div className="space-y-3">
                {mansionario.assignedEmployees.map((empId) => (
                  <div
                    key={empId}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {getEmployeeName(empId)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {mockEmployees.find(e => e.id === empId)?.jobTitle}
                        </div>
                      </div>
                      {isSigned(empId) && (
                        <span className="text-green-600 text-xl">✓</span>
                      )}
                    </div>

                    {isSigned(empId) ? (
                      <div className="text-xs text-gray-500">
                        Firmato il {new Date().toLocaleDateString('it-IT')}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSign(empId)}
                        className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Firma Accettazione
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Signature Summary */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Riepilogo Firme</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Totale Dipendenti</span>
                <span className="font-semibold">{mansionario.assignedEmployees.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Firmato</span>
                <span className="font-semibold text-green-600">{mansionario.signedBy.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Da Firmare</span>
                <span className="font-semibold text-red-600">
                  {mansionario.assignedEmployees.length - mansionario.signedBy.length}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Progresso</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{
                      width: mansionario.assignedEmployees.length > 0
                        ? `${(mansionario.signedBy.length / mansionario.assignedEmployees.length) * 100}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Conferma Eliminazione</h3>
            <p className="text-gray-600 mb-4">
              Sei sicuro di voler eliminare questo mansionario? Questa azione non può essere annullata.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Annulla
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
