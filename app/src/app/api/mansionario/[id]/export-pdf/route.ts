import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { id } = await params

    // Mock PDF export - in production this would generate a real PDF
    return NextResponse.json({
      message: 'Export PDF non ancora implementato',
      downloadUrl: `/api/mansionario/${id}/download-pdf`,
      filename: `mansionario-${id}.pdf`
    })
  } catch (error) {
    console.error('Error exporting PDF:', error)
    return NextResponse.json({ error: 'Errore durante l\'export' }, { status: 500 })
  }
}
