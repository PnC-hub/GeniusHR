import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const year = searchParams.get('year')
    const employeeId = searchParams.get('employeeId')

    // Get user (admin only)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tenant: true },
    })

    if (!user?.tenantId) {
      return NextResponse.json(
        { error: 'Solo gli amministratori possono esportare i dati' },
        { status: 403 }
      )
    }

    const where: Record<string, unknown> = {
      tenantId: user.tenantId,
    }

    if (employeeId) where.employeeId = employeeId
    if (status) where.status = status
    if (type) where.type = type

    if (year) {
      const yearNum = parseInt(year)
      where.startDate = {
        gte: new Date(yearNum, 0, 1),
        lt: new Date(yearNum + 1, 0, 1),
      }
    }

    const leaves = await prisma.leaveRequest.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fiscalCode: true,
            department: true,
            jobTitle: true,
          },
        },
        reviewer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    })

    // Generate CSV
    const headers = [
      'ID',
      'Dipendente',
      'Codice Fiscale',
      'Reparto',
      'Mansione',
      'Tipo Assenza',
      'Data Inizio',
      'Data Fine',
      'Giorni Totali',
      'Ore Totali',
      'Mezza Giornata Inizio',
      'Mezza Giornata Fine',
      'Stato',
      'Motivo',
      'Data Richiesta',
      'Approvato Da',
      'Data Approvazione',
      'Note Revisione',
    ]

    const rows = leaves.map((leave) => [
      leave.id,
      `${leave.employee.firstName} ${leave.employee.lastName}`,
      leave.employee.fiscalCode || '',
      leave.employee.department || '',
      leave.employee.jobTitle || '',
      leave.type,
      leave.startDate.toLocaleDateString('it-IT'),
      leave.endDate.toLocaleDateString('it-IT'),
      leave.totalDays.toString(),
      leave.totalHours?.toString() || '',
      leave.startHalf ? 'Sì' : 'No',
      leave.endHalf ? 'Sì' : 'No',
      leave.status,
      leave.reason || '',
      leave.requestedAt.toLocaleDateString('it-IT'),
      leave.reviewer?.name || '',
      leave.reviewedAt?.toLocaleDateString('it-IT') || '',
      leave.reviewNotes || '',
    ])

    // Build CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n')

    // Log audit
    await logAudit({
      tenantId: user.tenantId,
      userId: user.id,
      action: 'EXPORT',
      entityType: 'LeaveRequest',
      entityId: 'bulk',
      details: {
        count: leaves.length,
        filters: { status, type, year, employeeId },
      },
    })

    // Return CSV with proper headers
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="ferie-permessi-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting leaves:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
