# Amministrazione

L'area amministrativa gestisce tutti gli aspetti economici e finanziari dello studio, garantendo una corretta gestione dei flussi di cassa e della documentazione fiscale.

## Attività Principali

| Attività | Frequenza | Responsabile |
|----------|-----------|--------------|
| Emissione preventivi | Continua | Segreteria/Amministrazione |
| Fatturazione | Continua | Amministrazione |
| Incassi | Continua | Segreteria |
| Registrazione prima nota | Giornaliera | Amministrazione |
| Riconciliazione bancaria | Settimanale | Amministrazione |
| Recupero crediti | Settimanale | Amministrazione |

## Documenti della Sezione

| Documento | Descrizione |
|-----------|-------------|
| [Preventivi](preventivi.md) | Creazione e gestione preventivi |
| [Fatturazione](fatturazione.md) | Emissione fatture e documenti fiscali |
| [Incassi](incassi.md) | Gestione pagamenti e metodi di incasso |
| [Recupero Crediti](recupero-crediti.md) | Gestione insoluti |
| [Prima Nota](prima-nota.md) | Registrazione movimenti |

## Flusso Economico del Paziente

```
PRIMA VISITA
     │
     ▼
PIANO DI TRATTAMENTO
     │
     ▼
PREVENTIVO
     │
     ▼
ACCETTAZIONE
     │
     ▼
TRATTAMENTO ◄────► INCASSO
     │                (parziale/totale)
     ▼
COMPLETAMENTO
     │
     ▼
SALDO FINALE
     │
     ▼
FATTURA
```

## Riferimenti Fiscali

### Dati Studio

| Campo | Valore |
|-------|--------|
| Ragione Sociale | {{ clinic.legal_name }} |
| P.IVA | [Inserire] |
| Codice Fiscale | [Inserire] |
| Indirizzo | {{ clinic.full_address }} |

### Sistema Tessera Sanitaria

Per le prestazioni sanitarie detraibili:

- Invio telematico obbligatorio
- Scadenza: entro fine mese successivo
- Tracciabilità pagamenti

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Segreteria | Preventivi, incassi, prima interazione |
| Amministrazione | Fatturazione, contabilità, recupero crediti |
| Direzione | Supervisione, policy prezzi, decisioni strategiche |
| Commercialista | Consulenza fiscale, dichiarazioni |
