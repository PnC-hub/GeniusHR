import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'
import { DeadlineType, DeadlineStatus, Prisma } from '@prisma/client'

// GET /api/deadlines - Get all deadlines for tenant
export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url)
    const employeeId = searchParams.get('employeeId')
    const type = searchParams.get('type') as DeadlineType | null
    const status = searchParams.get('status') as DeadlineStatus | null
    const upcoming = searchParams.get('upcoming')

    const where: Prisma.DeadlineWhereInput = {
      tenantId: membership.tenantId,
    }

    if (employeeId) where.employeeId = employeeId
    if (type) where.type = type
    if (status) where.status = status

    // Filter for upcoming deadlines (next 30 days)
    if (upcoming === 'true') {
      const now = new Date()
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      where.dueDate = {
        gte: now,
        lte: thirtyDaysFromNow,
      }
      where.status = { not: 'COMPLETED' }
    }

    const deadlines = await prisma.deadline.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    })

    return NextResponse.json(deadlines)
  } catch (error) {
    console.error('Error fetching deadlines:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero scadenze' },
      { status: 500 }
    )
  }
}

// POST /api/deadlines - Create new deadline
export async function POST(req: Request) {
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

    const body = await req.json()
    const {
      employeeId,
      title,
      description,
      type,
      dueDate,
      notify30Days,
      notify60Days,
      notify90Days,
    } = body

    // Validate required fields
    if (!title || !type || !dueDate) {
      return NextResponse.json(
        { error: 'Titolo, tipo e data scadenza sono obbligatori' },
        { status: 400 }
      )
    }

    // Verify employee belongs to tenant if provided
    if (employeeId) {
      const employee = await prisma.employee.findFirst({
        where: {
          id: employeeId,
          tenantId: membership.tenantId,
        },
      })

      if (!employee) {
        return NextResponse.json(
          { error: 'Dipendente non trovato' },
          { status: 404 }
        )
      }
    }

    // Determine initial status based on due date
    const dueDateObj = new Date(dueDate)
    const now = new Date()
    let status: DeadlineStatus = 'PENDING'

    const daysUntilDue = Math.ceil((dueDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntilDue < 0) {
      status = 'OVERDUE'
    } else if (daysUntilDue <= 30) {
      status = 'UPCOMING'
    }

    const deadline = await prisma.deadline.create({
      data: {
        tenantId: membership.tenantId,
        employeeId: employeeId || null,
        title,
        description: description || null,
        type,
        dueDate: dueDateObj,
        status,
        notify30Days: notify30Days ?? true,
        notify60Days: notify60Days ?? false,
        notify90Days: notify90Days ?? false,
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Log audit
    await logAudit({
      tenantId: membership.tenantId,
      userId: session.user.id,
      action: 'CREATE',
      entityType: 'Deadline',
      entityId: deadline.id,
      newValue: {
        title,
        type,
        dueDate,
        employeeId,
      },
    })

    return NextResponse.json(deadline, { status: 201 })
  } catch (error) {
    console.error('Error creating deadline:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione scadenza' },
      { status: 500 }
    )
  }
}
