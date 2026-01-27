# GeniusHR - Product Requirements Document (PRD)

**Versione:** 1.0
**Data:** Gennaio 2026
**Autore:** Piero Natale Civero
**Prodotto:** GeniusHR - Piattaforma HR SaaS per Studi Odontoiatrici

---

## 1. Executive Summary

GeniusHR è una piattaforma SaaS completa per la gestione delle risorse umane, specificamente progettata per studi odontoiatrici e piccole-medie imprese italiane. Il software digitalizza e automatizza tutti i processi HR, dalla gestione presenze alla consegna dei cedolini, dalla pianificazione ferie alla conformità normativa.

### 1.1 Vision
Diventare il software HR di riferimento per gli studi odontoiatrici italiani, offrendo una soluzione integrata, conforme alla normativa e facile da usare.

### 1.2 Target Market
- **Primario:** Studi odontoiatrici con 5-50 dipendenti
- **Secondario:** PMI del settore sanitario
- **Terziario:** Consulenti del lavoro e commercialisti

---

## 2. Funzionalità Core

### 2.1 Gestione Presenze e Timbratura

#### 2.1.1 Rilevazione Presenze
- **Timbratura digitale** via web e app mobile
- **Geolocalizzazione** per lavoro fuori sede/trasferte
- **Timbratura QR Code** per postazioni fisse
- **Foglio presenze** sempre aggiornato in tempo reale
- **Gestione anomalie** con sistema di giustificativi

#### 2.1.2 Gestione Turni
- **Pianificazione turni** con vista giornaliera/settimanale/mensile
- **Assegnazione rapida** con drag & drop
- **Notifiche automatiche** ai dipendenti per cambi turno
- **Gestione copertura** minima per reparto
- **Template turni** riutilizzabili

#### 2.1.3 Straordinari e Banca Ore
- **Calcolo automatico** straordinari
- **Gestione banca ore** con saldo in tempo reale
- **Approvazione straordinari** multilivello
- **Report mensili** per consulente del lavoro

### 2.2 Ferie e Permessi

#### 2.2.1 Richieste e Approvazioni
- **Richiesta autonoma** da parte del dipendente
- **Workflow approvazione** configurabile (manager → HR → titolare)
- **Calendario condiviso** per evitare sovrapposizioni
- **Notifiche push** per nuove richieste
- **Commenti** per motivare approvazioni/rifiuti

#### 2.2.2 Piano Ferie Annuale
- **Visualizzazione calendario** annuale
- **Periodi di chiusura** aziendale preimpostati
- **Saldi ferie** sempre visibili (maturate, godute, residue)
- **Alert automatici** per ferie non godute a fine anno
- **Export piano ferie** per consulente

#### 2.2.3 Tipologie Assenze
- Ferie
- Permessi retribuiti (ROL)
- Malattia
- Congedo parentale
- Lutto
- Matrimonio
- Permessi non retribuiti
- Banca ore

### 2.3 Note Spese e Rimborsi

#### 2.3.1 Creazione Note Spese
- **Inserimento rapido** con foto scontrino/fattura
- **OCR automatico** per estrazione dati
- **Categorie predefinite:**
  - Alloggio
  - Trasporto (treno/aereo/bus)
  - Carburante
  - Noleggio auto
  - Parcheggio e pedaggi
  - Pasti
  - Taxi
  - Telefono e connettività

#### 2.3.2 Rimborso Chilometrico
- **Calcolo automatico** basato su tabelle ACI
- **Memorizzazione veicoli** dipendente
- **Calcolo distanze** integrato (partenza → arrivo)
- **Storico viaggi** per controlli

#### 2.3.3 Travel Policy
- **Tetti massimi** per categoria di spesa
- **Limiti chilometrici** giornalieri
- **Spese consentite/non consentite** configurabili
- **Workflow approvazione** con deleghe a capigruppo

### 2.4 Buste Paga e Documenti

#### 2.4.1 Consegna Cedolini
- **Upload massivo** PDF (anche unico file multipagina)
- **Smistamento automatico** per dipendente
- **Notifica consegna** via email + push
- **Conferma lettura** tracciata
- **Archivio storico** consultabile dal dipendente

