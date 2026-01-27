# GeniusHR - Specifica Progetto Completa

**Versione:** 2.0
**Data:** 26 Gennaio 2026
**Autore:** Claude + Piero Natale Civero

---

## 1. OVERVIEW

GeniusHR è un SaaS di gestione HR per PMI italiane con focus su:
- Compliance normativa (GDPR, D.Lgs. 81/2008, Art. 7 Statuto Lavoratori, D.Lgs. 24/2023)
- Gestione documentale con firma incontestabile
- Multi-ruolo (Gestore, Dipendente, Consulente del Lavoro)
- Presenze, ferie, permessi, spese e trasferte

---

## 2. ARCHITETTURA RUOLI

### 2.1 Ruoli Disponibili

| Ruolo | Codice | Descrizione | Accesso Multi-Tenant |
|-------|--------|-------------|----------------------|
| **Gestore/Imprenditore** | `OWNER` | Titolare azienda, accesso completo | No (solo sua azienda) |
| **Manager** | `MANAGER` | Responsabile HR, quasi tutti i permessi | No (solo sua azienda) |
| **Dipendente** | `EMPLOYEE` | Lavoratore, accesso limitato al proprio fascicolo | No (solo sua azienda) |
| **Consulente del Lavoro** | `CONSULTANT` | Professionista esterno | **Sì** (più aziende clienti) |

### 2.2 Permessi per Ruolo

```
OWNER/MANAGER:
├── Dashboard completa
├── Gestione dipendenti (CRUD)
├── Fascicoli dipendenti (tutti)
├── Appunti privati su dipendenti
├── Caricamento documenti aziendali
├── Assegnazione documenti da firmare
├── Visualizzazione audit trail firme
├── Approvazione ferie/permessi
├── Gestione presenze
├── Approvazione spese/trasferte
├── Compliance e sicurezza
├── Impostazioni azienda

EMPLOYEE:
├── La mia dashboard
├── Il mio fascicolo (solo lettura)
├── I miei documenti (contratto, buste paga)
├── Documenti da firmare
├── Richiesta ferie/permessi
├── Timbratura presenze
├── Richiesta rimborsi spese
├── Il mio profilo

CONSULTANT:
├── Lista aziende clienti (multi-tenant)
├── Accesso come OWNER a ogni azienda cliente
├── Dashboard cross-aziende
├── Scadenze aggregate
├── Caricamento massivo buste paga
├── Report compliance multi-azienda
```

---

## 3. STRUTTURA MENU SIDEBAR

### 3.1 Menu Gestore (OWNER/MANAGER)

```
📊 Dashboard

👥 Dipendenti
   ├── Lista Dipendenti
   ├── Nuovo Dipendente
   └── [Dipendente] → Fascicolo
       ├── Anagrafica
       ├── Documenti
       ├── Buste Paga
       ├── Appunti Privati (solo gestore)
       ├── Formazione
       ├── Scadenze
       └── Storico Firme

📄 Documenti
   ├── Documenti Aziendali
   ├── Carica Documento
   ├── Assegna da Firmare
   └── Archivio Firmati

⏰ Presenze
   ├── Timbrature Oggi
   ├── Calendario Presenze
   ├── Report Mensile
   └── Anomalie

🏖️ Ferie e Permessi
   ├── Richieste da Approvare
   ├── Calendario Team
   ├── Storico
   └── Residui Ferie

💰 Spese e Trasferte
   ├── Richieste da Approvare
   ├── Rimborsi Chilometrici
   └── Storico Spese

🎓 Onboarding
   ├── Timeline Attive
   └── Nuovo Onboarding

✅ Compliance
   ├── Dashboard Compliance
   ├── Audit Log
   └── GDPR Consensi

🛡️ Sicurezza Lavoro
   ├── Formazione 81/08
   ├── DVR Presa Visione
   └── Scadenze Sicurezza

⚖️ Disciplinare
   ├── Procedure Attive
   ├── Codice Disciplinare
   └── Archivio

🔔 Whistleblowing

⚙️ Impostazioni
   ├── Profilo
   ├── Organizzazione
   ├── Branding
   ├── Notifiche
   └── Abbonamento
```

### 3.2 Menu Dipendente (EMPLOYEE)

```
📊 La Mia Dashboard

📁 Il Mio Fascicolo
   ├── I Miei Documenti
   ├── Le Mie Buste Paga
   ├── I Miei Attestati
   └── Storico Firme

✍️ Da Firmare
   └── Documenti in attesa

⏰ Presenze
   ├── Timbra Entrata/Uscita
   └── Le Mie Presenze

🏖️ Ferie e Permessi
   ├── Nuova Richiesta
   ├── Le Mie Richieste
   └── Il Mio Residuo

💰 Spese e Trasferte
   ├── Nuova Richiesta Rimborso
   └── Le Mie Richieste

🎓 La Mia Formazione

👤 Il Mio Profilo
```

### 3.3 Menu Consulente (CONSULTANT)

```
📊 Dashboard Consulente

🏢 I Miei Clienti
   ├── Lista Aziende
   └── [Azienda] → Accesso completo

📅 Scadenze Cross-Aziende
   ├── Tutte le Scadenze
   └── Per Azienda

📤 Caricamento Massivo
   ├── Buste Paga
   └── Documenti

📊 Report
   ├── Compliance Aggregato
   └── Statistiche

⚙️ Impostazioni
```

