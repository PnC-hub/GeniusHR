import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Per ora usiamo EmployeeNote con categoria specifica per gli infortuni
// In futuro si può creare un modello dedicato Incident
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Tenant non trovato' }, { status: 404 })
    }

    // Recupera note con metadata JSON che contiene tipo 'INCIDENT'
    const incidents = await prisma.employeeNote.findMany({
      where: {
        tenantId: membership.tenantId,
        content: {
          contains: '"type":"INCIDENT"'
        }
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
            jobTitle: true
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Parse del contenuto JSON
    const parsedIncidents = incidents.map(inc => {
      try {
        const data = JSON.parse(inc.content)
        return {
          id: inc.id,
          employeeId: inc.employeeId,
          employee: inc.employee,
          author: inc.author,
          createdAt: inc.createdAt,
          updatedAt: inc.updatedAt,
          ...data
        }
      } catch {
        return null
      }
    }).filter(Boolean)

    return NextResponse.json(parsedIncidents)
  } catch (error) {
    console.error('Errore nel recupero infortuni:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero degli infortuni' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Tenant non trovato' }, { status: 404 })
    }

    const body = await req.json()
    const {
      employeeId,
      incidentDate,
      incidentTime,
      location,
      description,
      injuries,
      witnesses,
      severity,
      reportedToInail,
      inailReportDate,
      inailProtocol,
      medicalCertificate,
      followUp
    } = body

    if (!employeeId || !incidentDate || !description) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti' },
        { status: 400 }
      )
    }

    // Salva come EmployeeNote con struttura JSON
    const incidentData = {
      type: 'INCIDENT',
      incidentDate,
      incidentTime,
      location,
      description,
      injuries,
      witnesses,
      severity,
      reportedToInail,
      inailReportDate,
      inailProtocol,
      medicalCertificate,
      followUp,
      status: reportedToInail ? 'REPORTED' : 'PENDING'
    }

    const incident = await prisma.employeeNote.create({
      data: {
        tenantId: membership.tenantId,
        employeeId,
        authorId: session.user.id,
        category: 'WARNING', // Usiamo WARNING come categoria per alta visibilità
        content: JSON.stringify(incidentData),
        isPrivate: true
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true
          }
        },
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Crea notifica se grave e non ancora segnalato a INAIL
    if (severity === 'SEVERE' && !reportedToInail) {
      const deadline48h = new Date()
      deadline48h.setHours(deadline48h.getHours() + 48)

      await prisma.deadline.create({
        data: {
          tenantId: membership.tenantId,
          employeeId,
          title: 'URGENTE: Denuncia INAIL entro 48h',
          description: `Infortunio grave del ${new Date(incidentDate).toLocaleDateString('it-IT')} - Denuncia INAIL obbligatoria entro 48 ore`,
          type: 'CUSTOM',
          dueDate: deadline48h,
          status: 'PENDING',
          notify30Days: false,
          notify60Days: false,
          notify90Days: false
        }
      })
    }

    return NextResponse.json({
      id: incident.id,
      employeeId: incident.employeeId,
      employee: incident.employee,
      author: incident.author,
      createdAt: incident.createdAt,
      ...incidentData
    }, { status: 201 })
  } catch (error) {
    console.error('Errore nella creazione infortunio:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione dell\'infortunio' },
      { status: 500 }
    )
  }
}
