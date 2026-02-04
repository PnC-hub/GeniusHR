import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock risks for stats
const mockRisks = [
  { id: '1', score: 10, status: 'open', category: 'Operativo' },
  { id: '2', score: 12, status: 'mitigating', category: 'Legale/Compliance' },
  { id: '3', score: 8, status: 'mitigating', category: 'Sicurezza Lavoro' },
  { id: '4', score: 9, status: 'open', category: 'Sicurezza Lavoro' },
  { id: '5', score: 6, status: 'accepted', category: 'Operativo' },
  { id: '6', score: 12, status: 'open', category: 'Legale/Compliance' },
  { id: '7', score: 10, status: 'mitigating', category: 'IT/Cyber' },
  { id: '8', score: 9, status: 'open', category: 'Strategico' },
  { id: '9', score: 4, status: 'closed', category: 'Finanziario' },
  { id: '10', score: 6, status: 'open', category: 'Reputazionale' },
]

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  const totalRisks = mockRisks.length
  const criticalRisks = mockRisks.filter(r => r.score >= 15).length
  const highRisks = mockRisks.filter(r => r.score >= 10 && r.score < 15).length
  const mediumRisks = mockRisks.filter(r => r.score >= 5 && r.score < 10).length
  const lowRisks = mockRisks.filter(r => r.score < 5).length

  // Count by category
  const byCategory = mockRisks.reduce((acc, risk) => {
    acc[risk.category] = (acc[risk.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Count by status
  const byStatus = mockRisks.reduce((acc, risk) => {
    acc[risk.status] = (acc[risk.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return NextResponse.json({
    success: true,
    data: {
      totalRisks,
      criticalRisks,
      highRisks,
      mediumRisks,
      lowRisks,
      byCategory,
      byStatus,
      averageScore: Math.round(mockRisks.reduce((sum, r) => sum + r.score, 0) / totalRisks),
    },
  })
}
