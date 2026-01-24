import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isWhiteLabelEnabled } from '@/lib/whitelabel'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id },
      include: { tenant: true }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Nessun tenant associato' }, { status: 404 })
    }

    const tenant = membership.tenant

    return NextResponse.json({
      settings: {
        name: tenant.name,
        logo: tenant.logo,
        primaryColor: tenant.primaryColor,
        secondaryColor: tenant.secondaryColor,
        customDomain: tenant.customDomain
      },
      isPremium: isWhiteLabelEnabled(tenant.plan)
    })
  } catch (error) {
    console.error('Error fetching branding settings:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id },
      include: { tenant: true }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Nessun tenant associato' }, { status: 404 })
    }

    // Check if user has permission to edit
    if (!['OWNER', 'ADMIN'].includes(membership.role)) {
      return NextResponse.json({ error: 'Permessi insufficienti' }, { status: 403 })
    }

    const body = await req.json()
    const { name, logo, primaryColor, secondaryColor, customDomain } = body

    // Validate colors
    const colorRegex = /^#[0-9A-Fa-f]{6}$/
    if (primaryColor && !colorRegex.test(primaryColor)) {
      return NextResponse.json({ error: 'Colore primario non valido' }, { status: 400 })
    }
    if (secondaryColor && !colorRegex.test(secondaryColor)) {
      return NextResponse.json({ error: 'Colore secondario non valido' }, { status: 400 })
    }

    // Custom domain only for premium
    const isPremium = isWhiteLabelEnabled(membership.tenant.plan)
    if (customDomain && !isPremium) {
      return NextResponse.json({
        error: 'Dominio personalizzato disponibile solo con piano Partner'
      }, { status: 403 })
    }

    // Check if custom domain is already in use
    if (customDomain) {
      const existing = await prisma.tenant.findFirst({
        where: {
          customDomain,
          id: { not: membership.tenantId }
        }
      })

      if (existing) {
        return NextResponse.json({ error: 'Dominio gia in uso' }, { status: 400 })
      }
    }

    await prisma.tenant.update({
      where: { id: membership.tenantId },
      data: {
        name: name || undefined,
        logo: logo || null,
        primaryColor: primaryColor || undefined,
        secondaryColor: secondaryColor || undefined,
        customDomain: isPremium ? (customDomain || null) : undefined
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating branding settings:', error)
    return NextResponse.json({ error: 'Errore durante il salvataggio' }, { status: 500 })
  }
}
