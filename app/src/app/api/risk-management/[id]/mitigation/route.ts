import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const newAction = {
    id: `m${Date.now()}`,
    riskId: id,
    description: body.description,
    responsible: body.responsible,
    deadline: body.deadline,
    completionPercentage: 0,
    status: 'planned',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({
    success: true,
    data: newAction,
    message: 'Azione di mitigazione aggiunta con successo',
  })
}
