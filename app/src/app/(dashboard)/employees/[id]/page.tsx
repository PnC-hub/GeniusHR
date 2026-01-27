import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import EmployeeDetailTabs from '@/components/EmployeeDetailTabs'
import DashboardHeader from '@/components/DashboardHeader'

type PageProps = {
  params: {
    id: string
  }
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  PROBATION: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  ON_LEAVE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  TERMINATED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const contractColors: Record<string, string> = {
  FULL_TIME: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  PART_TIME: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  APPRENTICE: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  INTERNSHIP: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  FIXED_TERM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  FREELANCE: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const statusLabels: Record<string, string> = {
  ACTIVE: 'Attivo',
  PROBATION: 'In Prova',
  ON_LEAVE: 'In Congedo',
  TERMINATED: 'Terminato'
}

const contractLabels: Record<string, string> = {
  FULL_TIME: 'Tempo Pieno',
  PART_TIME: 'Part-Time',
  APPRENTICE: 'Apprendistato',
  INTERNSHIP: 'Stage',
  FIXED_TERM: 'Tempo Determinato',
  FREELANCE: 'Collaborazione'
}

export default async function EmployeeDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Get user's tenant
  const membership = await prisma.tenantMember.findFirst({
    where: { userId: session.user.id },
    include: { tenant: true }
  })

  if (!membership) {
    redirect('/onboarding')
  }

  // Fetch employee with all related data
  const employee = await prisma.employee.findFirst({
    where: {
      id: params.id,
      tenantId: membership.tenantId
    },
    include: {
      documents: {
        orderBy: { createdAt: 'desc' }
      },
      safetyTrainings: {
        orderBy: { createdAt: 'desc' }
      },
      leaveRequests: {
        orderBy: { startDate: 'desc' },
        take: 10
      },
      leaveBalances: {
        where: {
          year: new Date().getFullYear()
        }
      },
      disciplinaryProcedures: {
        orderBy: { createdAt: 'desc' }
      },
      notes: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    }
  })

  if (!employee) {
    notFound()
  }

  // Calculate totals for leave balance
  const currentBalance = employee.leaveBalances[0] || {
    vacationTotal: 0,
    vacationUsed: 0,
    vacationPending: 0,
    rolTotal: 0,
    rolUsed: 0,
    rolPending: 0
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header with back button */}
      <div className="mb-6">
        <Link
          href="/employees"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Torna alla lista dipendenti</span>
        </Link>

        <DashboardHeader
          title={`${employee.firstName} ${employee.lastName}`}
          subtitle={employee.jobTitle || 'Dipendente'}
          tooltipTitle="Scheda Dipendente"
          tooltipDescription="Qui trovi tutti i dettagli del dipendente: dati anagrafici, documenti firmati, formazione sicurezza, ferie e permessi, eventuali provvedimenti disciplinari."
          tooltipTips={[
            'Passa tra le tab per vedere le diverse sezioni',
            'Modifica i dati cliccando il pulsante Modifica',
            'I documenti sono organizzati per categoria'
          ]}
        />
      </div>

      {/* Employee Info Card */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-300 font-bold text-2xl">
                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
              </span>
            </div>

            {/* Basic Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {employee.jobTitle || 'Nessun ruolo specificato'}
                {employee.department && <span> • {employee.department}</span>}
              </p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[employee.status]}`}>
                  {statusLabels[employee.status]}
                </span>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${contractColors[employee.contractType]}`}>
                  {contractLabels[employee.contractType]}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link
              href={`/employees/${employee.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifica
            </Link>
          </div>
        </div>

        {/* Contact & Personal Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-zinc-700">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
            <p className="text-gray-900 dark:text-white font-medium">{employee.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Telefono</p>
            <p className="text-gray-900 dark:text-white font-medium">{employee.phone || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Codice Fiscale</p>
            <p className="text-gray-900 dark:text-white font-medium font-mono">{employee.fiscalCode || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Data di Nascita</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {employee.birthDate ? new Date(employee.birthDate).toLocaleDateString('it-IT') : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Luogo di Nascita</p>
            <p className="text-gray-900 dark:text-white font-medium">{employee.birthPlace || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Indirizzo</p>
            <p className="text-gray-900 dark:text-white font-medium">{employee.address || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Data Assunzione</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {new Date(employee.hireDate).toLocaleDateString('it-IT')}
            </p>
          </div>
          {employee.endDate && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Data Fine Rapporto</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {new Date(employee.endDate).toLocaleDateString('it-IT')}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Livello CCNL</p>
            <p className="text-gray-900 dark:text-white font-medium">{employee.ccnlLevel || '-'}</p>
          </div>
          {employee.probationEndsAt && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Fine Periodo di Prova</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {new Date(employee.probationEndsAt).toLocaleDateString('it-IT')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabbed Content */}
      <EmployeeDetailTabs
        employee={employee}
        documents={employee.documents}
        safetyTrainings={employee.safetyTrainings}
        leaveRequests={employee.leaveRequests}
        leaveBalance={currentBalance}
        disciplinaryProcedures={employee.disciplinaryProcedures}
        notes={employee.notes}
      />
    </div>
  )
}
