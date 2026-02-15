import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Dettaglio conversazione
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

    const conversation = await prisma.trainingConversation.findFirst({
      where: { id, tenantId },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        messages: { orderBy: { createdAt: 'asc' } },
        corrections: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversazione non trovata' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// PATCH - Aggiorna conversazione (status, title, summary)
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
    const { status, title, summary } = body;

    const conversation = await prisma.trainingConversation.updateMany({
      where: { id, tenantId },
      data: {
        ...(status && { status }),
        ...(title && { title }),
        ...(summary && { summary })
      }
    });

    if (conversation.count === 0) {
      return NextResponse.json({ error: 'Conversazione non trovata' }, { status: 404 });
    }

    const updated = await prisma.trainingConversation.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        messages: { orderBy: { createdAt: 'asc' } }
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// DELETE - Archivia conversazione
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

    await prisma.trainingConversation.updateMany({
      where: { id, tenantId },
      data: { status: 'ARCHIVED' }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error archiving conversation:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
