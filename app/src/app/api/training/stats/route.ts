import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Statistiche complete del sistema di training
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { tenantMembers: true }
    });

    if (!user?.tenantMembers?.[0]?.tenantId) {
      return NextResponse.json({ error: 'Tenant non trovato' }, { status: 404 });
    }

    const tenantId = user.tenantMembers[0].tenantId;

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, all

    // Calcola data inizio periodo
    const now = new Date();
    let startDate: Date | undefined;
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        startDate = undefined;
    }

    const dateFilter = startDate ? { gte: startDate } : undefined;

    // Statistiche conversazioni
    const [
      totalConversations,
      activeConversations,
      resolvedConversations,
      conversationsByModule
    ] = await Promise.all([
      prisma.trainingConversation.count({
        where: { tenantId, ...(dateFilter && { createdAt: dateFilter }) }
      }),
      prisma.trainingConversation.count({
        where: { tenantId, status: 'ACTIVE' }
      }),
      prisma.trainingConversation.count({
        where: { tenantId, status: 'RESOLVED', ...(dateFilter && { createdAt: dateFilter }) }
      }),
      prisma.trainingConversation.groupBy({
        by: ['context'],
        where: { tenantId, ...(dateFilter && { createdAt: dateFilter }) },
        _count: true
      })
    ]);

    // Statistiche messaggi
    const [totalMessages, messagesByRole] = await Promise.all([
      prisma.trainingMessage.count({
        where: {
          conversation: { tenantId },
          ...(dateFilter && { createdAt: dateFilter })
        }
      }),
      prisma.trainingMessage.groupBy({
        by: ['role'],
        where: {
          conversation: { tenantId },
          ...(dateFilter && { createdAt: dateFilter })
        },
        _count: true
      })
    ]);

    // Statistiche correzioni
    const [
      totalCorrections,
      appliedCorrections,
      pendingCorrections,
      correctionsByModule
    ] = await Promise.all([
      prisma.trainingCorrection.count({
        where: { tenantId, ...(dateFilter && { createdAt: dateFilter }) }
      }),
      prisma.trainingCorrection.count({
        where: { tenantId, applied: true, ...(dateFilter && { appliedAt: dateFilter }) }
      }),
      prisma.trainingCorrection.count({
        where: { tenantId, applied: false }
      }),
      prisma.trainingCorrection.groupBy({
        by: ['module'],
        where: { tenantId, ...(dateFilter && { createdAt: dateFilter }) },
        _count: true
      })
    ]);

    // Statistiche regole
    const [
      totalRules,
      activeRules,
      rulesByModule,
      topRules
    ] = await Promise.all([
      prisma.aIRule.count({
        where: { tenantId }
      }),
      prisma.aIRule.count({
        where: { tenantId, isActive: true }
      }),
      prisma.aIRule.groupBy({
        by: ['module'],
        where: { tenantId },
        _count: true
      }),
      prisma.aIRule.findMany({
        where: { tenantId, isActive: true },
        orderBy: { usageCount: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          module: true,
          usageCount: true,
          successCount: true,
          confidence: true
        }
      })
    ]);

    // Calcola metriche aggregate
    const rules = await prisma.aIRule.findMany({
      where: { tenantId },
      select: { confidence: true, usageCount: true, successCount: true }
    });

    const avgConfidence = rules.length > 0
      ? rules.reduce((sum, r) => sum + r.confidence, 0) / rules.length
      : 0;

    const totalUsage = rules.reduce((sum, r) => sum + r.usageCount, 0);
    const totalSuccess = rules.reduce((sum, r) => sum + r.successCount, 0);
    const overallSuccessRate = totalUsage > 0 ? totalSuccess / totalUsage : 0;

    // Trend ultimi 7 giorni (per grafico)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailyStats = await prisma.$queryRaw<Array<{
      date: Date;
      conversations: bigint;
      corrections: bigint;
    }>>`
      SELECT
        DATE("createdAt") as date,
        COUNT(DISTINCT CASE WHEN "id" IS NOT NULL THEN "id" END) as conversations,
        0::bigint as corrections
      FROM "TrainingConversation"
      WHERE "tenantId" = ${tenantId}
        AND "createdAt" >= ${sevenDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `.catch(() => []);

    // Formatta risposta
    return NextResponse.json({
      period,
      conversations: {
        total: totalConversations,
        active: activeConversations,
        resolved: resolvedConversations,
        byModule: Object.fromEntries(
          conversationsByModule.map(c => [c.context, c._count])
        )
      },
      messages: {
        total: totalMessages,
        byRole: Object.fromEntries(
          messagesByRole.map(m => [m.role, m._count])
        ),
        avgPerConversation: totalConversations > 0
          ? Math.round(totalMessages / totalConversations)
          : 0
      },
      corrections: {
        total: totalCorrections,
        applied: appliedCorrections,
        pending: pendingCorrections,
        applicationRate: totalCorrections > 0
          ? Math.round((appliedCorrections / totalCorrections) * 100)
          : 0,
        byModule: Object.fromEntries(
          correctionsByModule.map(c => [c.module, c._count])
        )
      },
      rules: {
        total: totalRules,
        active: activeRules,
        avgConfidence: Math.round(avgConfidence * 100) / 100,
        overallSuccessRate: Math.round(overallSuccessRate * 100),
        totalUsage,
        byModule: Object.fromEntries(
          rulesByModule.map(r => [r.module, r._count])
        ),
        top: topRules.map(r => ({
          ...r,
          successRate: r.usageCount > 0
            ? Math.round((r.successCount / r.usageCount) * 100)
            : 0
        }))
      },
      trend: dailyStats.map(d => ({
        date: d.date,
        conversations: Number(d.conversations),
        corrections: Number(d.corrections)
      })),
      learningScore: calculateLearningScore({
        totalRules,
        activeRules,
        avgConfidence,
        overallSuccessRate,
        appliedCorrections,
        totalCorrections
      })
    });
  } catch (error) {
    console.error('Error fetching training stats:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// Calcola un punteggio di apprendimento complessivo (0-100)
function calculateLearningScore(metrics: {
  totalRules: number;
  activeRules: number;
  avgConfidence: number;
  overallSuccessRate: number;
  appliedCorrections: number;
  totalCorrections: number;
}): number {
  let score = 0;

  // Regole create (max 20 punti)
  score += Math.min(20, metrics.totalRules * 2);

  // Regole attive / totali (max 15 punti)
  if (metrics.totalRules > 0) {
    score += Math.round((metrics.activeRules / metrics.totalRules) * 15);
  }

  // Confidence media (max 25 punti)
  score += Math.round(metrics.avgConfidence * 25);

  // Success rate (max 25 punti)
  score += Math.round(metrics.overallSuccessRate * 25);

  // Correzioni applicate (max 15 punti)
  if (metrics.totalCorrections > 0) {
    score += Math.round((metrics.appliedCorrections / metrics.totalCorrections) * 15);
  }

  return Math.min(100, score);
}
