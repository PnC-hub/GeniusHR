import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Dettaglio correzione
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const correction = await prisma.trainingCorrection.findFirst({
      where: { id, tenantId },
      include: {
        conversation: {
          select: { id: true, title: true, context: true, contextId: true }
        }
      }
    });

    if (!correction) {
      return NextResponse.json({ error: 'Correzione non trovata' }, { status: 404 });
    }

    return NextResponse.json(correction);
  } catch (error) {
    console.error('Error fetching correction:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// PATCH - Aggiorna correzione (conferma/rifiuta)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    const { applied, ruleExtracted, correctedValue } = body;

    const updated = await prisma.trainingCorrection.updateMany({
      where: { id, tenantId },
      data: {
        ...(applied !== undefined && { applied, appliedAt: applied ? new Date() : null }),
        ...(ruleExtracted !== undefined && { ruleExtracted }),
        ...(correctedValue !== undefined && { correctedValue })
      }
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: 'Correzione non trovata' }, { status: 404 });
    }

    const correction = await prisma.trainingCorrection.findUnique({ where: { id } });
    return NextResponse.json(correction);
  } catch (error) {
    console.error('Error updating correction:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
