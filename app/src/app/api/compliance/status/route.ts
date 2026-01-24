import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/compliance/status - Get compliance status for tenant
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    // Get user's tenant membership
    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id },
      include: { tenant: true },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Nessun tenant associato' },
        { status: 403 }
      )
    }

    const tenantId = membership.tenantId

    // Get compliance metrics
    const [
      totalEmployees,
      employeesWithGdprConsent,
      overdueDeadlines,
      upcomingDeadlines,
      recentAuditLogs,
      documentsExpiringSoon,
    ] = await Promise.all([
      // Total employees
      prisma.employee.count({
        where: { tenantId, status: { not: 'TERMINATED' } },
      }),

      // Employees with GDPR consent
      prisma.gdprConsent.groupBy({
        by: ['employeeId'],
        where: {
          tenantId,
          consentType: 'DATA_PROCESSING',
          granted: true,
        },
      }),

      // Overdue deadlines
      prisma.deadline.count({
        where: {
          tenantId,
          status: 'OVERDUE',
        },
      }),

      // Upcoming deadlines (next 30 days)
      prisma.deadline.count({
        where: {
          tenantId,
          status: { in: ['PENDING', 'UPCOMING'] },
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Recent audit logs (last 7 days)
      prisma.auditLog.count({
        where: {
          tenantId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Documents expiring in next 30 days
      prisma.document.count({
        where: {
          tenantId,
          expiresAt: {
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ])

    // Calculate compliance score (0-100)
    const gdprConsentRate =
      totalEmployees > 0
        ? (employeesWithGdprConsent.length / totalEmployees) * 100
        : 100

    const overdueImpact = overdueDeadlines * 5 // Each overdue deadline reduces score by 5
    const expiringDocsImpact = documentsExpiringSoon * 2 // Each expiring doc reduces score by 2

    const complianceScore = Math.max(
      0,
      Math.min(100, Math.round(gdprConsentRate - overdueImpact - expiringDocsImpact))
    )

    // Compliance checklist items
    const checklist = [
      {
        id: 'gdpr_consent',
        title: 'Consensi GDPR dipendenti',
        description: 'Tutti i dipendenti hanno firmato il consenso al trattamento dati',
        completed: employeesWithGdprConsent.length >= totalEmployees,
        count: employeesWithGdprConsent.length,
        total: totalEmployees,
        priority: 'high',
      },
      {
        id: 'no_overdue',
        title: 'Nessuna scadenza in ritardo',
        description: 'Tutte le scadenze sono state gestite in tempo',
        completed: overdueDeadlines === 0,
        count: overdueDeadlines,
        priority: 'high',
      },
      {
        id: 'documents_valid',
        title: 'Documenti in corso di validità',
        description: 'Nessun documento in scadenza nei prossimi 30 giorni',
        completed: documentsExpiringSoon === 0,
        count: documentsExpiringSoon,
        priority: 'medium',
      },
      {
        id: 'audit_active',
        title: 'Audit log attivo',
        description: 'Sistema di tracciamento operazioni funzionante',
        completed: recentAuditLogs > 0 || totalEmployees === 0,
        count: recentAuditLogs,
        priority: 'low',
      },
    ]

    // Status level
    let statusLevel: 'excellent' | 'good' | 'warning' | 'critical'
    if (complianceScore >= 90) statusLevel = 'excellent'
    else if (complianceScore >= 70) statusLevel = 'good'
    else if (complianceScore >= 50) statusLevel = 'warning'
    else statusLevel = 'critical'

    return NextResponse.json({
      score: complianceScore,
      statusLevel,
      metrics: {
        totalEmployees,
        employeesWithGdprConsent: employeesWithGdprConsent.length,
        gdprConsentRate: Math.round(gdprConsentRate),
        overdueDeadlines,
        upcomingDeadlines,
        documentsExpiringSoon,
        recentAuditLogs,
      },
      checklist,
    })
  } catch (error) {
    console.error('Error fetching compliance status:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero dello stato compliance' },
      { status: 500 }
    )
  }
}
