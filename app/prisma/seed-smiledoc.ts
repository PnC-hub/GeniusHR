import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Smiledoc demo account...')

  // Create Smiledoc tenant
  const smiledocTenant = await prisma.tenant.upsert({
    where: { slug: 'smiledoc' },
    update: {},
    create: {
      name: 'Smiledoc S.r.l.',
      slug: 'smiledoc',
      plan: 'PROFESSIONAL',
      subscriptionStatus: 'ACTIVE',
      primaryColor: '#0066cc',
      secondaryColor: '#00cc66'
    }
  })

  console.log('Created Smiledoc tenant:', smiledocTenant.name)

  // Create main user for Piero
  const pieroPassword = await bcrypt.hash('Smiledoc2025!', 12)

  const pieroUser = await prisma.user.upsert({
    where: { email: 'direzione@smiledoc.it' },
    update: {},
    create: {
      email: 'direzione@smiledoc.it',
      name: 'Piero Natale Civero',
      password: pieroPassword,
      role: 'ADMIN',
      emailVerified: new Date()
    }
  })

  // Link Piero to Smiledoc tenant
  await prisma.tenantMember.upsert({
    where: {
      userId_tenantId: {
        userId: pieroUser.id,
        tenantId: smiledocTenant.id
      }
    },
    update: {},
    create: {
      userId: pieroUser.id,
      tenantId: smiledocTenant.id,
      role: 'OWNER'
    }
  })

  console.log('Created admin user:', pieroUser.email)

  // Create Smiledoc employees - Da PRD Sezione 5.2
  const employees = [
    {
      id: 'smiledoc-maria-rossi',
      firstName: 'Maria',
      lastName: 'Rossi',
      email: 'maria.rossi@smiledoc.it',
      phone: '+39 333 1234567',
      fiscalCode: 'RSSMRA85M41H501Z',
      jobTitle: 'Segretaria',
      department: 'Reception',
      contractType: 'FULL_TIME' as const,
      ccnlLevel: '3° Livello',
      hireDate: new Date('2023-03-01'),
      birthDate: new Date('1985-03-15'),
      birthPlace: 'Roma',
      address: 'Via Roma 45, Monterotondo (RM)',
      status: 'ACTIVE' as const
    },
    {
      id: 'smiledoc-giuseppe-bianchi',
      firstName: 'Giuseppe',
      lastName: 'Bianchi',
      email: 'giuseppe.bianchi@smiledoc.it',
      phone: '+39 333 2345678',
      fiscalCode: 'BNCGPP88L22H501X',
      jobTitle: 'Igienista Dentale',
      department: 'Clinica',
      contractType: 'FULL_TIME' as const,
      ccnlLevel: '4° Livello',
      hireDate: new Date('2022-06-15'),
      birthDate: new Date('1988-07-22'),
      birthPlace: 'Roma',
      address: 'Via Milano 12, Monterotondo (RM)',
      status: 'ACTIVE' as const
    },
    {
      id: 'smiledoc-anna-verdi',
      firstName: 'Anna',
      lastName: 'Verdi',
      email: 'anna.verdi@smiledoc.it',
      phone: '+39 333 3456789',
      fiscalCode: 'VRDNNA92S48H501Y',
      jobTitle: 'ASO (Assistente Studio Odontoiatrico)',
      department: 'Clinica',
      contractType: 'FULL_TIME' as const,
      ccnlLevel: '3° Livello',
      hireDate: new Date('2023-09-01'),
      birthDate: new Date('1992-11-08'),
      birthPlace: 'Fiano Romano',
      address: 'Via Napoli 78, Fiano Romano (RM)',
      status: 'ACTIVE' as const
    },
    {
      id: 'smiledoc-marco-neri',
      firstName: 'Marco',
      lastName: 'Neri',
      email: 'marco.neri@smiledoc.it',
      phone: '+39 333 4567890',
      fiscalCode: 'NRIMRC80E12H501W',
      jobTitle: 'Odontoiatra',
      department: 'Clinica',
      contractType: 'FULL_TIME' as const,
      ccnlLevel: '5° Livello Quadro',
      hireDate: new Date('2020-01-01'),
      birthDate: new Date('1980-05-12'),
      birthPlace: 'Roma',
      address: 'Via Torino 23, Roma',
      status: 'ACTIVE' as const
    },
    {
      id: 'smiledoc-laura-gialli',
      firstName: 'Laura',
      lastName: 'Gialli',
      email: 'laura.gialli@smiledoc.it',
      phone: '+39 333 5678901',
      fiscalCode: 'GLLLRA90P70H501V',
      jobTitle: 'Responsabile Amministrazione',
      department: 'Back Office',
      contractType: 'FULL_TIME' as const,
      ccnlLevel: '4° Livello',
      hireDate: new Date('2024-04-01'),
      birthDate: new Date('1990-09-30'),
      birthPlace: 'Monterotondo',
      address: 'Via Firenze 56, Monterotondo (RM)',
      status: 'ACTIVE' as const
    },
    {
      id: 'smiledoc-fabio-blu',
      firstName: 'Fabio',
      lastName: 'Blu',
      email: 'fabio.blu@smiledoc.it',
      phone: '+39 333 6789012',
      fiscalCode: 'BLUFBA95A18H501U',
      jobTitle: 'ASO (Assistente Studio Odontoiatrico)',
      department: 'Clinica',
      contractType: 'FULL_TIME' as const,
      ccnlLevel: '2° Livello',
      hireDate: new Date('2024-02-15'),
      birthDate: new Date('1995-01-18'),
      birthPlace: 'Mentana',
      address: 'Via Bologna 34, Mentana (RM)',
      status: 'ACTIVE' as const
    },
    {
      id: 'smiledoc-sara-viola',
      firstName: 'Sara',
      lastName: 'Viola',
      email: 'sara.viola@smiledoc.it',
      phone: '+39 333 7890123',
      fiscalCode: 'VLASRA93T45H501T',
      jobTitle: 'Segretaria',
      department: 'Reception',
      contractType: 'FULL_TIME' as const,
      ccnlLevel: '3° Livello',
      hireDate: new Date('2024-07-01'),
      birthDate: new Date('1993-12-05'),
      birthPlace: 'Roma',
      address: 'Via Venezia 89, Roma',
      status: 'ACTIVE' as const
    },
    {
      id: 'smiledoc-luca-arancio',
      firstName: 'Luca',
      lastName: 'Arancio',
      email: 'luca.arancio@smiledoc.it',
      phone: '+39 333 8901234',
      fiscalCode: 'RNCCLCA03D25H501S',
      jobTitle: 'Apprendista ASO',
      department: 'Clinica',
      contractType: 'APPRENTICE' as const,
      ccnlLevel: '1° Livello Apprendista',
      hireDate: new Date('2025-10-01'),
      birthDate: new Date('2003-04-25'),
      birthPlace: 'Monterotondo',
      address: 'Via Genova 67, Monterotondo (RM)',
      probationEndsAt: new Date('2026-01-31'),
      status: 'PROBATION' as const
    }
  ]

  for (const emp of employees) {
    await prisma.employee.upsert({
      where: { id: emp.id },
      update: {},
      create: {
        tenantId: smiledocTenant.id,
        ...emp
      }
    })

    // Create LeaveBalance for each employee for 2026
    const currentYear = 2026
    const yearsOfService = (new Date('2026-01-27').getTime() - emp.hireDate.getTime()) / (365 * 24 * 60 * 60 * 1000)
    const vacationTotal = yearsOfService < 1 ? 15 : 22
    const rolTotal = 32 // Ore ROL annuali tipiche

    await prisma.leaveBalance.upsert({
      where: {
        employeeId_year: {
          employeeId: emp.id,
          year: currentYear
        }
      },
      update: {},
      create: {
        employeeId: emp.id,
        tenantId: smiledocTenant.id,
        year: currentYear,
        vacationTotal,
        vacationUsed: emp.lastName === 'Rossi' ? 5 : emp.lastName === 'Neri' ? 8 : emp.lastName === 'Bianchi' ? 3 : 2,
        vacationPending: emp.lastName === 'Verdi' ? 3 : 0,
        rolTotal,
        rolUsed: emp.lastName === 'Gialli' ? 8 : 4,
        rolPending: 0
      }
    })
  }

  console.log('Created', employees.length, 'employees')

  // Create document types and templates
  const documentTypes = [
    // Onboarding documents
    { type: 'CONTRACT', name: 'Contratto di Lavoro' },
    { type: 'GDPR_CONSENT', name: 'Informativa Privacy GDPR' },
    { type: 'NDA', name: 'Patto di Non Divulgazione' },
    { type: 'ID_DOCUMENT', name: 'Documento di Identita' },
    { type: 'TRAINING_CERTIFICATE', name: 'Attestato Formazione Sicurezza' },
    { type: 'MEDICAL_CERTIFICATE', name: 'Idoneita Sanitaria' },
    { type: 'DPI_RECEIPT', name: 'Consegna DPI' },
    // Administrative
    { type: 'PAYSLIP', name: 'Busta Paga' },
    { type: 'VARIATION', name: 'Variazione Dati Anagrafici' },
    { type: 'LEAVE_REQUEST', name: 'Richiesta Ferie' },
    // Disciplinary
    { type: 'DISCIPLINARY', name: 'Contestazione Disciplinare' },
    { type: 'WARNING', name: 'Richiamo Scritto' },
    // Policy
    { type: 'POLICY', name: 'Regolamento Aziendale' },
    { type: 'EMAIL_POLICY', name: 'Policy Uso Email' },
    { type: 'SMART_WORKING', name: 'Accordo Smart Working' }
  ]

  // Create sample documents for employees
  const sampleDocs = [
    // Maria Rossi - Full documentation
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-maria-rossi',
      name: 'Contratto Tempo Indeterminato - Maria Rossi',
      type: 'CONTRACT' as const,
      category: 'Onboarding',
      filePath: '/documents/smiledoc/maria_contratto.pdf',
      fileSize: 125000,
      mimeType: 'application/pdf'
    },
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-maria-rossi',
      name: 'Informativa Privacy GDPR - Maria Rossi',
      type: 'GDPR_CONSENT' as const,
      category: 'GDPR',
      filePath: '/documents/smiledoc/maria_privacy.pdf',
      fileSize: 85000,
      mimeType: 'application/pdf'
    },
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-maria-rossi',
      name: 'Attestato Formazione Generale 81/08 - Maria Rossi',
      type: 'TRAINING_CERTIFICATE' as const,
      category: 'Sicurezza',
      filePath: '/documents/smiledoc/maria_formazione_generale.pdf',
      fileSize: 95000,
      mimeType: 'application/pdf'
    },
    // Giuseppe Bianchi
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-giuseppe-bianchi',
      name: 'Contratto Tempo Indeterminato - Giuseppe Bianchi',
      type: 'CONTRACT' as const,
      category: 'Onboarding',
      filePath: '/documents/smiledoc/giuseppe_contratto.pdf',
      fileSize: 128000,
      mimeType: 'application/pdf'
    },
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-giuseppe-bianchi',
      name: 'Informativa Privacy GDPR - Giuseppe Bianchi',
      type: 'GDPR_CONSENT' as const,
      category: 'GDPR',
      filePath: '/documents/smiledoc/giuseppe_privacy.pdf',
      fileSize: 85000,
      mimeType: 'application/pdf'
    },
    // Luca Arancio - Nuovo assunto in onboarding
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-luca-arancio',
      name: 'Contratto Apprendistato - Luca Arancio',
      type: 'CONTRACT' as const,
      category: 'Onboarding',
      filePath: '/documents/smiledoc/luca_contratto.pdf',
      fileSize: 145000,
      mimeType: 'application/pdf'
    }
  ]

  for (const doc of sampleDocs) {
    await prisma.document.create({
      data: doc
    })
  }

  console.log('Created sample documents')

  // Create deadlines/scadenze
  const deadlines = [
    {
      tenantId: smiledocTenant.id,
      title: 'Rinnovo Formazione Specifica 81/08 - Maria Rossi',
      type: 'TRAINING_EXPIRY' as const,
      dueDate: new Date('2028-03-01'),
      employeeId: 'smiledoc-maria-rossi',
      notify30Days: true,
      notify60Days: true
    },
    {
      tenantId: smiledocTenant.id,
      title: 'Visita Medica Periodica - Maria Rossi',
      type: 'MEDICAL_VISIT' as const,
      dueDate: new Date('2026-03-01'),
      employeeId: 'smiledoc-maria-rossi',
      notify30Days: true,
      notify60Days: true
    },
    {
      tenantId: smiledocTenant.id,
      title: 'Fine Periodo di Prova - Luca Arancio',
      type: 'PROBATION_END' as const,
      dueDate: new Date('2026-01-31'),
      employeeId: 'smiledoc-luca-arancio',
      notify30Days: true,
      notify60Days: true
    },
    {
      tenantId: smiledocTenant.id,
      title: 'Rinnovo Formazione Antincendio - Anna Verdi',
      type: 'TRAINING_EXPIRY' as const,
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 giorni
      employeeId: 'smiledoc-anna-verdi',
      notify30Days: true,
      notify60Days: true
    },
    {
      tenantId: smiledocTenant.id,
      title: 'Formazione Generale Sicurezza - Giuseppe Bianchi (SCADUTA)',
      type: 'TRAINING_EXPIRY' as const,
      dueDate: new Date('2027-06-15'),
      employeeId: 'smiledoc-giuseppe-bianchi',
      status: 'OVERDUE' as const,
      notify30Days: true,
      notify60Days: true
    }
  ]

  for (const deadline of deadlines) {
    await prisma.deadline.create({ data: deadline })
  }

  console.log('Created deadlines')

  // Create safety training records
  const safetyTrainings = [
    // Maria Rossi - Segretaria Reception
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-maria-rossi',
      trainingType: 'GENERAL' as const,
      title: 'Formazione Generale 81/08',
      hoursCompleted: 4,
      hoursRequired: 4,
      completedAt: new Date('2023-03-05'),
      expiresAt: new Date('2028-03-05'),
      status: 'COMPLETED' as const,
      certificateNumber: 'GEN-23-0045',
      provider: 'Ente Formazione Sicurezza Lazio'
    },
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-maria-rossi',
      trainingType: 'SPECIFIC_LOW' as const,
      title: 'Formazione Specifica Rischio Basso',
      hoursCompleted: 4,
      hoursRequired: 4,
      completedAt: new Date('2023-03-08'),
      expiresAt: new Date('2028-03-08'),
      status: 'COMPLETED' as const,
      certificateNumber: 'SPEC-23-0045',
      provider: 'Ente Formazione Sicurezza Lazio'
    },
    // Giuseppe Bianchi - Igienista (FORMAZIONE SCADUTA PER TEST)
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-giuseppe-bianchi',
      trainingType: 'GENERAL' as const,
      title: 'Formazione Generale 81/08',
      hoursCompleted: 4,
      hoursRequired: 4,
      completedAt: new Date('2022-06-20'),
      expiresAt: new Date('2024-06-20'), // SCADUTA
      status: 'EXPIRED' as const,
      certificateNumber: 'GEN-22-0123',
      provider: 'Ente Formazione Sicurezza Lazio'
    },
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-giuseppe-bianchi',
      trainingType: 'SPECIFIC_HIGH' as const,
      title: 'Formazione Specifica Rischio Alto - Sanita',
      hoursCompleted: 12,
      hoursRequired: 12,
      completedAt: new Date('2022-06-25'),
      expiresAt: new Date('2027-06-25'),
      status: 'COMPLETED' as const,
      certificateNumber: 'SPEC-22-0123',
      provider: 'Ente Formazione Sicurezza Lazio'
    },
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-giuseppe-bianchi',
      trainingType: 'FIRST_AID' as const,
      title: 'Primo Soccorso Gruppo B',
      hoursCompleted: 12,
      hoursRequired: 12,
      completedAt: new Date('2022-07-10'),
      expiresAt: new Date('2025-07-10'),
      status: 'COMPLETED' as const,
      certificateNumber: 'FIRST-22-0089',
      provider: 'Croce Rossa Italiana'
    },
    // Anna Verdi - ASO
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-anna-verdi',
      trainingType: 'GENERAL' as const,
      title: 'Formazione Generale 81/08',
      hoursCompleted: 4,
      hoursRequired: 4,
      completedAt: new Date('2023-09-05'),
      expiresAt: new Date('2028-09-05'),
      status: 'COMPLETED' as const,
      certificateNumber: 'GEN-23-0234',
      provider: 'Ente Formazione Sicurezza Lazio'
    },
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-anna-verdi',
      trainingType: 'SPECIFIC_HIGH' as const,
      title: 'Formazione Specifica Rischio Alto - Sanita',
      hoursCompleted: 12,
      hoursRequired: 12,
      completedAt: new Date('2023-09-08'),
      expiresAt: new Date('2028-09-08'),
      status: 'COMPLETED' as const,
      certificateNumber: 'SPEC-23-0234',
      provider: 'Ente Formazione Sicurezza Lazio'
    },
    // Marco Neri - Odontoiatra
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-marco-neri',
      trainingType: 'GENERAL' as const,
      title: 'Formazione Generale 81/08',
      hoursCompleted: 4,
      hoursRequired: 4,
      completedAt: new Date('2020-01-10'),
      expiresAt: new Date('2025-01-10'),
      status: 'COMPLETED' as const,
      certificateNumber: 'GEN-20-0012',
      provider: 'Ente Formazione Sicurezza Lazio'
    },
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-marco-neri',
      trainingType: 'SPECIFIC_HIGH' as const,
      title: 'Formazione Specifica Rischio Alto - Sanita',
      hoursCompleted: 12,
      hoursRequired: 12,
      completedAt: new Date('2020-01-15'),
      expiresAt: new Date('2025-01-15'),
      status: 'COMPLETED' as const,
      certificateNumber: 'SPEC-20-0012',
      provider: 'Ente Formazione Sicurezza Lazio'
    },
    // Luca Arancio - Apprendista (NON INIZIATA PER TEST)
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-luca-arancio',
      trainingType: 'GENERAL' as const,
      title: 'Formazione Generale 81/08',
      hoursCompleted: 0,
      hoursRequired: 4,
      status: 'NOT_STARTED' as const
    },
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-luca-arancio',
      trainingType: 'SPECIFIC_HIGH' as const,
      title: 'Formazione Specifica Rischio Alto - Sanita',
      hoursCompleted: 0,
      hoursRequired: 12,
      status: 'NOT_STARTED' as const
    }
  ]

  for (const training of safetyTrainings) {
    await prisma.safetyTraining.create({ data: training })
  }

  console.log('Created safety training records')

  // Create onboarding checklist for Smiledoc
  const checklist = await prisma.onboardingChecklist.upsert({
    where: { id: 'smiledoc-checklist' },
    update: {},
    create: {
      id: 'smiledoc-checklist',
      tenantId: smiledocTenant.id,
      name: 'Checklist Onboarding Smiledoc',
      description: 'Checklist completa per inserimento nuovi collaboratori studio odontoiatrico',
      isDefault: true
    }
  })

  const checklistItems = [
    // Pre-assunzione
    { title: 'Raccolta documento identita (CI/Passaporto)', category: 'Pre-Assunzione', order: 1, required: true },
    { title: 'Raccolta codice fiscale', category: 'Pre-Assunzione', order: 2, required: true },
    { title: 'Raccolta titolo di studio', category: 'Pre-Assunzione', order: 3, required: false },
    { title: 'Verifica referenze lavorative', category: 'Pre-Assunzione', order: 4, required: false },
    // Contrattuale
    { title: 'Lettera di assunzione firmata', category: 'Contrattuale', order: 5, required: true },
    { title: 'Contratto di lavoro firmato', category: 'Contrattuale', order: 6, required: true },
    { title: 'Patto di non concorrenza (se applicabile)', category: 'Contrattuale', order: 7, required: false },
    { title: 'Accordo smart working (se applicabile)', category: 'Contrattuale', order: 8, required: false },
    // GDPR e Privacy
    { title: 'Informativa privacy Art. 13 GDPR firmata', category: 'GDPR', order: 9, required: true },
    { title: 'Consenso trattamento dati personali', category: 'GDPR', order: 10, required: true },
    { title: 'Consenso pubblicazione foto/video', category: 'GDPR', order: 11, required: false },
    { title: 'NDA - Patto di riservatezza firmato', category: 'GDPR', order: 12, required: true },
    // Sicurezza 81/08
    { title: 'Visita medica preassuntiva', category: 'Sicurezza', order: 13, required: true },
    { title: 'Idoneita sanitaria rilasciata', category: 'Sicurezza', order: 14, required: true },
    { title: 'Formazione generale sicurezza (4h)', category: 'Sicurezza', order: 15, required: true },
    { title: 'Formazione specifica rischio (4-8h)', category: 'Sicurezza', order: 16, required: true },
    { title: 'Consegna DPI con verbale firmato', category: 'Sicurezza', order: 17, required: true },
    { title: 'Formazione antincendio', category: 'Sicurezza', order: 18, required: false },
    { title: 'Formazione primo soccorso', category: 'Sicurezza', order: 19, required: false },
    // IT e Accessi
    { title: 'Creazione email aziendale', category: 'IT', order: 20, required: true },
    { title: 'Creazione account gestionale', category: 'IT', order: 21, required: true },
    { title: 'Consegna badge/chiavi accesso', category: 'IT', order: 22, required: true },
    { title: 'Policy uso strumenti informatici firmata', category: 'IT', order: 23, required: true },
    // Amministrativo
    { title: 'Comunicazione IBAN per accredito stipendio', category: 'Amministrativo', order: 24, required: true },
    { title: 'Modulo detrazioni fiscali compilato', category: 'Amministrativo', order: 25, required: true },
    { title: 'Iscrizione fondo previdenza complementare', category: 'Amministrativo', order: 26, required: false }
  ]

  for (const item of checklistItems) {
    await prisma.onboardingChecklistItem.create({
      data: {
        checklistId: checklist.id,
        ...item
      }
    })
  }

  console.log('Created onboarding checklist with', checklistItems.length, 'items')

  // Create onboarding timeline for Luca Arancio (new hire)
  const onboardingPhases = [
    { phase: 'DOCUMENTS_COLLECTION' as const, title: 'Raccolta Documenti', status: 'IN_PROGRESS' as const, order: 1 },
    { phase: 'OFFER_LETTER' as const, title: 'Firma Contratto', status: 'COMPLETED' as const, order: 2, completedAt: new Date('2025-10-01') },
    { phase: 'PRIVACY_CONSENT' as const, title: 'Privacy e GDPR', status: 'IN_PROGRESS' as const, order: 3 },
    { phase: 'SAFETY_TRAINING_GENERAL' as const, title: 'Formazione Sicurezza', status: 'PENDING' as const, order: 4 },
    { phase: 'IT_ACCOUNTS' as const, title: 'Setup IT e Accessi', status: 'PENDING' as const, order: 5 },
    { phase: 'TOOLS_TRAINING' as const, title: 'Formazione Ruolo', status: 'PENDING' as const, order: 6 }
  ]

  for (const phase of onboardingPhases) {
    await prisma.onboardingTimeline.create({
      data: {
        tenantId: smiledocTenant.id,
        employeeId: 'smiledoc-luca-arancio',
        ...phase,
        dueDate: new Date(Date.now() + phase.order * 7 * 24 * 60 * 60 * 1000)
      }
    })
  }

  console.log('Created onboarding timeline for Luca Arancio')

  // Create sample leave requests
  const leaveRequests = [
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-maria-rossi',
      type: 'VACATION' as const,
      status: 'APPROVED' as const,
      startDate: new Date('2026-08-11'),
      endDate: new Date('2026-08-22'),
      totalDays: 10,
      reason: 'Ferie estive',
      reviewedBy: pieroUser.id,
      reviewedAt: new Date('2026-01-15'),
      reviewNotes: 'Approvato, buone vacanze!'
    },
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-giuseppe-bianchi',
      type: 'VACATION' as const,
      status: 'PENDING' as const,
      startDate: new Date('2026-04-21'),
      endDate: new Date('2026-04-25'),
      totalDays: 5,
      reason: 'Ponte 25 aprile'
    },
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-anna-verdi',
      type: 'MEDICAL_VISIT' as const,
      status: 'APPROVED' as const,
      startDate: new Date('2026-02-14'),
      endDate: new Date('2026-02-14'),
      totalDays: 1,
      reason: 'Visita medica personale',
      reviewedBy: pieroUser.id,
      reviewedAt: new Date('2026-02-10')
    },
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-fabio-blu',
      type: 'SICK' as const,
      status: 'APPROVED' as const,
      startDate: new Date('2026-01-20'),
      endDate: new Date('2026-01-22'),
      totalDays: 3,
      reason: 'Influenza',
      reviewedBy: pieroUser.id,
      reviewedAt: new Date('2026-01-20')
    }
  ]

  for (const leave of leaveRequests) {
    await prisma.leaveRequest.create({ data: leave })
  }

  console.log('Created sample leave requests')

  // Create sample expense requests
  const expenseRequests = [
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-laura-gialli',
      type: 'MILEAGE' as const,
      status: 'APPROVED' as const,
      amount: 45.50,
      description: 'Rimborso km trasferta Roma - 35km x 1.30',
      date: new Date('2026-01-20'),
      kilometers: 35,
      ratePerKm: 1.30,
      origin: 'Smiledoc - Monterotondo',
      destination: 'Commercialista - Roma Centro',
      vehicleType: 'CAR_PETROL' as const,
      reviewedBy: pieroUser.id,
      reviewedAt: new Date('2026-01-21')
    },
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-giuseppe-bianchi',
      type: 'SUPPLIES' as const,
      status: 'PENDING' as const,
      amount: 89.90,
      description: 'Acquisto materiale formazione sicurezza',
      date: new Date('2026-01-25')
    },
    {
      tenantId: smiledocTenant.id,
      employeeId: 'smiledoc-marco-neri',
      type: 'TRAINING' as const,
      status: 'APPROVED' as const,
      amount: 450.00,
      description: 'Corso aggiornamento professionale odontoiatria',
      date: new Date('2026-01-15'),
      reviewedBy: pieroUser.id,
      reviewedAt: new Date('2026-01-16')
    }
  ]

  for (const expense of expenseRequests) {
    await prisma.expenseRequest.create({ data: expense })
  }

  console.log('Created sample expense requests')

  // Create sample payslips for last 3 months
  const periods = ['2025-10', '2025-11', '2025-12']

  const payslipData = [
    { employeeId: 'smiledoc-maria-rossi', firstName: 'Maria', lastName: 'Rossi', grossAmount: 1850, netAmount: 1420 },
    { employeeId: 'smiledoc-giuseppe-bianchi', firstName: 'Giuseppe', lastName: 'Bianchi', grossAmount: 2200, netAmount: 1680 },
    { employeeId: 'smiledoc-anna-verdi', firstName: 'Anna', lastName: 'Verdi', grossAmount: 1750, netAmount: 1350 },
    { employeeId: 'smiledoc-marco-neri', firstName: 'Marco', lastName: 'Neri', grossAmount: 3500, netAmount: 2450 },
    { employeeId: 'smiledoc-laura-gialli', firstName: 'Laura', lastName: 'Gialli', grossAmount: 2000, netAmount: 1550 },
    { employeeId: 'smiledoc-fabio-blu', firstName: 'Fabio', lastName: 'Blu', grossAmount: 1650, netAmount: 1280 },
    { employeeId: 'smiledoc-sara-viola', firstName: 'Sara', lastName: 'Viola', grossAmount: 1800, netAmount: 1390 }
  ]

  for (const period of periods) {
    for (const payslip of payslipData) {
      const fileName = `cedolino_${payslip.lastName.toLowerCase()}_${period}.pdf`
      await prisma.payslip.create({
        data: {
          tenantId: smiledocTenant.id,
          employeeId: payslip.employeeId,
          period: period,
          grossAmount: payslip.grossAmount,
          netAmount: payslip.netAmount,
          fileName: fileName,
          fileUrl: `/payslips/smiledoc/${fileName}`,
          uploadedBy: pieroUser.id
        }
      })
    }
  }

  console.log('Created sample payslips')

  // Create Disciplinary Code
  const disciplinaryCode = await prisma.disciplinaryCode.upsert({
    where: {
      tenantId: smiledocTenant.id
    },
    update: {},
    create: {
      tenantId: smiledocTenant.id,
      version: '1.0',
      content: `
# CODICE DISCIPLINARE SMILEDOC S.R.L.

## Art. 1 - Finalità
Il presente Codice Disciplinare è adottato in conformità all'art. 7 della L. 300/1970 (Statuto dei Lavoratori) e al CCNL Studi Professionali.

## Art. 2 - Infrazioni e Sanzioni

### Infrazioni lievi (Ammonizione scritta o multa fino a 4 ore di retribuzione)
- Ritardi o assenze ingiustificate
- Mancata comunicazione tempestiva di assenze
- Negligenza nell'esecuzione del lavoro
- Inosservanza delle disposizioni organizzative interne
- Trascuratezza nell'utilizzo o custodia di materiali/attrezzature

### Infrazioni gravi (Sospensione fino a 10 giorni)
- Recidiva nelle infrazioni lievi (3 volte in 2 anni)
- Insubordinazione o rifiuto di obbedienza
- Assenze ingiustificate ripetute (oltre 3 giorni consecutivi)
- Violazione norme di sicurezza sul lavoro (D.Lgs. 81/2008)
- Danneggiamento colposo di attrezzature
- Abbandono del posto di lavoro senza giustificato motivo
- Utilizzo improprio strumenti informatici aziendali

### Infrazioni gravissime (Licenziamento con preavviso o per giusta causa)
- Furto o appropriazione indebita
- Molestie o comportamenti offensivi gravi verso colleghi/pazienti
- Violazioni gravi della privacy dei pazienti (GDPR)
- Alterazione dati o documenti aziendali
- Violenze, minacce, ingiurie gravi
- Concorrenza sleale o divulgazione segreti aziendali
- Stato di ubriachezza o uso sostanze stupefacenti in servizio
- Abbandono del posto di lavoro che causi grave danno

## Art. 3 - Procedura Disciplinare
Ogni sanzione superiore al richiamo verbale sarà preceduta da:
1. Contestazione scritta dell'addebito (consegnata o inviata tramite raccomandata A/R)
2. Termine di 5 giorni per presentare le proprie giustificazioni
3. Eventuale audizione del dipendente (se richiesta)
4. Comunicazione del provvedimento finale

Il dipendente ha diritto di farsi assistere da un rappresentante sindacale.

## Art. 4 - Affissione
Il presente codice è affisso nella bacheca aziendale presso la sede di Via Monte Circeo 12, Monterotondo (RM).

Data affissione: 10 Gennaio 2025
      `,
      postedAt: new Date('2025-01-10'),
      postedBy: pieroUser.id,
      postedLocation: 'Bacheca ingresso studio',
      isActive: true
    }
  })

  console.log('Created disciplinary code')

  // Create DVR acknowledgments for older employees
  const dvrVersion = '1.0 - Gennaio 2025'
  const dvrDate = new Date('2025-01-15')

  const employeesForDvr = employees.filter(emp =>
    emp.hireDate < new Date('2024-07-01') // Solo dipendenti assunti prima di luglio 2024
  )

  for (const emp of employeesForDvr) {
    await prisma.dvrAcknowledgment.create({
      data: {
        tenantId: smiledocTenant.id,
        employeeId: emp.id,
        dvrVersion,
        dvrDate,
        acknowledgedAt: new Date(emp.hireDate.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 giorni dopo assunzione
        acknowledgedBy: pieroUser.id
      }
    })
  }

  console.log(`Created DVR acknowledgments for ${employeesForDvr.length} employees`)

  // Create disciplinary code acknowledgments
  for (const emp of employees) {
    await prisma.disciplinaryCodeAcknowledgment.create({
      data: {
        tenantId: smiledocTenant.id,
        codeId: disciplinaryCode.id,
        employeeId: emp.id,
        acknowledgedAt: emp.hireDate > new Date('2025-01-10')
          ? new Date(emp.hireDate.getTime() + 1 * 24 * 60 * 60 * 1000) // Dopo assunzione
          : new Date('2025-01-11'), // Il giorno dopo affissione
        method: 'DIGITAL'
      }
    })
  }

  console.log('Created disciplinary code acknowledgments')

  console.log('='.repeat(50))
  console.log('Smiledoc seed completed!')
  console.log('='.repeat(50))
  console.log('')
  console.log('Login credentials:')
  console.log('  Email: direzione@smiledoc.it')
  console.log('  Password: Smiledoc2025!')
  console.log('')
  console.log('Employees created:')
  employees.forEach(emp => {
    console.log(`  - ${emp.firstName} ${emp.lastName} (${emp.jobTitle} - ${emp.department})`)
  })
  console.log('')
  console.log('Data highlights:')
  console.log('  - Safety trainings: Some expired (Giuseppe Bianchi) for testing alerts')
  console.log('  - Leave requests: 1 pending, 3 approved')
  console.log('  - Expense requests: 1 pending, 2 approved')
  console.log('  - Onboarding in progress: Luca Arancio (Apprendista)')
  console.log('  - DVR acknowledgments: Created for all senior employees')
  console.log('  - Disciplinary code: Active and acknowledged by all')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