---

## 4. MODELLI DATABASE (PRISMA)

### 4.1 Nuovi Modelli da Aggiungere

```prisma
// Ruoli utente nel tenant
enum TenantRole {
  OWNER
  MANAGER
  EMPLOYEE
  CONSULTANT
}

// Aggiornare TenantMember esistente
model TenantMember {
  id        String     @id @default(cuid())
  userId    String
  tenantId  String
  role      TenantRole @default(EMPLOYEE)
  // ... altri campi esistenti
}

// Collegamento Consulente-Aziende (multi-tenant)
model ConsultantClient {
  id           String   @id @default(cuid())
  consultantId String   // User ID del consulente
  tenantId     String   // Azienda cliente
  addedAt      DateTime @default(now())
  addedBy      String?  // Chi ha aggiunto il collegamento
  isActive     Boolean  @default(true)

  consultant   User     @relation("ConsultantClients", fields: [consultantId], references: [id])
  tenant       Tenant   @relation(fields: [tenantId], references: [id])

  @@unique([consultantId, tenantId])
  @@index([consultantId])
  @@index([tenantId])
}

// Fascicolo Dipendente - Appunti Privati Gestore
model EmployeeNote {
  id         String   @id @default(cuid())
  employeeId String
  authorId   String
  tenantId   String
  content    String   @db.Text
  category   NoteCategory @default(GENERAL)
  isPrivate  Boolean  @default(true) // Solo visibile a OWNER/MANAGER
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  employee   Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  author     User     @relation(fields: [authorId], references: [id])
  tenant     Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([employeeId])
  @@index([tenantId])
}

enum NoteCategory {
  GENERAL
  PERFORMANCE
  BEHAVIOR
  MEETING
  WARNING
  POSITIVE
}

// Buste Paga
model Payslip {
  id           String   @id @default(cuid())
  employeeId   String
  tenantId     String
  period       String   // "2026-01" formato YYYY-MM
  grossAmount  Decimal? @db.Decimal(10, 2)
  netAmount    Decimal? @db.Decimal(10, 2)
  fileName     String
  fileUrl      String
  fileSize     Int?
  uploadedBy   String
  uploadedAt   DateTime @default(now())
  viewedAt     DateTime? // Quando il dipendente l'ha vista
  viewedIp     String?

  employee     Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  tenant       Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  uploader     User     @relation(fields: [uploadedBy], references: [id])

  @@unique([employeeId, period])
  @@index([tenantId])
  @@index([employeeId])
}

// Documenti da Firmare
model DocumentSignatureRequest {
  id              String   @id @default(cuid())
  tenantId        String
  documentId      String   // Riferimento al documento
  employeeId      String
  requestedBy     String
  requestedAt     DateTime @default(now())
  dueDate         DateTime?
  reminderSent    Boolean  @default(false)
  reminderSentAt  DateTime?
  status          SignatureStatus @default(PENDING)

  // Campi firma (compilati quando firma)
  signedAt        DateTime?
  signatureData   Json?    // Dati firma completi

  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  document        Document @relation(fields: [documentId], references: [id])
  employee        Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  requester       User     @relation(fields: [requestedBy], references: [id])

  @@index([tenantId])
  @@index([employeeId])
  @@index([status])
}

enum SignatureStatus {
  PENDING
  VIEWED
  SIGNED
  REJECTED
  EXPIRED
}

// Audit Trail Firma (prova legale)
model SignatureAuditLog {
  id                  String   @id @default(cuid())
  signatureRequestId  String
  tenantId            String
  employeeId          String
  action              SignatureAction
  timestamp           DateTime @default(now())

  // Dati forensi
  ipAddress           String
  userAgent           String
  deviceFingerprint   String?
  geoLocation         Json?    // {city, region, country, lat, lng}

  // Per azione SIGNED
  passwordVerified    Boolean?
  otpMethod           String?  // "email" | "totp" | "sms"
  otpVerified         Boolean?
  confirmationPhrase  String?  // Frase digitata dall'utente
  documentHash        String?  // SHA-256 del documento

  // Scroll tracking
  scrollPercentage    Int?     // 0-100
  timeOnDocument      Int?     // Secondi
  pagesViewed         Int?

  signatureRequest    DocumentSignatureRequest @relation(fields: [signatureRequestId], references: [id])
  tenant              Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([signatureRequestId])
  @@index([tenantId])
  @@index([employeeId])
}

enum SignatureAction {
  DOCUMENT_OPENED
  PAGE_VIEWED
  SCROLLED
  PASSWORD_ENTERED
  OTP_REQUESTED
  OTP_VERIFIED
  PHRASE_TYPED
  SIGNED
  REJECTED
  CERTIFICATE_GENERATED
}

// Timbrature Presenze
model TimeEntry {
  id           String    @id @default(cuid())
  employeeId   String
  tenantId     String
  date         DateTime  @db.Date
  clockIn      DateTime?
  clockOut     DateTime?

  // Geolocalizzazione
  clockInLat   Decimal?  @db.Decimal(10, 8)
  clockInLng   Decimal?  @db.Decimal(11, 8)
  clockInAddress String?
  clockOutLat  Decimal?  @db.Decimal(10, 8)
  clockOutLng  Decimal?  @db.Decimal(11, 8)
  clockOutAddress String?

  // Metadati
  clockInIp    String?
  clockOutIp   String?
  clockInDevice String?
  clockOutDevice String?

  // Calcoli
  workedMinutes Int?
  breakMinutes  Int?     @default(0)
  overtimeMinutes Int?   @default(0)

  // Status
  status       TimeEntryStatus @default(PENDING)
  notes        String?
  approvedBy   String?
  approvedAt   DateTime?

  employee     Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  tenant       Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  approver     User?    @relation(fields: [approvedBy], references: [id])

  @@unique([employeeId, date])
  @@index([tenantId])
  @@index([date])
}

enum TimeEntryStatus {
  PENDING
  APPROVED
  REJECTED
  ANOMALY
}

// Richieste Ferie e Permessi
model LeaveRequest {
  id           String   @id @default(cuid())
  employeeId   String
  tenantId     String
  type         LeaveType
  startDate    DateTime @db.Date
  endDate      DateTime @db.Date
  startHalf    Boolean  @default(false) // Mezza giornata inizio
  endHalf      Boolean  @default(false) // Mezza giornata fine
  totalDays    Decimal  @db.Decimal(4, 1)
  reason       String?
  status       LeaveStatus @default(PENDING)

  requestedAt  DateTime @default(now())
  reviewedBy   String?
  reviewedAt   DateTime?
  reviewNotes  String?

  employee     Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  tenant       Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  reviewer     User?    @relation(fields: [reviewedBy], references: [id])

  @@index([tenantId])
  @@index([employeeId])
  @@index([status])
}

enum LeaveType {
  VACATION        // Ferie
  SICK            // Malattia
  PERSONAL        // Permesso personale
  PARENTAL        // Congedo parentale
  BEREAVEMENT     // Lutto
  MARRIAGE        // Matrimonio
  STUDY           // Studio/esami
  BLOOD_DONATION  // Donazione sangue
  UNION           // Permesso sindacale
  MEDICAL_VISIT   // Visita medica
  OTHER           // Altro
}

enum LeaveStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}

// Saldo Ferie/Permessi per Anno
model LeaveBalance {
  id           String   @id @default(cuid())
  employeeId   String
  tenantId     String
  year         Int

  // Ferie
  vacationTotal     Decimal @db.Decimal(5, 2) @default(0)
  vacationUsed      Decimal @db.Decimal(5, 2) @default(0)
  vacationRemaining Decimal @db.Decimal(5, 2) @default(0)
  vacationCarryOver Decimal @db.Decimal(5, 2) @default(0) // Da anno precedente

  // Permessi (ROL)
  permitsTotal      Decimal @db.Decimal(5, 2) @default(0)
  permitsUsed       Decimal @db.Decimal(5, 2) @default(0)
  permitsRemaining  Decimal @db.Decimal(5, 2) @default(0)

  // Ex festività
  exFestTotal       Decimal @db.Decimal(5, 2) @default(0)
  exFestUsed        Decimal @db.Decimal(5, 2) @default(0)
  exFestRemaining   Decimal @db.Decimal(5, 2) @default(0)

  updatedAt    DateTime @updatedAt

  employee     Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  tenant       Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([employeeId, year])
  @@index([tenantId])
}

// Richieste Rimborso Spese
model ExpenseRequest {
  id           String   @id @default(cuid())
  employeeId   String
  tenantId     String
  type         ExpenseType
  date         DateTime @db.Date
  description  String
  amount       Decimal  @db.Decimal(10, 2)
  currency     String   @default("EUR")

  // Per rimborsi chilometrici
  kilometers   Decimal? @db.Decimal(8, 2)
  ratePerKm    Decimal? @db.Decimal(4, 3) // Tariffa ACI
  origin       String?
  destination  String?
  vehicleType  String?  // Auto, moto, etc.

  // Allegati
  receipts     ExpenseReceipt[]

  status       ExpenseStatus @default(PENDING)
  requestedAt  DateTime @default(now())
  reviewedBy   String?
  reviewedAt   DateTime?
  reviewNotes  String?
  paidAt       DateTime?

  employee     Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  tenant       Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  reviewer     User?    @relation(fields: [reviewedBy], references: [id])

  @@index([tenantId])
  @@index([employeeId])
  @@index([status])
}

enum ExpenseType {
  TRAVEL          // Viaggio
  ACCOMMODATION   // Alloggio
  MEALS           // Pasti
  TRANSPORT       // Trasporto
  MILEAGE         // Rimborso km
  PARKING         // Parcheggio
  TOLL            // Pedaggio
  PHONE           // Telefono
  SUPPLIES        // Materiali
  OTHER           // Altro
}

enum ExpenseStatus {
  PENDING
  APPROVED
  REJECTED
  PAID
}

// Allegati Spese (scontrini, ricevute)
model ExpenseReceipt {
  id           String   @id @default(cuid())
  expenseId    String
  fileName     String
  fileUrl      String
  fileSize     Int?
  mimeType     String?
  uploadedAt   DateTime @default(now())

  expense      ExpenseRequest @relation(fields: [expenseId], references: [id], onDelete: Cascade)

  @@index([expenseId])
}

// Codici OTP per firma
model OtpCode {
  id           String   @id @default(cuid())
  userId       String
  code         String
  type         OtpType
  purpose      String   // "document_signature", "login", etc.
  referenceId  String?  // ID del documento/richiesta
  expiresAt    DateTime
  usedAt       DateTime?
  attempts     Int      @default(0)
  maxAttempts  Int      @default(3)
  createdAt    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([code])
}

enum OtpType {
  EMAIL
  SMS
  TOTP
}

// Inviti dipendenti
model EmployeeInvite {
  id           String   @id @default(cuid())
  tenantId     String
  email        String
  role         TenantRole @default(EMPLOYEE)
  employeeId   String?  // Se collegato a un Employee esistente
  invitedBy    String
  token        String   @unique
  expiresAt    DateTime
  acceptedAt   DateTime?
  createdAt    DateTime @default(now())

  tenant       Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  inviter      User     @relation(fields: [invitedBy], references: [id])
  employee     Employee? @relation(fields: [employeeId], references: [id])

  @@index([tenantId])
  @@index([email])
  @@index([token])
}

// Inviti consulente
model ConsultantInvite {
  id           String   @id @default(cuid())
  tenantId     String
  email        String
  invitedBy    String
  token        String   @unique
  expiresAt    DateTime
  acceptedAt   DateTime?
  createdAt    DateTime @default(now())

  tenant       Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  inviter      User     @relation(fields: [invitedBy], references: [id])

  @@index([tenantId])
  @@index([email])
  @@index([token])
}

// Tariffe ACI per rimborsi km
model MileageRate {
  id           String   @id @default(cuid())
  vehicleType  String   // "AUTO_BENZINA", "AUTO_DIESEL", "AUTO_ELETTRICA", "MOTO"
  year         Int
  ratePerKm    Decimal  @db.Decimal(4, 3)
  source       String?  // "ACI 2026"
  validFrom    DateTime
  validTo      DateTime?

  @@unique([vehicleType, year])
}
```

