import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import InfoTooltip from '@/components/ui/InfoTooltip'

/**
 * Consultant - Client Specific Dashboard
 *
 * Shows detailed view of a specific client company with:
 * - Employee list
 * - Attendance summary (for payroll export)
 * - Leave requests
 * - Upcoming deadlines
 * - Recent activity
 */
export default async function ConsultantClientDashboardPage({
  params,
}: {
  params: { clientId: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Verify consultant has access to this client
  const consultantAccess = await prisma.consultantClient.findFirst({
    where: {
      consultantId: session.user.id,
      tenantId: params.clientId,
      isActive: true,
    },
    include: {
      tenant: {
        include: {
          _count: {
            select: {
              employees: true,
            },
          },
        },
      },
    },
  })

  if (!consultantAccess) {
    notFound()
  }

  const tenant = consultantAccess.tenant

  // Get current month date range
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Get statistics
  const [
    pendingAttendance,
    pendingLeaves,
    upcomingDeadlines,
    currentMonthAttendance,
    employees,
  ] = await Promise.all([
    // Pending attendance approvals
    prisma.timeEntry.count({
      where: {
        tenantId: params.clientId,
        status: 'PENDING',
      },
    }),
    // Pending leave requests
    prisma.leaveRequest.count({
      where: {
        tenantId: params.clientId,
        status: 'PENDING',
      },
    }),
    // Upcoming deadlines (next 30 days)
    prisma.deadline.findMany({
      where: {
        tenantId: params.clientId,
        status: { in: ['PENDING', 'UPCOMING'] },
        dueDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        employee: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
      take: 5,
    }),
    // Current month attendance summary
    prisma.timeEntry.groupBy({
      by: ['employeeId'],
      where: {
        tenantId: params.clientId,
        date: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      _sum: {
        workedMinutes: true,
        overtimeMinutes: true,
      },
      _count: true,
    }),
    // Get all active employees
    prisma.employee.findMany({
      where: {
        tenantId: params.clientId,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        fiscalCode: true,
        jobTitle: true,
        department: true,
      },
      orderBy: {
        lastName: 'asc',
      },
    }),
  ])

  // Calculate total worked hours this month
  const totalWorkedHours = currentMonthAttendance.reduce(
    (sum, entry) => sum + (entry._sum.workedMinutes || 0),
    0
  ) / 60

  const totalOvertimeHours = currentMonthAttendance.reduce(
    (sum, entry) => sum + (entry._sum.overtimeMinutes || 0),
    0
  ) / 60

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/consultant"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Torna ai Clienti
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {tenant.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Dashboard completa azienda cliente
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dipendenti Attivi</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {employees.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Ore Mese Corrente</p>
                <InfoTooltip
                  content="Ore lavorate nel mese corrente (inclusi straordinari)"
                  position="bottom"
                />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(totalWorkedHours)}h
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                +{Math.round(totalOvertimeHours)}h straordinari
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Scadenze 30gg</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {upcomingDeadlines.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Approvazioni Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pendingAttendance + pendingLeaves}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Azioni Rapide
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href={`/consultant/${params.clientId}/attendance`}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-center transition-colors"
          >
            <span className="text-3xl mb-2 block">📊</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Export Presenze
            </span>
            {pendingAttendance > 0 && (
              <span className="block mt-2 text-xs text-blue-600 dark:text-blue-400">
                {pendingAttendance} da approvare
              </span>
            )}
          </Link>

          <Link
            href={`/consultant/${params.clientId}/payslips`}
            className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg text-center transition-colors"
          >
            <span className="text-3xl mb-2 block">💰</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Upload Cedolini
            </span>
          </Link>

          <Link
            href={`/consultant/${params.clientId}/leaves`}
            className="p-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg text-center transition-colors"
          >
            <span className="text-3xl mb-2 block">🏖️</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Gestione Ferie
            </span>
            {pendingLeaves > 0 && (
              <span className="block mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                {pendingLeaves} in attesa
              </span>
            )}
          </Link>

          <Link
            href={`/consultant/${params.clientId}/messages`}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg text-center transition-colors"
          >
            <span className="text-3xl mb-2 block">💬</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Messaggi
            </span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Scadenze Imminenti
          </h2>
          {upcomingDeadlines.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Nessuna scadenza nei prossimi 30 giorni
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => {
                const daysUntil = Math.ceil(
                  (new Date(deadline.dueDate).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                )
                const isUrgent = daysUntil <= 7

                return (
                  <div
                    key={deadline.id}
                    className={`p-4 rounded-lg border ${
                      isUrgent
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {deadline.title}
                        </p>
                        {deadline.employee && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {deadline.employee.firstName} {deadline.employee.lastName}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${
                            isUrgent
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {daysUntil === 0
                            ? 'Oggi'
                            : daysUntil === 1
                            ? 'Domani'
                            : `${daysUntil} giorni`}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(deadline.dueDate).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Employee List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Dipendenti Attivi ({employees.length})
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {employee.jobTitle || employee.department || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                      {employee.fiscalCode || 'CF non disponibile'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
