import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/whistleblowing/stats - Get whistleblowing statistics
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Nessun tenant associato' },
        { status: 403 }
      )
    }

    // Only OWNER and ADMIN can view statistics
    if (!['OWNER', 'ADMIN'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Non hai i permessi per visualizzare le statistiche' },
        { status: 403 }
      )
    }

    // Get all reports for tenant
    const reports = await prisma.whistleblowingReport.findMany({
      where: { tenantId: membership.tenantId },
      select: {
        id: true,
        category: true,
        status: true,
        reporterType: true,
        reportDate: true,
        acknowledgedAt: true,
        investigationStartedAt: true,
        closedAt: true,
      },
    })

    // Calculate statistics
    const total = reports.length
    const byStatus = reports.reduce(
      (acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const byCategory = reports.reduce(
      (acc, report) => {
        acc[report.category] = (acc[report.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const byReporterType = reports.reduce(
      (acc, report) => {
        acc[report.reporterType] = (acc[report.reporterType] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    // Calculate average resolution time (only for closed reports)
    const closedReports = reports.filter((r) => r.closedAt)
    const avgResolutionDays =
      closedReports.length > 0
        ? closedReports.reduce((sum, report) => {
            const days =
              (new Date(report.closedAt!).getTime() - new Date(report.reportDate).getTime()) /
              (1000 * 60 * 60 * 24)
            return sum + days
          }, 0) / closedReports.length
        : 0

    // Calculate compliance metrics
    const needsAttention = reports.filter((r) => {
      if (r.status !== 'RECEIVED') return false
      const daysSince = (Date.now() - new Date(r.reportDate).getTime()) / (1000 * 60 * 60 * 24)
      return daysSince >= 7
    }).length

    const needsFeedback = reports.filter((r) => {
      if (r.status === 'CLOSED') return false
      const daysSince = (Date.now() - new Date(r.reportDate).getTime()) / (1000 * 60 * 60 * 24)
      return daysSince >= 90 // 3 months
    }).length

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyData = reports
      .filter((r) => new Date(r.reportDate) >= sixMonthsAgo)
      .reduce(
        (acc, report) => {
          const month = new Date(report.reportDate).toISOString().slice(0, 7) // YYYY-MM
          acc[month] = (acc[month] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )

    return NextResponse.json({
      total,
      byStatus,
      byCategory,
      byReporterType,
      avgResolutionDays: Math.round(avgResolutionDays),
      needsAttention,
      needsFeedback,
      monthlyData,
      closedCount: closedReports.length,
      openCount: total - closedReports.length,
    })
  } catch (error) {
    console.error('Error fetching whistleblowing statistics:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero statistiche' },
      { status: 500 }
    )
  }
}
