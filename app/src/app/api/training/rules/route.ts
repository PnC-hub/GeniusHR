import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Lista regole AI
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
    const module = searchParams.get('module');
    const isActive = searchParams.get('isActive');

    const where: any = { tenantId };
    if (module) where.module = module;
    if (isActive !== null) where.isActive = isActive === 'true';

    const rules = await prisma.aIRule.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { usageCount: 'desc' }]
    });

    // Calcola statistiche
    const stats = {
      total: rules.length,
      active: rules.filter(r => r.isActive).length,
      byModule: rules.reduce((acc, r) => {
        acc[r.module] = (acc[r.module] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      avgConfidence: rules.length > 0
        ? rules.reduce((sum, r) => sum + r.confidence, 0) / rules.length
        : 0,
      totalUsage: rules.reduce((sum, r) => sum + r.usageCount, 0),
      successRate: rules.reduce((sum, r) => sum + r.successCount, 0) /
        Math.max(1, rules.reduce((sum, r) => sum + r.usageCount, 0))
    };

    return NextResponse.json({ rules, stats });
  } catch (error) {
    console.error('Error fetching AI rules:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// POST - Crea nuova regola manuale
export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const { module, name, condition, action, priority, conditionJson, actionJson } = body;

    if (!module || !name || !condition || !action) {
      return NextResponse.json({
        error: 'Campi richiesti: module, name, condition, action'
      }, { status: 400 });
    }

    const rule = await prisma.aIRule.create({
      data: {
        tenantId,
        module,
        name,
        condition,
        conditionJson,
        action,
        actionJson,
        priority: priority || 0,
        confidence: 0.8, // Regole manuali hanno alta confidence
        createdBy: user.id
      }
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error('Error creating AI rule:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
