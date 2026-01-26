import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'
import { ReviewStatus, Prisma } from '@prisma/client'

// GET /api/performance - Get all performance reviews for tenant
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
    const status = searchParams.get('status') as ReviewStatus | null
    const year = searchParams.get('year')

    const where: Prisma.PerformanceReviewWhereInput = {
      tenantId: membership.tenantId,
    }

    if (employeeId) where.employeeId = employeeId
    if (status) where.status = status
    if (year) {
      const startOfYear = new Date(parseInt(year), 0, 1)
      const endOfYear = new Date(parseInt(year), 11, 31, 23, 59, 59)
      where.reviewDate = {
        gte: startOfYear,
        lte: endOfYear,
      }
    }

    const reviews = await prisma.performanceReview.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
            jobTitle: true,
          },
        },
      },
      orderBy: { reviewDate: 'desc' },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching performance reviews:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero valutazioni' },
      { status: 500 }
    )
  }
}

// POST /api/performance - Create new performance review
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

    // Check role
    if (!['OWNER', 'ADMIN', 'HR_MANAGER'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Non hai i permessi per questa operazione' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      employeeId,
      reviewDate,
      technicalSkills,
      teamwork,
      communication,
      reliability,
      growthPotential,
      strengths,
      improvements,
      goals,
      notes,
      status,
    } = body

    // Validate required fields
    if (!employeeId || !reviewDate) {
      return NextResponse.json(
        { error: 'Dipendente e data valutazione sono obbligatori' },
        { status: 400 }
      )
    }

    // Verify employee belongs to tenant
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

    // Calculate overall score
    const scores = [technicalSkills, teamwork, communication, reliability, growthPotential].filter(
      (s) => s !== null && s !== undefined
    )
    const overallScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null

    const review = await prisma.performanceReview.create({
      data: {
        tenantId: membership.tenantId,
        employeeId,
        reviewDate: new Date(reviewDate),
        reviewerId: session.user.id,
        technicalSkills: technicalSkills ?? null,
        teamwork: teamwork ?? null,
        communication: communication ?? null,
        reliability: reliability ?? null,
        growthPotential: growthPotential ?? null,
        overallScore,
        strengths: strengths || null,
        improvements: improvements || null,
        goals: goals || null,
        notes: notes || null,
        status: status || 'DRAFT',
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
      entityType: 'PerformanceReview',
      entityId: review.id,
      newValue: {
        employeeId,
        reviewDate,
        overallScore,
        status,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating performance review:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione valutazione' },
      { status: 500 }
    )
  }
}
