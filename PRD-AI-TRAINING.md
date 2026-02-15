# PRD - AI Training System per Ordinia

## Executive Summary

Sistema di training AI conversazionale per Ordinia che permette agli operatori di addestrare l'intelligenza artificiale attraverso chat, correzioni e creazione di regole automatiche.

## Obiettivi

1. Permettere agli operatori di correggere errori AI via chat
2. Apprendere dalle correzioni per migliorare nel tempo
3. Creare regole automatiche basate sul feedback
4. Integrare il training in tutti i moduli HR esistenti

## Architettura

### Stack
- LLM: OpenAI GPT-4o con function calling
- Framework: Next.js 16 + React 19
- Database: PostgreSQL via Prisma
- Real-time: Server-Sent Events

### Modelli Dati

```prisma
model TrainingConversation {
  id            String   @id @default(cuid())
  tenantId      String
  userId        String
  context       String   // modulo: attendance, payslip, safety, etc.
  contextId     String?  // ID entità correlata
  status        TrainingStatus @default(ACTIVE)
  title         String?
  messages      TrainingMessage[]
  corrections   TrainingCorrection[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  tenant        Tenant   @relation(fields: [tenantId], references: [id])
  user          User     @relation(fields: [userId], references: [id])
}

model TrainingMessage {
  id              String   @id @default(cuid())
  conversationId  String
  role            MessageRole
  content         String
  functionCall    Json?
  createdAt       DateTime @default(now())

  conversation    TrainingConversation @relation(...)
}

model TrainingCorrection {
  id              String   @id @default(cuid())
  conversationId  String
  tenantId        String
  module          String
  originalValue   Json
  correctedValue  Json
  ruleExtracted   String?
  applied         Boolean  @default(false)
  createdAt       DateTime @default(now())

  conversation    TrainingConversation @relation(...)
  tenant          Tenant   @relation(...)
}

model AIRule {
  id            String   @id @default(cuid())
  tenantId      String
  module        String
  condition     String
  action        String
  confidence    Float    @default(0.5)
  usageCount    Int      @default(0)
  successCount  Int      @default(0)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  tenant        Tenant   @relation(...)
}

enum TrainingStatus { ACTIVE, RESOLVED, ARCHIVED }
enum MessageRole { USER, ASSISTANT, SYSTEM }
```

### Componenti React

1. **TrainingDrawer** - Drawer laterale 40% per chat AI
2. **ChatMessage** - Singolo messaggio nella conversazione
3. **QuickFixDialog** - Dialog per correzioni rapide
4. **TrainingFAB** - Floating Action Button per aprire training
5. **TrainingStats** - Widget statistiche training

### API Routes

```
/api/training/
├── conversations/          GET, POST
├── conversations/[id]/     GET, PATCH
├── conversations/[id]/messages/  POST (+ GPT-4)
├── corrections/           GET, POST
├── corrections/[id]/      PATCH
├── rules/                 GET, POST
├── rules/[id]/            PATCH, DELETE
├── suggest/               POST
└── stats/                 GET
```

### Pagine

```
/ai-training/              Dashboard training
/ai-training/conversations Lista conversazioni
/ai-training/rules         Gestione regole AI
/ai-training/train         Training proattivo full-screen
```

## Fasi Implementazione

| Fase | Task | File |
|------|------|------|
| 1 | Schema Prisma | prisma/schema.prisma |
| 2 | API Conversations | app/src/app/api/training/* |
| 3 | API Rules + Corrections | app/src/app/api/training/* |
| 4 | Componenti UI | app/src/components/training/* |
| 5 | Integrazione OpenAI | app/src/lib/openai-training.ts |
| 6 | Pagine Dashboard | app/src/app/(dashboard)/ai-training/* |
| 7 | FAB + Layout Integration | app/src/components/layout/* |
| 8 | Testing | Verifica E2E |

## Contesti Training per Modulo

| Modulo | context | Uso tipico |
|--------|---------|------------|
| Presenze | attendance | Correggere anomalie timbrature |
| Cedolini | payslip | Spiegare voci stipendio |
| Ferie | leaves | Regole approvazione automatica |
| Onboarding | onboarding | Personalizzare checklist |
| Sicurezza | safety | Regole DPI e formazione |
| Disciplinare | disciplinary | Classificazione infrazioni |
| Note Spese | expenses | Categorizzazione spese |

## Metriche Successo

- Tempo medio risoluzione: < 2 minuti
- Regole create per tenant: > 10/mese
- Accuratezza regole: > 85%
- Adoption rate: > 60% operatori

---
Documento creato: 2026-02-09
Autore: Claude AI Architect
