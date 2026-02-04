import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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
    reviewDate: new Date('2026-03-15').toISOString(),
    createdAt: new Date('2026-01-10').toISOString(),
    updatedAt: new Date('2026-01-10').toISOString(),
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
    reviewDate: new Date('2026-02-20').toISOString(),
    createdAt: new Date('2025-12-05').toISOString(),
    updatedAt: new Date('2025-12-10').toISOString(),
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
    reviewDate: new Date('2026-02-28').toISOString(),
    createdAt: new Date('2025-11-20').toISOString(),
    updatedAt: new Date('2025-11-20').toISOString(),
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
    reviewDate: new Date('2026-01-30').toISOString(),
    createdAt: new Date('2025-12-10').toISOString(),
    updatedAt: new Date('2025-12-10').toISOString(),
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
    reviewDate: new Date('2026-06-01').toISOString(),
    createdAt: new Date('2025-10-15').toISOString(),
    updatedAt: new Date('2025-10-15').toISOString(),
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
    reviewDate: new Date('2026-02-15').toISOString(),
    createdAt: new Date('2026-01-05').toISOString(),
    updatedAt: new Date('2026-01-05').toISOString(),
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
    reviewDate: new Date('2026-03-01').toISOString(),
    createdAt: new Date('2025-11-30').toISOString(),
    updatedAt: new Date('2025-12-15').toISOString(),
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
    reviewDate: new Date('2026-04-01').toISOString(),
    createdAt: new Date('2026-01-02').toISOString(),
    updatedAt: new Date('2026-01-02').toISOString(),
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
    reviewDate: new Date('2026-05-01').toISOString(),
    createdAt: new Date('2025-09-10').toISOString(),
    updatedAt: new Date('2025-11-15').toISOString(),
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
    reviewDate: new Date('2026-03-10').toISOString(),
    createdAt: new Date('2025-12-20').toISOString(),
    updatedAt: new Date('2025-12-20').toISOString(),
  },
]

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  return NextResponse.json({
    success: true,
    data: mockRisks,
  })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  const body = await request.json()

  const newRisk = {
    id: String(mockRisks.length + 1),
    title: body.title,
    description: body.description,
    category: body.category,
    probability: body.probability || 2,
    impact: body.impact || 2,
    score: (body.probability || 2) * (body.impact || 2),
    status: 'open',
    owner: body.owner || session.user.name || 'N/A',
    reviewDate: body.reviewDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({
    success: true,
    data: newRisk,
    message: 'Rischio creato con successo',
  })
}
