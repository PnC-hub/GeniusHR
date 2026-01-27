import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomBytes } from 'crypto'

// GET /api/whistleblowing/[id]/documents - Get documents for a report
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Nessun tenant associato' },
        { status: 403 }
      )
    }

    // Only OWNER and ADMIN can view documents
    if (!['OWNER', 'ADMIN'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Non hai i permessi' },
        { status: 403 }
      )
    }

    const report = await prisma.whistleblowingReport.findFirst({
      where: {
        id,
        tenantId: membership.tenantId,
      },
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Segnalazione non trovata' },
        { status: 404 }
      )
    }

    const documents = await prisma.whistleblowingDocument.findMany({
      where: { reportId: id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching whistleblowing documents:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero documenti' },
      { status: 500 }
    )
  }
}

// POST /api/whistleblowing/[id]/documents - Upload document (manager or reporter via access code)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const accessCode = formData.get('accessCode') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'File obbligatorio' },
        { status: 400 }
      )
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File troppo grande. Massimo 10MB.' },
        { status: 400 }
      )
    }

    let report
    let uploadedBy = 'reporter'

    // If access code is provided, it's a reporter upload (public)
    if (accessCode) {
      report = await prisma.whistleblowingReport.findFirst({
        where: {
          id,
          accessCode: accessCode.toUpperCase(),
        },
      })

      if (!report) {
        return NextResponse.json(
          { error: 'Segnalazione non trovata o codice errato' },
          { status: 404 }
        )
      }
    } else {
      // Otherwise it's a manager upload (authenticated)
      const session = await getServerSession(authOptions)

      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
      }

      const membership = await prisma.tenantMember.findFirst({
        where: { userId: session.user.id },
      })

      if (!membership) {
        return NextResponse.json(
          { error: 'Nessun tenant associato' },
          { status: 403 }
        )
      }

      if (!['OWNER', 'ADMIN'].includes(membership.role)) {
        return NextResponse.json(
          { error: 'Non hai i permessi' },
          { status: 403 }
        )
      }

      report = await prisma.whistleblowingReport.findFirst({
        where: {
          id,
          tenantId: membership.tenantId,
        },
      })

      if (!report) {
        return NextResponse.json(
          { error: 'Segnalazione non trovata' },
          { status: 404 }
        )
      }

      uploadedBy = session.user.id
    }

    // Generate unique filename
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${randomBytes(16).toString('hex')}-${file.name}`
    const uploadDir = join(process.cwd(), 'uploads', 'whistleblowing', report.tenantId)
    const filepath = join(uploadDir, filename)

    // Create directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true })

    // Write file
    await writeFile(filepath, buffer)

    // Save to database
    const document = await prisma.whistleblowingDocument.create({
      data: {
        reportId: id,
        fileName: file.name,
        filePath: `/uploads/whistleblowing/${report.tenantId}/${filename}`,
        fileSize: file.size,
        mimeType: file.type,
        uploadedBy,
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Error uploading whistleblowing document:', error)
    return NextResponse.json(
      { error: 'Errore nell\'upload del documento' },
      { status: 500 }
    )
  }
}
