import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { processTrainingMessage } from '@/lib/openai-training';

// POST - Invia messaggio e ottieni risposta AI
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
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

    // Verifica conversazione
    const conversation = await prisma.trainingConversation.findFirst({
      where: { id: conversationId, tenantId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } }
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversazione non trovata' }, { status: 404 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Messaggio vuoto' }, { status: 400 });
    }

    // Salva messaggio utente
    const userMessage = await prisma.trainingMessage.create({
      data: {
        conversationId,
        role: 'USER',
        content: content.trim()
      }
    });

    // Processa con OpenAI
    const aiResponse = await processTrainingMessage({
      tenantId,
      conversationId,
      context: conversation.context,
      contextId: conversation.contextId || undefined,
      contextData: conversation.contextData as Record<string, any> | undefined,
      messages: [...conversation.messages, userMessage].map(m => ({
        role: m.role.toLowerCase() as 'user' | 'assistant' | 'system',
        content: m.content
      })),
      userMessage: content.trim()
    });

    // Salva risposta AI
    const assistantMessage = await prisma.trainingMessage.create({
      data: {
        conversationId,
        role: 'ASSISTANT',
        content: aiResponse.content,
        functionCall: aiResponse.functionCall || undefined,
        functionResult: aiResponse.functionResult || undefined,
        tokens: aiResponse.tokens
      }
    });

    // Se AI ha estratto una correzione, salvala
    if (aiResponse.correction) {
      await prisma.trainingCorrection.create({
        data: {
          conversationId,
          tenantId,
          module: conversation.context,
          entityType: aiResponse.correction.entityType,
          entityId: aiResponse.correction.entityId,
          originalValue: aiResponse.correction.originalValue,
          correctedValue: aiResponse.correction.correctedValue,
          fieldPath: aiResponse.correction.fieldPath,
          ruleExtracted: aiResponse.correction.ruleExtracted
        }
      });
    }

    // Se AI ha creato una regola, salvala
    if (aiResponse.rule) {
      await prisma.aIRule.create({
        data: {
          tenantId,
          module: conversation.context,
          name: aiResponse.rule.name,
          condition: aiResponse.rule.condition,
          conditionJson: aiResponse.rule.conditionJson,
          action: aiResponse.rule.action,
          actionJson: aiResponse.rule.actionJson,
          priority: aiResponse.rule.priority || 0,
          confidence: 0.7,
          createdBy: user.id,
          sourceConversationId: conversationId
        }
      });
    }

    // Aggiorna timestamp conversazione
    await prisma.trainingConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({
      userMessage,
      assistantMessage,
      correction: aiResponse.correction || null,
      rule: aiResponse.rule || null
    });
  } catch (error) {
    console.error('Error processing training message:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
