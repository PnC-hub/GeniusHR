import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tenant: true, employee: true },
    })

    if (!user?.tenantId && !user?.employee?.tenantId) {
      return NextResponse.json({ error: 'Tenant non trovato' }, { status: 404 })
    }

    const tenantId = user.tenantId || user.employee?.tenantId

    const where: Record<string, unknown> = {
      tenantId,
      anomalyType: {
        not: null,
      },
    }

    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) {
        (where.date as Record<string, Date>).gte = new Date(dateFrom)
      }
      if (dateTo) {
        (where.date as Record<string, Date>).lte = new Date(dateTo)
      }
    }

    const anomalies = await prisma.timeEntry.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
            jobTitle: true,
            email: true,
          },
        },
      },
      orderBy: [{ date: 'desc' }, { clockIn: 'desc' }],
      take: 100,
    })

    // Categorize anomalies
    const categorized = {
      missingClockIn: anomalies.filter((a) => a.anomalyType === 'MISSING_CLOCK_IN'),
      missingClockOut: anomalies.filter((a) => a.anomalyType === 'MISSING_CLOCK_OUT'),
      outOfZone: anomalies.filter((a) => a.anomalyType === 'OUT_OF_ZONE'),
      unusualHours: anomalies.filter((a) => a.anomalyType === 'UNUSUAL_HOURS'),
      overtimeNotApproved: anomalies.filter((a) => a.anomalyType === 'OVERTIME_NOT_APPROVED'),
      duplicateEntry: anomalies.filter((a) => a.anomalyType === 'DUPLICATE_ENTRY'),
    }

    return NextResponse.json({
      total: anomalies.length,
      anomalies,
      categorized,
    })
  } catch (error) {
    console.error('Error fetching anomalies:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
