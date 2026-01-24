import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function TenantDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: {
      members: {
        include: { user: true }
      },
      employees: {
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      _count: {
        select: {
          employees: true,
          documents: true,
          deadlines: true,
          performanceReviews: true
        }
      }
    }
  })

  if (!tenant) {
    notFound()
  }

  const planPrices: Record<string, number> = {
    STARTER: 29,
    PROFESSIONAL: 59,
    ENTERPRISE: 99,
    PARTNER: 199
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/admin" className="text-blue-600 hover:underline text-sm">
          ← Torna alla lista
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{tenant.name}</h1>
          <p className="text-gray-600 mt-1">
            {tenant.slug}.geniushr.it
            {tenant.customDomain && ` • ${tenant.customDomain}`}
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href={`https://${tenant.slug}.geniushr.it`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apri Portale ↗
          </a>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500 text-sm">Piano</p>
          <p className="text-2xl font-bold text-gray-900">{tenant.plan}</p>
          <p className="text-sm text-gray-400">€{planPrices[tenant.plan]}/mese</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500 text-sm">Status</p>
          <p className={`text-2xl font-bold ${
            tenant.subscriptionStatus === 'ACTIVE' ? 'text-green-600' :
            tenant.subscriptionStatus === 'TRIAL' ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {tenant.subscriptionStatus}
          </p>
          {tenant.trialEndsAt && tenant.subscriptionStatus === 'TRIAL' && (
            <p className="text-sm text-gray-400">
              Scade: {new Date(tenant.trialEndsAt).toLocaleDateString('it-IT')}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500 text-sm">Dipendenti</p>
          <p className="text-2xl font-bold text-gray-900">{tenant._count.employees}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500 text-sm">Registrato</p>
          <p className="text-2xl font-bold text-gray-900">
            {new Date(tenant.createdAt).toLocaleDateString('it-IT')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Utenti</h2>
          <div className="space-y-3">
            {tenant.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {member.user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{member.user.name}</p>
                    <p className="text-sm text-gray-500">{member.user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  member.role === 'OWNER' ? 'bg-purple-100 text-purple-800' :
                  member.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Utilizzo</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Documenti</span>
              <span className="font-semibold">{tenant._count.documents}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Scadenze</span>
              <span className="font-semibold">{tenant._count.deadlines}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Valutazioni</span>
              <span className="font-semibold">{tenant._count.performanceReviews}</span>
            </div>
          </div>
        </div>

        {/* Customization */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Personalizzazione</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Colore Primario</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border"
                  style={{ backgroundColor: tenant.primaryColor }}
                />
                <span className="font-mono text-sm">{tenant.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Colore Secondario</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border"
                  style={{ backgroundColor: tenant.secondaryColor }}
                />
                <span className="font-mono text-sm">{tenant.secondaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Logo</label>
              <p className="text-sm">{tenant.logo || 'Non configurato'}</p>
            </div>
          </div>
        </div>

        {/* Recent Employees */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Ultimi Dipendenti</h2>
          {tenant.employees.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nessun dipendente</p>
          ) : (
            <div className="space-y-2">
              {tenant.employees.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span>{emp.firstName} {emp.lastName}</span>
                  <span className="text-sm text-gray-400">{emp.jobTitle}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-red-800 mb-4">Zona Pericolosa</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-red-800">Elimina questo tenant</p>
            <p className="text-sm text-red-600">Questa azione e irreversibile</p>
          </div>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Elimina Tenant
          </button>
        </div>
      </div>
    </div>
  )
}
