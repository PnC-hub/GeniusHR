import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { employeeId } = body

    if (!employeeId) {
      return NextResponse.json({
        error: 'ID dipendente è obbligatorio'
      }, { status: 400 })
    }

    // Mock signature
    const signature = {
      id: `sig-${Date.now()}`,
      mansionarioId: id,
      employeeId,
      signedAt: new Date().toISOString(),
      signedBy: session.user.id
    }

    return NextResponse.json({
      message: 'Mansionario firmato con successo',
      signature
    })
  } catch (error) {
    console.error('Error signing mansionario:', error)
    return NextResponse.json({ error: 'Errore durante la firma' }, { status: 500 })
  }
}
