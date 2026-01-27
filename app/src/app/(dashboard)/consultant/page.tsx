import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import InfoTooltip from '@/components/ui/InfoTooltip'

/**
 * Consultant Portal - Main Dashboard
 *
 * Features:
 * - Lists all client companies managed by consultant
 * - Aggregate statistics (total employees, upcoming deadlines, documents to process)
 * - Quick actions per client
 * - Fast switch between companies
 */
export default async function ConsultantPortalPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Get consultant's client relationships
  const consultantClients = await prisma.consultantClient.findMany({
    where: {
      consultantId: session.user.id,
      isActive: true,
    },
    include: {
      tenant: {
        include: {
          _count: {
            select: {
              employees: true,
              timeEntries: {
                where: {
                  status: 'PENDING',
                },
              },
              leaveRequests: {
                where: {
                  status: 'PENDING',
                },
              },
              deadlines: {
                where: {
                  status: { in: ['PENDING', 'UPCOMING'] },
                  dueDate: {
                    lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      addedAt: 'desc',
    },
  })

  // Calculate aggregate stats
  const totalEmployees = consultantClients.reduce(
    (sum, cc) => sum + cc.tenant._count.employees,
    0
  )
  const totalPendingAttendance = consultantClients.reduce(
    (sum, cc) => sum + cc.tenant._count.timeEntries,
    0
  )
  const totalPendingLeaves = consultantClients.reduce(
    (sum, cc) => sum + cc.tenant._count.leaveRequests,
    0
  )
  const totalUpcomingDeadlines = consultantClients.reduce(
    (sum, cc) => sum + cc.tenant._count.deadlines,
    0
  )

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Portale Consulente
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestione clienti e export dati per elaborazione paghe
            </p>
          </div>
          <Link
            href="/consultant/invite"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Invita Cliente
          </Link>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Aziende Clienti</p>
                <InfoTooltip
                  content="Numero totale di aziende clienti che gestisci come consulente del lavoro"
                  position="bottom"
                />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {consultantClients.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Dipendenti Totali</p>
                <InfoTooltip
                  content="Somma di tutti i dipendenti delle aziende clienti"
                  position="bottom"
                />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalEmployees}
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
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Scadenze Imminenti</p>
                <InfoTooltip
                  content="Scadenze nei prossimi 30 giorni (formazione, visite mediche, contratti)"
                  position="bottom"
                />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalUpcomingDeadlines}
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
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Da Processare</p>
                <InfoTooltip
                  content="Presenze da approvare e ferie in attesa di decisione"
                  position="bottom"
                />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalPendingAttendance + totalPendingLeaves}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Aziende Clienti
        </h2>

        {consultantClients.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🏢</span>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Nessuna azienda cliente collegata
            </p>
            <Link
              href="/consultant/invite"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Invita il Primo Cliente
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultantClients.map((cc) => {
              const tenant = cc.tenant
              const pendingTasks =
                tenant._count.timeEntries + tenant._count.leaveRequests

              return (
                <div
                  key={cc.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {tenant.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {tenant._count.employees} dipendenti
                      </p>
                    </div>
                    {pendingTasks > 0 && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-xs font-medium rounded-full">
                        {pendingTasks} da fare
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Presenze pendenti
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {tenant._count.timeEntries}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Ferie in attesa
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {tenant._count.leaveRequests}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Scadenze 30gg
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {tenant._count.deadlines}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/consultant/${tenant.id}/attendance`}
                      className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-center"
                    >
                      📊 Presenze
                    </Link>
                    <Link
                      href={`/consultant/${tenant.id}/payslips`}
                      className="px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-center"
                    >
                      💰 Cedolini
                    </Link>
                    <Link
                      href={`/consultant/${tenant.id}/leaves`}
                      className="px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg text-sm font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors text-center"
                    >
                      🏖️ Ferie
                    </Link>
                    <Link
                      href={`/consultant/${tenant.id}/messages`}
                      className="px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-center"
                    >
                      💬 Messaggi
                    </Link>
                  </div>

                  {/* View Full Dashboard */}
                  <Link
                    href={`/consultant/${tenant.id}`}
                    className="mt-4 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center"
                  >
                    Vedi Dashboard Completa →
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
