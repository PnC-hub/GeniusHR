# Sistema Gestione Cedolini - GeniusHR

Sistema completo per la gestione digitale dei cedolini (buste paga) con tracking, notifiche automatiche e archivio storico.

## Funzionalità Implementate

### 1. Vista Amministratore (Gestore)

#### Upload Singolo
- Caricamento cedolino per singolo dipendente
- Selezione mese/anno
- Inserimento importi lordo/netto (opzionali)
- Upload PDF
- Notifica automatica al dipendente

#### Upload Massivo
- Caricamento multiplo file PDF
- Nomenclatura file intelligente:
  - `FISCALCODE_YYYYMM.pdf` (es. RSSMRA85M01H501X_202601.pdf)
  - `COGNOME_NOME_YYYYMM.pdf` (es. ROSSI_MARIO_202601.pdf)
- Smistamento automatico per dipendente
- Notifica batch a tutti i dipendenti

#### Gestione CU (Certificazione Unica)
- Upload CU annuale
- Distribuzione automatica a tutti i dipendenti attivi
- Notifica e tracking download

#### Tracking e Statistiche
- Cedolini caricati per mese/anno
- Status consegna per dipendente:
  - UPLOADED: Caricato ma non ancora visto
  - VIEWED: Visualizzato dal dipendente
  - DOWNLOADED: Scaricato dal dipendente
- Percentuale dipendenti che hanno visualizzato
- Totali lordo/netto per periodo
- Ultimi upload con dettagli

#### Funzioni Amministrative
- Invio notifica manuale singola
- Filtri per dipendente/periodo
- Export dati
- Storico completo per dipendente

### 2. Vista Dipendente

#### Lista Cedolini
- Vista tutti i propri cedolini
- Badge "NUOVO" per non ancora visualizzati
- Download PDF diretto
- Importi netto/lordo visibili

#### Archivio Storico
- Organizzazione per anno
- Card visive per ogni mese
- Stato download tracciato
- Ricerca veloce per periodo

#### Tracking Automatico
- Conferma lettura automatica al click
- Tracking download
- IP e timestamp registrati

### 3. Notifiche

- Notifica automatica in-app al caricamento
- Email notification (TODO: implementare email service)
- Badge contatore nuovi cedolini
- Link diretto al cedolino

## API Implementate

### GET /api/payslips
Recupera lista cedolini con filtri

**Query Parameters:**
- `year`: Anno (YYYY)
- `month`: Mese (1-12)
- `period`: Periodo formato YYYY-MM
- `employeeId`: ID dipendente specifico

**Response:**
```json
[
  {
    "id": "cuid",
    "month": 1,
    "year": 2026,
    "period": "2026-01",
    "grossAmount": 2500.00,
    "netAmount": 1850.00,
    "fileName": "cedolino_gennaio.pdf",
    "fileUrl": "/uploads/...",
    "status": "VIEWED",
    "uploadedAt": "2026-01-27T10:00:00Z",
    "viewedAt": "2026-01-28T09:00:00Z",
    "downloadedAt": null,
    "employee": {
      "id": "cuid",
      "firstName": "Mario",
      "lastName": "Rossi",
      "email": "mario.rossi@example.com",
      "department": "IT"
    },
    "uploader": {
      "id": "cuid",
      "name": "Admin User"
    }
  }
]
```

### POST /api/payslips
Carica nuovo cedolino singolo

**Body:**
```json
{
  "employeeId": "cuid",
  "period": "2026-01",
  "grossAmount": 2500.00,
  "netAmount": 1850.00,
  "fileName": "cedolino.pdf",
  "fileUrl": "/uploads/payslips/...",
  "fileSize": 245678
}
```

### GET /api/payslips/[id]
Recupera singolo cedolino (con tracking download)

### PATCH /api/payslips/[id]
Marca cedolino come visualizzato/scaricato

**Body:**
```json
{
  "action": "mark_viewed" | "mark_downloaded"
}
```

### POST /api/payslips/[id]/notify
Invia notifica al dipendente per cedolino specifico

### POST /api/payslips/bulk-upload
Upload massivo cedolini

**Body:**
```json
{
  "payslips": [
    {
      "employeeId": "cuid",
      "fileName": "cedolino1.pdf",
      "fileUrl": "/uploads/...",
      "fileSize": 123456,
      "grossAmount": 2500.00,
      "netAmount": 1850.00
    }
  ],
  "period": "2026-01",
  "notifyEmployees": true
}
```

### GET /api/payslips/stats
Statistiche cedolini

**Query Parameters:**
- `period`: Periodo YYYY-MM (opzionale)

**Response:**
```json
{
  "total": 25,
  "viewed": 20,
  "downloaded": 15,
  "notViewed": 5,
  "viewedPercentage": 80,
  "downloadedPercentage": 60,
  "totalGross": 62500.00,
  "totalNet": 46250.00,
  "recentUploads": [...]
}
```

## Database Schema

Modello già presente in Prisma:

```prisma
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
  viewedAt     DateTime? // Quando visualizzato
  viewedIp     String?
  downloadedAt DateTime? // Quando scaricato

  employee     Employee @relation(...)
  tenant       Tenant   @relation(...)
  uploader     User     @relation(...)

  @@unique([employeeId, period])
  @@index([tenantId])
  @@index([employeeId])
  @@index([period])
}
```