---

## 5. SISTEMA FIRMA INCONTESTABILE

### 5.1 Flusso Firma Documento

```
1. GESTORE ASSEGNA DOCUMENTO
   └── Crea DocumentSignatureRequest (status: PENDING)

2. DIPENDENTE RICEVE NOTIFICA
   └── Email + notifica in-app

3. DIPENDENTE APRE DOCUMENTO
   ├── Log: DOCUMENT_OPENED (IP, device, timestamp)
   └── Inizia scroll tracking

4. DIPENDENTE LEGGE DOCUMENTO
   ├── Log: PAGE_VIEWED per ogni pagina
   ├── Log: SCROLLED con percentuale
   └── Controllo tempo minimo (es. 30 sec per pagina)

5. DIPENDENTE CLICCA "FIRMA"
   ├── Modal conferma identità
   │
   ├── STEP 1: Password
   │   ├── Input password account
   │   ├── Verifica server-side
   │   └── Log: PASSWORD_ENTERED (verified: true/false)
   │
   ├── STEP 2: OTP
   │   ├── Scelta metodo (Email raccomandato, TOTP se configurato)
   │   ├── Invio OTP 6 cifre
   │   ├── Input OTP
   │   ├── Verifica (max 3 tentativi, scade in 5 min)
   │   └── Log: OTP_VERIFIED (method, verified: true/false)
   │
   └── STEP 3: Dichiarazione
       ├── Checkbox: "Dichiaro di aver letto e compreso il documento"
       ├── Input: Digitare "IO [NOME COGNOME] CONFERMO"
       ├── Verifica match esatto (case insensitive)
       └── Log: PHRASE_TYPED (phrase)

6. FIRMA COMPLETATA
   ├── Calcola hash SHA-256 documento
   ├── Salva signatureData JSON completo
   ├── Genera PDF certificato con tutti i dati
   ├── Log: SIGNED + CERTIFICATE_GENERATED
   ├── Invia email conferma al dipendente
   └── Notifica gestore

7. ARCHIVIAZIONE
   ├── Documento + certificato conservati
   └── Audit trail immutabile
```

