'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data - same 10 risks
const mockRisks = [
  {
    id: '1',
    title: 'Rischio clinico - errore diagnostico',
    description: 'Possibile errore di diagnosi per mancanza di aggiornamento professionale o strumentazione inadeguata',
    category: 'Operativo',
    probability: 2,
    impact: 5,
    score: 10,
    status: 'open',
    owner: 'Dott. Civero',
    reviewDate: new Date('2026-03-15'),
    createdAt: new Date('2026-01-10'),
  },
  {
    id: '2',
    title: 'Violazione privacy dati pazienti',
    description: 'Accesso non autorizzato o fuga di dati sensibili pazienti per mancanza di misure di sicurezza adeguate',
    category: 'Legale/Compliance',
    probability: 3,
    impact: 4,
    score: 12,
    status: 'mitigating',
    owner: 'Responsabile Privacy',
    reviewDate: new Date('2026-02-20'),
    createdAt: new Date('2025-12-05'),
  },
  {
    id: '3',
    title: 'Infortunio sul lavoro',
    description: 'Infortunio dipendente per mancato utilizzo DPI o procedure di sicurezza non rispettate',
    category: 'Sicurezza Lavoro',
    probability: 2,
    impact: 4,
    score: 8,
    status: 'mitigating',
    owner: 'RSPP',
    reviewDate: new Date('2026-02-28'),
    createdAt: new Date('2025-11-20'),
  },
  {
    id: '4',
    title: 'Mancato aggiornamento DVR',
    description: 'Documento di Valutazione Rischi non aggiornato secondo normativa D.Lgs 81/2008',
    category: 'Sicurezza Lavoro',
    probability: 3,
    impact: 3,
    score: 9,
    status: 'open',
    owner: 'RSPP',
    reviewDate: new Date('2026-01-30'),
    createdAt: new Date('2025-12-10'),
  },
  {
    id: '5',
    title: 'Guasto apparecchiature radiologiche',
    description: 'Malfunzionamento RX endorale o panoramica con interruzione servizio e possibile danno economico',
    category: 'Operativo',
    probability: 2,
    impact: 3,
    score: 6,
    status: 'accepted',
    owner: 'Dott. Civero',
    reviewDate: new Date('2026-06-01'),
    createdAt: new Date('2025-10-15'),
  },
  {
    id: '6',
    title: 'Contenzioso paziente',
    description: 'Reclamo o causa legale da paziente insoddisfatto per mancato consenso informato o errore terapeutico',
    category: 'Legale/Compliance',
    probability: 3,
    impact: 4,
    score: 12,
    status: 'open',
    owner: 'Dott. Civero',
    reviewDate: new Date('2026-02-15'),
    createdAt: new Date('2026-01-05'),
  },
  {
    id: '7',
    title: 'Cyberattack ransomware',
    description: 'Attacco ransomware con cifratura dati clinici e richiesta di riscatto',
    category: 'IT/Cyber',
    probability: 2,
    impact: 5,
    score: 10,
    status: 'mitigating',
    owner: 'Responsabile IT',
    reviewDate: new Date('2026-03-01'),
    createdAt: new Date('2025-11-30'),
  },
  {
    id: '8',
    title: 'Perdita dipendente chiave',
    description: 'Dimissioni improvvise igienista dentale senior con difficoltà di sostituzione',
    category: 'Strategico',
    probability: 3,
    impact: 3,
    score: 9,
    status: 'open',
    owner: 'Direttore Sanitario',
    reviewDate: new Date('2026-04-01'),
    createdAt: new Date('2026-01-02'),
  },
  {
    id: '9',
    title: 'Ritardo pagamenti fornitori',
    description: 'Liquidità insufficiente per pagamenti fornitori odontotecnici con rischio interruzione collaborazioni',
    category: 'Finanziario',
    probability: 2,
    impact: 2,
    score: 4,
    status: 'closed',
    owner: 'Amministrazione',
    reviewDate: new Date('2026-05-01'),
    createdAt: new Date('2025-09-10'),
  },
  {
    id: '10',
    title: 'Danno reputazionale social media',
    description: 'Recensioni negative virali su Google/Facebook per disservizio o malinteso',
    category: 'Reputazionale',
    probability: 2,
    impact: 3,
    score: 6,
    status: 'open',
    owner: 'Marketing',
    reviewDate: new Date('2026-03-10'),
    createdAt: new Date('2025-12-20'),
  },
]

