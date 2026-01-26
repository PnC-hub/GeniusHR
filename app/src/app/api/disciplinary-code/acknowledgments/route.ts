import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/disciplinary-code/acknowledgments - Get all code acknowledgments
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Nessun tenant associato' },
        { status: 403 }
      )
    }

    const acknowledgments = await prisma.disciplinaryCodeAcknowledgment.findMany({
      where: {
        tenantId: membership.tenantId,
      },
      select: {
        id: true,
        acknowledgedAt: true,
        method: true,
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
          },
        },
      },
      orderBy: { acknowledgedAt: 'desc' },
    })

    return NextResponse.json(acknowledgments)
  } catch (error) {
    console.error('Error fetching disciplinary code acknowledgments:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero prese visione codice disciplinare' },
      { status: 500 }
    )
  }
}