### 5.2 Struttura signatureData (JSON)

```json
{
  "version": "1.0",
  "signedAt": "2026-01-26T14:30:00.000Z",
  "document": {
    "id": "doc_abc123",
    "name": "Contratto di lavoro",
    "hash": "sha256:a1b2c3d4e5f6...",
    "version": 1
  },
  "signer": {
    "userId": "user_xyz789",
    "employeeId": "emp_456",
    "name": "Mario Rossi",
    "email": "mario.rossi@email.com"
  },
  "verification": {
    "passwordVerified": true,
    "passwordVerifiedAt": "2026-01-26T14:28:30.000Z",
    "otpMethod": "email",
    "otpVerified": true,
    "otpVerifiedAt": "2026-01-26T14:29:15.000Z",
    "confirmationPhrase": "IO MARIO ROSSI CONFERMO",
    "phraseVerifiedAt": "2026-01-26T14:29:45.000Z"
  },
  "reading": {
    "documentOpenedAt": "2026-01-26T14:20:00.000Z",
    "timeOnDocument": 540,
    "scrollPercentage": 100,
    "pagesViewed": 5,
    "totalPages": 5
  },
  "forensics": {
    "ipAddress": "93.186.255.100",
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0...",
    "deviceFingerprint": "fp_abc123xyz",
    "geoLocation": {
      "city": "Monterotondo",
      "region": "Lazio",
      "country": "IT",
      "lat": 42.0543,
      "lng": 12.6231
    }
  },
  "certificate": {
    "id": "cert_def456",
    "generatedAt": "2026-01-26T14:30:05.000Z",
    "fileUrl": "/certificates/cert_def456.pdf"
  }
}
```

