import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Dettaglio regola
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

    const rule = await prisma.aIRule.findFirst({
      where: { id, tenantId }
    });

    if (!rule) {
      return NextResponse.json({ error: 'Regola non trovata' }, { status: 404 });
    }

    // Recupera ultime applicazioni della regola
    const applications = await prisma.aIRuleApplication.findMany({
      where: { ruleId: id },
      orderBy: { appliedAt: 'desc' },
      take: 10
    });

    return NextResponse.json({ rule, applications });
  } catch (error) {
    console.error('Error fetching AI rule:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// PATCH - Aggiorna regola
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
    const { name, condition, action, priority, isActive, conditionJson, actionJson } = body;

    const updated = await prisma.aIRule.updateMany({
      where: { id, tenantId },
      data: {
        ...(name !== undefined && { name }),
        ...(condition !== undefined && { condition }),
        ...(action !== undefined && { action }),
        ...(priority !== undefined && { priority }),
        ...(isActive !== undefined && { isActive }),
        ...(conditionJson !== undefined && { conditionJson }),
        ...(actionJson !== undefined && { actionJson })
      }
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: 'Regola non trovata' }, { status: 404 });
    }

    const rule = await prisma.aIRule.findUnique({ where: { id } });
    return NextResponse.json(rule);
  } catch (error) {
    console.error('Error updating AI rule:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// DELETE - Elimina regola
export async function DELETE(
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

    const deleted = await prisma.aIRule.deleteMany({
      where: { id, tenantId }
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Regola non trovata' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting AI rule:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
