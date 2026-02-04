import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock data - same as main route
const mockMansionari = [
  {
    id: '1',
    title: 'Direttore Sanitario',
    ccnlLevel: 'Quadro',
    department: 'Direzione',
    status: 'active',
    duties: [
      'Supervisione delle attività cliniche',
      'Garantire il rispetto delle normative sanitarie',
      'Coordinamento del personale medico',
      'Gestione delle emergenze sanitarie',
      'Autorizzazione protocolli terapeutici'
    ],
    skills: [
      'Laurea in Odontoiatria',
      'Iscrizione Ordine dei Medici',
      'Esperienza minima 10 anni',
      'Leadership e capacità organizzative',
      'Conoscenza normativa sanitaria'
    ],
    responsibilities: [
      'Conformità normativa D.Lgs 81/08',
      'Qualità delle prestazioni erogate',
      'Sicurezza dei pazienti',
      'Formazione continua del personale'
    ],
    kpis: [
      'Tasso di conformità audit: >95%',
      'Soddisfazione pazienti: >4.5/5',
      'Zero eventi sentinella',
      'Ore formazione staff: >40h/anno'
    ],
    assignedEmployees: ['emp-1', 'emp-2'],
    signedBy: ['emp-1'],
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-20T14:30:00Z'
  },
  {
    id: '2',
    title: 'Odontoiatra',
    ccnlLevel: '1° Livello',
    department: 'Clinico',
    status: 'active',
    duties: [
      'Visite odontoiatriche e diagnosi',
      'Esecuzione di trattamenti conservativi ed estrattivi',
      'Chirurgia orale e implantologia',
      'Redazione piani di trattamento',
      'Gestione emergenze odontoiatriche'
    ],
    skills: [
      'Laurea in Odontoiatria e Protesi Dentaria',
      'Iscrizione Ordine dei Medici e Odontoiatri',
      'Competenze cliniche specialistiche',
      'Capacità relazionali con pazienti',
      'Aggiornamento continuo ECM'
    ],
    responsibilities: [
      'Qualità delle prestazioni cliniche',
      'Sicurezza del paziente',
      'Sterilizzazione e igiene',
      'Documentazione clinica completa'
    ],
    kpis: [
      'Soddisfazione pazienti: >4.8/5',
      'Tasso di complicanze: <2%',
      'Crediti ECM annui: 50 punti',
      'Preventivi accettati: >70%'
    ],
    assignedEmployees: ['emp-3', 'emp-4', 'emp-5'],
    signedBy: ['emp-3', 'emp-4'],
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-25T16:00:00Z'
  },
  {
    id: '3',
    title: 'Igienista Dentale',
    ccnlLevel: '3° Livello',
    department: 'Clinico',
    status: 'active',
    duties: [
      'Sedute di igiene orale professionale',
      'Ablazione tartaro e levigature radicolari',
      'Applicazione fluoro e sigillature',
      'Educazione igiene orale domiciliare',
      'Screening parodontale'
    ],
    skills: [
      'Diploma di Igienista Dentale',
      'Iscrizione Albo Igienisti',
      'Competenze tecniche specifiche',
      'Capacità comunicative ed educative',
      'Conoscenza protocolli igiene'
    ],
    responsibilities: [
      'Prevenzione patologie orali',
      'Controllo infezioni',
      'Sterilizzazione strumenti',
      'Educazione sanitaria pazienti'
    ],
    kpis: [
      'Pazienti richiamati: >80%',
      'Indice placca medio: <20%',
      'Soddisfazione servizio: >4.7/5',
      'Sedute/giorno: 8-10'
    ],
    assignedEmployees: ['emp-6'],
    signedBy: ['emp-6'],
    createdAt: '2026-01-12T11:00:00Z',
    updatedAt: '2026-01-18T10:00:00Z'
  },
  {
    id: '4',
    title: 'ASO - Assistente Studio Odontoiatrico',
    ccnlLevel: '4° Livello',
    department: 'Clinico',
    status: 'active',
    duties: [
      'Assistenza poltrona durante trattamenti',
      'Preparazione sala operativa e strumenti',
      'Sterilizzazione e decontaminazione',
      'Accoglienza e gestione pazienti in sala',
      'Gestione scorte materiali clinici'
    ],
    skills: [
      'Attestato ASO (D.Lgs 81/08)',
      'Conoscenza strumentario odontoiatrico',
      'Protocolli sterilizzazione',
      'Capacità multitasking',
      'Empatia e gentilezza'
    ],
    responsibilities: [
      'Sicurezza paziente in poltrona',
      'Controllo sterilità strumenti',
      'Disponibilità materiali',
      'Supporto efficace al medico'
    ],
    kpis: [
      'Tempo preparazione sala: <5 min',
      'Zero carenze materiali',
      'Test sterilizzazione: 100% conformi',
      'Valutazione medico: >4.5/5'
    ],
    assignedEmployees: ['emp-7', 'emp-8'],
    signedBy: [],
    createdAt: '2026-01-08T08:30:00Z',
    updatedAt: '2026-01-22T15:00:00Z'
  },
  {
    id: '5',
    title: 'Responsabile Amministrativa',
    ccnlLevel: '2° Livello',
    department: 'Amministrazione',
    status: 'active',
    duties: [
      'Gestione contabilità e fatturazione',
      'Coordinamento segreteria',
      'Rapporti con commercialista',
      'Budget e controllo di gestione',
      'Gestione fornitori e ordini'
    ],
    skills: [
      'Diploma ragioneria o laurea economia',
      'Competenze contabilità e fiscali',
      'Conoscenza software gestionali',
      'Leadership e organizzazione',
      'Capacità analitiche'
    ],
    responsibilities: [
      'Correttezza amministrativa',
      'Puntualità adempimenti fiscali',
      'Efficienza processi interni',
      'Controllo costi'
    ],
    kpis: [
      'Zero ritardi scadenze fiscali',
      'Incasso fatture: <30 giorni medi',
      'Risparmio acquisti: >5% annuo',
      'Audit contabili: zero rilievi'
    ],
    assignedEmployees: ['emp-9'],
    signedBy: ['emp-9'],
    createdAt: '2026-01-05T09:00:00Z',
    updatedAt: '2026-01-28T11:30:00Z'
  },
  {
    id: '6',
    title: 'Segreteria',
    ccnlLevel: '4° Livello',
    department: 'Amministrazione',
    status: 'draft',
    duties: [
      'Gestione appuntamenti e agenda',
      'Accoglienza pazienti in reception',
      'Gestione telefonate',
      'Fatturazione e incassi',
      'Archiviazione documenti'
    ],
    skills: [
      'Diploma scuola superiore',
      'Competenze informatiche base',
      'Software gestionale studio',
      'Ottime capacità relazionali',
      'Riservatezza e precisione'
    ],
    responsibilities: [
      'Prima impressione pazienti',
      'Ottimizzazione agenda',
      'Correttezza fatturazione',
      'Privacy dati pazienti'
    ],
    kpis: [
      'Tempo attesa telefono: <30 sec',
      'Buchi agenda: <10%',
      'Errori fatturazione: <1%',
      'Soddisfazione accoglienza: >4.5/5'
    ],
    assignedEmployees: ['emp-10'],
    signedBy: [],
    createdAt: '2026-01-30T14:00:00Z',
    updatedAt: '2026-01-30T14:00:00Z'
  }
]

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
    const mansionario = mockMansionari.find(m => m.id === id)

    if (!mansionario) {
      return NextResponse.json({ error: 'Mansionario non trovato' }, { status: 404 })
    }

    return NextResponse.json(mansionario)
  } catch (error) {
    console.error('Error fetching mansionario:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    const mansionario = mockMansionari.find(m => m.id === id)

    if (!mansionario) {
      return NextResponse.json({ error: 'Mansionario non trovato' }, { status: 404 })
    }

    // Mock update
    const updatedMansionario = {
      ...mansionario,
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(updatedMansionario)
  } catch (error) {
    console.error('Error updating mansionario:', error)
    return NextResponse.json({ error: 'Errore durante l\'aggiornamento' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { id } = await params
    const mansionario = mockMansionari.find(m => m.id === id)

    if (!mansionario) {
      return NextResponse.json({ error: 'Mansionario non trovato' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Mansionario eliminato con successo' })
  } catch (error) {
    console.error('Error deleting mansionario:', error)
    return NextResponse.json({ error: 'Errore durante l\'eliminazione' }, { status: 500 })
  }
}