### 5.3 PDF Certificato Firma

Il PDF generato contiene:
- Dati documento firmato
- Nome e cognome firmatario
- Data e ora firma (timestamp preciso)
- Indirizzo IP
- Dispositivo utilizzato
- Geolocalizzazione
- Metodo verifica (password + OTP email)
- Frase di conferma digitata
- Hash SHA-256 documento
- QR code per verifica online

---

## 6. SISTEMA PRESENZE

### 6.1 Timbratura con Geolocalizzazione

```
FLUSSO TIMBRATURA ENTRATA:
1. Dipendente apre app/PWA
2. Click "Timbra Entrata"
3. Richiesta permesso geolocalizzazione
4. Acquisizione coordinate GPS
5. Reverse geocoding → indirizzo
6. Verifica distanza da sede (opzionale, configurabile)
7. Salvataggio TimeEntry con tutti i dati
8. Conferma visiva con mappa

FLUSSO TIMBRATURA USCITA:
1. Click "Timbra Uscita"
2. Acquisizione GPS
3. Calcolo ore lavorate
4. Salvataggio
5. Riepilogo giornata

ANTI-FRODE:
- Geolocalizzazione obbligatoria
- IP tracking
- Device fingerprint
- Impossibile timbrare da browser desktop (solo mobile/PWA)
- Alert se timbratura fuori zona consentita
```

### 6.2 Dashboard Presenze Gestore

- Mappa live con posizione timbrature
- Lista presenti oggi
- Lista assenti non giustificati
- Anomalie (timbrature mancanti, fuori zona)
- Report mensile per dipendente
- Export Excel/PDF

---

## 7. SISTEMA FERIE E PERMESSI

### 7.1 Flusso Richiesta

```
1. DIPENDENTE
   ├── Seleziona tipo (ferie, permesso, malattia, etc.)
   ├── Seleziona date (con calendario visuale)
   ├── Opzione mezza giornata
   ├── Motivo (opzionale per ferie, obbligatorio per altri)
   └── Invia richiesta

2. SISTEMA
   ├── Verifica saldo disponibile
   ├── Verifica sovrapposizioni con altri
   ├── Notifica manager via email
   └── Aggiorna calendario team

3. MANAGER
   ├── Vede richiesta in dashboard
   ├── Vede calendario team per verificare copertura
   ├── Approva o rifiuta con note
   └── Sistema notifica dipendente

4. POST-APPROVAZIONE
   ├── Aggiorna saldo ferie/permessi
   ├── Aggiorna calendario condiviso
   └── Reminder il giorno prima
```

### 7.2 Calcolo Saldi Automatico

- Maturazione mensile ferie (es. 2.17 giorni/mese per 26 annuali)
- ROL secondo CCNL
- Ex festività
- Riporto anno precedente (con scadenza)
- Storico utilizzo

---

## 8. SISTEMA SPESE E TRASFERTE

### 8.1 Flusso Richiesta Rimborso

```
1. DIPENDENTE
   ├── Seleziona tipo spesa
   ├── Data e importo
   ├── Descrizione
   ├── Upload scontrino/ricevuta (foto)
   └── Per km: origine, destinazione, veicolo

2. PER RIMBORSI KM
   ├── Calcolo automatico distanza (Google Maps API o manuale)
   ├── Applicazione tariffa ACI corrente
   └── Calcolo importo automatico

3. MANAGER
   ├── Revisione richiesta
   ├── Verifica allegati
   ├── Approva/rifiuta
   └── Notifica dipendente

4. AMMINISTRAZIONE
   ├── Export per pagamento
   └── Segna come pagato
```

### 8.2 Tariffe ACI 2026

Precaricate nel sistema, aggiornabili annualmente.

---

## 9. AREA CONSULENTE DEL LAVORO

### 9.1 Multi-Tenant Access

Il consulente può:
- Essere invitato da un'azienda (gestore invia invito)
- Auto-registrarsi e richiedere collegamento
- Vedere lista di tutte le aziende clienti
- Accedere a ogni azienda con permessi OWNER-like (read + alcune write)

### 9.2 Funzioni Specifiche

- **Dashboard aggregata**: scadenze, anomalie, compliance di tutti i clienti
- **Caricamento massivo buste paga**: upload Excel/CSV con mapping automatico
- **Report cross-aziende**: compliance, formazione, scadenze
- **Notifiche aggregate**: un'email con riepilogo tutti i clienti

---

## 10. STRUTTURA FILE E CARTELLE

