import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create super admin user
  const hashedPassword = await bcrypt.hash('SuperAdmin2025!', 12)

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@geniushr.it' },
    update: {},
    create: {
      email: 'admin@geniushr.it',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      emailVerified: new Date()
    }
  })

  console.log('Created super admin:', superAdmin.email)

  // Create demo tenant
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Studio Demo',
      slug: 'demo',
      plan: 'PROFESSIONAL',
      subscriptionStatus: 'ACTIVE',
      primaryColor: '#2563eb',
      secondaryColor: '#10b981'
    }
  })

  console.log('Created demo tenant:', demoTenant.slug)

  // Create demo HR user
  const demoPassword = await bcrypt.hash('Demo2025!', 12)

  const demoUser = await prisma.user.upsert({
    where: { email: 'hr@demo.geniushr.it' },
    update: {},
    create: {
      email: 'hr@demo.geniushr.it',
      name: 'Mario Rossi',
      password: demoPassword,
      role: 'ADMIN',
      emailVerified: new Date()
    }
  })

  // Link demo user to demo tenant
  await prisma.tenantMember.upsert({
    where: {
      userId_tenantId: {
        userId: demoUser.id,
        tenantId: demoTenant.id
      }
    },
    update: {},
    create: {
      userId: demoUser.id,
      tenantId: demoTenant.id,
      role: 'OWNER'
    }
  })

  console.log('Created demo user:', demoUser.email)

  // Create demo employees
  const employees = [
    {
      firstName: 'Anna',
      lastName: 'Bianchi',
      email: 'anna.bianchi@demo.it',
      jobTitle: 'ASO',
      department: 'Clinica',
      contractType: 'FULL_TIME' as const,
      ccnlLevel: '4',
      hireDate: new Date('2023-03-15'),
      status: 'ACTIVE' as const
    },
    {
      firstName: 'Luca',
      lastName: 'Verdi',
      email: 'luca.verdi@demo.it',
      jobTitle: 'Segretario',
      department: 'Amministrazione',
      contractType: 'PART_TIME' as const,
      ccnlLevel: '5',
      hireDate: new Date('2024-01-10'),
      status: 'ACTIVE' as const
    },
    {
      firstName: 'Giulia',
      lastName: 'Neri',
      email: 'giulia.neri@demo.it',
      jobTitle: 'ASO',
      department: 'Clinica',
      contractType: 'APPRENTICE' as const,
      ccnlLevel: '5',
      hireDate: new Date('2024-06-01'),
      probationEndsAt: new Date('2024-12-01'),
      status: 'PROBATION' as const
    }
  ]

  for (const emp of employees) {
    await prisma.employee.upsert({
      where: {
        id: `demo-${emp.firstName.toLowerCase()}`
      },
      update: {},
      create: {
        id: `demo-${emp.firstName.toLowerCase()}`,
        tenantId: demoTenant.id,
        ...emp
      }
    })
  }

  console.log('Created demo employees')

  // Create demo deadlines
  const deadlines = [
    {
      title: 'Rinnovo Formazione Sicurezza - Anna Bianchi',
      type: 'TRAINING_EXPIRY' as const,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      employeeId: 'demo-anna'
    },
    {
      title: 'Visita Medica Periodica - Luca Verdi',
      type: 'MEDICAL_VISIT' as const,
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      employeeId: 'demo-luca'
    },
    {
      title: 'Fine Periodo di Prova - Giulia Neri',
      type: 'PROBATION_END' as const,
      dueDate: new Date('2024-12-01'),
      employeeId: 'demo-giulia'
    }
  ]

  for (const deadline of deadlines) {
    await prisma.deadline.create({
      data: {
        tenantId: demoTenant.id,
        ...deadline,
        notify30Days: true
      }
    })
  }

  console.log('Created demo deadlines')

  // Create default onboarding checklist
  const checklist = await prisma.onboardingChecklist.upsert({
    where: { id: 'default-checklist' },
    update: {},
    create: {
      id: 'default-checklist',
      tenantId: demoTenant.id,
      name: 'Checklist Nuova Assunzione',
      description: 'Checklist standard per onboarding nuovi dipendenti',
      isDefault: true
    }
  })

  const checklistItems = [
    { title: 'Raccolta documenti di identita', category: 'Documenti', order: 1 },
    { title: 'Copia codice fiscale', category: 'Documenti', order: 2 },
    { title: 'Contratto di lavoro firmato', category: 'Documenti', order: 3 },
    { title: 'Informativa privacy firmata', category: 'GDPR', order: 4 },
    { title: 'Consenso trattamento dati', category: 'GDPR', order: 5 },
    { title: 'Formazione sicurezza generale', category: 'Formazione', order: 6 },
    { title: 'Formazione sicurezza specifica', category: 'Formazione', order: 7 },
    { title: 'Visita medica preassuntiva', category: 'Sicurezza', order: 8 },
    { title: 'Consegna DPI', category: 'Sicurezza', order: 9 },
    { title: 'Creazione badge/accessi', category: 'IT', order: 10 },
    { title: 'Creazione email aziendale', category: 'IT', order: 11 }
  ]

  for (const item of checklistItems) {
    await prisma.onboardingChecklistItem.create({
      data: {
        checklistId: checklist.id,
        ...item,
        required: true
      }
    })
  }

  console.log('Created onboarding checklist')

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
