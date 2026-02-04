'use client'

import { useState, use } from 'react'
import Link from 'next/link'

// Mock risk detail data
const mockRiskData: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Rischio clinico - errore diagnostico',
    description: 'Possibile errore di diagnosi per mancanza di aggiornamento professionale o strumentazione inadeguata. Questo rischio può portare a trattamenti non corretti, aggravamento della condizione del paziente, possibile contenzioso legale e danno reputazionale significativo.',
    category: 'Operativo',
    probability: 2,
    impact: 5,
    score: 10,
    status: 'open',
    owner: 'Dott. Civero',
    reviewDate: new Date('2026-03-15'),
    createdAt: new Date('2026-01-10'),
    mitigationActions: [
      {
        id: 'm1',
        description: 'Formazione ECM annuale obbligatoria per tutto il personale clinico',
        responsible: 'Dott. Civero',
        deadline: new Date('2026-06-30'),
        completionPercentage: 30,
        status: 'in_progress',
      },
      {
        id: 'm2',
        description: 'Aggiornamento protocolli diagnostici con peer review mensile',
        responsible: 'Direttore Sanitario',
        deadline: new Date('2026-03-31'),
        completionPercentage: 0,
        status: 'planned',
      },
    ],
    history: [
      { date: new Date('2026-01-10'), action: 'Rischio identificato', user: 'Dott. Civero' },
      { date: new Date('2026-01-12'), action: 'Prima azione di mitigazione pianificata', user: 'Dott. Civero' },
    ],
  },
  '2': {
    id: '2',
    title: 'Violazione privacy dati pazienti',
    description: 'Accesso non autorizzato o fuga di dati sensibili pazienti per mancanza di misure di sicurezza adeguate (GDPR). Possibili sanzioni fino a €20M o 4% del fatturato annuo.',
    category: 'Legale/Compliance',
    probability: 3,
    impact: 4,
    score: 12,
    status: 'mitigating',
    owner: 'Responsabile Privacy',
    reviewDate: new Date('2026-02-20'),
    createdAt: new Date('2025-12-05'),
    mitigationActions: [
      {
        id: 'm1',
        description: 'Implementazione autenticazione a due fattori per accesso gestionale',
        responsible: 'Responsabile IT',
        deadline: new Date('2026-02-15'),
        completionPercentage: 85,
        status: 'in_progress',
      },
      {
        id: 'm2',
        description: 'Audit trimestrale accessi ai dati sensibili',
        responsible: 'DPO',
        deadline: new Date('2026-03-31'),
        completionPercentage: 100,
        status: 'completed',
      },
      {
        id: 'm3',
        description: 'Formazione GDPR per tutto il personale',
        responsible: 'Responsabile Privacy',
        deadline: new Date('2026-04-30'),
        completionPercentage: 40,
        status: 'in_progress',
      },
    ],
    history: [
      { date: new Date('2025-12-05'), action: 'Rischio identificato durante audit GDPR', user: 'DPO' },
      { date: new Date('2025-12-10'), action: 'Stato cambiato da "Aperto" a "In Mitigazione"', user: 'Responsabile Privacy' },
      { date: new Date('2026-01-15'), action: 'Azione 2 completata', user: 'DPO' },
    ],
  },
}

// Default mock for other IDs
const defaultMockRisk = {
  title: 'Rischio non trovato',
  description: 'Dettagli non disponibili',
  category: 'Operativo',
  probability: 2,
  impact: 3,
  score: 6,
  status: 'open',
  owner: 'N/A',
  reviewDate: new Date(),
  createdAt: new Date(),
  mitigationActions: [],
  history: [],
}

