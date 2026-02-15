# Documenti e Presa Visione

Il sistema di **Presa Visione Digitale** consente di gestire in modo sicuro e tracciabile la firma dei documenti aziendali.

## Tipi di Documenti

### Documenti Obbligatori

Documenti che tutti i dipendenti devono firmare:

| Codice | Documento | Rinnovo |
|--------|-----------|---------|
| PRIVACY-DIPENDENTE | Informativa Privacy Dipendente | Annuale |
| DVR-PRESA-VISIONE | Presa Visione DVR | Ad ogni aggiornamento |
| REGOLAMENTO-INTERNO | Regolamento Aziendale | Ad ogni modifica |
| CODICE-ETICO | Codice Etico | Una tantum |

### Documenti per Ruolo

Documenti specifici in base alla mansione:

| Ruolo | Documenti Aggiuntivi |
|-------|---------------------|
| ASO | Protocolli sterilizzazione, Radioprotezione |
| Segretaria | Gestione dati pazienti, Fatturazione |
| Igienista | Protocolli igiene, Consensi specifici |

## Come Firmare un Documento

### 1. Visualizza i Documenti Pendenti

1. Vai su **HR > Documenti**
2. Vedi la lista dei documenti da firmare
3. I documenti urgenti sono evidenziati in rosso

### 2. Leggi il Documento

1. Clicca su **"Leggi"** per aprire il documento
2. Leggi attentamente tutto il contenuto
3. Puoi scaricare una copia per consultazione

!!! warning "Obbligo di Lettura"
    La firma attesta che hai letto e compreso il documento. Non firmare documenti che non hai letto.

### 3. Firma il Documento

1. Clicca su **"Firma"**
2. Seleziona il tipo di firma:
   - **Firma Semplice** - Click di conferma
   - **Firma FEA** - Con PIN personale
3. Spunta le caselle di conferma
4. Clicca **"Firma documento"**

### Tipi di Firma

=== "Firma Semplice (Click)"

    - Adatta per documenti interni
    - Non richiede PIN
    - Traccia IP e timestamp

=== "Firma Elettronica Avanzata (FEA)"

    - Per documenti con valore legale
    - Richiede PIN personale
    - Maggiore sicurezza

## Verifica Integrità

Ogni documento firmato è protetto da un **hash SHA-256** che garantisce:

- Il documento non è stato modificato
- La firma è autentica
- Il timestamp è verificabile

### Come Verificare

1. Vai su **HR > Documenti > Firmati**
2. Clicca su **"Verifica"** accanto al documento
3. Il sistema conferma l'integrità

Puoi anche verificare esternamente:

```
URL: manuale.smiledoc.it/verifica/{hash}
```

## Storico Firme

Dalla sezione "Firmati" puoi vedere:

- Tutti i documenti firmati
- Data e ora della firma
- Tipo di firma utilizzato
- Hash di verifica

## Scadenze

### Notifiche Automatiche

Ricevi notifiche per:

- Nuovi documenti da firmare
- Documenti con scadenza imminente
- Documenti scaduti da rinnovare

### Rinnovo

Alcuni documenti richiedono rinnovo periodico:

1. Quando un documento scade, appare nei "Pendenti"
2. Leggi la nuova versione
3. Firma per confermare la presa visione

## Validità Legale

La presa visione digitale ha valore legale ai sensi del:

- **Regolamento eIDAS** (UE 910/2014)
- **Codice dell'Amministrazione Digitale** (D.Lgs 82/2005)
- **D.Lgs 81/2008** per la documentazione sulla sicurezza

### Elementi di Prova

Ogni firma digitale registra:

| Elemento | Descrizione |
|----------|-------------|
| Identità | ID dipendente autenticato |
| Timestamp | Data e ora esatta (UTC) |
| IP Address | Indirizzo IP del dispositivo |
| User Agent | Browser/dispositivo utilizzato |
| Hash | Impronta digitale del documento |

## FAQ

??? question "Posso firmare da smartphone?"
    Sì, puoi accedere al sistema HR da qualsiasi dispositivo.

??? question "Ho firmato per errore, posso annullare?"
    No, le firme non sono annullabili. Contatta HR per segnalare problemi.

??? question "Non ho il PIN FEA, come lo ottengo?"
    Il PIN viene generato al primo utilizzo. Contatta HR se hai problemi.

??? question "Il documento che ho firmato è stato modificato?"
    Usa la funzione "Verifica" per controllare l'integrità del documento.

---

!!! info "Conservazione"
    I documenti firmati sono conservati per 10 anni come richiesto dalla normativa sulla sicurezza sul lavoro.