#### 2.4.2 Certificazioni Uniche (CU)
- **Distribuzione annuale** CU
- **Archiviazione** per anno fiscale
- **Download autonomo** da parte del dipendente

#### 2.4.3 Documenti Dipendente
- **Fascicolo personale** digitale
- **Contratto di lavoro**
- **Variazioni contrattuali**
- **Attestati e certificazioni**
- **Documenti firmati**

### 2.5 Onboarding e Offboarding

#### 2.5.1 Checklist Onboarding
**Fase 1 - Documenti Assunzione (Giorno 1)**
- Modulo Dati Personali
- Informativa Privacy Dipendenti
- Patto di Riservatezza (NDA)
- Nomina Autorizzato Trattamento Dati
- Modulo Presa Visione Regolamento

**Fase 2 - Sicurezza (Giorni 1-3)**
- Verbale Consegna DPI
- Presa Visione DVR
- Scheda Formazione Sicurezza

**Fase 3 - Configurazione (Prima settimana)**
- Configurazione IT (email, accessi)
- Presentazione Team
- Formazione Ruolo

**Fase 4 - Periodo Prova**
- Inizio periodo prova
- Valutazioni intermedie
- Comunicazione esito

#### 2.5.2 Firma Digitale Documenti
- **Richiesta firma** con priorità e scadenza
- **Firma OTP** via SMS/email
- **Firma grafometrica** su tablet
- **Validità legale** conforme eIDAS
- **Audit trail** completo

#### 2.5.3 Timeline Visuale
- **Progress bar** per ogni dipendente
- **Stato documenti** (da firmare, firmati, scaduti)
- **Promemoria automatici** per documenti in attesa
- **Report completamento** onboarding

### 2.6 Sicurezza sul Lavoro (D.Lgs. 81/08)

#### 2.6.1 Formazione Obbligatoria
- **Scadenzario corsi** per dipendente
- **Tipologie formazione:**
  - Formazione Generale (4h)
  - Formazione Specifica Rischio Basso (4h)
  - Antincendio Rischio Basso (4h)
  - Primo Soccorso (12h)
- **Alert scadenze** automatici (30/60/90 giorni prima)
- **Certificati** archiviati nel fascicolo

#### 2.6.2 DVR (Documento Valutazione Rischi)
- **Presa visione** tracciata per ogni dipendente
- **Aggiornamenti** comunicati automaticamente
- **Storico versioni**

#### 2.6.3 DPI e Attrezzature
- **Verbale consegna** DPI
- **Scadenza dispositivi** (es. scarpe antinfortunistiche)
- **Inventario** per dipendente

#### 2.6.4 Infortuni
- **Modulo segnalazione** infortunio
- **Workflow INAIL** (entro 48h)
- **Registro infortuni** digitale

### 2.7 Disciplina e Compliance

#### 2.7.1 Codice Disciplinare
- **Pubblicazione digitale** del codice
- **Presa visione** tracciata
- **Aggiornamenti** notificati

#### 2.7.2 Procedura Disciplinare (Art. 7 L. 300/1970)
**Step del workflow:**
1. Contestazione scritta (template disponibili)
2. Attesa 5 giorni per difesa dipendente
3. Valutazione giustificazioni
4. Emissione provvedimento
5. Comunicazione sanzione
6. Archiviazione nel registro

**Tipologie sanzioni:**
- Richiamo verbale
- Ammonizione scritta
- Multa (max 4h retribuzione)
- Sospensione (max 10 giorni)
- Licenziamento disciplinare

#### 2.7.3 Registro Provvedimenti
- **Storico completo** per dipendente
- **Ricerca** per tipo/data/gravità
- **Export** per consulente del lavoro
- **Gestione recidiva** (2 anni)

### 2.8 Whistleblowing (D.Lgs. 24/2023)

- **Canale segnalazioni** anonimo
- **Gestione ticket** con messaggistica sicura
- **Tracciamento** stato segnalazione
- **Conformità** normativa whistleblowing

