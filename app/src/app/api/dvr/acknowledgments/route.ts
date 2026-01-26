import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/dvr/acknowledgments - Get all DVR acknowledgments with employee details
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

    const acknowledgments = await prisma.dvrAcknowledgment.findMany({
      where: {
        tenantId: membership.tenantId,
        acknowledgedAt: { not: null },
      },
      select: {
        id: true,
        dvrVersion: true,
        acknowledgedAt: true,
        signature: true,
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

    // Transform to match UI expectations
    const transformed = acknowledgments.map((ack) => ({
      id: ack.id,
      documentTitle: 'DVR',
      documentVersion: ack.dvrVersion,
      acknowledgedAt: ack.acknowledgedAt,
      signedAt: ack.signature ? ack.acknowledgedAt : null,
      signaturePath: ack.signature,
      employee: ack.employee,
    }))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Error fetching DVR acknowledgments:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero prese visione DVR' },
      { status: 500 }
    )
  }
}
