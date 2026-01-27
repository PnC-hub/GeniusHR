import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/onboarding/[employeeId]
 * Dettaglio onboarding di un dipendente specifico
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id },
      select: { tenantId: true, role: true }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Tenant non trovato' }, { status: 404 })
    }

    const { employeeId } = await params

    // Get employee with all onboarding data
    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        tenantId: membership.tenantId
      },
      include: {
        onboardingTimelines: {
          orderBy: { order: 'asc' }
        },
        signatureRequests: {
          include: {
            document: true
          },
          orderBy: { requestedAt: 'desc' }
        },
        user: {
          select: { id: true, email: true }
        },
        probationOutcome: true
      }
    })

    if (!employee) {
      return NextResponse.json({ error: 'Dipendente non trovato' }, { status: 404 })
    }

    // Group timelines by phase
    const timelinesByPhase = {
      phase1: employee.onboardingTimelines.filter(t => t.order >= 1 && t.order <= 5),
      phase2: employee.onboardingTimelines.filter(t => t.order >= 6 && t.order <= 8),
      phase3: employee.onboardingTimelines.filter(t => t.order >= 9 && t.order <= 11),
      phase4: employee.onboardingTimelines.filter(t => t.order >= 12 && t.order <= 14)
    }

    return NextResponse.json({
      employee: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        department: employee.department,
        jobTitle: employee.jobTitle,
        hireDate: employee.hireDate,
        probationEndsAt: employee.probationEndsAt,
        status: employee.status,
        hasUserAccount: !!employee.userId
      },
      timelinesByPhase,
      signatureRequests: employee.signatureRequests,
      probationOutcome: employee.probationOutcome
    })
  } catch (error) {
    console.error('Error fetching employee onboarding:', error)
    return NextResponse.json(
      { error: 'Errore nel caricamento del dettaglio onboarding' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/onboarding/[employeeId]
 * Aggiorna stato di una fase onboarding
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id },
      select: { tenantId: true, role: true }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Tenant non trovato' }, { status: 404 })
    }

    const { employeeId } = await params
    const body = await req.json()
    const { timelineId, status, notes, documentId } = body

    if (!timelineId || !status) {
      return NextResponse.json({ error: 'timelineId e status richiesti' }, { status: 400 })
    }

    // Verify timeline belongs to employee and tenant
    const timeline = await prisma.onboardingTimeline.findFirst({
      where: {
        id: timelineId,
        employeeId,
        tenantId: membership.tenantId
      }
    })

    if (!timeline) {
      return NextResponse.json({ error: 'Timeline non trovata' }, { status: 404 })
    }

    // Update timeline
    const updateData: any = {
      status,
      notes: notes || timeline.notes
    }

    if (status === 'COMPLETED') {
      updateData.completedAt = new Date()
      updateData.completedBy = session.user.id
    } else if (status === 'IN_PROGRESS' && !timeline.startedAt) {
      updateData.startedAt = new Date()
    }

    if (documentId) {
      updateData.documentId = documentId
    }

    const updatedTimeline = await prisma.onboardingTimeline.update({
      where: { id: timelineId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      timeline: updatedTimeline
    })
  } catch (error) {
    console.error('Error updating onboarding timeline:', error)
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento della timeline' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/onboarding/[employeeId]
 * Elimina tutto l'onboarding di un dipendente
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id },
      select: { tenantId: true, role: true }
    })

    if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 })
    }

    const { employeeId } = await params

    // Delete all timelines for this employee
    await prisma.onboardingTimeline.deleteMany({
      where: {
        employeeId,
        tenantId: membership.tenantId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Onboarding eliminato con successo'
    })
  } catch (error) {
    console.error('Error deleting onboarding:', error)
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione dell\'onboarding' },
      { status: 500 }
    )
  }
}
