'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import PageInfoTooltip from '@/components/PageInfoTooltip'

// Mock data - 10 risks for dental clinic
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

export default function RiskManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Calculate stats
  const totalRisks = mockRisks.length
  const criticalRisks = mockRisks.filter(r => r.score >= 15).length
  const highRisks = mockRisks.filter(r => r.score >= 10 && r.score < 15).length
  const mediumRisks = mockRisks.filter(r => r.score >= 5 && r.score < 10).length
  const lowRisks = mockRisks.filter(r => r.score < 5).length

  // Risks needing review (reviewDate in the past)
  const now = new Date()
  const needsReview = mockRisks.filter(r => new Date(r.reviewDate) < now && r.status !== 'closed')

  // Build 5x5 matrix data (probability x impact)
  const matrixData: number[][] = Array(5).fill(0).map(() => Array(5).fill(0))
  mockRisks.forEach(risk => {
    if (risk.status !== 'closed') {
      const probIndex = risk.probability - 1 // 0-4
      const impactIndex = risk.impact - 1    // 0-4
      matrixData[4 - probIndex][impactIndex]++ // Flip Y axis (high prob on top)
    }
  })

  // Recent risks (last 5)
  const recentRisks = [...mockRisks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestione Rischi</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Identificazione, valutazione e monitoraggio dei rischi aziendali
              </p>
            </div>
            <PageInfoTooltip
              title="Risk Management"
              description="Dashboard gestione rischi con matrice rischio/impatto e azioni di mitigazione"
              tips={[
                "Matrice rischio/impatto visuale",
                "Registro rischi con priorità",
                "Azioni di mitigazione con scadenze"
              ]}
            />
          </div>
          <Link
            href="/risk-management/registro"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            + Nuovo Rischio
          </Link>
        </div>
      </div>

      {/* Alert Banner for Risks Needing Review */}
      {needsReview.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-200">
                {needsReview.length} rischi richiedono revisione
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Alcuni rischi hanno superato la data di revisione programmata
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Totale Rischi</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalRisks}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Critici (≥15)</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{criticalRisks}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-orange-200 dark:border-orange-800 p-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Alti (10-14)</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{highRisks}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-yellow-200 dark:border-yellow-800 p-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Medi (5-9)</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{mediumRisks}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-green-200 dark:border-green-800 p-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bassi (1-4)</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{lowRisks}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5x5 Risk Heatmap Matrix */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Matrice dei Rischi (Probabilità × Impatto)
          </h2>

          <div className="space-y-2">
            {/* Axis labels */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-20 text-xs text-gray-500 dark:text-gray-400">Probabilità</div>
              <div className="flex-1 flex justify-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Impatto →</div>
              </div>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-6 gap-1">
              {/* Y-axis labels */}
              <div className="space-y-1">
                {['Molto Alta (5)', 'Alta (4)', 'Media (3)', 'Bassa (2)', 'Molto Bassa (1)'].map((label, i) => (
                  <div
                    key={i}
                    className="h-16 flex items-center justify-end pr-2"
                  >
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-right">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Matrix cells */}
              <div className="col-span-5">
                <div className="grid grid-cols-5 gap-1">
                  {matrixData.map((row, probIdx) => (
                    row.map((count, impactIdx) => {
                      // Calculate score for this cell
                      const prob = 5 - probIdx
                      const impact = impactIdx + 1
                      const score = prob * impact

                      // Color based on score
                      let bgColor = 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
                      if (score >= 15) {
                        bgColor = 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700'
                      } else if (score >= 10) {
                        bgColor = 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700'
                      } else if (score >= 5) {
                        bgColor = 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'
                      }

                      return (
                        <div
                          key={`${probIdx}-${impactIdx}`}
                          className={`h-16 border-2 rounded-lg flex items-center justify-center ${bgColor} transition-all hover:scale-105 cursor-pointer`}
                          title={`Prob: ${prob}, Impact: ${impact}, Score: ${score}`}
                        >
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {count || '0'}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              ({score})
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ))}
                </div>

                {/* X-axis labels */}
                <div className="grid grid-cols-5 gap-1 mt-2">
                  {['Molto Basso (1)', 'Basso (2)', 'Medio (3)', 'Alto (4)', 'Molto Alto (5)'].map((label, i) => (
                    <div key={i} className="text-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Legenda livelli di rischio:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 dark:bg-green-900 border border-green-400 rounded"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Basso (1-4)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-200 dark:bg-yellow-900 border border-yellow-400 rounded"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Medio (5-9)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-200 dark:bg-orange-900 border border-orange-400 rounded"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Alto (10-14)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 dark:bg-red-900 border border-red-400 rounded"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Critico (≥15)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Risks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Rischi Recenti</h2>
            <Link
              href="/risk-management/registro"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Vedi registro completo
            </Link>
          </div>

          <div className="space-y-3">
            {recentRisks.map(risk => {
              let scoreColor = 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
              if (risk.score >= 15) {
                scoreColor = 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
              } else if (risk.score >= 10) {
                scoreColor = 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'
              } else if (risk.score >= 5) {
                scoreColor = 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
              }

              let statusBadge = { text: 'Aperto', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' }
              if (risk.status === 'mitigating') {
                statusBadge = { text: 'In Mitigazione', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' }
              } else if (risk.status === 'accepted') {
                statusBadge = { text: 'Accettato', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' }
              } else if (risk.status === 'closed') {
                statusBadge = { text: 'Chiuso', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' }
              }

              return (
                <Link
                  key={risk.id}
                  href={`/risk-management/${risk.id}`}
                  className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {risk.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-1">
                        {risk.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                          {risk.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Owner: {risk.owner}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${scoreColor}`}>
                        <span className="text-2xl font-bold">{risk.score}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/risk-management/registro"
              className="block w-full py-2 text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              Visualizza Registro Completo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
