import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import InfoTooltip from '@/components/ui/InfoTooltip'

/**
 * Consultant - Leave Requests Management
 *
 * View and manage leave requests for client company
 */
export default async function ConsultantLeavesPage({
  params,
}: {
  params: { clientId: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Verify consultant has access to this client
  const access = await prisma.consultantClient.findFirst({
    where: {
      consultantId: session.user.id,
      tenantId: params.clientId,
      isActive: true,
    },
    include: {
      tenant: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!access) {
    notFound()
  }

  const tenant = access.tenant

  // Get leave requests
  const [pendingLeaves, approvedLeaves, leaveBalances] = await Promise.all([
    // Pending leave requests
    prisma.leaveRequest.findMany({
      where: {
        tenantId: params.clientId,
        status: 'PENDING',
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            department: true,
          },
        },
      },
      orderBy: {
        requestedAt: 'desc',
      },
    }),
    // Approved leaves (current year)
    prisma.leaveRequest.findMany({
      where: {
        tenantId: params.clientId,
        status: { in: ['APPROVED', 'IN_PROGRESS'] },
        startDate: {
          gte: new Date(new Date().getFullYear(), 0, 1),
        },
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            department: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
      take: 10,
    }),
    // Leave balances
    prisma.leaveBalance.findMany({
      where: {
        tenantId: params.clientId,
        year: new Date().getFullYear(),
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            department: true,
          },
        },
      },
      orderBy: {
        employee: {
          lastName: 'asc',
        },
      },
    }),
  ])

  const getLeaveTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      VACATION: 'Ferie',
      SICK: 'Malattia',
      PERSONAL: 'Permesso',
      ROL: 'ROL',
      PARENTAL: 'Parentale',
      MATERNITY: 'Maternità',
      PATERNITY: 'Paternità',
      BEREAVEMENT: 'Lutto',
      MARRIAGE: 'Matrimonio',
      UNPAID: 'Non retribuito',
      OTHER: 'Altro',
    }
    return labels[type] || type
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
      APPROVED: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      REJECTED: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
      IN_PROGRESS: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
    }
    return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href={`/consultant/${params.clientId}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Torna alla Dashboard Cliente
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestione Ferie - {tenant.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Visualizza richieste ferie e saldi dipendenti
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Richieste Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pendingLeaves.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Approvate Anno</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {approvedLeaves.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dipendenti</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {leaveBalances.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Richieste in Attesa ({pendingLeaves.length})
            </h2>
            <InfoTooltip
              content="Richieste di ferie e permessi in attesa di approvazione da parte del gestore"
              position="bottom"
            />
          </div>

          {pendingLeaves.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Nessuna richiesta in attesa
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pendingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {leave.employee.firstName} {leave.employee.lastName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {leave.employee.department || 'N/A'}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
                      {getLeaveTypeLabel(leave.type)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p>
                      Dal {new Date(leave.startDate).toLocaleDateString('it-IT')} al{' '}
                      {new Date(leave.endDate).toLocaleDateString('it-IT')}
                    </p>
                    <p className="font-medium">
                      {leave.totalDays.toString()} giorni
                    </p>
                    {leave.reason && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {leave.reason}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leave Balances */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Saldi Ferie {new Date().getFullYear()}
            </h2>
            <InfoTooltip
              content="Saldi ferie e permessi ROL per ogni dipendente"
              position="bottom"
            />
          </div>

          {leaveBalances.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Nessun saldo disponibile
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {leaveBalances.map((balance) => {
                const vacationRemaining =
                  Number(balance.vacationTotal) - Number(balance.vacationUsed)
                const rolRemaining = Number(balance.rolTotal) - Number(balance.rolUsed)

                return (
                  <div
                    key={balance.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {balance.employee.firstName} {balance.employee.lastName}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Ferie</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {vacationRemaining.toFixed(1)} gg rimanenti
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">ROL</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {rolRemaining.toFixed(1)} gg rimanenti
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Approved */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ferie Approvate Recenti
        </h2>
        {approvedLeaves.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Nessuna ferie approvata quest'anno
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dipendente
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipo
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Periodo
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Giorni
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Stato
                  </th>
                </tr>
              </thead>
              <tbody>
                {approvedLeaves.map((leave, idx) => (
                  <tr
                    key={leave.id}
                    className={`border-b border-gray-100 dark:border-gray-800 ${
                      idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {leave.employee.firstName} {leave.employee.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {leave.employee.department || 'N/A'}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {getLeaveTypeLabel(leave.type)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {new Date(leave.startDate).toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: 'short',
                      })}{' '}
                      -{' '}
                      {new Date(leave.endDate).toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-900 dark:text-white">
                      {leave.totalDays.toString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          leave.status
                        )}`}
                      >
                        {leave.status === 'IN_PROGRESS' ? 'In corso' : 'Approvata'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
