import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/whistleblowing/track/message - Send message from reporter (public endpoint)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { accessCode, content } = body

    if (!accessCode) {
      return NextResponse.json(
        { error: 'Codice di accesso obbligatorio' },
        { status: 400 }
      )
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Contenuto messaggio obbligatorio' },
        { status: 400 }
      )
    }

    // Find report by access code
    const report = await prisma.whistleblowingReport.findUnique({
      where: { accessCode: accessCode.toUpperCase() },
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Segnalazione non trovata. Verifica il codice di accesso.' },
        { status: 404 }
      )
    }

    // Check if report is closed
    if (report.status === 'CLOSED') {
      return NextResponse.json(
        { error: 'La segnalazione è già stata chiusa. Non è possibile inviare nuovi messaggi.' },
        { status: 400 }
      )
    }

    // Create message from reporter
    const message = await prisma.whistleblowingMessage.create({
      data: {
        reportId: report.id,
        senderType: 'reporter',
        content: content.trim(),
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Messaggio inviato con successo',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error sending reporter message:', error)
    return NextResponse.json(
      { error: 'Errore nell\'invio del messaggio' },
      { status: 500 }
    )
  }
}
