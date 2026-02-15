# Fatturazione

## Obiettivo
Emettere documentazione fiscale corretta e completa nel rispetto della normativa vigente.

## Tipologie di Documenti Fiscali

| Documento | Quando Utilizzare |
|-----------|-------------------|
| Fattura | Prestazioni sanitarie, sempre |
| Fattura elettronica | B2B obbligatoria, B2C su richiesta |
| Ricevuta fiscale | Non più utilizzata (abolita) |

## Fattura per Prestazioni Sanitarie

### Dati Obbligatori

| Campo | Contenuto |
|-------|-----------|
| Numero | Progressivo univoco |
| Data | Di emissione |
| Dati emittente | Ragione sociale, P.IVA, indirizzo |
| Dati paziente | Nome, cognome, CF, indirizzo |
| Descrizione | Prestazioni effettuate |
| Importi | Imponibile, IVA, totale |
| Modalità pagamento | Come è stato pagato |

### Regime IVA

Le prestazioni odontoiatriche sono:

- **Esenti IVA** (art. 10 DPR 633/72) per prestazioni sanitarie
- Soggette IVA per prestazioni estetiche non sanitarie (sbiancamento estetico, ecc.)

### Descrizione Prestazioni

!!! tip "Chiarezza"
    La descrizione deve essere comprensibile e dettagliata per consentire la detrazione fiscale.

**Esempi corretti:**

- "Visita odontoiatrica specialistica"
- "Igiene orale professionale"
- "Otturazione in composito elemento 3.6"
- "Trattamento endodontico elemento 4.5"

**Esempi da evitare:**

- "Prestazione professionale" (troppo generico)
- "Varie" (non dettagliato)

## Fatturazione Elettronica

### Quando è Obbligatoria

| Destinatario | Obbligatoria |
|--------------|--------------|
| Aziende (B2B) | Sì |
| Privati (B2C) | Solo su richiesta |
| Pubblica Amministrazione | Sì |

### Sistema di Interscambio (SDI)

Per fatture B2B:

1. Creare fattura nel gestionale
2. Generare XML
3. Inviare allo SDI
4. Attendere esito
5. Archiviare

### Codice Destinatario / PEC

Raccogliere dal cliente:

- Codice destinatario (7 caratteri) oppure
- PEC per ricezione fatture

## Emissione della Fattura

### Tempistiche

| Situazione | Termine Emissione |
|------------|-------------------|
| Pagamento contestuale | Al momento del pagamento |
| Pagamento differito | Entro 12 giorni dal pagamento |
| Fine trattamento | Al completamento |

### Procedura

1. Verificare dati anagrafici paziente
2. Verificare codice fiscale
3. Inserire prestazioni eseguite
4. Verificare importi e modalità pagamento
5. Emettere fattura
6. Consegnare/inviare al paziente
7. Registrare in contabilità

## Trasmissione al Sistema TS

### Obblighi

Le spese sanitarie devono essere trasmesse al Sistema Tessera Sanitaria per la dichiarazione dei redditi precompilata.

### Dati da Trasmettere

| Campo | Dato |
|-------|------|
| CF paziente | Codice fiscale |
| Data | Della prestazione |
| Tipo spesa | Sanitaria |
| Importo | Totale |
| Tipo pagamento | Tracciato/Non tracciato |

### Scadenze

- Invio: entro la fine del mese successivo a quello di emissione
- Opposizione paziente: possibile entro la scadenza

### Tracciabilità Pagamenti

!!! warning "Attenzione"
    Per la detraibilità fiscale, i pagamenti devono essere tracciabili (no contanti per importi > limiti di legge).

| Metodo | Tracciabile |
|--------|-------------|
| Bonifico | Sì |
| Carta credito/debito | Sì |
| Assegno | Sì |
| Contanti | No |

## Correzioni ed Errori

### Note di Credito

Quando emettere:

- Errore in fattura già emessa
- Reso/storno parziale
- Sconto successivo

Procedura:

1. Creare nota di credito
2. Riferimento a fattura originale
3. Motivazione
4. Emettere/inviare
5. Registrare

### Fattura Sostitutiva

Per errori formali su fattura elettronica:

1. Emettere nuova fattura
2. Indicare che sostituisce la precedente
3. Stornare la precedente

## Archiviazione

### Conservazione Digitale

| Documento | Durata | Modalità |
|-----------|--------|----------|
| Fatture emesse | 10 anni | Conservazione sostitutiva |
| Fatture PA | 10 anni | Conservazione sostitutiva |
| Registro IVA | 10 anni | Digitale + backup |

### Backup

- Backup giornaliero automatico
- Copia su cloud/NAS
- Verifica periodica integrità

## Reportistica

### Report Mensili

- Fatturato per operatore
- Fatturato per tipo prestazione
- Incassi vs fatturato
- Invii Sistema TS

### Controlli

- Verifica numerazione progressiva
- Corrispondenza incassi-fatture
- Esito invii SDI
- Esito invii Sistema TS

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Segreteria | Emissione fatture standard |
| Amministrazione | Fatture complesse, note credito, Sistema TS |
| Commercialista | Consulenza, dichiarazioni |
| Direzione | Policy, controllo |
