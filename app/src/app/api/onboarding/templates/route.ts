import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/onboarding/templates
 * Lista template onboarding disponibili
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id },
      select: { tenantId: true }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Tenant non trovato' }, { status: 404 })
    }

    const templates = await prisma.onboardingChecklist.findMany({
      where: { tenantId: membership.tenantId },
      include: {
        items: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Errore nel caricamento dei template' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/onboarding/templates
 * Crea nuovo template onboarding
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id },
      select: { tenantId: true, role: true }
    })

    if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 })
    }

    const body = await req.json()
    const { name, description, items, isDefault } = body

    if (!name || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Nome e items richiesti' },
        { status: 400 }
      )
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.onboardingChecklist.updateMany({
        where: {
          tenantId: membership.tenantId,
          isDefault: true
        },
        data: { isDefault: false }
      })
    }

    // Create template with items
    const template = await prisma.onboardingChecklist.create({
      data: {
        tenantId: membership.tenantId,
        name,
        description,
        isDefault: isDefault || false,
        items: {
          create: items.map((item: any, index: number) => ({
            title: item.title,
            description: item.description,
            category: item.category,
            order: index,
            required: item.required !== false
          }))
        }
      },
      include: {
        items: true
      }
    })

    return NextResponse.json({
      success: true,
      template
    })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione del template' },
      { status: 500 }
    )
  }
}
