import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

// POST /api/legal/accept - Accept a legal document
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const body = await request.json()
    const { documentId, documentType } = body

    // Get document by ID or by type (active version)
    let document
    if (documentId) {
      document = await prisma.legalDocument.findUnique({
        where: { id: documentId },
      })
    } else if (documentType) {
      document = await prisma.legalDocument.findFirst({
        where: {
          type: documentType,
          isActive: true,
        },
      })
    }

    if (!document) {
      return NextResponse.json(
        { error: 'Documento legale non trovato' },
        { status: 404 }
      )
    }

    // Get IP and User Agent
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip')
    const userAgent = headersList.get('user-agent')

    // Create or update acceptance
    const acceptance = await prisma.legalAcceptance.upsert({
      where: {
        userId_legalDocumentId: {
          userId: session.user.id,
          legalDocumentId: document.id,
        },
      },
      update: {
        acceptedAt: new Date(),
        ipAddress,
        userAgent,
      },
      create: {
        userId: session.user.id,
        legalDocumentId: document.id,
        ipAddress,
        userAgent,
      },
    })

    return NextResponse.json({
      success: true,
      acceptance: {
        id: acceptance.id,
        documentType: document.type,
        documentVersion: document.version,
        acceptedAt: acceptance.acceptedAt,
      },
    })
  } catch (error) {
    console.error('Error accepting legal document:', error)
    return NextResponse.json(
      { error: 'Errore nel salvare l\'accettazione' },
      { status: 500 }
    )
  }
}

// GET /api/legal/accept - Get user's acceptances
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const acceptances = await prisma.legalAcceptance.findMany({
      where: { userId: session.user.id },
      include: {
        legalDocument: {
          select: {
            type: true,
            version: true,
            title: true,
            effectiveAt: true,
          },
        },
      },
      orderBy: {
        acceptedAt: 'desc',
      },
    })

    // Check which required documents are missing
    const requiredTypes = ['PRIVACY_POLICY', 'TERMS_OF_SERVICE'] as const
    const activeDocuments = await prisma.legalDocument.findMany({
      where: {
        type: { in: [...requiredTypes] },
        isActive: true,
      },
    })

    const acceptedDocIds = new Set(acceptances.map((a) => a.legalDocumentId))
    const missingDocuments = activeDocuments.filter(
      (doc) => !acceptedDocIds.has(doc.id)
    )

    return NextResponse.json({
      acceptances,
      allAccepted: missingDocuments.length === 0,
      missingDocuments: missingDocuments.map((d) => ({
        id: d.id,
        type: d.type,
        title: d.title,
      })),
    })
  } catch (error) {
    console.error('Error fetching acceptances:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero delle accettazioni' },
      { status: 500 }
    )
  }
}
