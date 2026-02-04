import { NextResponse } from 'next/server'

// Mock version history
const mockHistory = [
  {
    id: '1',
    version: 3,
    changedBy: 'Admin',
    changedAt: new Date('2026-01-30T14:30:00'),
    changes: 'Aggiunta posizione Odontoiatra Senior (vacante)',
    snapshot: {}
  },
  {
    id: '2',
    version: 2,
    changedBy: 'Admin',
    changedAt: new Date('2026-01-25T10:15:00'),
    changes: 'Spostato Anna Verdi sotto Giuseppe Bianchi',
    snapshot: {}
  },
  {
    id: '3',
    version: 1,
    changedBy: 'Admin',
    changedAt: new Date('2026-01-20T09:00:00'),
    changes: 'Creazione organigramma iniziale',
    snapshot: {}
  }
]

// GET /api/organigramma/history - Return version history
export async function GET() {
  try {
    // In production, fetch from database
    // const session = await getServerSession(authOptions)
    // const history = await prisma.orgChartHistory.findMany({
    //   where: { tenantId: session.user.tenantId },
    //   orderBy: { version: 'desc' },
    //   take: 20
    // })

    return NextResponse.json({
      success: true,
      data: mockHistory
    })
  } catch (error) {
    console.error('Error fetching org chart history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}
