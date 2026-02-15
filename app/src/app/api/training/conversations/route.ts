import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Lista conversazioni di training
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
    const status = searchParams.get('status');
    const context = searchParams.get('context');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = { tenantId };
    if (status) where.status = status;
    if (context) where.context = context;

    const [conversations, total] = await Promise.all([
      prisma.trainingConversation.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
          _count: { select: { messages: true, corrections: true } }
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.trainingConversation.count({ where })
    ]);

    return NextResponse.json({ conversations, total, limit, offset });
  } catch (error) {
    console.error('Error fetching training conversations:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// POST - Crea nuova conversazione
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
    const { context, contextId, contextData, title, initialMessage } = body;

    if (!context) {
      return NextResponse.json({ error: 'Contesto richiesto' }, { status: 400 });
    }

    // Crea conversazione con messaggio iniziale opzionale
    const conversation = await prisma.trainingConversation.create({
      data: {
        tenantId,
        userId: user.id,
        context,
        contextId,
        contextData,
        title: title || `Training ${context} - ${new Date().toLocaleDateString('it-IT')}`,
        messages: initialMessage ? {
          create: {
            role: 'USER',
            content: initialMessage
          }
        } : undefined
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        messages: true
      }
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Error creating training conversation:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
