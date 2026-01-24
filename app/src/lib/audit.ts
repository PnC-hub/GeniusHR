import { prisma } from './prisma'
import { AuditAction, Prisma } from '@prisma/client'
import { headers } from 'next/headers'

interface LogAuditParams {
  tenantId: string
  userId?: string | null
  action: AuditAction
  entityType: string
  entityId: string
  details?: Prisma.InputJsonValue
  oldValue?: Prisma.InputJsonValue
  newValue?: Prisma.InputJsonValue
}

/**
 * Log an audit event for GDPR compliance (Art. 32)
 * Call this function after any data modification
 */
export async function logAudit({
  tenantId,
  userId,
  action,
  entityType,
  entityId,
  details,
  oldValue,
  newValue,
}: LogAuditParams): Promise<void> {
  try {
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null
    const userAgent = headersList.get('user-agent') || null

    await prisma.auditLog.create({
      data: {
        tenantId,
        userId: userId || null,
        action,
        entityType,
        entityId,
        details: details || undefined,
        oldValue: oldValue || undefined,
        newValue: newValue || undefined,
        ipAddress,
        userAgent,
      },
    })
  } catch (error) {
    // Don't throw - audit logging should never break the main flow
    console.error('Failed to log audit event:', error)
  }
}

/**
 * Get audit logs for a tenant with pagination and filters
 */
export async function getAuditLogs({
  tenantId,
  entityType,
  entityId,
  userId,
  action,
  startDate,
  endDate,
  page = 1,
  limit = 50,
}: {
  tenantId: string
  entityType?: string
  entityId?: string
  userId?: string
  action?: AuditAction
  startDate?: Date
  endDate?: Date
  page?: number
  limit?: number
}) {
  const where = {
    tenantId,
    ...(entityType && { entityType }),
    ...(entityId && { entityId }),
    ...(userId && { userId }),
    ...(action && { action }),
    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate }),
          },
        }
      : {}),
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ])

  return {
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

/**
 * Format audit action for display
 */
export function formatAuditAction(action: AuditAction): string {
  const labels: Record<AuditAction, string> = {
    CREATE: 'Creazione',
    READ: 'Lettura',
    UPDATE: 'Modifica',
    DELETE: 'Eliminazione',
    EXPORT: 'Esportazione',
    LOGIN: 'Accesso',
    LOGOUT: 'Disconnessione',
    CONSENT_GRANTED: 'Consenso concesso',
    CONSENT_REVOKED: 'Consenso revocato',
    DOCUMENT_SIGNED: 'Documento firmato',
  }
  return labels[action] || action
}

/**
 * Format entity type for display
 */
export function formatEntityType(entityType: string): string {
  const labels: Record<string, string> = {
    Employee: 'Dipendente',
    Document: 'Documento',
    Deadline: 'Scadenza',
    GdprConsent: 'Consenso GDPR',
    PerformanceReview: 'Valutazione',
    User: 'Utente',
    Tenant: 'Studio',
  }
  return labels[entityType] || entityType
}