```
app/src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── invite/
│   │       ├── employee/[token]/
│   │       └── consultant/[token]/
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx  ← Sidebar dinamica per ruolo
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx  ← Redirect a dashboard corretta per ruolo
│   │   │
│   │   ├── manager/  ← Area Gestore/Manager
│   │   │   ├── dashboard/
│   │   │   ├── employees/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx  ← Fascicolo
│   │   │   │       ├── documents/
│   │   │   │       ├── payslips/
│   │   │   │       ├── notes/  ← Appunti privati
│   │   │   │       └── signatures/
│   │   │   ├── documents/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── upload/
│   │   │   │   └── assign/
│   │   │   ├── attendance/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── today/
│   │   │   │   └── reports/
│   │   │   ├── leave/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── requests/
│   │   │   │   └── calendar/
│   │   │   ├── expenses/
│   │   │   │   ├── page.tsx
│   │   │   │   └── mileage/
│   │   │   ├── onboarding/
│   │   │   ├── compliance/
│   │   │   ├── safety/
│   │   │   ├── disciplinary/
│   │   │   └── whistleblowing/
│   │   │
│   │   ├── employee/  ← Area Dipendente
│   │   │   ├── dashboard/
│   │   │   ├── my-file/
│   │   │   │   ├── documents/
│   │   │   │   ├── payslips/
│   │   │   │   └── signatures/
│   │   │   ├── to-sign/
│   │   │   ├── attendance/
│   │   │   │   ├── clock/  ← Timbratura
│   │   │   │   └── history/
│   │   │   ├── leave/
│   │   │   │   ├── request/
│   │   │   │   └── history/
│   │   │   ├── expenses/
│   │   │   │   ├── request/
│   │   │   │   └── history/
│   │   │   ├── training/
│   │   │   └── profile/
│   │   │
│   │   ├── consultant/  ← Area Consulente
│   │   │   ├── dashboard/
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx  ← Lista aziende
│   │   │   │   └── [tenantId]/  ← Accesso azienda
│   │   │   ├── deadlines/
│   │   │   ├── bulk-upload/
│   │   │   │   ├── payslips/
│   │   │   │   └── documents/
│   │   │   └── reports/
│   │   │
│   │   └── settings/
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── employees/
│   │   ├── documents/
│   │   ├── signatures/
│   │   │   ├── request/
│   │   │   ├── verify-password/
│   │   │   ├── send-otp/
│   │   │   ├── verify-otp/
│   │   │   ├── complete/
│   │   │   └── certificate/
│   │   ├── attendance/
│   │   │   ├── clock-in/
│   │   │   ├── clock-out/
│   │   │   └── report/
│   │   ├── leave/
│   │   │   ├── request/
│   │   │   ├── approve/
│   │   │   ├── reject/
│   │   │   └── balance/
│   │   ├── expenses/
│   │   │   ├── request/
│   │   │   ├── approve/
│   │   │   └── mileage-rates/
│   │   ├── payslips/
│   │   ├── notes/  ← Appunti privati
│   │   ├── invites/
│   │   │   ├── employee/
│   │   │   └── consultant/
│   │   ├── consultant/
│   │   │   ├── clients/
│   │   │   └── bulk-upload/
│   │   └── otp/
│   │       ├── send/
│   │       └── verify/
│   │
│   └── (legal)/
│       ├── privacy/
│       ├── terms/
│       └── cookies/
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx  ← Dinamica per ruolo
│   │   ├── SidebarManager.tsx
│   │   ├── SidebarEmployee.tsx
│   │   └── SidebarConsultant.tsx
│   ├── signatures/
│   │   ├── SignatureModal.tsx
│   │   ├── PasswordStep.tsx
│   │   ├── OtpStep.tsx
│   │   ├── ConfirmationStep.tsx
│   │   ├── DocumentViewer.tsx
│   │   └── SignatureCertificate.tsx
│   ├── attendance/
│   │   ├── ClockButton.tsx
│   │   ├── AttendanceMap.tsx
│   │   └── AttendanceTable.tsx
│   ├── leave/
│   │   ├── LeaveRequestForm.tsx
│   │   ├── LeaveCalendar.tsx
│   │   └── LeaveBalance.tsx
│   ├── expenses/
│   │   ├── ExpenseForm.tsx
│   │   ├── MileageCalculator.tsx
│   │   └── ReceiptUpload.tsx
│   └── ...
│
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── permissions.ts  ← Verifica ruoli
│   ├── audit.ts  ← Audit logging
│   ├── otp.ts  ← Generazione/verifica OTP
│   ├── signature.ts  ← Logica firma
│   ├── certificate.ts  ← Generazione PDF certificato
│   ├── geolocation.ts  ← Utilities geo
│   └── mileage.ts  ← Calcoli km
│
└── middleware.ts  ← Protezione route per ruolo
```

---

## 11. API ROUTES PRINCIPALI

### 11.1 Autenticazione e Inviti

| Route | Method | Descrizione |
|-------|--------|-------------|
| `/api/invites/employee/send` | POST | Invita dipendente |
| `/api/invites/employee/accept` | POST | Accetta invito dipendente |
| `/api/invites/consultant/send` | POST | Invita consulente |
| `/api/invites/consultant/accept` | POST | Accetta invito consulente |

