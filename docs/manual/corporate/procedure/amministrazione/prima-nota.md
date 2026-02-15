# Prima Nota

## Obiettivo
Registrare quotidianamente tutti i movimenti finanziari dello studio per garantire una corretta contabilità e tracciabilità.

## Cos'è la Prima Nota

La prima nota è il registro cronologico di tutti i movimenti di denaro:

- Entrate (incassi)
- Uscite (pagamenti)
- Movimenti di cassa
- Movimenti bancari

## Struttura della Prima Nota

### Campi Essenziali

| Campo | Descrizione |
|-------|-------------|
| Data | Del movimento |
| Descrizione | Causale del movimento |
| Dare | Importo in entrata |
| Avere | Importo in uscita |
| Conto | Di riferimento (cassa/banca) |
| Categoria | Tipo di movimento |
| Documento | Riferimento (fattura, ricevuta) |

### Categorie di Movimento

**Entrate:**

| Categoria | Esempi |
|-----------|--------|
| Incassi prestazioni | Pagamenti pazienti |
| Incassi POS | Carte credito/debito |
| Bonifici in entrata | Pagamenti differiti |
| Rimborsi | Da fondi/assicurazioni |
| Altri proventi | Vendite varie |

**Uscite:**

| Categoria | Esempi |
|-----------|--------|
| Acquisto materiali | Consumabili, materiale |
| Laboratorio | Fatture laboratorio |
| Utenze | Luce, gas, telefono |
| Affitto | Canone locazione |
| Stipendi | Retribuzioni |
| Consulenze | Commercialista, legale |
| Manutenzioni | Riparazioni |
| Imposte e tasse | F24, bolli |

## Registrazione Giornaliera

### Procedura

1. **Raccogliere** tutti i documenti del giorno
2. **Verificare** corrispondenza incassi/documenti
3. **Registrare** ogni movimento
4. **Quadrare** la cassa
5. **Verificare** movimenti bancari (periodicamente)
6. **Archiviare** documenti

### Esempio Registrazione

```
DATA: 24/01/2026

| Data | Descrizione | Dare | Avere | Conto | Cat. |
|------|-------------|------|-------|-------|------|
| 24/01| Incasso Rossi - Fatt. 125 | 150,00 | | Cassa | Incassi |
| 24/01| Incasso Bianchi POS | 280,00 | | Banca | Incassi |
| 24/01| Acquisto materiale | | 85,00 | Cassa | Materiali |
| 24/01| Fattura laboratorio | | 320,00 | Banca | Laboratorio |

TOTALE GIORNO: Dare 430,00 - Avere 405,00 = +25,00
```

## Cassa Contanti

### Gestione

| Operazione | Frequenza |
|------------|-----------|
| Conta cassa | Giornaliera |
| Quadratura | Giornaliera |
| Versamento banca | Quando > € [limite] |
| Prelievo per piccole spese | Al bisogno |

### Quadratura

```
QUADRATURA CASSA - Data: __/__/____

Saldo iniziale:        € _______
+ Incassi contanti:    € _______
- Uscite contanti:     € _______
= Saldo teorico:       € _______

Saldo effettivo:       € _______
Differenza:            € _______

Firma operatore: _____________
```

### Piccola Cassa (Petty Cash)

Per spese minute:

- Fondo: € [importo] (es. 200€)
- Spese ammesse: < € 50
- Documentare ogni uscita
- Reintegro quando scende sotto € [limite]

## Movimenti Bancari

### Verifica Estratto Conto

Frequenza: settimanale

1. Accedere a home banking
2. Scaricare movimenti
3. Riconciliare con prima nota
4. Segnalare anomalie
5. Archiviare estratti

### Riconciliazione

```
RICONCILIAZIONE BANCARIA - Periodo: __/__/____ - __/__/____

Saldo banca (estratto conto):    € _______
Saldo prima nota (banca):        € _______
Differenza:                      € _______

Movimenti non ancora registrati:
- ________________________________
- ________________________________

Saldo riconciliato:              € _______
```

## Gestione Documenti

### Documenti da Conservare

| Documento | Conservazione |
|-----------|---------------|
| Fatture emesse | 10 anni |
| Fatture ricevute | 10 anni |
| Scontrini/ricevute | 10 anni |
| Estratti conto | 10 anni |
| Prima nota | 10 anni |

### Archiviazione

- Ordine cronologico
- Divisi per tipo (entrate/uscite)
- Numerazione progressiva
- Backup digitale

## Controlli Periodici

### Giornaliero

- [x] Registrazione movimenti
- [x] Quadratura cassa
- [x] Verifica incassi vs fatture

### Settimanale

- [x] Riconciliazione bancaria
- [x] Verifica scadenze fornitori
- [x] Controllo crediti pazienti

### Mensile

- [x] Chiusura prima nota mensile
- [x] Report per commercialista
- [x] Analisi costi/ricavi
- [x] Verifica budget

## Report

### Report Mensile

```
PRIMA NOTA - RIEPILOGO MESE [MESE/ANNO]

ENTRATE
├── Incassi pazienti:      € _______
├── Incassi POS:           € _______
├── Bonifici:              € _______
├── Rimborsi fondi:        € _______
└── TOTALE ENTRATE:        € _______

USCITE
├── Materiali:             € _______
├── Laboratorio:           € _______
├── Utenze:                € _______
├── Personale:             € _______
├── Consulenze:            € _______
├── Altro:                 € _______
└── TOTALE USCITE:         € _______

RISULTATO MESE:            € _______

SITUAZIONE LIQUIDITÀ
├── Cassa:                 € _______
└── Banca:                 € _______
    TOTALE:                € _______
```

## Integrazione con Gestionale

### Funzionalità

- Registrazione automatica incassi
- Import movimenti bancari
- Generazione report
- Export per commercialista

### Flusso Dati

```
INCASSO
   │
   ▼
Registrazione nel gestionale
   │
   ▼
Prima nota automatica
   │
   ▼
Report e export
```

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Segreteria | Registrazione incassi, quadratura cassa |
| Amministrazione | Prima nota, riconciliazioni, report |
| Commercialista | Supervisione, dichiarazioni fiscali |
| Direzione | Controllo, decisioni finanziarie |
