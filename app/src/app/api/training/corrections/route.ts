import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Lista correzioni
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
    const applied = searchParams.get('applied');

    const where: any = { tenantId };
    if (module) where.module = module;
    if (applied !== null) where.applied = applied === 'true';

    const corrections = await prisma.trainingCorrection.findMany({
      where,
      include: {
        conversation: {
          select: { id: true, title: true, context: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ corrections });
  } catch (error) {
    console.error('Error fetching corrections:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// POST - Applica correzione
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
    const { correctionId, createRule } = body;

    const correction = await prisma.trainingCorrection.findFirst({
      where: { id: correctionId, tenantId }
    });

    if (!correction) {
      return NextResponse.json({ error: 'Correzione non trovata' }, { status: 404 });
    }

    // Marca come applicata
    await prisma.trainingCorrection.update({
      where: { id: correctionId },
      data: { applied: true, appliedAt: new Date() }
    });

    // Se richiesto, crea regola dalla correzione
    let rule = null;
    if (createRule && correction.ruleExtracted) {
      rule = await prisma.aIRule.create({
        data: {
          tenantId,
          module: correction.module,
          name: `Regola da correzione ${correction.fieldPath || correction.module}`,
          condition: correction.ruleExtracted,
          action: `Imposta ${correction.fieldPath || 'valore'} = ${JSON.stringify(correction.correctedValue)}`,
          confidence: 0.75,
          createdBy: user.id,
          sourceConversationId: correction.conversationId
        }
      });
    }

    return NextResponse.json({ success: true, rule });
  } catch (error) {
    console.error('Error applying correction:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
