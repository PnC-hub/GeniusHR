import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/employee/onboarding
 * Vista onboarding per il dipendente loggato
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    // Find employee linked to this user
    const employee = await prisma.employee.findFirst({
      where: { userId: session.user.id },
      include: {
        onboardingTimelines: {
          orderBy: { order: 'asc' }
        },
        signatureRequests: {
          where: {
            status: { in: ['PENDING', 'VIEWED', 'IN_PROGRESS'] }
          },
          include: {
            document: true
          },
          orderBy: [
            { priority: 'desc' },
            { dueDate: 'asc' }
          ]
        }
      }
    })

    if (!employee) {
      return NextResponse.json({ error: 'Profilo dipendente non trovato' }, { status: 404 })
    }

    return NextResponse.json({
      employee: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        hireDate: employee.hireDate,
        probationEndsAt: employee.probationEndsAt
      },
      timelines: employee.onboardingTimelines,
      signatureRequests: employee.signatureRequests
    })
  } catch (error) {
    console.error('Error fetching employee onboarding:', error)
    return NextResponse.json(
      { error: 'Errore nel caricamento dell\'onboarding' },
      { status: 500 }
    )
  }
}
