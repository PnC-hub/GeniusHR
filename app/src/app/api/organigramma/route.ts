import { NextResponse } from 'next/server'

// Mock org chart data
const mockOrgData = [
  {
    id: '1',
    name: 'Dott. Piernatale Civero',
    position: 'Direttore Sanitario',
    department: 'MANAGEMENT',
    children: [
      {
        id: '2',
        name: 'Dott.ssa Annita Di Vozzo',
        position: 'Odontoiatra',
        department: 'CLINICAL',
      },
      {
        id: '3',
        name: 'Maria Rossi',
        position: 'Igienista Dentale',
        department: 'CLINICAL',
      },
      {
        id: '4',
        name: '',
        position: 'Odontoiatra Senior',
        department: 'CLINICAL',
        isVacant: true,
      },
      {
        id: '5',
        name: 'Giuseppe Bianchi',
        position: 'ASO - Assistente di Poltrona',
        department: 'CLINICAL',
        children: [
          {
            id: '6',
            name: 'Anna Verdi',
            position: 'ASO - Assistente di Poltrona',
            department: 'CLINICAL',
          }
        ]
      },
      {
        id: '7',
        name: 'Raffaella Cretella',
        position: 'Responsabile Amministrativa',
        department: 'ADMIN',
        children: [
          {
            id: '8',
            name: 'Laura Gialli',
            position: 'Segreteria',
            department: 'ADMIN',
          },
          {
            id: '9',
            name: 'Sara Viola',
            position: 'Amministrazione',
            department: 'ADMIN',
          }
        ]
      }
    ]
  }
]

// GET /api/organigramma - Return org chart tree
export async function GET() {
  try {
    // In production, fetch from database
    // const session = await getServerSession(authOptions)
    // const orgChart = await prisma.orgChart.findMany({ where: { tenantId: session.user.tenantId } })

    return NextResponse.json({
      success: true,
      data: mockOrgData
    })
  } catch (error) {
    console.error('Error fetching org chart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch org chart' },
      { status: 500 }
    )
  }
}

// PUT /api/organigramma - Save org chart tree
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { tree } = body

    if (!tree || !Array.isArray(tree)) {
      return NextResponse.json(
        { success: false, error: 'Invalid tree data' },
        { status: 400 }
      )
    }

    // In production, save to database
    // const session = await getServerSession(authOptions)
    // await prisma.orgChart.updateMany({
    //   where: { tenantId: session.user.tenantId },
    //   data: { tree: JSON.stringify(tree) }
    // })

    console.log('Org chart saved (mock):', tree)

    return NextResponse.json({
      success: true,
      message: 'Org chart saved successfully',
      data: tree
    })
  } catch (error) {
    console.error('Error saving org chart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save org chart' },
      { status: 500 }
    )
  }
}
