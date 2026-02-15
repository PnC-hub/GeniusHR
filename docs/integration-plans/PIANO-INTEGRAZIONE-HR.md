# Piano di Integrazione Sistema HR Intelligente

**Progetto:** Geniusmile HR Integration
**Versione Piano:** 1.0
**Data:** 25 Gennaio 2026
**Stato:** IN CORSO

---

## Indice

1. [Vision e Obiettivi](#1-vision-e-obiettivi)
2. [Architettura Sistema](#2-architettura-sistema)
3. [Componenti da Sviluppare](#3-componenti-da-sviluppare)
4. [Database Schema](#4-database-schema)
5. [API Endpoints](#5-api-endpoints)
6. [Fasi di Implementazione](#6-fasi-di-implementazione)
7. [Checklist Dettagliata](#7-checklist-dettagliata)
8. [Testing e Validazione](#8-testing-e-validazione)
9. [Deploy e Monitoring](#9-deploy-e-monitoring)
10. [Log Avanzamento](#10-log-avanzamento)

---

## 1. Vision e Obiettivi

### 1.1 Problema da Risolvere

| Problema Attuale | Soluzione |
|------------------|-----------|
| Dipendenti non sanno dove trovare procedure | Assistente AI che guida e risponde |
| Presa visione solo cartacea | Sistema digitale con hash e timestamp |
| Onboarding non tracciato | Percorsi guidati con progress tracking |
| Formazione non verificata | Quiz + certificati automatici |
| Nessuna collaborazione sui documenti | Wiki controllata (proponi → approva) |
| Dati HR sparsi tra sistemi | Database unificato nel CRM |

### 1.2 Obiettivi Misurabili

| Obiettivo | KPI | Target |
|-----------|-----|--------|
| Ridurre domande ripetitive | Ticket HR/mese | -70% |
| Onboarding completo | Tempo medio completamento | < 5 giorni |
| Presa visione | % dipendenti con firma digitale | 100% |
| Formazione | Tasso superamento quiz | > 90% |
| Soddisfazione | NPS dipendenti su sistema | > 8/10 |

### 1.3 Stakeholder

| Ruolo | Interesse | Accesso |
|-------|-----------|---------|
| Direzione | Compliance, analytics | Admin completo |
| HR Manager | Gestione onboarding, formazione | Admin HR |
| Coordinatore Sede | Verifica prese visione | Read + gestione sede |
| Dipendenti | Consultazione, formazione | Self-service |

---

## 2. Architettura Sistema

### 2.1 Diagramma Architetturale

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                  │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│  CRM Geniusmile   │   HR-Smiledoc     │  Manuale MkDocs   │   App Mobile    │
│  /dipendenti      │   (Refactored)    │  + Widget AI      │   (Futuro)      │
│  + Widget Chat    │   + Widget Chat   │                   │                 │
│                   │                   │                   │                 │
│  URL:             │  URL:             │  URL:             │                 │
│  crm.geniusmile   │  hr-smiledoc.     │  manuale-smiledoc │                 │
│  .com             │  geniusmile.com   │  .geniusmile.com  │                 │
└─────────┬─────────┴─────────┬─────────┴─────────┬─────────┴────────┬────────┘
          │                   │                   │                  │
          └───────────────────┴───────────────────┴──────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GENIUSMILE-API (Laravel)                            │
│                         Server: 93.186.255.213                              │
│                         api.geniusmile.com (PROD)                           │
│                         api-test.geniusmile.com (TEST)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ESISTENTI:                          NUOVI:                                 │
│  ────────────                        ──────                                 │
│  POST /api/v1/dipendenti             POST /api/v1/hr/assistant/chat         │
│  GET  /api/v1/dipendenti             GET  /api/v1/hr/assistant/history      │
│  PUT  /api/v1/dipendenti/{id}        POST /api/v1/hr/assistant/escalate     │
│  DEL  /api/v1/dipendenti/{id}        POST /api/v1/hr/assistant/feedback     │
│  POST /api/v1/dipendenti/{id}/       GET  /api/v1/hr/training/paths         │
│       assenze                        GET  /api/v1/hr/training/progress      │
│  GET  /api/v1/dipendenti/{id}/       POST /api/v1/hr/training/start/{id}    │
│       buste-paga                     POST /api/v1/hr/training/complete-step │
│                                      POST /api/v1/hr/training/quiz          │
│                                      GET  /api/v1/hr/training/certificate   │
│                                      GET  /api/v1/hr/documents/pending      │
│                                      POST /api/v1/hr/documents/acknowledge  │
│                                      GET  /api/v1/hr/documents/history      │
│                                      GET  /api/v1/hr/documents/verify/{hash}│
│                                      GET  /api/v1/hr/proposals              │
│                                      POST /api/v1/hr/proposals              │
│                                      PUT  /api/v1/hr/proposals/{id}/review  │
│                                      GET  /api/v1/hr/faq                    │
│                                      GET  /api/v1/hr/faq/search             │
│                                      GET  /api/v1/hr/notifications          │
│                                      PUT  /api/v1/hr/notifications/{id}/read│
│                                      GET  /api/v1/hr/onboarding/status      │
│                                      POST /api/v1/hr/onboarding/complete    │
│                                      GET  /api/v1/hr/admin/dashboard        │
│                                      GET  /api/v1/hr/admin/escalations      │
│                                      GET  /api/v1/hr/admin/stats            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
          │                   │                   │                  │
          ▼                   ▼                   ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   OpenAI API    │ │     MySQL       │ │  Vector Store   │ │     Redis       │
│   GPT-4o        │ │   geniusmile_   │ │   (Qdrant       │ │   Cache +       │
│                 │ │   production    │ │   self-hosted)  │ │   Sessions      │
│   Model:        │ │                 │ │                 │ │                 │
│   gpt-4o        │ │   Prefisso:     │ │   Collection:   │ │   TTL: 3600s    │
│                 │ │   afts5498_     │ │   smiledoc_docs │ │                 │
│   Embeddings:   │ │                 │ │                 │ │                 │
│   text-embed-   │ │   Host:         │ │   Host:         │ │   Host:         │
│   ding-3-small  │ │   localhost     │ │   localhost:    │ │   localhost:    │
│                 │ │                 │ │   6333          │ │   6379          │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 2.2 Flusso Dati Principale

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Dipendente  │────▶│   Widget     │────▶│    API       │────▶│   OpenAI     │
│  (Browser)   │     │   Chat JS    │     │   Laravel    │     │   GPT-4o     │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                │                     │
                                                ▼                     │
                                         ┌──────────────┐            │
                                         │   Qdrant     │◀───────────┘
                                         │   (RAG)      │  embedding query
                                         └──────────────┘
                                                │
                                                ▼ contesto documenti
                                         ┌──────────────┐
                                         │   MySQL      │
                                         │   (log +     │
                                         │   tracking)  │
                                         └──────────────┘
```

### 2.3 Tecnologie

| Componente | Tecnologia | Versione | Note |
|------------|------------|----------|------|
| Backend API | Laravel | 8.x | Esistente, da estendere |
| Database | MySQL | 8.0 | Esistente |
| Vector DB | Qdrant | 1.7+ | Self-hosted su server |
| Cache | Redis | 7.x | Esistente |
| AI | OpenAI GPT-4o | Latest | API cloud |
| Embeddings | text-embedding-3-small | Latest | 1536 dimensioni |
| Widget | Vanilla JS | ES6+ | No dipendenze |
| Frontend CRM | Nuxt 3 + Vue 3 | 3.14 | Esistente |

---

## 3. Componenti da Sviluppare

### 3.1 Backend (Laravel - Geniusmile-API)

#### 3.1.1 Nuovi Model

| Model | Tabella | Descrizione |
|-------|---------|-------------|
| `HrDocumentAcknowledgment` | `hr_document_acknowledgments` | Prese visione digitali |
| `HrTrainingPath` | `hr_training_paths` | Configurazione percorsi |
| `HrTrainingProgress` | `hr_training_progress` | Avanzamento dipendenti |
| `HrAiConversation` | `hr_ai_conversations` | Log chat AI |
| `HrProposal` | `hr_proposals` | Proposte wiki-like |
| `HrFaq` | `hr_faqs` | FAQ approvate |
| `HrNotification` | `hr_notifications` | Notifiche sistema |

#### 3.1.2 Nuovi Controller

| Controller | Namespace | Responsabilità |
|------------|-----------|----------------|
| `AssistantController` | `App\Http\Controllers\Api\V1\Hr` | Chat AI + RAG |
| `TrainingController` | `App\Http\Controllers\Api\V1\Hr` | Formazione |
| `DocumentsController` | `App\Http\Controllers\Api\V1\Hr` | Prese visione |
| `ProposalsController` | `App\Http\Controllers\Api\V1\Hr` | Wiki-like |
| `FaqController` | `App\Http\Controllers\Api\V1\Hr` | FAQ |
| `NotificationsController` | `App\Http\Controllers\Api\V1\Hr` | Notifiche |
| `OnboardingController` | `App\Http\Controllers\Api\V1\Hr` | Onboarding |
| `HrAdminController` | `App\Http\Controllers\Api\V1\Hr` | Dashboard admin |

#### 3.1.3 Nuovi Service

| Service | Responsabilità |
|---------|----------------|
| `OpenAiService` | Comunicazione con OpenAI API |
| `RagService` | Retrieval Augmented Generation |
| `QdrantService` | Gestione vector store |
| `DocumentHashService` | Calcolo e verifica hash SHA-256 |
| `CertificateService` | Generazione PDF certificati |
| `NotificationService` | Invio notifiche multi-canale |

#### 3.1.4 Nuovi Job (Queue)

| Job | Trigger | Azione |
|-----|---------|--------|
| `InitializeOnboardingJob` | Creazione dipendente | Setup percorso formativo |
| `EmbedDocumentJob` | Nuovo/modifica documento | Embedding in Qdrant |
| `SendTrainingReminderJob` | Cron giornaliero | Notifica scadenze |
| `GenerateCertificateJob` | Completamento percorso | PDF certificato |
| `EscalationNotifyJob` | Escalation AI | Notifica admin |

### 3.2 Widget Chat (JavaScript)

#### 3.2.1 File Structure

```
/widget/
├── smiledoc-assistant.js      # Entry point (IIFE)
├── src/
│   ├── chat.js                # Logica chat
│   ├── api.js                 # Chiamate API
│   ├── ui.js                  # Render UI
│   ├── auth.js                # Gestione token
│   └── storage.js             # LocalStorage
├── styles/
│   └── widget.css             # Stili inline
└── dist/
    └── smiledoc-assistant.min.js  # Bundle minificato
```

#### 3.2.2 Funzionalità Widget

| Funzione | Descrizione |
|----------|-------------|
| `init(config)` | Inizializza widget con configurazione |
| `open()` | Apre la chat |
| `close()` | Chiude la chat |
| `send(message)` | Invia messaggio |
| `setContext(ctx)` | Imposta contesto (pagina corrente) |
| `setUser(user)` | Imposta utente autenticato |
| `showNotification(n)` | Mostra notifica |
| `destroy()` | Rimuove widget |

### 3.3 Frontend CRM (Nuxt/Vue)

#### 3.3.1 Nuove Pagine

| Path | Componente | Descrizione |
|------|------------|-------------|
| `/hr/dashboard` | `HrDashboard.vue` | Overview HR |
| `/hr/onboarding` | `HrOnboarding.vue` | Gestione onboarding |
| `/hr/formazione` | `HrFormazione.vue` | Percorsi formativi |
| `/hr/documenti` | `HrDocumenti.vue` | Prese visione |
| `/hr/proposte` | `HrProposte.vue` | Gestione proposte |
| `/hr/escalations` | `HrEscalations.vue` | Domande non risolte |
| `/dipendenti/[id]/hr` | `DipendenteHr.vue` | Dettaglio HR dipendente |

#### 3.3.2 Nuovi Componenti

| Componente | Uso |
|------------|-----|
| `HrAssistantWidget.vue` | Wrapper Vue del widget |
| `OnboardingProgress.vue` | Barra progresso onboarding |
| `TrainingCard.vue` | Card percorso formativo |
| `QuizComponent.vue` | Quiz interattivo |
| `AcknowledgmentModal.vue` | Modal presa visione |
| `ProposalForm.vue` | Form proposta |

### 3.4 Manuale MkDocs (Modifiche)

#### 3.4.1 Nuovi File

| File | Descrizione |
|------|-------------|
| `docs/assets/js/widget-loader.js` | Loader widget nel manuale |
| `docs/overrides/main.html` | Override template per widget |

#### 3.4.2 Configurazione

```yaml
# mkdocs.yml - Aggiungere
extra_javascript:
  - assets/js/widget-loader.js

extra:
  hr_api_url: https://api.geniusmile.com
```

---

## 4. Database Schema

### 4.1 Estensione Tabella Dipendenti

```sql
-- Migration: 2026_01_25_000001_extend_dipendenti_table.php

ALTER TABLE Dipendenti ADD COLUMN codice_fiscale VARCHAR(16) AFTER cognome;
ALTER TABLE Dipendenti ADD COLUMN data_nascita DATE AFTER codice_fiscale;
ALTER TABLE Dipendenti ADD COLUMN luogo_nascita VARCHAR(100) AFTER data_nascita;
ALTER TABLE Dipendenti ADD COLUMN indirizzo_residenza VARCHAR(255) AFTER luogo_nascita;
ALTER TABLE Dipendenti ADD COLUMN iban VARCHAR(34) AFTER indirizzo_residenza;
ALTER TABLE Dipendenti ADD COLUMN cellulare VARCHAR(20) AFTER email;
ALTER TABLE Dipendenti ADD COLUMN mansione ENUM('segretaria','aso','igienista','odontoiatra','coordinatore') AFTER cellulare;
ALTER TABLE Dipendenti ADD COLUMN probation_end_date DATE AFTER data_assunzione;
ALTER TABLE Dipendenti ADD COLUMN responsabile_id BIGINT UNSIGNED AFTER probation_end_date;
ALTER TABLE Dipendenti ADD COLUMN onboarding_status ENUM('pending','in_progress','completed') DEFAULT 'pending' AFTER responsabile_id;
ALTER TABLE Dipendenti ADD COLUMN onboarding_completed_at DATETIME AFTER onboarding_status;
ALTER TABLE Dipendenti ADD COLUMN last_training_date DATE AFTER onboarding_completed_at;
ALTER TABLE Dipendenti ADD COLUMN next_training_due DATE AFTER last_training_date;

ALTER TABLE Dipendenti ADD INDEX idx_mansione (mansione);
ALTER TABLE Dipendenti ADD INDEX idx_onboarding_status (onboarding_status);
```

### 4.2 Nuove Tabelle

```sql
-- Migration: 2026_01_25_000002_create_hr_tables.php

-- Prese visione digitali
CREATE TABLE hr_document_acknowledgments (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dipendente_id BIGINT UNSIGNED NOT NULL,
    document_code VARCHAR(20) NOT NULL COMMENT 'Es: PRO-CLI-001',
    document_version VARCHAR(10) NOT NULL COMMENT 'Es: 1.0',
    document_hash VARCHAR(64) NOT NULL COMMENT 'SHA-256',
    document_title VARCHAR(255) NOT NULL,
    acknowledged_at DATETIME NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    signature_type ENUM('click','fea') DEFAULT 'click',
    signature_data TEXT COMMENT 'Base64 se firma grafica',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (dipendente_id) REFERENCES Dipendenti(id) ON DELETE CASCADE,
    UNIQUE KEY uk_ack (dipendente_id, document_code, document_version),
    INDEX idx_document (document_code),
    INDEX idx_date (acknowledged_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Percorsi formativi (configurazione)
CREATE TABLE hr_training_paths (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_role ENUM('segretaria','aso','igienista','odontoiatra','all') DEFAULT 'all',
    documents JSON NOT NULL COMMENT 'Array ordinato di document_code',
    quiz_config JSON COMMENT 'Configurazione quiz per step',
    is_mandatory BOOLEAN DEFAULT TRUE,
    estimated_hours DECIMAL(4,1),
    validity_months INT DEFAULT 12 COMMENT 'Mesi validità certificato',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_role (target_role),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Progresso formazione dipendenti
CREATE TABLE hr_training_progress (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dipendente_id BIGINT UNSIGNED NOT NULL,
    path_id BIGINT UNSIGNED NOT NULL,
    current_step INT DEFAULT 0,
    completed_steps JSON DEFAULT '[]' COMMENT 'Array step completati',
    quiz_scores JSON DEFAULT '{}' COMMENT '{step: score}',
    started_at DATETIME,
    completed_at DATETIME,
    certificate_path VARCHAR(500),
    certificate_hash VARCHAR(64),
    expires_at DATE COMMENT 'Scadenza certificato',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (dipendente_id) REFERENCES Dipendenti(id) ON DELETE CASCADE,
    FOREIGN KEY (path_id) REFERENCES hr_training_paths(id) ON DELETE CASCADE,
    UNIQUE KEY uk_progress (dipendente_id, path_id),
    INDEX idx_status (completed_at),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Conversazioni AI
CREATE TABLE hr_ai_conversations (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dipendente_id BIGINT UNSIGNED NOT NULL,
    session_id VARCHAR(36) NOT NULL COMMENT 'UUID sessione',
    messages JSON NOT NULL COMMENT '[{role, content, timestamp}]',
    context JSON COMMENT '{page, document_code, etc}',
    tokens_used INT DEFAULT 0,
    resolved BOOLEAN DEFAULT FALSE,
    escalated BOOLEAN DEFAULT FALSE,
    escalated_at DATETIME,
    escalation_reason TEXT,
    admin_response TEXT,
    admin_responded_at DATETIME,
    admin_id BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (dipendente_id) REFERENCES Dipendenti(id) ON DELETE CASCADE,
    INDEX idx_session (session_id),
    INDEX idx_escalated (escalated, escalated_at),
    INDEX idx_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Proposte wiki-like
CREATE TABLE hr_proposals (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dipendente_id BIGINT UNSIGNED NOT NULL,
    document_code VARCHAR(20) COMMENT 'Documento di riferimento',
    proposal_type ENUM('modifica','chiarimento','errore','faq','nuovo') NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('pending','under_review','approved','rejected','implemented') DEFAULT 'pending',
    priority ENUM('low','medium','high') DEFAULT 'medium',
    reviewed_by BIGINT UNSIGNED,
    reviewed_at DATETIME,
    review_notes TEXT,
    implemented_at DATETIME,
    implemented_version VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (dipendente_id) REFERENCES Dipendenti(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_document (document_code),
    INDEX idx_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FAQ approvate
CREATE TABLE hr_faqs (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    document_codes JSON COMMENT 'Array documenti correlati',
    category VARCHAR(100),
    keywords JSON COMMENT 'Array keyword per ricerca',
    source_proposal_id BIGINT UNSIGNED COMMENT 'Se deriva da proposta',
    approved_by BIGINT UNSIGNED,
    approved_at DATETIME,
    usage_count INT DEFAULT 0,
    last_used_at DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (source_proposal_id) REFERENCES hr_proposals(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    FULLTEXT idx_search (question, answer)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifiche HR
CREATE TABLE hr_notifications (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dipendente_id BIGINT UNSIGNED NOT NULL,
    type ENUM('scadenza','documento','formazione','onboarding','proposta','sistema') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(500),
    action_label VARCHAR(100),
    priority ENUM('low','medium','high','urgent') DEFAULT 'medium',
    read_at DATETIME,
    dismissed_at DATETIME,
    expires_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (dipendente_id) REFERENCES Dipendenti(id) ON DELETE CASCADE,
    INDEX idx_unread (dipendente_id, read_at),
    INDEX idx_type (type),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Log accessi manuale (per analytics)
CREATE TABLE hr_manual_access_logs (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dipendente_id BIGINT UNSIGNED,
    document_path VARCHAR(500) NOT NULL,
    document_code VARCHAR(20),
    accessed_at DATETIME NOT NULL,
    duration_seconds INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),

    FOREIGN KEY (dipendente_id) REFERENCES Dipendenti(id) ON DELETE SET NULL,
    INDEX idx_document (document_code),
    INDEX idx_date (accessed_at),
    INDEX idx_dipendente (dipendente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 4.3 Dati Seed Iniziali

```sql
-- Seed: hr_training_paths

INSERT INTO hr_training_paths (code, name, description, target_role, documents, quiz_config, is_mandatory, estimated_hours) VALUES

('ONBOARDING_GENERALE', 'Onboarding Generale', 'Percorso base per tutti i nuovi dipendenti', 'all',
'["POL-DOC-001","PRO-GEN-001","MOD-GEN-001","MOD-GEN-002"]',
'{"POL-DOC-001": {"questions": 5, "passing_score": 80}}',
TRUE, 2.0),

('ONBOARDING_SEGRETARIA', 'Onboarding Segretaria', 'Formazione specifica per segreteria', 'segretaria',
'["PRC-CLI-001","PRC-CLI-002","PRC-CLI-003","PRC-COR-013","PRC-COR-016"]',
'{"PRC-CLI-002": {"questions": 10, "passing_score": 80}}',
TRUE, 4.0),

('ONBOARDING_ASO', 'Onboarding ASO', 'Formazione specifica per assistenti alla poltrona', 'aso',
'["PRO-CLI-001","PRO-CLI-002","PRO-CLI-004","PRO-CLI-009","PRO-CLI-017"]',
'{"PRO-CLI-001": {"questions": 10, "passing_score": 90}}',
TRUE, 6.0),

('ONBOARDING_IGIENISTA', 'Onboarding Igienista', 'Formazione specifica per igienisti', 'igienista',
'["PRO-CLI-001","PRO-CLI-004","PRO-CLI-013","PRO-CLI-015"]',
'{}',
TRUE, 4.0),

('SICUREZZA_BASE', 'Sicurezza sul Lavoro - Base', 'Formazione obbligatoria D.Lgs. 81/08', 'all',
'["PRO-CLI-016","PRO-CLI-017","PRO-CLI-018"]',
'{"PRO-CLI-016": {"questions": 20, "passing_score": 80}}',
TRUE, 4.0),

('PRIVACY_GDPR', 'Privacy e GDPR', 'Formazione annuale obbligatoria privacy', 'all',
'["MOD-GEN-001","MOD-GEN-002","MOD-GEN-003"]',
'{"MOD-GEN-001": {"questions": 10, "passing_score": 80}}',
TRUE, 2.0);
```

---

## 5. API Endpoints

### 5.1 Autenticazione

Usa sistema esistente Laravel Sanctum. Header richiesto:
```
Authorization: Bearer {token}
X-API-Key: sk_smiledoc_2025_xK9mP3nQ7rT2wY5v
```

### 5.2 Endpoints Dettagliati

#### 5.2.1 Assistente AI

```
POST /api/v1/hr/assistant/chat
────────────────────────────────
Request:
{
  "message": "Come faccio la sterilizzazione?",
  "session_id": "uuid-optional",
  "context": {
    "page": "/clinica/protocolli/sterilizzazione/",
    "document_code": "PRO-CLI-001"
  }
}

Response:
{
  "success": true,
  "data": {
    "response": "La sterilizzazione segue questi passaggi...",
    "sources": [
      {"code": "PRO-CLI-001", "title": "Ciclo Sterilizzazione", "relevance": 0.95}
    ],
    "session_id": "uuid",
    "suggestions": ["Vuoi sapere di più su...", "Altro documento correlato..."]
  }
}
────────────────────────────────

GET /api/v1/hr/assistant/history
────────────────────────────────
Query: ?limit=20&offset=0

Response:
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": 1,
        "session_id": "uuid",
        "messages": [...],
        "created_at": "2026-01-25T10:00:00Z",
        "resolved": true
      }
    ],
    "total": 45
  }
}
────────────────────────────────

POST /api/v1/hr/assistant/feedback
────────────────────────────────
Request:
{
  "conversation_id": 123,
  "message_index": 2,
  "helpful": false,
  "comment": "Non ha risposto alla mia domanda"
}
────────────────────────────────

POST /api/v1/hr/assistant/escalate
────────────────────────────────
Request:
{
  "conversation_id": 123,
  "reason": "L'assistente non sa rispondere a questa domanda"
}
```

#### 5.2.2 Formazione

```
GET /api/v1/hr/training/paths
────────────────────────────────
Query: ?role=segretaria&mandatory_only=true

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "ONBOARDING_SEGRETARIA",
      "name": "Onboarding Segretaria",
      "description": "...",
      "documents": ["PRC-CLI-001", ...],
      "estimated_hours": 4.0,
      "is_mandatory": true,
      "my_progress": {
        "status": "in_progress",
        "current_step": 2,
        "total_steps": 5,
        "percentage": 40
      }
    }
  ]
}
────────────────────────────────

GET /api/v1/hr/training/progress
────────────────────────────────
Response:
{
  "success": true,
  "data": {
    "overall": {
      "completed_paths": 2,
      "total_mandatory": 3,
      "next_expiring": {
        "path": "PRIVACY_GDPR",
        "expires_at": "2027-01-25"
      }
    },
    "paths": [...]
  }
}
────────────────────────────────

POST /api/v1/hr/training/start/{path_code}
────────────────────────────────
Response:
{
  "success": true,
  "data": {
    "progress_id": 123,
    "first_document": {
      "code": "PRC-CLI-001",
      "title": "Gestione Telefonate",
      "url": "/clinica/procedure/segreteria/gestione-telefonate/"
    }
  }
}
────────────────────────────────

POST /api/v1/hr/training/complete-step
────────────────────────────────
Request:
{
  "progress_id": 123,
  "step": 1,
  "document_code": "PRC-CLI-001",
  "time_spent_seconds": 300
}
────────────────────────────────

POST /api/v1/hr/training/quiz
────────────────────────────────
Request:
{
  "progress_id": 123,
  "step": 1,
  "answers": {
    "q1": "a",
    "q2": "c",
    "q3": ["a", "b"]
  }
}

Response:
{
  "success": true,
  "data": {
    "passed": true,
    "score": 85,
    "passing_score": 80,
    "feedback": {
      "q2": "La risposta corretta era B perché..."
    }
  }
}
────────────────────────────────

GET /api/v1/hr/training/certificate/{progress_id}
────────────────────────────────
Response: PDF binary
Headers:
  Content-Type: application/pdf
  Content-Disposition: attachment; filename="certificato_ONBOARDING_SEGRETARIA.pdf"
```

#### 5.2.3 Documenti / Presa Visione

```
GET /api/v1/hr/documents/pending
────────────────────────────────
Response:
{
  "success": true,
  "data": [
    {
      "code": "PRO-CLI-001",
      "version": "1.0",
      "title": "Ciclo Sterilizzazione",
      "category": "Protocolli Clinica",
      "url": "/clinica/protocolli/sterilizzazione/ciclo-sterilizzazione/",
      "is_mandatory": true,
      "reason": "onboarding"
    }
  ]
}
────────────────────────────────

POST /api/v1/hr/documents/acknowledge
────────────────────────────────
Request:
{
  "document_code": "PRO-CLI-001",
  "document_version": "1.0",
  "document_hash": "sha256:abc123...",
  "signature_type": "click",
  "signature_data": null,
  "confirmation": true
}

Response:
{
  "success": true,
  "data": {
    "acknowledgment_id": 456,
    "acknowledged_at": "2026-01-25T15:30:00Z",
    "remaining_pending": 5
  }
}
────────────────────────────────

GET /api/v1/hr/documents/history
────────────────────────────────
Query: ?from=2026-01-01&to=2026-12-31

Response:
{
  "success": true,
  "data": [
    {
      "id": 456,
      "document_code": "PRO-CLI-001",
      "document_version": "1.0",
      "document_title": "Ciclo Sterilizzazione",
      "acknowledged_at": "2026-01-25T15:30:00Z",
      "signature_type": "click"
    }
  ]
}
────────────────────────────────

GET /api/v1/hr/documents/verify/{hash}
────────────────────────────────
Response:
{
  "success": true,
  "data": {
    "valid": true,
    "document_code": "PRO-CLI-001",
    "version": "1.0",
    "current_hash": "sha256:abc123...",
    "matches": true,
    "last_modified": "2026-01-20T10:00:00Z"
  }
}
```

#### 5.2.4 Proposte

```
GET /api/v1/hr/proposals
────────────────────────────────
Query: ?status=pending&my_only=true

Response:
{
  "success": true,
  "data": [
    {
      "id": 789,
      "document_code": "PRO-CLI-001",
      "type": "chiarimento",
      "title": "Passaggio 3 non chiaro",
      "content": "Nel passaggio 3 non è specificato...",
      "status": "pending",
      "created_at": "2026-01-24T10:00:00Z"
    }
  ]
}
────────────────────────────────

POST /api/v1/hr/proposals
────────────────────────────────
Request:
{
  "document_code": "PRO-CLI-001",
  "type": "chiarimento",
  "title": "Passaggio 3 non chiaro",
  "content": "Nel passaggio 3 non è specificato se..."
}
────────────────────────────────

PUT /api/v1/hr/proposals/{id}/review [ADMIN]
────────────────────────────────
Request:
{
  "status": "approved",
  "notes": "Proposta accettata, aggiorneremo il documento"
}
```

#### 5.2.5 FAQ

```
GET /api/v1/hr/faq
────────────────────────────────
Query: ?category=sterilizzazione&limit=10

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "question": "Quanto tempo dura il ciclo di sterilizzazione?",
      "answer": "Il ciclo completo dura...",
      "document_codes": ["PRO-CLI-001"],
      "category": "sterilizzazione"
    }
  ]
}
────────────────────────────────

GET /api/v1/hr/faq/search
────────────────────────────────
Query: ?q=sterilizzazione+temperatura

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "question": "...",
      "answer": "...",
      "relevance": 0.92
    }
  ]
}
```

#### 5.2.6 Notifiche

```
GET /api/v1/hr/notifications
────────────────────────────────
Query: ?unread_only=true

Response:
{
  "success": true,
  "data": {
    "unread_count": 3,
    "notifications": [
      {
        "id": 101,
        "type": "documento",
        "title": "Nuovo documento da leggere",
        "message": "È stato pubblicato PRO-CLI-028...",
        "action_url": "/clinica/protocolli/...",
        "action_label": "Leggi ora",
        "priority": "high",
        "created_at": "2026-01-25T09:00:00Z"
      }
    ]
  }
}
────────────────────────────────

PUT /api/v1/hr/notifications/{id}/read
────────────────────────────────
Response:
{
  "success": true,
  "data": {
    "read_at": "2026-01-25T15:00:00Z"
  }
}
```

#### 5.2.7 Admin

```
GET /api/v1/hr/admin/dashboard
────────────────────────────────
Response:
{
  "success": true,
  "data": {
    "dipendenti": {
      "totali": 15,
      "attivi": 12,
      "in_onboarding": 2
    },
    "formazione": {
      "completamenti_mese": 8,
      "in_scadenza_30gg": 3
    },
    "documenti": {
      "prese_visione_mese": 45,
      "pendenti_totali": 12
    },
    "proposte": {
      "pending": 5,
      "approvate_mese": 3
    },
    "ai": {
      "conversazioni_mese": 120,
      "escalations_pending": 2
    }
  }
}
────────────────────────────────

GET /api/v1/hr/admin/escalations
────────────────────────────────
Response:
{
  "success": true,
  "data": [
    {
      "id": 50,
      "dipendente": {"id": 5, "nome": "Mario", "cognome": "Rossi"},
      "question": "Come gestisco un paziente con...",
      "context": {...},
      "escalated_at": "2026-01-24T14:00:00Z",
      "ai_response_attempt": "...",
      "reason": "Non so rispondere a domande mediche specifiche"
    }
  ]
}
────────────────────────────────

GET /api/v1/hr/admin/stats
────────────────────────────────
Query: ?from=2026-01-01&to=2026-01-31

Response:
{
  "success": true,
  "data": {
    "training": {
      "completions_by_path": {...},
      "avg_quiz_score": 87.5,
      "avg_completion_days": 4.2
    },
    "ai": {
      "total_conversations": 450,
      "avg_messages_per_conversation": 3.2,
      "resolution_rate": 0.85,
      "top_topics": ["sterilizzazione", "appuntamenti", "privacy"]
    },
    "documents": {
      "most_viewed": [...],
      "acknowledgment_rate": 0.92
    }
  }
}
```

---

## 6. Fasi di Implementazione

### Fase 0: Setup Infrastruttura (2 giorni)

| # | Task | Dettaglio | Owner | Status |
|---|------|-----------|-------|--------|
| 0.1 | Creare branch | `feature/hr-integration` in Geniusmile-API | Dev | ⬜ |
| 0.2 | Setup OpenAI | Account + API Key in .env | Dev | ⬜ |
| 0.3 | Setup Qdrant | Docker container su server | Dev | ⬜ |
| 0.4 | Config Redis | Verificare connessione esistente | Dev | ⬜ |
| 0.5 | Struttura cartelle | Creare namespace Hr in Controllers | Dev | ⬜ |

### Fase 1: Database (2 giorni)

| # | Task | Dettaglio | Owner | Status |
|---|------|-----------|-------|--------|
| 1.1 | Migration estensione | Estendere tabella Dipendenti | Dev | ⬜ |
| 1.2 | Migration nuove tabelle | Tutte le tabelle hr_* | Dev | ⬜ |
| 1.3 | Seed training paths | Inserire percorsi base | Dev | ⬜ |
| 1.4 | Model Laravel | Creare tutti i Model | Dev | ⬜ |
| 1.5 | Relationships | Definire relazioni Eloquent | Dev | ⬜ |
| 1.6 | Test migrations | Eseguire su DB test | Dev | ⬜ |

### Fase 2: Services Core (3 giorni)

| # | Task | Dettaglio | Owner | Status |
|---|------|-----------|-------|--------|
| 2.1 | OpenAiService | Wrapper per API OpenAI | Dev | ⬜ |
| 2.2 | QdrantService | Client per vector store | Dev | ⬜ |
| 2.3 | RagService | Pipeline RAG completa | Dev | ⬜ |
| 2.4 | DocumentHashService | Calcolo SHA-256 | Dev | ⬜ |
| 2.5 | Embedding pipeline | Script per embedding docs | Dev | ⬜ |
| 2.6 | Embed tutti i documenti | 91 docs → Qdrant | Dev | ⬜ |
| 2.7 | Test RAG | Query di test | Dev | ⬜ |

### Fase 3: API Assistente (3 giorni)

| # | Task | Dettaglio | Owner | Status |
|---|------|-----------|-------|--------|
| 3.1 | AssistantController | Endpoint chat | Dev | ⬜ |
| 3.2 | System prompt | Prompt ottimizzato Smiledoc | Dev | ⬜ |
| 3.3 | Gestione sessioni | Continuità conversazione | Dev | ⬜ |
| 3.4 | Ricerca FAQ | Prima cerca FAQ esistenti | Dev | ⬜ |
| 3.5 | Logging | Salvataggio conversazioni | Dev | ⬜ |
| 3.6 | Escalation | Sistema escalation admin | Dev | ⬜ |
| 3.7 | Rate limiting | Max 10 msg/minuto | Dev | ⬜ |
| 3.8 | Test endpoint | Postman/Insomnia tests | Dev | ⬜ |

### Fase 4: API Formazione (2 giorni)

| # | Task | Dettaglio | Owner | Status |
|---|------|-----------|-------|--------|
| 4.1 | TrainingController | Tutti gli endpoint | Dev | ⬜ |
| 4.2 | Progress tracking | Logica avanzamento | Dev | ⬜ |
| 4.3 | Quiz engine | Valutazione risposte | Dev | ⬜ |
| 4.4 | CertificateService | Generazione PDF | Dev | ⬜ |
| 4.5 | Scadenze | Calcolo e notifiche | Dev | ⬜ |
| 4.6 | Test endpoint | Tests completi | Dev | ⬜ |

### Fase 5: API Documenti (2 giorni)

| # | Task | Dettaglio | Owner | Status |
|---|------|-----------|-------|--------|
| 5.1 | DocumentsController | Tutti gli endpoint | Dev | ⬜ |
| 5.2 | Presa visione | Registrazione con hash | Dev | ⬜ |
| 5.3 | Verifica integrità | Confronto hash | Dev | ⬜ |
| 5.4 | Pending documents | Lista per dipendente | Dev | ⬜ |
| 5.5 | History | Storico completo | Dev | ⬜ |
| 5.6 | Test endpoint | Tests completi | Dev | ⬜ |

### Fase 6: API Proposte + FAQ (1 giorno)

| # | Task | Dettaglio | Owner | Status |
|---|------|-----------|-------|--------|
| 6.1 | ProposalsController | CRUD + review | Dev | ⬜ |
| 6.2 | FaqController | Lista + search | Dev | ⬜ |
| 6.3 | Workflow approvazione | Status transitions | Dev | ⬜ |
| 6.4 | Test endpoint | Tests completi | Dev | ⬜ |

### Fase 7: API Notifiche + Admin (1 giorno)

| # | Task | Dettaglio | Owner | Status |
|---|------|-----------|-------|--------|
| 7.1 | NotificationsController | Lista + read | Dev | ⬜ |
| 7.2 | HrAdminController | Dashboard + stats | Dev | ⬜ |
| 7.3 | NotificationService | Invio multi-canale | Dev | ⬜ |
| 7.4 | Test endpoint | Tests completi | Dev | ⬜ |

### Fase 8: Jobs e Automazioni (1 giorno)

| # | Task | Dettaglio | Owner | Status |
|---|------|-----------|-------|--------|
| 8.1 | InitializeOnboardingJob | Setup nuovo dipendente | Dev | ⬜ |
| 8.2 | SendTrainingReminderJob | Cron scadenze | Dev | ⬜ |
| 8.3 | GenerateCertificateJob | PDF asincrono | Dev | ⬜ |
| 8.4 | EscalationNotifyJob | Notifica admin | Dev | ⬜ |
| 8.5 | Cron schedule | Configurare scheduler | Dev | ⬜ |
| 8.6 | Test jobs | Verificare esecuzione | Dev | ⬜ |

### Fase 9: Widget Chat (3 giorni)

| # | Task | Dettaglio | Owner | Status |
|---|------|-----------|-------|--------|
| 9.1 | Struttura base | IIFE + classi | Dev | ⬜ |
| 9.2 | UI componenti | Chat bubble, input, messaggi | Dev | ⬜ |
| 9.3 | API client | Fetch wrapper | Dev | ⬜ |
| 9.4 | Autenticazione | Token handling | Dev | ⬜ |
| 9.5 | Gestione sessione | UUID + localStorage | Dev | ⬜ |
| 9.6 | Contesto pagina | Detect documento corrente | Dev | ⬜ |
| 9.7 | Notifiche badge | Counter non lette | Dev | ⬜ |
| 9.8 | Responsive | Mobile friendly | Dev | ⬜ |
| 9.9 | Bundle | Minify + single file | Dev | ⬜ |
| 9.10 | Integrazione Manuale | Embed in MkDocs | Dev | ⬜ |
| 9.11 | Test cross-browser | Chrome, Firefox, Safari | Dev | ⬜ |

### Fase 10: Frontend CRM (4 giorni)

| # | Task | Dettaglio | Owner | Status |
|---|------|-----------|-------|--------|
| 10.1 | HrDashboard.vue | Pagina overview | Dev | ⬜ |
| 10.2 | HrOnboarding.vue | Gestione onboarding | Dev | ⬜ |
| 10.3 | HrFormazione.vue | Percorsi formativi | Dev | ⬜ |
| 10.4 | HrDocumenti.vue | Prese visione | Dev | ⬜ |
| 10.5 | HrProposte.vue | Gestione proposte | Dev | ⬜ |
| 10.6 | HrEscalations.vue | Domande AI non risolte | Dev | ⬜ |
| 10.7 | DipendenteHr.vue | Tab HR in dettaglio | Dev | ⬜ |
| 10.8 | Componenti shared | Cards, modals, forms | Dev | ⬜ |
| 10.9 | Widget integration | HrAssistantWidget.vue | Dev | ⬜ |
| 10.10 | Navigation | Aggiungere menu HR | Dev | ⬜ |
| 10.11 | Test pagine | Verifica funzionamento | Dev | ⬜ |

### Fase 11: Testing E2E (2 giorni)

| # | Task | Dettaglio | Owner | Status |
|---|------|-----------|-------|--------|
| 11.1 | Test onboarding flow | Nuovo dip → completamento | QA | ⬜ |
| 11.2 | Test chat AI | Domande varie + escalation | QA | ⬜ |
| 11.3 | Test formazione | Percorso + quiz + certificato | QA | ⬜ |
| 11.4 | Test presa visione | Firma + verifica hash | QA | ⬜ |
| 11.5 | Test proposte | Crea + approva | QA | ⬜ |
| 11.6 | Test admin | Dashboard + stats | QA | ⬜ |
| 11.7 | Test widget | Tutti i contesti | QA | ⬜ |
| 11.8 | Load testing | 50 utenti concorrenti | QA | ⬜ |
| 11.9 | Security test | OWASP basic | QA | ⬜ |
| 11.10 | Bug fixing | Correzione issues | Dev | ⬜ |

### Fase 12: Deploy Produzione (1 giorno)

| # | Task | Dettaglio | Owner | Status |
|---|------|-----------|-------|--------|
| 12.1 | Merge branch | feature/hr-integration → main | Dev | ⬜ |
| 12.2 | Run migrations | Produzione | Dev | ⬜ |
| 12.3 | Deploy API | PM2 restart | Dev | ⬜ |
| 12.4 | Deploy widget | CDN/Server | Dev | ⬜ |
| 12.5 | Deploy frontend | Nuxt build + deploy | Dev | ⬜ |
| 12.6 | Update Manuale | Widget loader | Dev | ⬜ |
| 12.7 | Embed docs produzione | 91 docs in Qdrant prod | Dev | ⬜ |
| 12.8 | Smoke test | Verifica rapida | QA | ⬜ |
| 12.9 | Monitoring | Sentry + logs | Dev | ⬜ |
| 12.10 | Documentazione | API docs finale | Dev | ⬜ |

---

## 7. Checklist Dettagliata

### 7.1 Pre-Requisiti

- [ ] Account OpenAI con credito
- [ ] API Key OpenAI in `.env`
- [ ] Docker installato su server
- [ ] Accesso SSH a 93.186.255.213
- [ ] Accesso repo Geniusmile-API
- [ ] Accesso repo Geniusmile-Frontend
- [ ] Accesso DB geniusmile_test

### 7.2 Backend Checklist

#### Models
- [ ] `HrDocumentAcknowledgment.php`
- [ ] `HrTrainingPath.php`
- [ ] `HrTrainingProgress.php`
- [ ] `HrAiConversation.php`
- [ ] `HrProposal.php`
- [ ] `HrFaq.php`
- [ ] `HrNotification.php`
- [ ] `HrManualAccessLog.php`
- [ ] Relazioni in `Dipendente.php` aggiornate

#### Controllers
- [ ] `Hr/AssistantController.php`
- [ ] `Hr/TrainingController.php`
- [ ] `Hr/DocumentsController.php`
- [ ] `Hr/ProposalsController.php`
- [ ] `Hr/FaqController.php`
- [ ] `Hr/NotificationsController.php`
- [ ] `Hr/OnboardingController.php`
- [ ] `Hr/HrAdminController.php`

#### Services
- [ ] `Services/OpenAiService.php`
- [ ] `Services/QdrantService.php`
- [ ] `Services/RagService.php`
- [ ] `Services/DocumentHashService.php`
- [ ] `Services/CertificateService.php`
- [ ] `Services/NotificationService.php`

#### Jobs
- [ ] `Jobs/InitializeOnboardingJob.php`
- [ ] `Jobs/EmbedDocumentJob.php`
- [ ] `Jobs/SendTrainingReminderJob.php`
- [ ] `Jobs/GenerateCertificateJob.php`
- [ ] `Jobs/EscalationNotifyJob.php`

#### Migrations
- [ ] `2026_01_25_000001_extend_dipendenti_table.php`
- [ ] `2026_01_25_000002_create_hr_tables.php`

#### Seeders
- [ ] `HrTrainingPathSeeder.php`

#### Routes
- [ ] Tutte le route in `routes/api.php`

#### Tests
- [ ] `Tests/Feature/Hr/AssistantTest.php`
- [ ] `Tests/Feature/Hr/TrainingTest.php`
- [ ] `Tests/Feature/Hr/DocumentsTest.php`
- [ ] `Tests/Feature/Hr/ProposalsTest.php`

### 7.3 Widget Checklist

- [ ] `widget/smiledoc-assistant.js` (entry point)
- [ ] `widget/src/chat.js`
- [ ] `widget/src/api.js`
- [ ] `widget/src/ui.js`
- [ ] `widget/src/auth.js`
- [ ] `widget/src/storage.js`
- [ ] `widget/styles/widget.css`
- [ ] `widget/dist/smiledoc-assistant.min.js`
- [ ] Integrazione in Manuale MkDocs
- [ ] Integrazione in HR-Smiledoc
- [ ] Test Chrome
- [ ] Test Firefox
- [ ] Test Safari
- [ ] Test Mobile

### 7.4 Frontend CRM Checklist

- [ ] `pages/hr/dashboard.vue`
- [ ] `pages/hr/onboarding.vue`
- [ ] `pages/hr/formazione.vue`
- [ ] `pages/hr/documenti.vue`
- [ ] `pages/hr/proposte.vue`
- [ ] `pages/hr/escalations.vue`
- [ ] `pages/dipendenti/[id]/hr.vue`
- [ ] `components/hr/HrAssistantWidget.vue`
- [ ] `components/hr/OnboardingProgress.vue`
- [ ] `components/hr/TrainingCard.vue`
- [ ] `components/hr/QuizComponent.vue`
- [ ] `components/hr/AcknowledgmentModal.vue`
- [ ] `components/hr/ProposalForm.vue`
- [ ] Navigation menu aggiornato
- [ ] Composables/stores per stato HR

### 7.5 Qdrant Checklist

- [ ] Docker container running
- [ ] Collection `smiledoc_docs` creata
- [ ] Schema: `{id, document_code, title, content, embedding, metadata}`
- [ ] Tutti i 91 documenti embedded
- [ ] Query test funzionante
- [ ] Backup configurato

### 7.6 Testing Checklist

- [ ] Unit tests passano
- [ ] Feature tests passano
- [ ] E2E flow onboarding
- [ ] E2E flow formazione
- [ ] E2E flow chat AI
- [ ] E2E flow presa visione
- [ ] E2E flow proposte
- [ ] Load test 50 utenti
- [ ] Security scan OWASP

### 7.7 Deploy Checklist

- [ ] Branch merged
- [ ] Migrations eseguite PROD
- [ ] Qdrant PROD con tutti i docs
- [ ] API deployed
- [ ] Widget deployed
- [ ] Frontend deployed
- [ ] Manuale aggiornato
- [ ] Smoke test passato
- [ ] Monitoring attivo
- [ ] Backup verificato

---

## 8. Testing e Validazione

### 8.1 Test Cases Principali

#### TC-001: Onboarding Nuovo Dipendente
```
Precondizioni: Admin loggato
1. Admin crea nuovo dipendente (mansione: segretaria)
2. Sistema crea automaticamente percorso onboarding
3. Sistema invia email al dipendente
4. Dipendente accede e vede dashboard onboarding
5. Dipendente completa primo documento
6. Sistema registra presa visione
7. Dipendente risponde a quiz
8. Sistema valuta e mostra risultato
9. Al completamento → genera certificato
Expected: Tutto il flusso funziona, dati registrati correttamente
```

#### TC-002: Chat AI con RAG
```
Precondizioni: Dipendente loggato
1. Apre widget chat
2. Scrive "Come faccio la sterilizzazione?"
3. Sistema cerca in Qdrant
4. Sistema genera risposta con GPT-4o
5. Risposta include link al documento sorgente
6. Dipendente clicca "Non utile"
7. Sistema chiede se vuole escalation
8. Dipendente conferma
9. Admin riceve notifica
Expected: Risposta pertinente, escalation registrata
```

#### TC-003: Presa Visione Documento
```
Precondizioni: Dipendente con documenti pending
1. Dipendente va su documento nel Manuale
2. Sistema traccia tempo lettura
3. Dopo 30 secondi appare bottone "Conferma lettura"
4. Dipendente clicca
5. Sistema calcola hash documento
6. Sistema registra acknowledgment
7. Documento sparisce da "pending"
Expected: Hash corretto, timestamp registrato, IP loggato
```

#### TC-004: Proposta Modifica
```
Precondizioni: Dipendente loggato
1. Dipendente su documento PRO-CLI-001
2. Clicca "Proponi modifica"
3. Compila form (tipo: chiarimento, titolo, descrizione)
4. Invia proposta
5. Admin riceve notifica
6. Admin apre dashboard proposte
7. Admin approva con nota
8. Dipendente riceve notifica approvazione
Expected: Workflow completo, notifiche inviate
```

### 8.2 Test Performance

| Endpoint | Target Response Time | Max Concurrent |
|----------|---------------------|----------------|
| GET /hr/training/paths | < 200ms | 100 |
| POST /hr/assistant/chat | < 3000ms | 20 |
| POST /hr/documents/acknowledge | < 500ms | 50 |
| GET /hr/notifications | < 100ms | 100 |

### 8.3 Test Security

- [ ] SQL Injection su tutti gli input
- [ ] XSS su contenuti utente
- [ ] CSRF token validation
- [ ] Rate limiting funzionante
- [ ] Auth required su tutti gli endpoint
- [ ] Tenant isolation (no cross-tenant access)

---

## 9. Deploy e Monitoring

### 9.1 Configurazione Server

```bash
# Server: 93.186.255.213

# Qdrant Docker
docker run -d --name qdrant \
  -p 6333:6333 -p 6334:6334 \
  -v /var/lib/qdrant:/qdrant/storage \
  qdrant/qdrant

# Redis (già esistente)
# MySQL (già esistente)

# PM2 per API
pm2 restart geniusmile-api
```

### 9.2 Environment Variables

```env
# .env (Geniusmile-API)

# OpenAI
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4o
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Qdrant
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_COLLECTION=smiledoc_docs

# HR Settings
HR_CHAT_RATE_LIMIT=10
HR_CHAT_RATE_WINDOW=60
HR_ONBOARDING_AUTO_SETUP=true
```

### 9.3 Monitoring

| Metric | Alert Threshold | Action |
|--------|-----------------|--------|
| API Error Rate | > 1% | Notify dev |
| Chat Response Time | > 5s | Scale/optimize |
| Qdrant Memory | > 80% | Add storage |
| OpenAI Cost | > $200/month | Review usage |
| Failed Jobs | > 10/hour | Investigate |

### 9.4 Backup

| Cosa | Frequenza | Retention |
|------|-----------|-----------|
| MySQL hr_* tables | Daily | 30 days |
| Qdrant snapshots | Weekly | 4 weeks |
| Certificati PDF | Real-time | Permanent |
| Conversation logs | Daily | 1 year |

---

## 10. Log Avanzamento

### Sessione 1 - 25/01/2026

| Ora | Azione | Stato | Note |
|-----|--------|-------|------|
| 12:45 | Creato piano dettagliato | ✅ | Questo documento |
| | | | |
| | | | |

---

## Appendice A: System Prompt Assistente AI

```
Sei l'Assistente HR di Smiledoc, una clinica odontoiatrica. Il tuo compito è aiutare i dipendenti a trovare informazioni su protocolli, procedure e policy aziendali.

REGOLE:
1. Rispondi SOLO basandoti sui documenti forniti nel contesto
2. Se non trovi l'informazione, dì "Non ho trovato questa informazione nei documenti. Vuoi che inoltri la domanda alla direzione?"
3. Cita sempre il documento sorgente (es: "Secondo il documento PRO-CLI-001...")
4. Sii conciso ma completo
5. Se la domanda riguarda questioni mediche specifiche, rimanda sempre al medico
6. Non inventare informazioni
7. Usa un tono professionale ma amichevole
8. Rispondi in italiano

CONTESTO DIPENDENTE:
- Nome: {nome}
- Ruolo: {mansione}
- Sede: {sede}
- In onboarding: {is_onboarding}

DOCUMENTI RILEVANTI:
{context}

DOMANDA: {question}
```

---

## Appendice B: Quiz Questions Schema

```json
{
  "document_code": "PRO-CLI-001",
  "questions": [
    {
      "id": "q1",
      "type": "single",
      "question": "Qual è la temperatura minima per la sterilizzazione in autoclave?",
      "options": [
        {"id": "a", "text": "100°C"},
        {"id": "b", "text": "121°C"},
        {"id": "c", "text": "134°C"},
        {"id": "d", "text": "150°C"}
      ],
      "correct": "c",
      "explanation": "La temperatura minima per la sterilizzazione è 134°C come indicato nel protocollo."
    },
    {
      "id": "q2",
      "type": "multiple",
      "question": "Quali sono le fasi del ciclo di sterilizzazione?",
      "options": [
        {"id": "a", "text": "Decontaminazione"},
        {"id": "b", "text": "Lavaggio"},
        {"id": "c", "text": "Asciugatura"},
        {"id": "d", "text": "Tutte le precedenti"}
      ],
      "correct": ["a", "b", "c"],
      "explanation": "Il ciclo comprende decontaminazione, lavaggio e asciugatura prima della sterilizzazione."
    }
  ]
}
```

---

## Appendice C: Certificato Template

```html
<!-- certificate-template.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Georgia', serif; text-align: center; }
        .certificate { border: 10px solid #00BCD4; padding: 50px; margin: 20px; }
        .logo { width: 150px; }
        .title { font-size: 36px; color: #00BCD4; margin: 30px 0; }
        .name { font-size: 28px; font-weight: bold; margin: 20px 0; }
        .details { font-size: 16px; margin: 10px 0; }
        .signature { margin-top: 50px; }
        .qr { width: 100px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="certificate">
        <img src="logo.png" class="logo">
        <div class="title">CERTIFICATO DI COMPLETAMENTO</div>
        <div class="details">Si certifica che</div>
        <div class="name">{{ $dipendente->nome }} {{ $dipendente->cognome }}</div>
        <div class="details">ha completato con successo il percorso formativo</div>
        <div class="name">{{ $path->name }}</div>
        <div class="details">
            Punteggio medio: {{ $score }}%<br>
            Data completamento: {{ $completed_at }}<br>
            Validità: {{ $expires_at }}
        </div>
        <div class="signature">
            <div>_______________________</div>
            <div>Direzione Smiledoc S.r.l.</div>
        </div>
        <img src="{{ $qr_code }}" class="qr">
        <div class="details">Codice verifica: {{ $certificate_hash }}</div>
    </div>
</body>
</html>
```

---

**Fine Piano di Integrazione**

*Documento generato automaticamente - Versione 1.0*
*Ultimo aggiornamento: 25 Gennaio 2026*