### 2.9 Comunicazione Interna

#### 2.9.1 Bacheca Digitale
- **Comunicazioni** a tutti o gruppi selezionati
- **Conferma lettura** obbligatoria
- **Allegati** (circolari, policy, etc.)
- **Storico messaggi**

#### 2.9.2 Notifiche Multicanale
- Email
- Push notification (app)
- SMS (per urgenze)

### 2.10 Gestione Accessi e Ruoli

#### 2.10.1 Livelli di Accesso
- **Titolare/Admin:** accesso completo
- **HR Manager:** gestione dipendenti, approvazioni
- **Manager/Capogruppo:** approvazioni team, visibilità limitata
- **Dipendente:** solo propri dati
- **Consulente del Lavoro:** dati per elaborazione paghe

#### 2.10.2 Permessi Granulari
- Visualizza dipendenti
- Modifica dipendenti
- Approva ferie
- Approva spese
- Carica buste paga
- Gestione disciplinare
- Impostazioni sistema

### 2.11 Integrazione Consulente del Lavoro

- **Accesso dedicato** gratuito per il consulente
- **Export presenze** nel formato del software paghe
- **Upload cedolini** diretto dal consulente
- **Comunicazioni** bidirezionali
- **Storico modifiche** per audit

---

## 3. Tutorial e Guide Integrate

### 3.1 Centro Assistenza In-App

Ogni pagina avrà:
- **Icona (i)** con tooltip esplicativo
- **Link a tutorial** specifico
- **Video guide** (opzionale)

### 3.2 Moduli Tutorial

#### Tutorial 1: Organizzazione Efficiente del Team
- Come strutturare reparti e gruppi
- Assegnazione ruoli e responsabilità
- Best practice per la delega

#### Tutorial 2: Pianificazione Ferie Senza Stress
- Creare il piano ferie annuale
- Gestire richieste multiple
- Evitare le ferie di massa a fine anno
- Criteri di approvazione equi

#### Tutorial 3: Gestione Spese e Trasferte
- Impostare la travel policy
- Calcolo rimborso chilometrico
- Approvazione note spese
- Controllo budget trasferte

#### Tutorial 4: Distribuzione Cedolini Veloce
- Upload massivo buste paga
- Smistamento automatico
- Verifica consegna
- Gestione CU annuali

#### Tutorial 5: Comunicazione Efficace
- Uso della bacheca digitale
- Quando e cosa comunicare
- Conferma lettura documenti
- Gestione emergenze

#### Tutorial 6: Onboarding Perfetto
- Checklist primo giorno
- Documenti obbligatori
- Formazione sicurezza
- Periodo di prova

#### Tutorial 7: Conformità Normativa
- Obblighi D.Lgs. 81/08
- Procedura disciplinare corretta
- Gestione whistleblowing
- Conservazione documenti (10 anni)

#### Tutorial 8: Collaborazione con il Consulente
- Configurare l'accesso consulente
- Export dati per paghe
- Comunicazioni efficaci
- Gestione modifiche

---

## 4. Requisiti Tecnici

### 4.1 Stack Tecnologico
- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL con Prisma ORM
- **Auth:** NextAuth.js
- **Storage:** AWS S3 / compatibile
- **Email:** SMTP / SendGrid
- **SMS:** Twilio (per OTP)

### 4.2 Sicurezza
- Crittografia dati sensibili (AES-256)
- HTTPS obbligatorio
- Autenticazione 2FA opzionale
- Backup giornalieri
- Audit log completo
- Conformità GDPR

### 4.3 Performance
- Tempo caricamento pagina < 2s
- API response time < 500ms
- Uptime 99.9%
- Supporto 10.000+ utenti concorrenti

---

## 5. Dati Demo - Smiledoc

### 5.1 Azienda
- **Nome:** Smiledoc S.r.l.
- **Indirizzo:** Via Monte Circeo 12, Monterotondo (RM)
- **P.IVA:** 12345678901
- **CCNL:** Studi Professionali
- **Dipendenti:** 8

### 5.2 Dipendenti Demo

