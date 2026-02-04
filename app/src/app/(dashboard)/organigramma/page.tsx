'use client'

import { useState, useEffect } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import OrgChartTree from '@/components/organigramma/OrgChartTree'
import { OrgNode } from '@/components/organigramma/OrgChartNode'
import Link from 'next/link'

// Mock org chart data for dental clinic
const mockOrgData: OrgNode[] = [
  {
    id: '1',
    name: 'Dott. Piernatale Civero',
    position: 'Direttore Sanitario',
    department: 'MANAGEMENT',
    children: [
      {
        id: '2',
        name: 'Dott.ssa Annita Di Vozzo',
        position: 'Odontoiatra',
        department: 'CLINICAL',
      },
      {
        id: '3',
        name: 'Maria Rossi',
        position: 'Igienista Dentale',
        department: 'CLINICAL',
      },
      {
        id: '4',
        name: '',
        position: 'Odontoiatra Senior',
        department: 'CLINICAL',
        isVacant: true,
      },
      {
        id: '5',
        name: 'Giuseppe Bianchi',
        position: 'ASO - Assistente di Poltrona',
        department: 'CLINICAL',
        children: [
          {
            id: '6',
            name: 'Anna Verdi',
            position: 'ASO - Assistente di Poltrona',
            department: 'CLINICAL',
          }
        ]
      },
      {
        id: '7',
        name: 'Raffaella Cretella',
        position: 'Responsabile Amministrativa',
        department: 'ADMIN',
        children: [
          {
            id: '8',
            name: 'Laura Gialli',
            position: 'Segreteria',
            department: 'ADMIN',
          },
          {
            id: '9',
            name: 'Sara Viola',
            position: 'Amministrazione',
            department: 'ADMIN',
          }
        ]
      }
    ]
  }
]

export default function OrganigrammaPage() {
  const [orgData, setOrgData] = useState<OrgNode[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrgData(mockOrgData)
      setLoading(false)
    }, 500)
  }, [])

  // Calculate stats
  const calculateStats = (nodes: OrgNode[]): {
    total: number
    departments: Set<string>
    vacant: number
  } => {
    let total = 0
    let vacant = 0
    const departments = new Set<string>()

    const traverse = (node: OrgNode) => {
      total++
      departments.add(node.department)
      if (node.isVacant) vacant++
      node.children?.forEach(traverse)
    }

    nodes.forEach(traverse)
    return { total, departments, vacant }
  }

  const stats = orgData.length > 0 ? calculateStats(orgData) : { total: 0, departments: new Set(), vacant: 0 }
  const coverage = stats.total > 0 ? Math.round(((stats.total - stats.vacant) / stats.total) * 100) : 0

  // Search functionality
  const handleSearch = () => {
    if (!searchTerm.trim()) return

    // Find node in tree
    const findNode = (nodes: OrgNode[], term: string): OrgNode | null => {
      for (const node of nodes) {
        if (node.name.toLowerCase().includes(term.toLowerCase()) ||
            node.position.toLowerCase().includes(term.toLowerCase())) {
          return node
        }
        if (node.children) {
          const found = findNode(node.children, term)
          if (found) return found
        }
      }
      return null
    }

    const found = findNode(orgData, searchTerm)
    if (found) {
      alert(`Trovato: ${found.name || found.position} - ${found.position}`)
    } else {
      alert('Nessun risultato trovato')
    }
  }

  const handleExportPDF = async () => {
    try {
      const response = await fetch('/api/organigramma/export-pdf')
      if (response.ok) {
        alert('PDF esportato con successo! (funzionalità demo)')
      }
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Caricamento organigramma...</p>
        </div>
      </div>
    )
  }

  if (orgData.length === 0) {
    return (
      <div className="p-6">
        <DashboardHeader
          title="Organigramma"
          subtitle="Visualizza la struttura organizzativa"
          tooltipTitle="Organigramma Aziendale"
          tooltipDescription="L'organigramma mostra la gerarchia e la struttura del personale della tua azienda. Ogni nodo rappresenta una posizione, con indicazione del dipartimento e dell'assegnazione."
          tooltipTips={[
            'Clicca sui nodi per espandere/comprimere i rami',
            'Usa la ricerca per trovare rapidamente un dipendente',
            'Esporta in PDF per condividere o stampare'
          ]}
        />

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <span className="text-6xl mb-4 block">🏢</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Nessun Organigramma Configurato
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Inizia a costruire la struttura organizzativa della tua azienda.
          </p>
          <Link
            href="/organigramma/edit"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crea il tuo Organigramma
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <DashboardHeader
          title="Organigramma"
          subtitle="Struttura organizzativa aziendale"
          tooltipTitle="Organigramma Aziendale"
          tooltipDescription="L'organigramma mostra la gerarchia e la struttura del personale della tua azienda. Ogni nodo rappresenta una posizione, con indicazione del dipartimento e dell'assegnazione."
          tooltipTips={[
            'Clicca sui nodi per espandere/comprimere i rami',
            'Usa la ricerca per trovare rapidamente un dipendente',
            'Esporta in PDF per condividere o stampare'
          ]}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Totale Posizioni</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <span className="text-xl">🏢</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dipartimenti</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.departments.size}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Posizioni Vacanti</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.vacant}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <span className="text-xl">✓</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Copertura</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{coverage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search */}
          <div className="flex gap-2 flex-1 max-w-md">
            <input
              type="text"
              placeholder="Cerca dipendente o ruolo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cerca
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <span>📄</span>
              <span>Esporta PDF</span>
            </button>
            <Link
              href="/organigramma/edit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span>✏️</span>
              <span>Modifica</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Org Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <OrgChartTree nodes={orgData} />
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Legenda Dipartimenti</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Direzione</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Clinico</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Amministrativo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Posizione Vacante</span>
          </div>
        </div>
      </div>
    </div>
  )
}
