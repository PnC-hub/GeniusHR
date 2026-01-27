import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/onboarding
 * Lista tutti i dipendenti con stato onboarding
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    // Get tenant membership
    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id },
      select: { tenantId: true, role: true }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Tenant non trovato' }, { status: 404 })
    }

    // Get all employees with onboarding status
    const employees = await prisma.employee.findMany({
      where: { tenantId: membership.tenantId },
      include: {
        onboardingTimelines: {
          orderBy: { order: 'asc' }
        },
        user: {
          select: { id: true, email: true }
        }
      },
      orderBy: { hireDate: 'desc' }
    })

    // Calculate onboarding progress for each employee
    const employeesWithProgress = employees.map(employee => {
      const timelines = employee.onboardingTimelines
      const totalPhases = timelines.length
      const completedPhases = timelines.filter(t => t.status === 'COMPLETED').length
      const pendingPhases = timelines.filter(t => t.status === 'PENDING').length
      const inProgressPhases = timelines.filter(t => t.status === 'IN_PROGRESS').length

      let status: 'not_started' | 'in_progress' | 'completed' = 'not_started'
      if (completedPhases === totalPhases && totalPhases > 0) {
        status = 'completed'
      } else if (completedPhases > 0 || inProgressPhases > 0) {
        status = 'in_progress'
      }

      const progress = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0

      return {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        department: employee.department,
        jobTitle: employee.jobTitle,
        hireDate: employee.hireDate,
        status: employee.status,
        hasUserAccount: !!employee.userId,
        onboardingStatus: status,
        onboardingProgress: progress,
        totalPhases,
        completedPhases,
        pendingPhases,
        inProgressPhases
      }
    })

    return NextResponse.json(employeesWithProgress)
  } catch (error) {
    console.error('Error fetching onboarding list:', error)
    return NextResponse.json(
      { error: 'Errore nel caricamento della lista onboarding' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/onboarding
 * Crea onboarding da template per un dipendente
 */
export async function POST(req: NextRequest) {
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

    const body = await req.json()
    const { employeeId, templateId } = body

    if (!employeeId) {
      return NextResponse.json({ error: 'employeeId richiesto' }, { status: 400 })
    }

    // Verify employee belongs to tenant
    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        tenantId: membership.tenantId
      }
    })

    if (!employee) {
      return NextResponse.json({ error: 'Dipendente non trovato' }, { status: 404 })
    }

    // Check if onboarding already exists
    const existingTimeline = await prisma.onboardingTimeline.findFirst({
      where: { employeeId }
    })

    if (existingTimeline) {
      return NextResponse.json({ error: 'Onboarding già esistente per questo dipendente' }, { status: 400 })
    }

    // Create default onboarding phases based on PRD
    const defaultPhases = [
      // Fase 1: Documenti Assunzione (Giorno 1)
      {
        phase: 'DOCUMENTS_COLLECTION',
        title: 'Modulo Dati Personali',
        description: 'Raccolta dati anagrafici e contatti',
        order: 1,
        dueDate: new Date(employee.hireDate)
      },
      {
        phase: 'PRIVACY_CONSENT',
        title: 'Informativa Privacy Dipendenti',
        description: 'Presa visione e consenso trattamento dati personali',
        order: 2,
        dueDate: new Date(employee.hireDate)
      },
      {
        phase: 'CONTRACT_SIGNING',
        title: 'Patto di Riservatezza (NDA)',
        description: 'Firma accordo di riservatezza',
        order: 3,
        dueDate: new Date(employee.hireDate)
      },
      {
        phase: 'CONTRACT_SIGNING',
        title: 'Nomina Autorizzato Trattamento Dati',
        description: 'Nomina per trattamento dati GDPR',
        order: 4,
        dueDate: new Date(employee.hireDate)
      },
      {
        phase: 'DISCIPLINARY_CODE',
        title: 'Modulo Presa Visione Regolamento',
        description: 'Presa visione regolamento aziendale',
        order: 5,
        dueDate: new Date(employee.hireDate)
      },

      // Fase 2: Sicurezza (Giorni 1-3)
      {
        phase: 'DPI_DELIVERY',
        title: 'Verbale Consegna DPI',
        description: 'Consegna dispositivi di protezione individuale',
        order: 6,
        dueDate: new Date(employee.hireDate.getTime() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        phase: 'DVR_ACKNOWLEDGMENT',
        title: 'Presa Visione DVR',
        description: 'Documento valutazione rischi',
        order: 7,
        dueDate: new Date(employee.hireDate.getTime() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        phase: 'SAFETY_TRAINING_GENERAL',
        title: 'Scheda Formazione Sicurezza',
        description: 'Formazione generale sicurezza lavoro (4h)',
        order: 8,
        dueDate: new Date(employee.hireDate.getTime() + 3 * 24 * 60 * 60 * 1000)
      },

      // Fase 3: Configurazione (Prima settimana)
      {
        phase: 'IT_ACCOUNTS',
        title: 'Configurazione IT (email, accessi)',
        description: 'Creazione account email e accessi sistemi',
        order: 9,
        dueDate: new Date(employee.hireDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        phase: 'TEAM_INTRODUCTION',
        title: 'Presentazione Team',
        description: 'Introduzione ai colleghi e struttura aziendale',
        order: 10,
        dueDate: new Date(employee.hireDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        phase: 'TOOLS_TRAINING',
        title: 'Formazione Ruolo',
        description: 'Training specifico per mansioni e strumenti',
        order: 11,
        dueDate: new Date(employee.hireDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      },

      // Fase 4: Periodo Prova
      {
        phase: 'PROBATION_REVIEW_30',
        title: 'Inizio Periodo Prova',
        description: 'Comunicazione inizio periodo di prova',
        order: 12,
        dueDate: new Date(employee.hireDate.getTime() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        phase: 'PROBATION_REVIEW_60',
        title: 'Valutazioni Intermedie',
        description: 'Check intermedio andamento',
        order: 13,
        dueDate: employee.probationEndsAt ? new Date(employee.probationEndsAt.getTime() - 30 * 24 * 60 * 60 * 1000) : new Date(employee.hireDate.getTime() + 60 * 24 * 60 * 60 * 1000)
      },
      {
        phase: 'PROBATION_FINAL',
        title: 'Comunicazione Esito',
        description: 'Esito finale periodo di prova',
        order: 14,
        dueDate: employee.probationEndsAt || new Date(employee.hireDate.getTime() + 90 * 24 * 60 * 60 * 1000)
      }
    ]

    // Create all timeline entries
    const timelines = await prisma.$transaction(
      defaultPhases.map(phase =>
        prisma.onboardingTimeline.create({
          data: {
            tenantId: membership.tenantId,
            employeeId: employee.id,
            phase: phase.phase as any,
            title: phase.title,
            description: phase.description,
            dueDate: phase.dueDate,
            status: 'PENDING',
            order: phase.order
          }
        })
      )
    )

    return NextResponse.json({
      success: true,
      message: 'Onboarding creato con successo',
      timelines
    })
  } catch (error) {
    console.error('Error creating onboarding:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione dell\'onboarding' },
      { status: 500 }
    )
  }
}
