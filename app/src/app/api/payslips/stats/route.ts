import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') // YYYY-MM

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user?.tenantId) {
      return NextResponse.json({ error: 'Tenant non trovato' }, { status: 404 })
    }

    const where: any = {
      tenantId: user.tenantId,
    }

    if (period) {
      where.period = period
    }

    // Get stats
    const [
      total,
      viewed,
      downloaded,
      notViewed,
      totalGross,
      totalNet,
      recentUploads,
    ] = await Promise.all([
      prisma.payslip.count({ where }),
      prisma.payslip.count({ where: { ...where, viewedAt: { not: null } } }),
      prisma.payslip.count({ where: { ...where, downloadedAt: { not: null } } }),
      prisma.payslip.count({ where: { ...where, viewedAt: null } }),
      prisma.payslip.aggregate({
        where,
        _sum: { grossAmount: true },
      }),
      prisma.payslip.aggregate({
        where,
        _sum: { netAmount: true },
      }),
      prisma.payslip.findMany({
        where: { tenantId: user.tenantId },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { uploadedAt: 'desc' },
        take: 10,
      }),
    ])

    const viewedPercentage = total > 0 ? Math.round((viewed / total) * 100) : 0
    const downloadedPercentage = total > 0 ? Math.round((downloaded / total) * 100) : 0

    return NextResponse.json({
      total,
      viewed,
      downloaded,
      notViewed,
      viewedPercentage,
      downloadedPercentage,
      totalGross: totalGross._sum.grossAmount || 0,
      totalNet: totalNet._sum.netAmount || 0,
      recentUploads: recentUploads.map(p => ({
        id: p.id,
        employee: `${p.employee.firstName} ${p.employee.lastName}`,
        period: p.period,
        uploadedAt: p.uploadedAt,
        viewed: !!p.viewedAt,
        downloaded: !!p.downloadedAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching payslip stats:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
