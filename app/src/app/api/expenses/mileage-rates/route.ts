import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || new Date().getFullYear().toString()

    const rates = await prisma.mileageRate.findMany({
      where: {
        year: parseInt(year),
        isActive: true,
      },
      orderBy: [{ vehicleType: 'asc' }, { engineCc: 'asc' }],
    })

    return NextResponse.json(rates)
  } catch (error) {
    console.error('Error fetching mileage rates:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    // Only admin can create mileage rates
    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Permessi insufficienti' }, { status: 403 })
    }

    const body = await request.json()
    const { vehicleType, year, ratePerKm, source, fuelType, engineCc, validFrom, validTo } =
      body

    if (!vehicleType || !year || !ratePerKm || !validFrom) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti' },
        { status: 400 }
      )
    }

    const rate = await prisma.mileageRate.create({
      data: {
        vehicleType,
        year: parseInt(year),
        ratePerKm: parseFloat(ratePerKm),
        source: source || 'Tabelle ACI',
        fuelType,
        engineCc,
        validFrom: new Date(validFrom),
        validTo: validTo ? new Date(validTo) : null,
        isActive: true,
      },
    })

    return NextResponse.json(rate, { status: 201 })
  } catch (error) {
    console.error('Error creating mileage rate:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
