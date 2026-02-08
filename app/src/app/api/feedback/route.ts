import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/feedback - Create new feedback
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const body = await req.json();
    const {
      type,
      title,
      description,
      page,
      priority,
      userEmail,
      userName,
      timestamp,
      userAgent,
    } = body;

    // Validate required fields
    if (!title || !description || !type) {
      return NextResponse.json(
        { error: 'Titolo, descrizione e tipo sono obbligatori' },
        { status: 400 }
      );
    }

    // Get tenant ID from user if authenticated
    let tenantId: string | null = null;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { employee: true },
      });
      tenantId = user?.tenantId || user?.employee?.tenantId || null;
    }

    // Create feedback record in database
    const feedback = await prisma.feedback.create({
      data: {
        type,
        title,
        description,
        page: page || '/unknown',
        priority: priority || 'medium',
        status: 'open',
        userEmail: userEmail || session?.user?.email || 'anonymous',
        userName: userName || session?.user?.name || 'Anonimo',
        userAgent: userAgent || null,
        tenantId,
        createdAt: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    // Optional: Send email notification to support team
    // This could be implemented with nodemailer or similar
    // await sendFeedbackNotification(feedback);

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback ricevuto con successo',
        feedbackId: feedback.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: 'Errore durante la creazione del feedback' },
      { status: 500 }
    );
  }
}

// GET /api/feedback - Get all feedback (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }

    // Only admins can view all feedback
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { employee: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accesso negato' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (user.tenantId) where.tenantId = user.tenantId;

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.feedback.count({ where }),
    ]);

    return NextResponse.json({
      feedbacks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero dei feedback' },
      { status: 500 }
    );
  }
}
