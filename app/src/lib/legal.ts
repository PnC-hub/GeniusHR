import { prisma } from './prisma'
import { LegalDocumentType } from '@prisma/client'

/**
 * Get the currently active legal document of a specific type
 */
export async function getActiveLegalDocument(type: LegalDocumentType) {
  return prisma.legalDocument.findFirst({
    where: {
      type,
      isActive: true,
    },
    orderBy: {
      effectiveAt: 'desc',
    },
  })
}

/**
 * Get all active legal documents
 */
export async function getAllActiveLegalDocuments() {
  return prisma.legalDocument.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      type: 'asc',
    },
  })
}

/**
 * Check if a user has accepted a specific legal document
 */
export async function hasAcceptedDocument(userId: string, documentId: string): Promise<boolean> {
  const acceptance = await prisma.legalAcceptance.findUnique({
    where: {
      userId_legalDocumentId: {
        userId,
        legalDocumentId: documentId,
      },
    },
  })
  return !!acceptance
}

/**
 * Check if a user has accepted all required legal documents (Privacy + ToS)
 */
export async function hasAcceptedAllRequired(userId: string): Promise<{
  accepted: boolean
  missing: LegalDocumentType[]
}> {
  const requiredTypes: LegalDocumentType[] = ['PRIVACY_POLICY', 'TERMS_OF_SERVICE']

  const activeDocuments = await prisma.legalDocument.findMany({
    where: {
      type: { in: requiredTypes },
      isActive: true,
    },
  })

  const acceptances = await prisma.legalAcceptance.findMany({
    where: {
      userId,
      legalDocumentId: { in: activeDocuments.map((d) => d.id) },
    },
  })

  const acceptedDocIds = new Set(acceptances.map((a) => a.legalDocumentId))
  const missing: LegalDocumentType[] = []

  for (const doc of activeDocuments) {
    if (!acceptedDocIds.has(doc.id)) {
      missing.push(doc.type)
    }
  }

  return {
    accepted: missing.length === 0,
    missing,
  }
}

/**
 * Record user acceptance of a legal document
 */
export async function recordAcceptance({
  userId,
  documentId,
  ipAddress,
  userAgent,
}: {
  userId: string
  documentId: string
  ipAddress?: string | null
  userAgent?: string | null
}) {
  return prisma.legalAcceptance.upsert({
    where: {
      userId_legalDocumentId: {
        userId,
        legalDocumentId: documentId,
      },
    },
    update: {
      acceptedAt: new Date(),
      ipAddress,
      userAgent,
    },
    create: {
      userId,
      legalDocumentId: documentId,
      ipAddress,
      userAgent,
    },
  })
}

/**
 * Get user's acceptance history
 */
export async function getUserAcceptances(userId: string) {
  return prisma.legalAcceptance.findMany({
    where: { userId },
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
}

/**
 * Format legal document type for display
 */
export function formatLegalDocumentType(type: LegalDocumentType): string {
  const labels: Record<LegalDocumentType, string> = {
    PRIVACY_POLICY: 'Privacy Policy',
    TERMS_OF_SERVICE: 'Termini di Servizio',
    DPA: 'Accordo Trattamento Dati',
    COOKIE_POLICY: 'Cookie Policy',
  }
  return labels[type] || type
}

/**
 * Get URL path for a legal document type
 */
export function getLegalDocumentPath(type: LegalDocumentType): string {
  const paths: Record<LegalDocumentType, string> = {
    PRIVACY_POLICY: '/privacy',
    TERMS_OF_SERVICE: '/terms',
    DPA: '/dpa',
    COOKIE_POLICY: '/cookies',
  }
  return paths[type] || '/'
}
