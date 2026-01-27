# Modulo Whistleblowing - GeniusHR

Sistema completo di segnalazione whistleblowing conforme al **D.Lgs. 24/2023**.

## Caratteristiche

### Conformità Normativa D.Lgs. 24/2023
- Canale di segnalazione sicuro e riservato
- Protezione identità segnalante
- Divieto di ritorsioni
- Conferma ricezione entro 7 giorni
- Feedback al segnalante entro 3 mesi
- Conservazione dati per 5 anni
- Crittografia end-to-end

### Tipologie di Segnalazione
1. **Anonima**: identità completamente nascosta
2. **Riservata**: identità nota solo al gestore whistleblowing
3. **Identificata**: identità visibile

### Categorie di Violazione
- Frode
- Corruzione
- Violazioni sicurezza sul lavoro
- Violazioni ambientali
- Discriminazione
- Molestie
- Violazione dati personali (GDPR)
- Conflitto di interessi
- Irregolarità finanziarie
- Altro

## Struttura File

### Pagine Pubbliche (senza autenticazione)
```
/app/src/app/whistleblowing/
├── layout.tsx                    # Layout pubblico
├── report/
│   └── page.tsx                  # Form segnalazione pubblica
└── track/
    └── page.tsx                  # Tracking stato segnalazione
```

### Dashboard Admin (autenticato)
```
/app/src/app/(dashboard)/whistleblowing/
├── page.tsx                      # Lista segnalazioni
└── [id]/
    └── page.tsx                  # Dettaglio segnalazione
```

### API Routes
```
/app/src/app/api/whistleblowing/
├── route.ts                      # GET (list) / POST (create)
├── stats/
│   └── route.ts                  # GET statistiche
├── check/
│   └── route.ts                  # POST verifica con access code
├── track/
│   └── message/
│       └── route.ts              # POST messaggio da segnalante
└── [id]/
    ├── route.ts                  # GET / PUT segnalazione
    ├── messages/
    │   └── route.ts              # GET / POST messaggi
    └── documents/
        └── route.ts              # GET / POST documenti
```

### Database Schema
```prisma
model WhistleblowingReport {
  id                      String
  tenantId                String
  reporterType            WhistleblowerType (ANONYMOUS/CONFIDENTIAL/IDENTIFIED)
  reporterName            String?
  reporterEmail           String?
  reporterPhone           String?
  reporterRole            String?
  reportDate              DateTime
  category                WhistleblowingCategory
  title                   String
  description             String
  personsInvolved         String?
  evidence                String?
  assignedTo              String?
  status                  WhistleblowingStatus
  acknowledgedAt          DateTime?
  investigationStartedAt  DateTime?
  investigationCompletedAt DateTime?
  closedAt                DateTime?
  outcome                 String?
  actionsTaken            String?
  lastFeedbackAt          DateTime?
  accessCode              String @unique
  messages                WhistleblowingMessage[]
  documents               WhistleblowingDocument[]
}

model WhistleblowingMessage {
  id          String
  reportId    String
  senderType  String (reporter/manager)
  content     String
  createdAt   DateTime
}

model WhistleblowingDocument {
  id          String
  reportId    String
  fileName    String
  filePath    String
  fileSize    Int?
  mimeType    String?
  uploadedBy  String
  createdAt   DateTime
}
```

## Flusso di Lavoro

### 1. Ricezione Segnalazione
1. Segnalante compila form su `/whistleblowing/report`
2. Sceglie tipo (anonima/riservata/identificata)
3. Seleziona categoria violazione
4. Descrive fatti e prove
5. Sistema genera **codice di tracciamento** univoco
6. Segnalante conserva codice per follow-up

### 2. Gestione da parte del Gestore
1. Segnalazione appare in dashboard admin
2. Alert se >7 giorni senza conferma (obbligo legge)
3. Gestore prende in carico (status: ACKNOWLEDGED)
4. Avvia indagine (status: UNDER_INVESTIGATION)
5. Comunica con segnalante via messaggistica sicura
6. Richiede info aggiuntive se necessario
7. Conclude indagine (status: SUBSTANTIATED/UNSUBSTANTIATED)
8. Chiude pratica con esito (status: CLOSED)

### 3. Follow-up Segnalante
1. Accede a `/whistleblowing/track`
2. Inserisce codice di tracciamento
3. Visualizza stato aggiornato
4. Legge messaggi dal gestore
5. Invia messaggi/documenti aggiuntivi
6. Riceve feedback finale

## Stati Segnalazione

| Stato | Descrizione | Obbligo Temporale |
|-------|-------------|-------------------|
| RECEIVED | Ricevuta, in attesa presa in carico | Conferma entro 7 giorni |
| ACKNOWLEDGED | Presa in carico | - |
| UNDER_INVESTIGATION | Indagine in corso | Feedback entro 3 mesi |
| ADDITIONAL_INFO_REQUESTED | Richieste info aggiuntive | - |
| SUBSTANTIATED | Segnalazione fondata | - |
| UNSUBSTANTIATED | Segnalazione non fondata | - |
| CLOSED | Pratica chiusa | - |

## Sicurezza e Privacy

### Protezione Identità
- Segnalazioni anonime: nessun dato personale salvato
- Segnalazioni riservate: dati visibili solo a OWNER/ADMIN
- Accesso controllato tramite ruoli (RBAC)
- Mascheramento automatico dati sensibili

### Crittografia
- Connessione HTTPS obbligatoria
- Dati at rest crittografati (database)
- File upload in directory isolata
- Access code generato con crypto.randomBytes