### 11.2 Firma Documenti

| Route | Method | Descrizione |
|-------|--------|-------------|
| `/api/signatures/request` | POST | Crea richiesta firma |
| `/api/signatures/pending` | GET | Lista documenti da firmare |
| `/api/signatures/[id]/view` | POST | Log apertura documento |
| `/api/signatures/[id]/verify-password` | POST | Verifica password |
| `/api/signatures/[id]/send-otp` | POST | Invia OTP |
| `/api/signatures/[id]/verify-otp` | POST | Verifica OTP |
| `/api/signatures/[id]/complete` | POST | Completa firma |
| `/api/signatures/[id]/certificate` | GET | Scarica certificato PDF |
| `/api/signatures/[id]/audit` | GET | Audit trail completo |

### 11.3 Presenze

| Route | Method | Descrizione |
|-------|--------|-------------|
| `/api/attendance/clock-in` | POST | Timbratura entrata |
| `/api/attendance/clock-out` | POST | Timbratura uscita |
| `/api/attendance/today` | GET | Presenze oggi |
| `/api/attendance/my-history` | GET | Storico personale |
| `/api/attendance/report` | GET | Report mensile |
| `/api/attendance/anomalies` | GET | Anomalie |

### 11.4 Ferie e Permessi

| Route | Method | Descrizione |
|-------|--------|-------------|
| `/api/leave/request` | POST | Nuova richiesta |
| `/api/leave/pending` | GET | Richieste da approvare |
| `/api/leave/[id]/approve` | POST | Approva |
| `/api/leave/[id]/reject` | POST | Rifiuta |
| `/api/leave/balance/[employeeId]` | GET | Saldo ferie |
| `/api/leave/calendar` | GET | Calendario team |

### 11.5 Spese

| Route | Method | Descrizione |
|-------|--------|-------------|
| `/api/expenses/request` | POST | Nuova richiesta |
| `/api/expenses/pending` | GET | Da approvare |
| `/api/expenses/[id]/approve` | POST | Approva |
| `/api/expenses/[id]/reject` | POST | Rifiuta |
| `/api/expenses/mileage-rates` | GET | Tariffe ACI |
| `/api/expenses/calculate-mileage` | POST | Calcola rimborso km |

### 11.6 Buste Paga

| Route | Method | Descrizione |
|-------|--------|-------------|
| `/api/payslips/upload` | POST | Upload singola |
| `/api/payslips/bulk-upload` | POST | Upload massivo |
| `/api/payslips/[employeeId]` | GET | Lista buste dipendente |
| `/api/payslips/[id]/view` | POST | Log visualizzazione |

### 11.7 Appunti Privati

| Route | Method | Descrizione |
|-------|--------|-------------|
| `/api/notes/[employeeId]` | GET | Lista note dipendente |
| `/api/notes` | POST | Crea nota |
| `/api/notes/[id]` | PUT | Modifica nota |
| `/api/notes/[id]` | DELETE | Elimina nota |

### 11.8 Consulente

| Route | Method | Descrizione |
|-------|--------|-------------|
| `/api/consultant/clients` | GET | Lista aziende cliente |
| `/api/consultant/switch/[tenantId]` | POST | Switch a azienda |
| `/api/consultant/deadlines` | GET | Scadenze aggregate |
| `/api/consultant/bulk-payslips` | POST | Upload massivo cross-tenant |

---

## 12. COMPONENTI UI PRINCIPALI

### 12.1 Sidebar Dinamica

```tsx
// Determina ruolo e renderizza sidebar appropriata
const role = getCurrentUserRole(session, tenantId)

switch (role) {
  case 'OWNER':
  case 'MANAGER':
    return <SidebarManager />
  case 'EMPLOYEE':
    return <SidebarEmployee />
  case 'CONSULTANT':
    return <SidebarConsultant />
}
```

### 12.2 Modal Firma Multi-Step

```
┌─────────────────────────────────────────┐
│  Firma Documento: Contratto di Lavoro   │
├─────────────────────────────────────────┤
│                                         │
│  Step 1 di 3: Verifica Password         │
│                                         │
│  Per confermare la tua identità,        │
│  inserisci la password del tuo account. │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ●●●●●●●●●●                      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [Annulla]              [Verifica →]    │
│                                         │
└─────────────────────────────────────────┘
```

### 12.3 Timbratura con Mappa

```
┌─────────────────────────────────────────┐
│         Timbra Presenza                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │         [MAPPA GPS]             │    │
│  │            📍                   │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  📍 Via Monte Circeo 12, Monterotondo   │
│  🕐 14:32:15                            │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │     🟢 TIMBRA ENTRATA           │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 13. SICUREZZA E VALIDAZIONI

### 13.1 Middleware Autorizzazione

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Route manager-only
  if (path.startsWith('/manager')) {
    const role = getUserRole(request)
    if (!['OWNER', 'MANAGER'].includes(role)) {
      return redirect('/employee/dashboard')
    }
  }

  // Route employee-only
  if (path.startsWith('/employee')) {
    const role = getUserRole(request)
    if (role !== 'EMPLOYEE') {
      return redirect('/manager/dashboard')
    }
  }

  // Route consultant-only
  if (path.startsWith('/consultant')) {
    const role = getUserRole(request)
    if (role !== 'CONSULTANT') {
      return redirect('/dashboard')
    }
  }
}
```

