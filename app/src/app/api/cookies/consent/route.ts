import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { headers } from 'next/headers'

// POST /api/cookies/consent - Save cookie consent
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { visitorId, necessary, analytics, marketing, preferences } = body

    if (!visitorId) {
      return NextResponse.json(
        { error: 'visitorId richiesto' },
        { status: 400 }
      )
    }

    // Get user ID if logged in
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || null

    // Get IP and User Agent
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip')
    const userAgent = headersList.get('user-agent')

    // Upsert cookie consent
    const consent = await prisma.cookieConsent.upsert({
      where: { visitorId },
      update: {
        userId,
        necessary: necessary ?? true,
        analytics: analytics ?? false,
        marketing: marketing ?? false,
        preferences: preferences ?? false,
        ipAddress,
        userAgent,
        updatedAt: new Date(),
      },
      create: {
        visitorId,
        userId,
        necessary: necessary ?? true,
        analytics: analytics ?? false,
        marketing: marketing ?? false,
        preferences: preferences ?? false,
        ipAddress,
        userAgent,
      },
    })

    return NextResponse.json({
      success: true,
      consent: {
        necessary: consent.necessary,
        analytics: consent.analytics,
        marketing: consent.marketing,
        preferences: consent.preferences,
      },
    })
  } catch (error) {
    console.error('Error saving cookie consent:', error)
    return NextResponse.json(
      { error: 'Errore nel salvare le preferenze cookie' },
      { status: 500 }
    )
  }
}

// GET /api/cookies/consent?visitorId=xxx - Get cookie consent
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const visitorId = searchParams.get('visitorId')

    if (!visitorId) {
      return NextResponse.json(
        { error: 'visitorId richiesto' },
        { status: 400 }
      )
    }

    const consent = await prisma.cookieConsent.findUnique({
      where: { visitorId },
      select: {
        necessary: true,
        analytics: true,
        marketing: true,
        preferences: true,
        updatedAt: true,
      },
    })

    if (!consent) {
      return NextResponse.json({ found: false })
    }

    return NextResponse.json({
      found: true,
      consent,
    })
  } catch (error) {
    console.error('Error fetching cookie consent:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero delle preferenze cookie' },
      { status: 500 }
    )
  }
}
