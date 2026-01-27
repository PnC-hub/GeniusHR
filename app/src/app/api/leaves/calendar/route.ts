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
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1))
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()))

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { employee: true, tenant: true },
    })

    if (!user?.tenantId && !user?.employee?.tenantId) {
      return NextResponse.json({ error: 'Accesso non autorizzato' }, { status: 403 })
    }

    const tenantId = user.tenantId || user.employee?.tenantId

    // Calculate month date range
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    // Get all approved and pending leaves for the month
    const leaves = await prisma.leaveRequest.findMany({
      where: {
        tenantId: tenantId!,
        status: {
          in: ['APPROVED', 'PENDING', 'IN_PROGRESS'],
        },
        OR: [
          {
            AND: [{ startDate: { lte: endDate } }, { endDate: { gte: startDate } }],
          },
        ],
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
      orderBy: {
        startDate: 'asc',
      },
    })

    // Build calendar data structure
    const calendarData: Record<
      string,
      Array<{
        id: string
        employeeId: string
        employeeName: string
        type: string
        status: string
        startHalf?: boolean
        endHalf?: boolean
      }>
    > = {}

    leaves.forEach((leave) => {
      // Iterate through each day of the leave
      const currentDate = new Date(leave.startDate)
      const leaveEndDate = new Date(leave.endDate)

      while (currentDate <= leaveEndDate) {
        // Only include days within the requested month
        if (
          currentDate >= startDate &&
          currentDate <= endDate &&
          currentDate.getDay() !== 0 &&
          currentDate.getDay() !== 6
        ) {
          const dateKey = currentDate.toISOString().split('T')[0]

          if (!calendarData[dateKey]) {
            calendarData[dateKey] = []
          }

          const isStartDate = currentDate.toDateString() === leave.startDate.toDateString()
          const isEndDate = currentDate.toDateString() === leave.endDate.toDateString()

          calendarData[dateKey].push({
            id: leave.id,
            employeeId: leave.employeeId,
            employeeName: `${leave.employee.firstName} ${leave.employee.lastName}`,
            type: leave.type,
            status: leave.status,
            startHalf: isStartDate ? leave.startHalf : undefined,
            endHalf: isEndDate ? leave.endHalf : undefined,
          })
        }

        currentDate.setDate(currentDate.getDate() + 1)
      }
    })

    return NextResponse.json({
      month,
      year,
      calendarData,
    })
  } catch (error) {
    console.error('Error fetching calendar data:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
