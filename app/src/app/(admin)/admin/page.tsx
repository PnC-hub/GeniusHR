import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  // Get all tenants with stats
  const tenants = await prisma.tenant.findMany({
    include: {
      _count: {
        select: {
          employees: true,
          members: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Calculate stats
  const totalTenants = tenants.length
  const activeTenants = tenants.filter(t => t.subscriptionStatus === 'ACTIVE').length
  const trialTenants = tenants.filter(t => t.subscriptionStatus === 'TRIAL').length
  const totalEmployees = tenants.reduce((sum, t) => sum + t._count.employees, 0)

  // Revenue calculation (monthly)
  const planPrices: Record<string, number> = {
    STARTER: 29,
    PROFESSIONAL: 59,
    ENTERPRISE: 99,
    PARTNER: 199
  }
  const mrr = tenants
    .filter(t => t.subscriptionStatus === 'ACTIVE')
    .reduce((sum, t) => sum + (planPrices[t.plan] || 0), 0)

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Gestione piattaforma GeniusHR</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <p className="text-green-100 text-sm">MRR</p>
          <p className="text-3xl font-bold">€{mrr}</p>
          <p className="text-green-200 text-xs mt-1">+{activeTenants} abbonati</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500 text-sm">Totale Clienti</p>
          <p className="text-3xl font-bold text-gray-900">{totalTenants}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500 text-sm">Abbonati Attivi</p>
          <p className="text-3xl font-bold text-blue-600">{activeTenants}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500 text-sm">In Prova</p>
          <p className="text-3xl font-bold text-yellow-600">{trialTenants}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500 text-sm">Tot. Dipendenti</p>
          <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tutti i Clienti</h2>
            <input
              type="search"
              placeholder="Cerca cliente..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Studio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Piano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dipendenti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{tenant.name}</div>
                      <div className="text-sm text-gray-500">{tenant.slug}.geniushr.it</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      tenant.plan === 'PARTNER' ? 'bg-purple-100 text-purple-800' :
                      tenant.plan === 'ENTERPRISE' ? 'bg-blue-100 text-blue-800' :
                      tenant.plan === 'PROFESSIONAL' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      tenant.subscriptionStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      tenant.subscriptionStatus === 'TRIAL' ? 'bg-yellow-100 text-yellow-800' :
                      tenant.subscriptionStatus === 'PAST_DUE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tenant.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant._count.employees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tenant.createdAt).toLocaleDateString('it-IT')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a
                      href={`/admin/tenants/${tenant.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Dettagli
                    </a>
                    <a
                      href={`https://${tenant.slug}.geniushr.it`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Apri ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tenants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nessun cliente registrato</p>
          </div>
        )}
      </div>
    </div>
  )
}
