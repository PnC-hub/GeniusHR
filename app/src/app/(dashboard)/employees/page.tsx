import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DashboardHeader from '@/components/DashboardHeader'
import EmployeesTable from '@/components/EmployeesTable'

export default async function EmployeesPage() {
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

  const employees = await prisma.employee.findMany({
    where: { tenantId: membership.tenantId },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <DashboardHeader
          title="Dipendenti"
          subtitle="Gestisci il personale del tuo studio"
          tooltipTitle="Anagrafica Dipendenti"
          tooltipDescription="Da qui puoi visualizzare, aggiungere e modificare tutti i dipendenti della tua azienda. Ogni scheda contiene dati anagrafici, contrattuali e documentali."
          tooltipTips={[
            'Usa i filtri per trovare rapidamente un dipendente',
            'Clicca su Dettagli per vedere la scheda completa',
            'Esporta l\'elenco in Excel dal menu azioni'
          ]}
        />
        <Link
          href="/employees/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>+</span>
          <span>Nuovo Dipendente</span>
        </Link>
      </div>

      <EmployeesTable employees={employees} />
    </div>
  )
}
