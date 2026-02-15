# Politica di Controllo Documenti

| Codice | Versione | Data Emissione | Data Revisione | Approvato da |
|--------|----------|----------------|----------------|--------------|
| POL-DOC-001 | 1.0 | 25/01/2026 | - | Direzione Generale |

---

## 1. Scopo e Campo di Applicazione

La presente politica definisce le regole per la **creazione, approvazione, distribuzione, revisione e archiviazione** di tutti i documenti del Sistema di Gestione Qualità di {{ clinic.legal_name }}

Si applica a:

- Protocolli operativi
- Procedure aziendali
- Checklist operative
- Moduli e modulistica
- Istruzioni di lavoro
- Documenti di registrazione

---

## 2. Definizioni

| Termine | Definizione |
|---------|-------------|
| **Documento controllato** | Documento ufficiale soggetto a gestione formale |
| **Versione** | Identificativo numerico dello stato del documento |
| **Revisione** | Modifica apportata a un documento esistente |
| **Obsoleto** | Documento non più in vigore |
| **Presa visione** | Attestazione formale di lettura e comprensione |

---

## 3. Codifica dei Documenti

Ogni documento è identificato da un **codice univoco** secondo il seguente schema:

```
[TIPO]-[AREA]-[NUMERO]
```

### 3.1 Tipi di Documento

| Codice | Tipo |
|--------|------|
| PRO | Protocollo |
| PRC | Procedura |
| CHK | Checklist |
| MOD | Modulo |
| IST | Istruzione operativa |
| POL | Politica |

### 3.2 Aree

| Codice | Area |
|--------|------|
| GEN | Generali |
| COR | Corporate |
| CLI | Clinica |
| SED | Sede |
| DOC | Sistema Documentale |

### 3.3 Esempi

- `PRO-CLI-001` = Protocollo Clinica numero 001
- `PRC-COR-015` = Procedura Corporate numero 015
- `MOD-GEN-003` = Modulo Generali numero 003

---

## 4. Ciclo di Vita del Documento

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   BOZZA     │────▶│  APPROVATO  │────▶│   VIGENTE   │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  OBSOLETO   │◀────│  REVISIONE  │
                    └─────────────┘     └─────────────┘
```

### 4.1 Stati del Documento

| Stato | Descrizione |
|-------|-------------|
| **Bozza** | In fase di redazione, non ancora approvato |
| **Approvato** | Validato dalla Direzione |
| **Vigente** | Attualmente in uso e obbligatorio |
| **In Revisione** | Soggetto a modifica |
| **Obsoleto** | Superato da nuova versione |

---

## 5. Responsabilità

### 5.1 Redazione

La redazione dei documenti è affidata a personale competente nell'area di riferimento.

### 5.2 Verifica

La verifica tecnica è effettuata dal Responsabile di Area.

### 5.3 Approvazione

L'approvazione finale è di competenza esclusiva della **Direzione Generale**.

!!! warning "IMPORTANTE"
    Nessun documento può entrare in vigore senza l'approvazione formale della Direzione.

---

## 6. Distribuzione e Accesso

### 6.1 Pubblicazione

Tutti i documenti approvati sono pubblicati sul **Manuale Operativo Online** accessibile all'indirizzo:

```
https://manuale-smiledoc.geniusmile.com
```

### 6.2 Controllo Accessi

L'accesso al manuale è protetto da:

- Credenziali di autenticazione
- Log degli accessi
- Tracciamento delle consultazioni

### 6.3 Copia Controllata

!!! danger "DIVIETO"
    È **vietato** stampare o copiare documenti dal manuale senza autorizzazione. Le copie cartacee non hanno valore legale.

---

## 7. Revisione dei Documenti

### 7.1 Frequenza

| Tipo Documento | Frequenza Revisione |
|----------------|---------------------|
| Politiche | Annuale |
| Protocolli | Annuale o su necessità |
| Procedure | Semestrale o su necessità |
| Checklist | Annuale |
| Moduli | Su necessità |

### 7.2 Tracciabilità

Ogni revisione deve indicare:

- Numero di versione aggiornato
- Data di revisione
- Descrizione delle modifiche
- Responsabile della revisione
- Approvazione della Direzione

---

## 8. Archiviazione

### 8.1 Repository

Tutti i documenti sono archiviati su:

- **Repository GitHub** (versione sorgente)
- **Server Web** (versione pubblicata)

### 8.2 Backup

I backup sono effettuati:

- Automaticamente ad ogni modifica (Git)
- Giornalmente sul server

### 8.3 Conservazione

| Tipo | Periodo Conservazione |
|------|----------------------|
| Documenti vigenti | Permanente |
| Versioni obsolete | 10 anni |
| Log modifiche | Permanente |

---

## 9. Integrità e Non Ripudiabilità

### 9.1 Sistema Git

L'utilizzo del sistema di versionamento **Git** garantisce:

- **Tracciabilità completa** di ogni modifica
- **Identificazione dell'autore** di ogni cambiamento
- **Timestamp certificato** di ogni commit
- **Impossibilità di alterazione retroattiva**

### 9.2 Hash Crittografici

Ogni documento è associato a un **hash SHA-256** che garantisce:

- L'integrità del contenuto
- La non alterabilità
- La verificabilità in qualsiasi momento

---

## 10. Obblighi del Personale

Tutto il personale è tenuto a:

1. **Consultare** regolarmente il manuale operativo
2. **Sottoscrivere** il modulo di presa visione
3. **Applicare** le procedure documentate
4. **Segnalare** eventuali non conformità o necessità di aggiornamento
5. **Non divulgare** i contenuti a terzi non autorizzati

!!! danger "CONSEGUENZE"
    Il mancato rispetto di questi obblighi costituisce **inadempimento contrattuale** e può comportare provvedimenti disciplinari fino al licenziamento per giusta causa.

---

## 11. Validità Legale

Il presente sistema documentale, unitamente al registro delle prese visione, costituisce **prova documentale opponibile** in sede giudiziale ai sensi:

- Dell'art. 2712 del Codice Civile (riproduzioni meccaniche)
- Del D.Lgs. 82/2005 (Codice dell'Amministrazione Digitale)
- Del Regolamento eIDAS (UE) 910/2014

---

**Approvato da:** Direzione Generale {{ clinic.legal_name }}

**Data:** 25 Gennaio 2026

**Firma digitale:** ________________________
