import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/onboarding/[employeeId]/assign-document
 * Assegna un documento da firmare a una fase onboarding
 */
export async function POST(
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
    const { documentId, timelineId, priority = 'NORMAL', dueDate } = body

    if (!documentId || !timelineId) {
      return NextResponse.json(
        { error: 'documentId e timelineId richiesti' },
        { status: 400 }
      )
    }

    // Verify employee
    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        tenantId: membership.tenantId
      }
    })

    if (!employee) {
      return NextResponse.json({ error: 'Dipendente non trovato' }, { status: 404 })
    }

    // Verify document
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        tenantId: membership.tenantId
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Documento non trovato' }, { status: 404 })
    }

    // Verify timeline
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

    // Create signature request
    const signatureRequest = await prisma.documentSignatureRequest.create({
      data: {
        tenantId: membership.tenantId,
        documentId: documentId,
        employeeId,
        requestedBy: session.user.id,
        priority: priority as any,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'PENDING',
        requirePassword: true,
        requireOtp: true,
        requirePhrase: true,
        minReadingTime: 30
      }
    })

    // Update timeline with document reference
    await prisma.onboardingTimeline.update({
      where: { id: timelineId },
      data: {
        documentId: documentId,
        status: 'IN_PROGRESS',
        startedAt: timeline.startedAt || new Date()
      }
    })

    // Create notification for employee if they have a user account
    if (employee.userId) {
      await prisma.notification.create({
        data: {
          userId: employee.userId,
          tenantId: membership.tenantId,
          type: 'DOCUMENT_TO_SIGN',
          title: 'Nuovo documento da firmare',
          message: `È stato assegnato il documento "${document.name}" da firmare per l'onboarding`,
          link: `/employee/signatures`,
          entityType: 'DocumentSignatureRequest',
          entityId: signatureRequest.id
        }
      })
    }

    return NextResponse.json({
      success: true,
      signatureRequest
    })
  } catch (error) {
    console.error('Error assigning document:', error)
    return NextResponse.json(
      { error: 'Errore nell\'assegnazione del documento' },
      { status: 500 }
    )
  }
}
