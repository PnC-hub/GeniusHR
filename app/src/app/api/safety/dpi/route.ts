import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Modello DPI (aggiunto come Document con tipo DPI_RECEIPT)
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

    const { searchParams } = new URL(req.url)
    const employeeId = searchParams.get('employeeId')

    const where: any = {
      tenantId: membership.tenantId,
      type: 'DPI_RECEIPT'
    }

    if (employeeId) {
      where.employeeId = employeeId
    }

    const dpiRecords = await prisma.document.findMany({
      where,
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
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(dpiRecords)
  } catch (error) {
    console.error('Errore nel recupero DPI:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero dei DPI' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json()
    const {
      employeeId,
      name,
      category,
      filePath,
      expiresAt
    } = body

    if (!employeeId || !name) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti' },
        { status: 400 }
      )
    }

    const dpiRecord = await prisma.document.create({
      data: {
        tenantId: membership.tenantId,
        employeeId,
        name,
        type: 'DPI_RECEIPT',
        category,
        filePath: filePath || '',
        uploadedBy: session.user.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        retentionYears: 10 // D.Lgs. 81/08 richiede 10 anni
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
      }
    })

    // Crea deadline se ha scadenza
    if (expiresAt) {
      await prisma.deadline.create({
        data: {
          tenantId: membership.tenantId,
          employeeId,
          title: `Rinnovo DPI: ${name}`,
          description: `Il dispositivo "${name}" necessita di rinnovo`,
          type: 'DPI_RENEWAL',
          dueDate: new Date(expiresAt),
          status: 'PENDING',
          notify30Days: true
        }
      })
    }

    return NextResponse.json(dpiRecord, { status: 201 })
  } catch (error) {
    console.error('Errore nella creazione DPI:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione del DPI' },
      { status: 500 }
    )
  }
}
