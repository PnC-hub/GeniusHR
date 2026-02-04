'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DashboardHeader from '@/components/DashboardHeader'

interface Mansionario {
  id: string
  title: string
  ccnlLevel: string
  department: string
  status: 'draft' | 'active'
  assignedEmployees: string[]
  signedBy: string[]
  createdAt: string
  updatedAt: string
}

export default function MansionarioPage() {
  const [mansionari, setMansionari] = useState<Mansionario[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchMansionari()
  }, [])

  const fetchMansionari = async () => {
    try {
      const res = await fetch('/api/mansionario')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setMansionari(data)
    } catch (error) {
      console.error('Error fetching mansionari:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMansionari = mansionari.filter(m => {
    if (filter !== 'all' && m.department !== filter) return false
    if (searchTerm && !m.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const totalMansionari = mansionari.length
  const assignedCount = mansionari.filter(m => m.assignedEmployees.length > 0).length
  const unassignedCount = mansionari.filter(m => m.assignedEmployees.length === 0).length
  const fullySigned = mansionari.filter(m =>
    m.assignedEmployees.length > 0 && m.signedBy.length === m.assignedEmployees.length
  ).length
  const partiallySigned = mansionari.filter(m =>
    m.assignedEmployees.length > 0 && m.signedBy.length > 0 && m.signedBy.length < m.assignedEmployees.length
  ).length

  const getSignatureBadge = (mansionario: Mansionario) => {
    if (mansionario.assignedEmployees.length === 0) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Non assegnato</span>
    }
    if (mansionario.signedBy.length === mansionario.assignedEmployees.length) {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Tutti firmato</span>
    }
    if (mansionario.signedBy.length > 0) {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
        {mansionario.signedBy.length}/{mansionario.assignedEmployees.length} firmato
      </span>
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Da firmare</span>
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <DashboardHeader
          title="Mansionario"
          subtitle="Gestione mansioni e job descriptions"
          tooltipTitle="Mansionario"
          tooltipDescription="Il mansionario definisce ruoli, responsabilità, competenze e KPI per ogni posizione aziendale. Ogni dipendente deve firmare la propria job description per accettazione formale."
          tooltipTips={[
            'Usa i template predefiniti per velocizzare la creazione',
            'Assegna i mansionari ai dipendenti dalla scheda dettaglio',
            'Monitora lo stato delle firme per garantire compliance'
          ]}
        />
        <div className="flex gap-3">
          <Link
            href="/mansionario/templates"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center gap-2"
          >
            <span>📋</span>
            <span>Usa Template</span>
          </Link>
          <Link
            href="/mansionario/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <span>+</span>
            <span>Nuovo Mansionario</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Totale Mansionari</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{totalMansionari}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Assegnati</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{assignedCount}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Non Assegnati</div>
          <div className="text-2xl font-bold text-gray-600 mt-1">{unassignedCount}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Tutti Firmato</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{fullySigned}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Parzialmente Firmato</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">{partiallySigned}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cerca per titolo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tutti i Reparti</option>
              <option value="Direzione">Direzione</option>
              <option value="Clinico">Clinico</option>
              <option value="Amministrazione">Amministrazione</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mansionari Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMansionari.map((mansionario) => (
          <Link
            key={mansionario.id}
            href={`/mansionario/${mansionario.id}`}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{mansionario.title}</h3>
                <p className="text-sm text-gray-600">{mansionario.ccnlLevel}</p>
              </div>
              {mansionario.status === 'draft' && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Bozza</span>
              )}
            </div>

            <div className="mb-4">
              <div className="inline-block px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700">
                {mansionario.department}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                {mansionario.assignedEmployees.length} dipendenti
              </div>
              {getSignatureBadge(mansionario)}
            </div>
          </Link>
        ))}
      </div>

      {filteredMansionari.length === 0 && (
        <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
          <div className="text-gray-400 mb-2">📋</div>
          <div className="text-gray-600">Nessun mansionario trovato</div>
          <div className="text-sm text-gray-500 mt-1">
            Prova a modificare i filtri o crea un nuovo mansionario
          </div>
        </div>
      )}
    </div>
  )
}
