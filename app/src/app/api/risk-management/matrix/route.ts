import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock risks for matrix calculation
const mockRisks = [
  { id: '1', probability: 2, impact: 5, status: 'open' },
  { id: '2', probability: 3, impact: 4, status: 'mitigating' },
  { id: '3', probability: 2, impact: 4, status: 'mitigating' },
  { id: '4', probability: 3, impact: 3, status: 'open' },
  { id: '5', probability: 2, impact: 3, status: 'accepted' },
  { id: '6', probability: 3, impact: 4, status: 'open' },
  { id: '7', probability: 2, impact: 5, status: 'mitigating' },
  { id: '8', probability: 3, impact: 3, status: 'open' },
  { id: '9', probability: 2, impact: 2, status: 'closed' },
  { id: '10', probability: 2, impact: 3, status: 'open' },
]

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  // Build 5x5 matrix (probability x impact)
  const matrix: number[][] = Array(5).fill(0).map(() => Array(5).fill(0))

  mockRisks
    .filter(r => r.status !== 'closed')
    .forEach(risk => {
      const probIndex = risk.probability - 1 // 0-4
      const impactIndex = risk.impact - 1    // 0-4
      // Flip Y axis for display (high probability on top)
      matrix[4 - probIndex][impactIndex]++
    })

  return NextResponse.json({
    success: true,
    data: {
      matrix,
      totalRisks: mockRisks.length,
      activeRisks: mockRisks.filter(r => r.status !== 'closed').length,
    },
  })
}
