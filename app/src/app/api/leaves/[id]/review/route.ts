import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { action, reason } = body

    // Get user (must be admin/manager)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tenant: true },
    })

    if (!user?.tenantId) {
      return NextResponse.json(
        { error: 'Solo gli amministratori possono approvare/rifiutare richieste' },
        { status: 403 }
      )
    }

    // Get leave request
    const leave = await prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!leave) {
      return NextResponse.json({ error: 'Richiesta non trovata' }, { status: 404 })
    }

    if (leave.tenantId !== user.tenantId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 })
    }

    if (leave.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Questa richiesta è già stata processata' },
        { status: 400 }
      )
    }

    if (action === 'reject' && !reason) {
      return NextResponse.json(
        { error: 'Il motivo del rifiuto è obbligatorio' },
        { status: 400 }
      )
    }

    const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED'

    // Update leave request
    const updatedLeave = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status: newStatus,
        reviewedBy: user.id,
        reviewedAt: new Date(),
        reviewNotes: reason || null,
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

    // If approved, update leave balance
    if (action === 'approve') {
      const currentYear = new Date().getFullYear()

      // Get or create balance for the year
      let balance = await prisma.leaveBalance.findUnique({
        where: {
          employeeId_year: {
            employeeId: leave.employeeId,
            year: currentYear,
          },
        },
      })

      if (!balance) {
        balance = await prisma.leaveBalance.create({
          data: {
            employeeId: leave.employeeId,
            tenantId: leave.tenantId,
            year: currentYear,
            vacationTotal: 26,
            vacationUsed: 0,
            vacationPending: 0,
            rolTotal: 56,
            rolUsed: 0,
            rolPending: 0,
            exFestTotal: 32,
            exFestUsed: 0,
            exFestPending: 0,
          },
        })
      }

      // Update balance based on leave type
      const updateData: Record<string, number> = {}
      const totalDays = Number(leave.totalDays)

      switch (leave.type) {
        case 'VACATION':
          updateData.vacationUsed = Number(balance.vacationUsed) + totalDays
          updateData.vacationPending = Math.max(0, Number(balance.vacationPending) - totalDays)
          break
        case 'PERSONAL':
        case 'ROL':
          const hoursUsed = totalDays * 8 // Convert days to hours
          updateData.rolUsed = Number(balance.rolUsed) + hoursUsed
          updateData.rolPending = Math.max(0, Number(balance.rolPending) - hoursUsed)
          break
        case 'EX_FESTIVITY':
          const exFestHours = totalDays * 8
          updateData.exFestUsed = Number(balance.exFestUsed) + exFestHours
          updateData.exFestPending = Math.max(0, Number(balance.exFestPending) - exFestHours)
          break
        case 'SICK':
          updateData.sickDaysUsed = balance.sickDaysUsed + Math.ceil(totalDays)
          break
        case 'LAW_104':
          updateData.law104Used = Number(balance.law104Used) + totalDays
          break
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.leaveBalance.update({
          where: {
            employeeId_year: {
              employeeId: leave.employeeId,
              year: currentYear,
            },
          },
          data: updateData,
        })
      }
    }

    // Log audit
    await logAudit({
      tenantId: user.tenantId,
      userId: user.id,
      action: 'UPDATE',
      entityType: 'LeaveRequest',
      entityId: id,
      oldValue: { status: 'PENDING' },
      newValue: { status: newStatus, reviewNotes: reason },
    })

    // Notify employee
    if (leave.employee.userId) {
      const notificationTypes: Record<string, string> = {
        approve: 'LEAVE_APPROVED',
        reject: 'LEAVE_REJECTED',
      }

      await prisma.notification.create({
        data: {
          tenantId: user.tenantId,
          userId: leave.employee.userId,
          type: notificationTypes[action] as any,
          title: action === 'approve' ? 'Richiesta approvata' : 'Richiesta rifiutata',
          message:
            action === 'approve'
              ? `La tua richiesta di ${leave.type} dal ${leave.startDate.toLocaleDateString('it-IT')} è stata approvata`
              : `La tua richiesta di ${leave.type} è stata rifiutata. Motivo: ${reason}`,
          entityType: 'LeaveRequest',
          entityId: id,
          link: `/employee/leaves`,
        },
      })
    }

    return NextResponse.json(updatedLeave)
  } catch (error) {
    console.error('Error reviewing leave:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