### 13.2 Validazioni API

- Verifica sempre tenantId dell'utente
- Consulente: verifica accesso al tenant richiesto
- Rate limiting su endpoint sensibili (OTP, login)
- Input sanitization
- CSRF protection

---

## 14. NOTIFICHE

### 14.1 Tipi Notifica

| Evento | Email | In-App | Push (PWA) |
|--------|-------|--------|------------|
| Documento da firmare | ✅ | ✅ | ✅ |
| Firma completata | ✅ | ✅ | - |
| Richiesta ferie (manager) | ✅ | ✅ | ✅ |
| Ferie approvate/rifiutate | ✅ | ✅ | ✅ |
| Richiesta spesa (manager) | ✅ | ✅ | - |
| Spesa approvata/rifiutata | ✅ | ✅ | - |
| Busta paga caricata | ✅ | ✅ | ✅ |
| Scadenza imminente | ✅ | ✅ | ✅ |
| Anomalia presenze | ✅ | ✅ | - |

---

## 15. PWA (Progressive Web App)

### 15.1 Configurazione

- `manifest.json` con icone e colori
- Service Worker per offline
- Add to Home Screen prompt
- Push notifications
- Geolocalizzazione (per timbratura)

### 15.2 Funzionalità Offline

- Coda timbrature offline → sync quando online
- Cache documenti già visualizzati
- Form offline → invio quando online

---

## 16. CHECKLIST IMPLEMENTAZIONE

### Fase 1: Schema e Infrastruttura
- [ ] Aggiornare schema Prisma con tutti i nuovi modelli
- [ ] Migrare database
- [ ] Creare seed con dati di test
- [ ] Implementare middleware autorizzazione
- [ ] Creare lib/permissions.ts

### Fase 2: Sistema Ruoli e Sidebar
- [ ] Aggiornare TenantMember con campo role
- [ ] Creare SidebarManager, SidebarEmployee, SidebarConsultant
- [ ] Implementare layout dinamico
- [ ] Creare redirect intelligente /dashboard

### Fase 3: Area Manager - Base
- [ ] Dashboard manager
- [ ] Lista dipendenti (esistente, aggiornare)
- [ ] Fascicolo dipendente
- [ ] Appunti privati (CRUD)
- [ ] Upload buste paga

### Fase 4: Sistema Firma
- [ ] Creare modelli signature
- [ ] API richiesta firma
- [ ] DocumentViewer con scroll tracking
- [ ] Modal firma multi-step
- [ ] Sistema OTP (email)
- [ ] Generazione certificato PDF
- [ ] Audit trail completo

### Fase 5: Area Dipendente
- [ ] Dashboard dipendente
- [ ] Il mio fascicolo
- [ ] Documenti da firmare
- [ ] Storico firme

### Fase 6: Presenze
- [ ] Modello TimeEntry
- [ ] API clock-in/clock-out
- [ ] Componente timbratura con GPS
- [ ] Dashboard presenze manager
- [ ] Storico presenze dipendente
- [ ] Report mensile

### Fase 7: Ferie e Permessi
- [ ] Modelli LeaveRequest, LeaveBalance
- [ ] Form richiesta
- [ ] Workflow approvazione
- [ ] Calendario team
- [ ] Calcolo saldi automatico

### Fase 8: Spese e Trasferte
- [ ] Modelli ExpenseRequest, ExpenseReceipt
- [ ] Form richiesta
- [ ] Upload scontrini
- [ ] Calcolatore rimborsi km
- [ ] Tariffe ACI
- [ ] Workflow approvazione

### Fase 9: Area Consulente
- [ ] Modello ConsultantClient
- [ ] Multi-tenant switching
- [ ] Dashboard aggregata
- [ ] Upload massivo buste paga
- [ ] Report cross-aziende

### Fase 10: Inviti e Onboarding
- [ ] Sistema inviti dipendente
- [ ] Sistema inviti consulente
- [ ] Pagine accettazione invito
- [ ] Email invito

### Fase 11: PWA
- [ ] manifest.json
- [ ] Service Worker
- [ ] Push notifications
- [ ] Offline support

### Fase 12: Testing e Polish
- [ ] Test manuali tutti i flussi
- [ ] Fix bug
- [ ] Ottimizzazione performance
- [ ] Deploy production

---

## 17. NOTE TECNICHE

### 17.1 Librerie da Aggiungere

```bash
npm install @react-pdf/renderer  # Generazione PDF certificati
npm install crypto-js           # Hash SHA-256
npm install ua-parser-js        # User agent parsing
npm install geoip-lite          # Geolocalizzazione da IP (fallback)
npm install otplib              # Generazione TOTP
npm install qrcode              # QR code per certificati
```

### 17.2 Variabili Ambiente

```env
# OTP
OTP_SECRET=your-secret-key
OTP_EXPIRY_MINUTES=5

# Geolocation
GOOGLE_MAPS_API_KEY=your-key  # Opzionale per reverse geocoding

# Email
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
```

---

*Documento generato automaticamente. Ultima modifica: 26/01/2026*