export default function RiskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const initialRisk = mockRiskData[id] || { ...defaultMockRisk, id }

  const [risk, setRisk] = useState(initialRisk)
  const [probability, setProbability] = useState(risk.probability)
  const [impact, setImpact] = useState(risk.impact)
  const [newActionDescription, setNewActionDescription] = useState('')
  const [newActionResponsible, setNewActionResponsible] = useState('')
  const [newActionDeadline, setNewActionDeadline] = useState('')

  const score = probability * impact

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

  const handleAddMitigationAction = () => {
    if (!newActionDescription || !newActionResponsible || !newActionDeadline) {
      alert('Compila tutti i campi')
      return
    }

    const newAction = {
      id: `m${risk.mitigationActions.length + 1}`,
      description: newActionDescription,
      responsible: newActionResponsible,
      deadline: new Date(newActionDeadline),
      completionPercentage: 0,
      status: 'planned',
    }

    setRisk({
      ...risk,
      mitigationActions: [...risk.mitigationActions, newAction],
    })

    // Reset form
    setNewActionDescription('')
    setNewActionResponsible('')
    setNewActionDeadline('')
  }

  const handleStatusChange = (newStatus: string) => {
    setRisk({ ...risk, status: newStatus })
  }

  const statusBadge = getStatusBadge(risk.status)

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/risk-management/registro"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
        >
          ← Torna al Registro
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{getCategoryIcon(risk.category)}</span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {risk.title}
              </h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
                {statusBadge.text}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Categoria: {risk.category}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Owner: {risk.owner}
              </span>
            </div>
          </div>
          <div className={`px-6 py-4 rounded-xl text-center ${getScoreBadgeColor(score)}`}>
            <div className="text-sm font-medium mb-1">Risk Score</div>
            <div className="text-4xl font-bold">{score}</div>
            <div className="text-xs mt-1">
              {score >= 15 ? 'Critico' : score >= 10 ? 'Alto' : score >= 5 ? 'Medio' : 'Basso'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Descrizione
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {risk.description}
            </p>
          </div>

          {/* Risk Assessment */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Valutazione Rischio
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Probability Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Probabilità: {probability}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={probability}
                  onChange={(e) => setProbability(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Molto Bassa</span>
                  <span>Molto Alta</span>
                </div>
              </div>

              {/* Impact Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Impatto: {impact}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={impact}
                  onChange={(e) => setImpact(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Molto Basso</span>
                  <span>Molto Alto</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Score Calcolato:</strong> {probability} × {impact} = {score}
              </div>
            </div>
          </div>

          {/* Mitigation Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Piano di Mitigazione
            </h2>

            {risk.mitigationActions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Nessuna azione di mitigazione definita
              </p>
            ) : (
              <div className="space-y-4">
                {risk.mitigationActions.map((action: any) => {
                  const daysUntilDeadline = Math.ceil(
                    (new Date(action.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  )
                  const isOverdue = daysUntilDeadline < 0

                  let statusColor = 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  let statusText = 'Pianificato'
                  if (action.status === 'in_progress') {
                    statusColor = 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    statusText = 'In Corso'
                  } else if (action.status === 'completed') {
                    statusColor = 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    statusText = 'Completato'
                  }

                  return (
                    <div
                      key={action.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white mb-1">
                            {action.description}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <span>👤 {action.responsible}</span>
                            <span className={isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
                              📅 {new Date(action.deadline).toLocaleDateString('it-IT')}
                              {isOverdue && ` (Scaduta)`}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColor}`}>
                          {statusText}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Completamento</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {action.completionPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${action.completionPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Add New Action Form */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                Aggiungi Azione di Mitigazione
              </h3>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Descrizione azione"
                    value={newActionDescription}
                    onChange={(e) => setNewActionDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Responsabile"
                    value={newActionResponsible}
                    onChange={(e) => setNewActionResponsible(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={newActionDeadline}
                    onChange={(e) => setNewActionDeadline(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleAddMitigationAction}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  + Aggiungi Azione
                </button>
              </div>
            </div>
          </div>

          {/* History Log */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Cronologia
            </h2>
            <div className="space-y-3">
              {risk.history.map((entry: any, index: number) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {entry.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(entry.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })} - {entry.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Status Workflow */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Gestione Stato
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => handleStatusChange('open')}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                  risk.status === 'open'
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Aperto</span>
                  {risk.status === 'open' && <span className="text-blue-600">✓</span>}
                </div>
              </button>
              <button
                onClick={() => handleStatusChange('mitigating')}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                  risk.status === 'mitigating'
                    ? 'bg-blue-200 dark:bg-blue-600 text-blue-900 dark:text-white'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>In Mitigazione</span>
                  {risk.status === 'mitigating' && <span className="text-blue-900 dark:text-white">✓</span>}
                </div>
              </button>
              <button
                onClick={() => handleStatusChange('accepted')}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                  risk.status === 'accepted'
                    ? 'bg-purple-200 dark:bg-purple-600 text-purple-900 dark:text-white'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Accettato</span>
                  {risk.status === 'accepted' && <span className="text-purple-900 dark:text-white">✓</span>}
                </div>
              </button>
              <button
                onClick={() => handleStatusChange('closed')}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                  risk.status === 'closed'
                    ? 'bg-green-200 dark:bg-green-600 text-green-900 dark:text-white'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Chiuso</span>
                  {risk.status === 'closed' && <span className="text-green-900 dark:text-white">✓</span>}
                </div>
              </button>
            </div>
          </div>

          {/* Review Date */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Prossima Revisione
            </h2>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                📅 {new Date(risk.reviewDate).toLocaleDateString('it-IT', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Assicurati di rivedere questo rischio entro questa data
              </p>
            </div>
          </div>

          {/* Owner */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Responsabile
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{risk.owner}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Risk Owner</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Azioni Rapide
            </h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium transition-colors text-sm">
                📧 Notifica Owner
              </button>
              <button className="w-full px-4 py-2 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg font-medium transition-colors text-sm">
                📊 Esporta Report
              </button>
              <button className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-medium transition-colors text-sm">
                🗑️ Elimina Rischio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