| Nome | Ruolo | Reparto | Data Assunzione |
|------|-------|---------|-----------------|
| Maria Rossi | Segretaria | Reception | 01/03/2023 |
| Giuseppe Bianchi | Igienista Dentale | Clinica | 15/06/2022 |
| Anna Verdi | ASO | Clinica | 01/09/2023 |
| Marco Neri | Odontoiatra | Clinica | 01/01/2020 |
| Laura Gialli | Amministrazione | Back Office | 01/04/2024 |
| Fabio Blu | ASO | Clinica | 15/02/2024 |
| Sara Viola | Segretaria | Reception | 01/07/2024 |
| Luca Arancio | Apprendista | Clinica | 01/10/2025 |

### 5.3 Documenti Precaricati

**Onboarding:**
- Modulo Dati Personali
- Informativa Privacy Dipendenti
- Patto di Riservatezza (NDA)
- Nomina Autorizzato Trattamento Dati
- Modulo Presa Visione Regolamento
- Checklist Onboarding

**Sicurezza:**
- Verbale Consegna DPI
- Scheda Formazione Sicurezza
- Modulo Segnalazione Infortunio
- Modulo Presa Visione Rischi Specifici

**Policy:**
- Regolamento Aziendale Completo
- Regolamento Interno (versione breve)
- Policy Uso Email Aziendali
- Manuale Comunicazioni e Disciplina

**Disciplina:**
- Procedura Disciplinare Interna
- Template Richiamo Disciplinare
- Template Contestazione Disciplinare
- Procedura Licenziamento Disciplinare
- Registro Provvedimenti

**Amministrazione:**
- Modulo Richiesta Ferie/Permessi
- Modulo Variazione Dati
- Quadro Gestione Documentale

---

## 6. Roadmap

### Fase 1 - MVP (Completata)
- [x] Autenticazione multi-tenant
- [x] Dashboard gestore
- [x] Gestione dipendenti
- [x] Firma digitale documenti
- [x] Gestione presenze
- [x] Ferie e permessi
- [x] Note spese
- [x] Buste paga
- [x] Onboarding
- [x] Sicurezza 81/08
- [x] Disciplinare
- [x] Whistleblowing
- [x] Portale dipendente
- [x] AI Assistant

### Fase 2 - Enhancement (In corso)
- [ ] Tutorial integrati in ogni pagina
- [ ] Tooltip informativi (icona i)
- [ ] Dati demo Smiledoc
- [ ] Miglioramenti UX da competitor analysis
- [ ] Integrazione consulente del lavoro

### Fase 3 - Scale
- [ ] App mobile nativa (iOS/Android)
- [ ] Integrazioni software paghe (Zucchetti, TeamSystem)
- [ ] API pubblica per integrazioni
- [ ] Multi-sede
- [ ] Analytics avanzati

---

## 7. Metriche di Successo

### 7.1 KPI Prodotto
- Time-to-value < 30 minuti (primo dipendente aggiunto)
- Adoption rate > 80% (dipendenti attivi)
- Riduzione tempo gestione HR > 50%
- NPS > 50

### 7.2 KPI Business
- MRR growth > 20% mensile
- Churn rate < 5%
- CAC payback < 6 mesi
- LTV/CAC > 3

---

## 8. Appendice

### 8.1 Riferimenti Normativi
- **D.Lgs. 81/2008** - Sicurezza sul lavoro
- **L. 300/1970 Art. 7** - Statuto dei Lavoratori (disciplina)
- **GDPR Reg. UE 2016/679** - Privacy
- **D.Lgs. 24/2023** - Whistleblowing
- **CCNL Studi Professionali** - Contratto collettivo

### 8.2 Conservazione Documenti
| Documento | Durata |
|-----------|--------|
| Fascicolo personale | 10 anni da cessazione |
| Scheda formazione | 10 anni |
| Registro DPI | 10 anni da consegna |
| Provvedimenti disciplinari | 10 anni (2 anni per recidiva) |
| Buste paga | 5 anni da cessazione |

---

*Documento generato: Gennaio 2026*
*GeniusHR - Smiledoc S.r.l.*
