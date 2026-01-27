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
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tenant: true, employee: true },
    })

    if (!user?.tenantId && !user?.employee?.tenantId) {
      return NextResponse.json({ error: 'Tenant non trovato' }, { status: 404 })
    }

    const tenantId = user.tenantId || user.employee?.tenantId

    const where: Record<string, unknown> = {
      tenantId,
    }

    if (employeeId) {
      where.employeeId = employeeId
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

    const entries = await prisma.timeEntry.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
            jobTitle: true,
            fiscalCode: true,
          },
        },
      },
      orderBy: [{ date: 'asc' }, { employee: { lastName: 'asc' } }, { clockIn: 'asc' }],
    })

    // Generate CSV
    const csvRows = []

    // Header
    csvRows.push([
      'Cognome',
      'Nome',
      'Codice Fiscale',
      'Reparto',
      'Data',
      'Giorno',
      'Entrata',
      'Uscita',
      'Pausa (min)',
      'Ore Lavorate',
      'Straordinari',
      'Stato',
      'Anomalia',
      'Note',
    ])

    // Data rows
    for (const entry of entries) {
      const date = new Date(entry.date)
      const dayName = new Intl.DateTimeFormat('it-IT', { weekday: 'long' }).format(date)
      const dateStr = new Intl.DateTimeFormat('it-IT').format(date)

      const clockIn = entry.clockIn
        ? new Intl.DateTimeFormat('it-IT', {
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(entry.clockIn))
        : ''

      const clockOut = entry.clockOut
        ? new Intl.DateTimeFormat('it-IT', {
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(entry.clockOut))
        : ''

      const workedHours = entry.workedMinutes
        ? `${Math.floor(entry.workedMinutes / 60)}:${String(entry.workedMinutes % 60).padStart(2, '0')}`
        : ''

      const overtimeHours = entry.overtimeMinutes
        ? `${Math.floor(entry.overtimeMinutes / 60)}:${String(entry.overtimeMinutes % 60).padStart(2, '0')}`
        : ''

      csvRows.push([
        entry.employee.lastName,
        entry.employee.firstName,
        entry.employee.fiscalCode || '',
        entry.employee.department || '',
        dateStr,
        dayName,
        clockIn,
        clockOut,
        entry.breakMinutes?.toString() || '0',
        workedHours,
        overtimeHours,
        entry.status,
        entry.anomalyType || '',
        entry.notes || '',
      ])
    }

    // Convert to CSV string
    const csvContent = csvRows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n')

    // Add UTF-8 BOM for Excel compatibility
    const csvWithBom = '\uFEFF' + csvContent

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="presenze-${dateFrom || 'export'}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting attendance:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
