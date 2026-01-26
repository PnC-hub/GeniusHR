import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'
import { DocumentType, Prisma } from '@prisma/client'

// GET /api/documents - Get all documents for tenant
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
    const type = searchParams.get('type') as DocumentType | null
    const category = searchParams.get('category')

    const where: Prisma.DocumentWhereInput = {
      tenantId: membership.tenantId,
    }

    if (employeeId) where.employeeId = employeeId
    if (type) where.type = type
    if (category) where.category = category

    const documents = await prisma.document.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero documenti' },
      { status: 500 }
    )
  }
}

// POST /api/documents - Create new document
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
      name,
      type,
      category,
      filePath,
      fileSize,
      mimeType,
      retentionYears,
      expiresAt,
    } = body

    // Validate required fields
    if (!name || !type || !filePath) {
      return NextResponse.json(
        { error: 'Nome, tipo e percorso file sono obbligatori' },
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

    const document = await prisma.document.create({
      data: {
        tenantId: membership.tenantId,
        employeeId: employeeId || null,
        name,
        type,
        category: category || null,
        filePath,
        fileSize: fileSize || null,
        mimeType: mimeType || null,
        retentionYears: retentionYears || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        uploadedBy: session.user.id,
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
      entityType: 'Document',
      entityId: document.id,
      newValue: {
        name,
        type,
        employeeId,
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione documento' },
      { status: 500 }
    )
  }
}