### Audit Trail
- Log completo di tutte le azioni
- Timestamp di ogni operazione
- Tracciamento accessi segnalazione
- Conservazione 5 anni (obbligo legge)

## Utilizzo

### Per Segnalanti

#### Inviare Segnalazione
```
https://[azienda].geniushr.com/whistleblowing/report
```

1. Scegli tipo segnalazione
2. Compila form (categoria, titolo, descrizione)
3. Clicca "Invia Segnalazione"
4. **Conserva il codice di tracciamento**

#### Tracciare Segnalazione
```
https://[azienda].geniushr.com/whistleblowing/track
```

1. Inserisci codice di tracciamento
2. Visualizza stato e messaggi
3. Invia messaggi aggiuntivi se necessario

### Per Gestori (Admin)

#### Dashboard Segnalazioni
```
https://[azienda].geniushr.com/whistleblowing
```

- Vista riepilogativa di tutte le segnalazioni
- Filtri per stato, categoria, data
- Alert per segnalazioni urgenti (>7 giorni)
- Statistiche aggregate

#### Gestire Segnalazione
```
https://[azienda].geniushr.com/whistleblowing/[id]
```

1. Visualizza dettagli segnalazione
2. Invia messaggi al segnalante
3. Aggiorna stato (ACKNOWLEDGED → UNDER_INVESTIGATION → CLOSED)
4. Documenta esito e azioni intraprese
5. Carica documenti indagine

## API Endpoints

### Pubblici (no auth)

#### POST /api/whistleblowing
Crea nuova segnalazione
```json
{
  "tenantSlug": "azienda",
  "reporterType": "ANONYMOUS",
  "category": "FRAUD",
  "title": "Titolo",
  "description": "Descrizione dettagliata"
}
```

Response:
```json
{
  "success": true,
  "accessCode": "A1B2C3D4E5F6G7H8",
  "message": "Segnalazione inviata con successo"
}
```

#### POST /api/whistleblowing/check
Verifica stato segnalazione
```json
{
  "accessCode": "A1B2C3D4E5F6G7H8"
}
```

#### POST /api/whistleblowing/track/message
Invia messaggio da segnalante
```json
{
  "accessCode": "A1B2C3D4E5F6G7H8",
  "content": "Testo messaggio"
}
```

### Autenticati (OWNER/ADMIN only)

#### GET /api/whistleblowing
Lista segnalazioni (con filtri opzionali)
```
?status=RECEIVED
?category=FRAUD
```

#### GET /api/whistleblowing/stats
Statistiche aggregate

#### GET /api/whistleblowing/[id]
Dettaglio segnalazione

#### PUT /api/whistleblowing/[id]
Aggiorna stato segnalazione
```json
{
  "status": "ACKNOWLEDGED",
  "outcome": "Descrizione esito",
  "actionsTaken": "Azioni intraprese"
}
```

#### POST /api/whistleblowing/[id]/messages
Invia messaggio al segnalante
```json
{
  "content": "Testo messaggio"
}
```

#### POST /api/whistleblowing/[id]/documents
Upload documento (multipart/form-data)
```
file: File
accessCode?: string (se upload da segnalante)
```

## Seed Data

Per popolare il database con dati demo:

```bash
cd app
npx tsx scripts/seed-whistleblowing.ts
```

Crea 6 segnalazioni di esempio con stati diversi:
- 1 in attesa (RECEIVED)
- 2 in indagine (UNDER_INVESTIGATION, ACKNOWLEDGED)
- 1 con richiesta info (ADDITIONAL_INFO_REQUESTED)
- 2 chiuse (CLOSED, SUBSTANTIATED)

## Checklist Conformità D.Lgs. 24/2023

- [x] Canale di segnalazione interno
- [x] Protezione identità segnalante
- [x] Possibilità segnalazione anonima
- [x] Conferma ricezione entro 7 giorni
- [x] Feedback entro 3 mesi dalla segnalazione
- [x] Messaggistica sicura bidirezionale
- [x] Divieto ritorsioni (policy aziendale)
- [x] Conservazione dati 5 anni
- [x] Audit trail completo
- [x] Crittografia comunicazioni
- [x] Tracciamento stato pratica
- [x] Documentazione esito indagine

## Roadmap Future

- [ ] Notifiche email automatiche
- [ ] Export PDF report completo
- [ ] Integrazione ANAC (Autorità Nazionale Anticorruzione)
- [ ] Dashboard analytics avanzate
- [ ] App mobile per segnalazioni
- [ ] Supporto multilingua
- [ ] OCR automatico documenti allegati
- [ ] AI per categorizzazione automatica

## Note Implementative

### Permessi
Solo utenti con ruolo **OWNER** o **ADMIN** possono:
- Visualizzare segnalazioni
- Gestire indagini
- Inviare messaggi
- Aggiornare stati

### Mascheramento Dati
Per segnalazioni **ANONYMOUS**:
- reporterName → null
- reporterEmail → null
- reporterPhone → null

Per segnalazioni **CONFIDENTIAL**:
- Dati visibili solo a OWNER/ADMIN
- Badge "RISERVATO" in UI
- Alert anti-divulgazione

### Performance
- Index su `tenantId`, `status`, `accessCode`
- Pagination su lista segnalazioni (future)
- Cache statistiche (future)

### File Upload
- Max 10MB per file
- Directory: `/uploads/whistleblowing/[tenantId]/`
- Sanitizzazione nome file
- Validazione MIME type

---

**Sviluppato per GeniusHR** | Conforme D.Lgs. 24/2023
