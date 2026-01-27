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

    // Get all employees for this tenant
    const employees = await prisma.employee.findMany({
      where: {
        tenantId: tenantId!,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      orderBy: {
        lastName: 'asc',
      },
    })

    // Get balances for all employees
    const balancesData = await Promise.all(
      employees.map(async (employee) => {
        let balance = await prisma.leaveBalance.findUnique({
          where: {
            employeeId_year: {
              employeeId: employee.id,
              year,
            },
          },
        })

        // Create default balance if not exists
        if (!balance) {
          balance = await prisma.leaveBalance.create({
            data: {
              employeeId: employee.id,
              tenantId: tenantId!,
              year,
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

        return {
          employeeId: employee.id,
          employee: {
            firstName: employee.firstName,
            lastName: employee.lastName,
          },
          vacationDays: Number(balance.vacationTotal),
          vacationUsed: Number(balance.vacationUsed),
          vacationRemaining:
            Number(balance.vacationTotal) +
            Number(balance.vacationCarryOver) -
            Number(balance.vacationUsed) -
            Number(balance.vacationPending),
          sickDays: balance.sickDaysUsed,
          sickUsed: balance.sickDaysUsed,
          permits: Number(balance.rolTotal),
          permitsUsed: Number(balance.rolUsed),
        }
      })
    )

    return NextResponse.json(balancesData)
  } catch (error) {
    console.error('Error fetching leave balances:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
