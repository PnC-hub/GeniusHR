import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPlanLimits } from '@/lib/tenant'
import { logAudit } from '@/lib/audit'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Nessun tenant associato' }, { status: 404 })
    }

    const employees = await prisma.employee.findMany({
      where: { tenantId: membership.tenantId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(employees)
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id },
      include: {
        tenant: {
          include: {
            _count: { select: { employees: true } }
          }
        }
      }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Nessun tenant associato' }, { status: 404 })
    }

    // Check plan limits
    const limits = getPlanLimits(membership.tenant.plan)
    if (membership.tenant._count.employees >= limits.maxEmployees) {
      return NextResponse.json({
        error: `Hai raggiunto il limite di ${limits.maxEmployees} dipendenti per il piano ${membership.tenant.plan}. Effettua l'upgrade per aggiungere altri dipendenti.`
      }, { status: 403 })
    }

    const body = await req.json()
    const {
      firstName,
      lastName,
      fiscalCode,
      email,
      phone,
      birthDate,
      hireDate,
      contractType,
      jobTitle,
      department,
      ccnlLevel,
      probationEndsAt
    } = body

    // Validate required fields
    if (!firstName || !lastName || !hireDate || !contractType) {
      return NextResponse.json({
        error: 'Nome, cognome, data assunzione e tipo contratto sono obbligatori'
      }, { status: 400 })
    }

    const employee = await prisma.employee.create({
      data: {
        tenantId: membership.tenantId,
        firstName,
        lastName,
        fiscalCode: fiscalCode || null,
        email: email || null,
        phone: phone || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        hireDate: new Date(hireDate),
        contractType,
        jobTitle: jobTitle || null,
        department: department || null,
        ccnlLevel: ccnlLevel || null,
        probationEndsAt: probationEndsAt ? new Date(probationEndsAt) : null,
        status: probationEndsAt ? 'PROBATION' : 'ACTIVE'
      }
    })

    // Auto-create deadline for probation end if set
    if (probationEndsAt) {
      await prisma.deadline.create({
        data: {
          tenantId: membership.tenantId,
          employeeId: employee.id,
          title: `Fine periodo di prova - ${firstName} ${lastName}`,
          type: 'PROBATION_END',
          dueDate: new Date(probationEndsAt),
          notify30Days: true,
          notify60Days: false
        }
      })
    }

    // Log audit event
    await logAudit({
      tenantId: membership.tenantId,
      userId: session.user.id,
      action: 'CREATE',
      entityType: 'Employee',
      entityId: employee.id,
      newValue: {
        firstName,
        lastName,
        contractType,
        hireDate,
      },
    })

    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json({ error: 'Errore durante la creazione' }, { status: 500 })
  }
}