## File Storage

Il sistema è predisposto per integrare storage esterno. TODO da implementare:

1. **AWS S3**
   - Upload diretto con pre-signed URL
   - Bucket privato con accesso autenticato
   - Lifecycle rules per retention legale (5+ anni)

2. **Cloudinary**
   - Upload PDF con transformations
   - Signed URLs per download sicuro

3. **Vercel Blob Storage**
   - Integrazione nativa Next.js
   - Edge network per download veloce

### Esempio Integrazione S3

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

async function uploadPayslipToS3(file: File, employeeId: string, period: string) {
  const s3 = new S3Client({ region: 'eu-west-1' })

  const key = `payslips/${employeeId}/${period}/${file.name}`

  const command = new PutObjectCommand({
    Bucket: 'geniushr-payslips',
    Key: key,
    ContentType: 'application/pdf',
    ServerSideEncryption: 'AES256'
  })

  await s3.send(command)

  return {
    fileUrl: `https://geniushr-payslips.s3.eu-west-1.amazonaws.com/${key}`,
    key
  }
}
```

## Compliance Legale

### GDPR
- Consenso esplicito per trattamento dati busta paga
- Diritto all'oblio: eliminazione dati dopo termine conservazione
- Audit log completo di tutti gli accessi
- Tracciamento IP per conferma lettura

### Normativa Italiana
- Conservazione obbligatoria: 5 anni (DPR 445/2000)
- Retention automatica con lifecycle policies
- Backup crittografati
- Access control basato su ruoli

### Privacy
- File storage crittografato
- Accesso autenticato con sessione
- URL signed per download temporaneo
- No condivisione link pubblici

## Sicurezza

### Autenticazione
- Session-based con NextAuth
- Verifica tenant membership
- Employee can only access own payslips
- Admin can access all tenant payslips

### Autorizzazione
```typescript
// Admin check
if (user?.tenantId !== payslip.tenantId) {
  return 403 Forbidden
}

// Employee check
if (user?.employee?.id !== payslip.employeeId) {
  return 403 Forbidden
}
```

### Audit Trail
Ogni operazione è loggata:
- Upload: chi, quando, file
- View: chi, quando, da dove (IP)
- Download: chi, quando
- Notification: inviata a chi, quando

## Frontend Components

### /app/src/app/(dashboard)/payslips/page.tsx
Pagina principale con:
- Dual view (Admin/Employee)
- Upload modals
- Table view
- History view (employee)
- Stats cards
- Filters

### Componenti Riutilizzabili
- PageInfoTooltip: info contestuali
- Success/Error alerts
- Responsive table
- Card grid per storico

## Performance

### Ottimizzazioni
- Lazy loading lista cedolini
- Pagination (TODO: da implementare per > 100 records)
- Image optimization per PDF thumbnails
- Edge caching per file statici

### Caching Strategy
```typescript
// API Response caching
export const revalidate = 60 // Revalidate ogni 60s

// Static Generation per storico
export async function generateStaticParams() {
  // Pre-generate last 12 months
}
```

## Testing

### Unit Tests (TODO)
```typescript
describe('Payslips API', () => {
  it('should upload payslip', async () => {
    // Test upload
  })

  it('should track view', async () => {
    // Test view tracking
  })

  it('should send notification', async () => {
    // Test notification
  })
})
```

### E2E Tests (TODO)
- Upload flow completo
- Employee view e download
- Bulk upload
- Notification flow

## Roadmap

### Fase 1 - MVP (Completato)
- [x] Upload singolo
- [x] Vista admin
- [x] Vista employee
- [x] Tracking base
- [x] Notifiche in-app

### Fase 2 - Storage & Email
- [ ] Integrazione S3/Cloudinary
- [ ] Email notifications
- [ ] SMS notifications (opzionale)
- [ ] PDF preview nel browser

### Fase 3 - Advanced Features
- [ ] Bulk upload intelligente con OCR
- [ ] Parsing automatico importi da PDF
- [ ] Firma digitale cedolini
- [ ] Export Excel per consulente
- [ ] Grafici evoluzione retribuzione

### Fase 4 - Automation
- [ ] Import da software paghe (Zucchetti, Teamsystem)
- [ ] API integrazione consulente del lavoro
- [ ] Auto-distribuzione via email scheduled
- [ ] Reminder automatici dopo N giorni

## Deployment

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://..."

# Storage (quando implementato)
AWS_REGION="eu-west-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
S3_BUCKET_PAYSLIPS="geniushr-payslips"

# Email (quando implementato)
SMTP_HOST="smtp.sendgrid.net"
SMTP_USER="apikey"
SMTP_PASS="..."
```

### Prisma Migration
```bash
cd app
npx prisma migrate dev --name add_payslips
npx prisma generate
```

### Build & Deploy
```bash
npm run build
npm run start
```

## Support

Per domande o bug report:
- Email: support@geniushr.com
- GitHub Issues: https://github.com/geniushr/issues

## License

Proprietary - GeniusHR SaaS
