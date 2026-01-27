import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Tenant non trovato' }, { status: 404 })
    }

    const tenantId = membership.tenantId

    // Conta dipendenti attivi
    const totalEmployees = await prisma.employee.count({
      where: {
        tenantId,
        status: 'ACTIVE'
      }
    })

    // Formazione in regola (COMPLETED e non scaduta)
    const employeesWithValidTraining = await prisma.employee.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        safetyTrainings: {
          some: {
            status: 'COMPLETED',
            OR: [
              { expiresAt: null },
              { expiresAt: { gte: new Date() } }
            ]
          }
        }
      },
      select: { id: true }
    })

    // DVR firmato
    const employeesWithDVR = await prisma.employee.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        dvrAcknowledgments: {
          some: {
            acknowledgedAt: { not: null }
          }
        }
      },
      select: { id: true }
    })

    // DPI consegnati
    const employeesWithDPI = await prisma.employee.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        documents: {
          some: {
            type: 'DPI_RECEIPT'
          }
        }
      },
      select: { id: true }
    })

    // Scadenze imminenti (30, 60, 90 giorni)
    const now = new Date()
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
    const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)

    const upcomingDeadlines = await prisma.deadline.findMany({
      where: {
        tenantId,
        status: { in: ['PENDING', 'UPCOMING'] },
        type: { in: ['TRAINING_EXPIRY', 'DPI_RENEWAL'] },
        dueDate: {
          gte: now,
          lte: in90Days
        }
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true
          }
        }
      },
      orderBy: { dueDate: 'asc' }
    })

    // Raggruppa per urgenza
    const deadlines30 = upcomingDeadlines.filter(d => d.dueDate <= in30Days)
    const deadlines60 = upcomingDeadlines.filter(d => d.dueDate > in30Days && d.dueDate <= in60Days)
    const deadlines90 = upcomingDeadlines.filter(d => d.dueDate > in60Days && d.dueDate <= in90Days)

    // Formazioni per status
    const trainingsByStatus = await prisma.safetyTraining.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: true
    })

    // Infortuni ultimi 12 mesi
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const recentIncidents = await prisma.employeeNote.count({
      where: {
        tenantId,
        content: { contains: '"type":"INCIDENT"' },
        createdAt: { gte: twelveMonthsAgo }
      }
    })

    // Calcola percentuali
    const trainingCompliance = totalEmployees > 0
      ? Math.round((employeesWithValidTraining.length / totalEmployees) * 100)
      : 0

    const dvrCompliance = totalEmployees > 0
      ? Math.round((employeesWithDVR.length / totalEmployees) * 100)
      : 0

    const dpiCompliance = totalEmployees > 0
      ? Math.round((employeesWithDPI.length / totalEmployees) * 100)
      : 0

    return NextResponse.json({
      totalEmployees,
      compliance: {
        training: {
          percentage: trainingCompliance,
          compliant: employeesWithValidTraining.length,
          total: totalEmployees
        },
        dvr: {
          percentage: dvrCompliance,
          compliant: employeesWithDVR.length,
          total: totalEmployees
        },
        dpi: {
          percentage: dpiCompliance,
          compliant: employeesWithDPI.length,
          total: totalEmployees
        }
      },
      upcomingDeadlines: {
        next30Days: deadlines30.length,
        next60Days: deadlines60.length,
        next90Days: deadlines90.length,
        list: upcomingDeadlines.slice(0, 10) // Prime 10 scadenze
      },
      trainingStats: trainingsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count
        return acc
      }, {} as Record<string, number>),
      incidents: {
        last12Months: recentIncidents
      }
    })
  } catch (error) {
    console.error('Errore nel recupero dashboard sicurezza:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero dei dati' },
      { status: 500 }
    )
  }
}
