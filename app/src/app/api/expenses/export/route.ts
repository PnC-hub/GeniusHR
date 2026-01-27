import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Get user and tenant
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tenant: true },
    })

    if (!user?.tenantId) {
      return NextResponse.json({ error: 'Tenant non trovato' }, { status: 404 })
    }

    const where: Record<string, unknown> = {
      tenantId: user.tenantId,
    }

    if (employeeId) {
      where.employeeId = employeeId
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) {
        (where.date as Record<string, Date>).gte = new Date(dateFrom)
      }
      if (dateTo) {
        (where.date as Record<string, Date>).lte = new Date(dateTo)
      }
    }

    const expenses = await prisma.expenseRequest.findMany({
      where,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            department: true,
          },
        },
        reviewer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    })

    // Generate CSV
    const headers = [
      'Data',
      'Dipendente',
      'Reparto',
      'Tipo',
      'Descrizione',
      'Importo (EUR)',
      'Valuta',
      'Stato',
      'Km',
      'Tariffa/Km',
      'Origine',
      'Destinazione',
      'Veicolo',
      'Data Richiesta',
      'Approvato Da',
      'Data Approvazione',
      'Note',
    ]

    const rows = expenses.map((exp) => [
      new Date(exp.date).toLocaleDateString('it-IT'),
      `${exp.employee.firstName} ${exp.employee.lastName}`,
      exp.employee.department || '',
      exp.type,
      exp.description,
      exp.amount.toString(),
      exp.currency,
      exp.status,
      exp.kilometers?.toString() || '',
      exp.ratePerKm?.toString() || '',
      exp.origin || '',
      exp.destination || '',
      exp.vehicleType || '',
      new Date(exp.createdAt).toLocaleDateString('it-IT'),
      exp.reviewer?.name || '',
      exp.reviewedAt ? new Date(exp.reviewedAt).toLocaleDateString('it-IT') : '',
      exp.reviewNotes || '',
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n')

    // Add BOM for Excel UTF-8 support
    const bom = '\uFEFF'
    const csvWithBom = bom + csv

    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="note-spese-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting expenses:', error)
    return NextResponse.json({ error: 'Errore export' }, { status: 500 })
  }
}