const categories = [
  'Tutti',
  'Operativo',
  'Finanziario',
  'Legale/Compliance',
  'Reputazionale',
  'Strategico',
  'IT/Cyber',
  'Sicurezza Lavoro',
]

const statuses = [
  { value: 'all', label: 'Tutti gli stati' },
  { value: 'open', label: 'Aperto' },
  { value: 'mitigating', label: 'In Mitigazione' },
  { value: 'accepted', label: 'Accettato' },
  { value: 'closed', label: 'Chiuso' },
]

type SortField = 'score' | 'date' | 'category'

export default function RiskRegisterPage() {
  const [categoryFilter, setCategoryFilter] = useState('Tutti')
  const [statusFilter, setStatusFilter] = useState('all')
  const [scoreMin, setScoreMin] = useState(0)
  const [scoreMax, setScoreMax] = useState(25)
  const [sortBy, setSortBy] = useState<SortField>('score')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Apply filters
  let filteredRisks = mockRisks.filter(risk => {
    if (categoryFilter !== 'Tutti' && risk.category !== categoryFilter) return false
    if (statusFilter !== 'all' && risk.status !== statusFilter) return false
    if (risk.score < scoreMin || risk.score > scoreMax) return false
    return true
  })

  // Apply sorting
  filteredRisks = [...filteredRisks].sort((a, b) => {
    let comparison = 0

    if (sortBy === 'score') {
      comparison = a.score - b.score
    } else if (sortBy === 'date') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else if (sortBy === 'category') {
      comparison = a.category.localeCompare(b.category)
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  const getScoreBadgeColor = (score: number) => {
    if (score >= 15) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    if (score >= 10) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
    if (score >= 5) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      open: { text: 'Aperto', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
      mitigating: { text: 'In Mitigazione', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
      accepted: { text: 'Accettato', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
      closed: { text: 'Chiuso', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
    }
    return badges[status as keyof typeof badges] || badges.open
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Operativo': '⚙️',
      'Finanziario': '💰',
      'Legale/Compliance': '⚖️',
      'Reputazionale': '💬',
      'Strategico': '🎯',
      'IT/Cyber': '🔒',
      'Sicurezza Lavoro': '🦺',
    }
    return icons[category] || '📋'
  }

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Registro Rischi</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filteredRisks.length} rischi trovati
            </p>
          </div>
          <Link
            href="/risk-management"
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
          >
            ← Torna alla Dashboard
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filtri</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stato
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Score Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Score Min
            </label>
            <input
              type="number"
              min="0"
              max="25"
              value={scoreMin}
              onChange={(e) => setScoreMin(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Score Max
            </label>
            <input
              type="number"
              min="0"
              max="25"
              value={scoreMax}
              onChange={(e) => setScoreMax(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Sort Controls */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ordina per:
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('score')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'score'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Score
              </button>
              <button
                onClick={() => setSortBy('date')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'date'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Data
              </button>
              <button
                onClick={() => setSortBy('category')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'category'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Categoria
              </button>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {sortOrder === 'asc' ? '↑ Crescente' : '↓ Decrescente'}
            </button>
          </div>
        </div>
      </div>

      {/* Risks Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rischio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Prob
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Imp
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Prossima Revisione
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRisks.map(risk => {
                const badge = getStatusBadge(risk.status)
                const daysUntilReview = Math.ceil(
                  (new Date(risk.reviewDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                )
                const isOverdue = daysUntilReview < 0 && risk.status !== 'closed'

                return (
                  <tr
                    key={risk.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/risk-management/${risk.id}`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {risk.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {risk.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(risk.category)}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {risk.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {risk.probability}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {risk.impact}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getScoreBadgeColor(risk.score)}`}>
                        {risk.score}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {risk.owner}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                        {badge.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-700 dark:text-gray-300'}>
                        <div className="text-sm">
                          {new Date(risk.reviewDate).toLocaleDateString('it-IT')}
                        </div>
                        {isOverdue && (
                          <div className="text-xs">
                            Scaduta {Math.abs(daysUntilReview)} giorni fa
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredRisks.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Nessun rischio trovato con i filtri selezionati
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
