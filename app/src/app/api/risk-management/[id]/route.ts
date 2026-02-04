import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const mockRiskData: Record<string, any> = {
  '1': {
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
  '2': {
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
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  const { id } = await params
  const risk = mockRiskData[id]

  if (!risk) {
    return NextResponse.json({ error: 'Rischio non trovato' }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: risk,
  })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const updatedRisk = {
    id,
    ...body,
    score: body.probability * body.impact,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({
    success: true,
    data: updatedRisk,
    message: 'Rischio aggiornato con successo',
  })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  const { id } = await params

  return NextResponse.json({
    success: true,
    message: `Rischio ${id} eliminato con successo`,
  })
}
