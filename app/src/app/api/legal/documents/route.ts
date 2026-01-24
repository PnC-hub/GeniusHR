import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { LegalDocumentType } from '@prisma/client'

// GET /api/legal/documents - Get all active legal documents
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as LegalDocumentType | null

    const where = {
      isActive: true,
      ...(type && { type }),
    }

    const documents = await prisma.legalDocument.findMany({
      where,
      select: {
        id: true,
        type: true,
        version: true,
        title: true,
        content: true,
        summary: true,
        effectiveAt: true,
      },
      orderBy: {
        type: 'asc',
      },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching legal documents:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero dei documenti legali' },
      { status: 500 }
    )
  }
}
