import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { EmployeeStatus } from '@prisma/client'
import InfoTooltip from '@/components/ui/InfoTooltip'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Get user's tenants
  const memberships = await prisma.tenantMember.findMany({
    where: { userId: session.user.id },
    include: {
      tenant: {
        include: {
          _count: {
            select: { employees: true, deadlines: true }
          }
        }
      }
    }
  })

  const tenant = memberships[0]?.tenant
  const tenantId = tenant?.id

  // STATISTICS: Calculate real employee stats
  const employeeStats = tenantId ? await prisma.employee.groupBy({
    by: ['status'],
    where: { tenantId },
    _count: true
  }) : []

  const totalEmployees = employeeStats.reduce((sum, stat) => sum + stat._count, 0)
  const activeEmployees = employeeStats.find(s => s.status === EmployeeStatus.ACTIVE)?._count || 0
  const probationEmployees = employeeStats.find(s => s.status === EmployeeStatus.PROBATION)?._count || 0

  // COMPLIANCE SCORE: Calculate real compliance based on:
  // 1. Safety training completion
  // 2. DVR acknowledgments
  // 3. Required document signatures
  let complianceScore = 100

  if (tenantId && totalEmployees > 0) {
    // 1. Safety training compliance (40% weight)
    const employeesWithValidTraining = await prisma.employee.count({
      where: {
        tenantId,
        status: EmployeeStatus.ACTIVE,
        safetyTrainings: {
          some: {
            status: 'COMPLETED',
            OR: [
              { expiresAt: { gte: new Date() } },
              { expiresAt: null }
            ]
          }
        }
      }
    })
    const trainingCompliance = totalEmployees > 0 ? (employeesWithValidTraining / totalEmployees) * 100 : 0

    // 2. DVR acknowledgment compliance (30% weight)
    const employeesWithDVR = await prisma.employee.count({
      where: {
        tenantId,
        status: EmployeeStatus.ACTIVE,
        dvrAcknowledgments: {
          some: {
            acknowledgedAt: { not: null }
          }
        }
      }
    })
    const dvrCompliance = totalEmployees > 0 ? (employeesWithDVR / totalEmployees) * 100 : 0

    // 3. Document signature compliance (30% weight)
    const totalSignatureRequests = await prisma.documentSignatureRequest.count({
      where: {
        tenantId,
        status: { in: ['PENDING', 'SIGNED'] }
      }
    })
    const signedDocuments = await prisma.documentSignatureRequest.count({
      where: {
        tenantId,
        status: 'SIGNED'
      }
    })
    const signatureCompliance = totalSignatureRequests > 0
      ? (signedDocuments / totalSignatureRequests) * 100
      : 100

    // Weighted average
    complianceScore = Math.round(
      (trainingCompliance * 0.4) +
      (dvrCompliance * 0.3) +
      (signatureCompliance * 0.3)
    )
  }

  // Get upcoming deadlines
  const upcomingDeadlines = tenantId ? await prisma.deadline.findMany({
    where: {
      tenantId,
      status: { in: ['PENDING', 'UPCOMING'] },
      dueDate: {
        lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
      }
    },
    include: { employee: true },
    orderBy: { dueDate: 'asc' },
    take: 5
  }) : []

  // RECENT ACTIVITIES: Get latest events
  const recentActivities = tenantId ? await Promise.all([
    // New employees (last 7 days)
    prisma.employee.findMany({
      where: {
        tenantId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        jobTitle: true
      },
      orderBy: { createdAt: 'desc' },
      take: 3
    }),
    // Recent leave requests
    prisma.leaveRequest.findMany({
      where: {
        tenantId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 3
    }),
    // Recent document signatures
    prisma.documentSignatureRequest.findMany({
      where: {
        tenantId,
        signedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        document: {
          select: {
            name: true
          }
        }
      },
      orderBy: { signedAt: 'desc' },
      take: 3
    })
  ]).then(([newEmployees, leaveRequests, signatures]) => {
    const activities: Array<{
      id: string
      type: string
      icon: string
      title: string
      description: string
      timestamp: Date
    }> = []

    newEmployees.forEach(emp => {
      activities.push({
        id: emp.id,
        type: 'employee',
        icon: '👤',
        title: 'Nuovo Dipendente',
        description: `${emp.firstName} ${emp.lastName}${emp.jobTitle ? ` - ${emp.jobTitle}` : ''}`,
        timestamp: emp.createdAt
      })
    })

    leaveRequests.forEach(req => {
      activities.push({
        id: req.id,
        type: 'leave',
        icon: '🏖️',
        title: 'Richiesta Ferie',
        description: `${req.employee.firstName} ${req.employee.lastName} - ${req.totalDays} giorni`,
        timestamp: req.createdAt
      })
    })

    signatures.forEach(sig => {
      activities.push({
        id: sig.id,
        type: 'signature',
        icon: '✍️',
        title: 'Documento Firmato',
        description: `${sig.employee.firstName} ${sig.employee.lastName} - ${sig.document.name}`,
        timestamp: sig.signedAt!
      })
    })

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5)
  }) : []

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Benvenuto, {session.user.name} - {tenant?.name || 'Nessuno studio'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Employees */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dipendenti</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEmployees}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {activeEmployees} attivi{probationEmployees > 0 ? `, ${probationEmployees} in prova` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Active Deadlines */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Scadenze Attive</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tenant?._count.deadlines || 0}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {upcomingDeadlines.length} prossimi 30gg
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Score */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              complianceScore >= 90
                ? 'bg-green-100 dark:bg-green-900'
                : complianceScore >= 70
                ? 'bg-yellow-100 dark:bg-yellow-900'
                : 'bg-red-100 dark:bg-red-900'
            }`}>
              <span className="text-2xl">
                {complianceScore >= 90 ? '✅' : complianceScore >= 70 ? '⚠️' : '❌'}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Compliance Score</p>
                <InfoTooltip
                  content="Il punteggio di compliance è calcolato su 3 fattori: Formazione Sicurezza (40%), Riconoscimenti DVR (30%), Firme Documenti (30%). Punteggio ≥90% è ottimo, 70-89% da migliorare, <70% critico."
                  position="bottom"
                />
              </div>
              <p className={`text-2xl font-bold ${
                complianceScore >= 90
                  ? 'text-green-600 dark:text-green-400'
                  : complianceScore >= 70
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {complianceScore}%
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {complianceScore >= 90 ? 'Ottimo' : complianceScore >= 70 ? 'Da migliorare' : 'Critico'}
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Piano</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tenant?.plan || 'Trial'}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {tenant?.subscriptionStatus === 'TRIAL' ? 'Prova attiva' : 'Attivo'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Scadenze Imminenti</h2>
            <a href="/deadlines" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Vedi tutte
            </a>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Nessuna scadenza nei prossimi 30 giorni
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => {
                const daysUntil = Math.ceil(
                  (new Date(deadline.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
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
                        <p className="font-medium text-gray-900 dark:text-white">{deadline.title}</p>
                        {deadline.employee && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {deadline.employee.firstName} {deadline.employee.lastName}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          isUrgent
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {daysUntil === 0 ? 'Oggi' : daysUntil === 1 ? 'Domani' : `${daysUntil} giorni`}
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

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Attività Recenti</h2>
          </div>

          {recentActivities.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Nessuna attività recente negli ultimi 7 giorni
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => {
                const timeAgo = getTimeAgo(activity.timestamp)

                return (
                  <div
                    key={`${activity.type}-${activity.id}`}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{activity.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {timeAgo}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Azioni Rapide</h2>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/employees/new"
              className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-center transition-colors"
            >
              <span className="text-2xl mb-2 block">👤</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Nuovo Dipendente</span>
            </a>
            <a
              href="/documents/upload"
              className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg text-center transition-colors"
            >
              <span className="text-2xl mb-2 block">📄</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Carica Documento</span>
            </a>
            <a
              href="/deadlines/new"
              className="p-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg text-center transition-colors"
            >
              <span className="text-2xl mb-2 block">⏰</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Nuova Scadenza</span>
            </a>
            <a
              href="/performance/new"
              className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg text-center transition-colors"
            >
              <span className="text-2xl mb-2 block">📊</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Valutazione</span>
            </a>
          </div>
        </div>

        {/* Subscription Status */}
        {tenant?.subscriptionStatus === 'TRIAL' && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
              <div>
                <h3 className="text-xl font-bold mb-1">Periodo di Prova Attivo</h3>
                <p className="text-blue-100">
                  {tenant.trialEndsAt && (
                    <>
                      Scade il {new Date(tenant.trialEndsAt).toLocaleDateString('it-IT')}.
                      Attiva il tuo abbonamento per continuare.
                    </>
                  )}
                </p>
              </div>
              <a
                href="/settings/billing"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                Attiva Abbonamento
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Adesso'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minuti fa`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ore fa`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} giorni fa`

  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}
