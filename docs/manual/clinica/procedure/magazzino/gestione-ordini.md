# Gestione Ordini

## Obiettivo
Garantire un processo di approvvigionamento efficiente, tempestivo ed economicamente vantaggioso.

## Quando Ordinare

### Sistema a Scorta Minima

Per ogni prodotto definire:

| Parametro | Descrizione |
|-----------|-------------|
| Scorta minima | Quantità sotto cui ordinare |
| Scorta di sicurezza | Buffer per imprevisti |
| Quantità ordine | Quanto ordinare ogni volta |
| Lead time | Tempo di consegna previsto |

### Calcolo Scorta Minima

```
Scorta Minima = Consumo giornaliero × Lead time (giorni) + Scorta sicurezza

Esempio:
- Guanti: 1 box/giorno × 3 giorni consegna + 2 box sicurezza = 5 box
- Quando scorta < 5 box → Ordinare
```

## Procedura di Ordine

### Fase 1: Identificazione Necessità

**Metodi:**

1. Controllo visivo durante utilizzo
2. Report gestionale scorte
3. Inventario periodico
4. Segnalazione del personale

**Scheda segnalazione:**

| Prodotto | Quantità Attuale | Scorta Min | Da Ordinare |
|----------|------------------|------------|-------------|
| [Nome] | [N] | [N] | ✓/✗ |

### Fase 2: Preparazione Ordine

1. Verificare il fornitore abituale
2. Controllare prezzi e condizioni
3. Valutare alternative se conveniente
4. Preparare lista ordine
5. Verificare budget disponibile

### Fase 3: Invio Ordine

**Modalità:**

| Canale | Quando Utilizzare |
|--------|-------------------|
| Portale online | Ordini standard |
| Email | Ordini documentati |
| Telefono | Urgenze |
| Agente | Ordini complessi |

**Dati ordine:**

- Data ordine
- Numero ordine (progressivo interno)
- Prodotti e quantità
- Prezzo concordato
- Indirizzo consegna
- Richiesta DDT/fattura

### Fase 4: Conferma

1. Richiedere sempre conferma scritta
2. Verificare corrispondenza con ordine
3. Annotare data consegna prevista
4. Archiviare conferma

## Ricezione Merce

### Controllo al Ricevimento

!!! warning "Importante"
    Controllare SEMPRE la merce prima di firmare il documento di trasporto.

**Checklist:**

- [ ] Colli integri (no danni evidenti)
- [ ] Quantità corretta
- [ ] Prodotti corrispondenti all'ordine
- [ ] Scadenze accettabili
- [ ] DDT presente e corretto

### Gestione Anomalie

| Anomalia | Azione |
|----------|--------|
| Collo danneggiato | Rifiutare o accettare con riserva |
| Quantità errata | Segnalare su DDT, contattare fornitore |
| Prodotto errato | Segnalare, richiedere sostituzione |
| Scadenza breve | Valutare se accettabile, segnalare |
| DDT mancante | Non accettare senza documento |

### Firma DDT

Firmare indicando:

- Data e ora ricezione
- Nome di chi riceve
- Eventuali riserve

## Stoccaggio

### Regole Generali

1. **FIFO** - First In First Out
2. Prodotti più vecchi davanti
3. Nuovi arrivi dietro
4. Separare per categoria
5. Rispettare condizioni di conservazione

### Condizioni di Conservazione

| Prodotto | Condizioni |
|----------|------------|
| Compositi | Temperatura ambiente, al riparo dalla luce |
| Adesivi | Refrigerato se indicato |
| Anestetici | Temperatura ambiente |
| Farmaci emergenza | Secondo indicazioni |
| Materiali sterili | Ambiente asciutto, pulito |

### Organizzazione Magazzino

```
SCHEMA MAGAZZINO

SCAFFALE 1 - Monouso
├── Guanti
├── Mascherine
├── Bicchieri
└── Tovaglioli

SCAFFALE 2 - Materiali clinici
├── Conservativa
├── Endodonzia
└── Protesi

ARMADIO FARMACI
├── Anestetici
└── Medicinali

FRIGORIFERO (se necessario)
└── Prodotti termosensibili
```

## Documentazione

### Registro Ordini

| Campo | Dato |
|-------|------|
| N. Ordine | Progressivo |
| Data | Ordine |
| Fornitore | Nome |
| Prodotti | Lista |
| Importo | Totale |
| Stato | Ordinato/Consegnato/Fatturato |

### Archiviazione

| Documento | Conservazione |
|-----------|---------------|
| Ordini | 2 anni |
| DDT | 10 anni |
| Fatture | 10 anni |
| Certificati prodotti | Durata validità |

## Ordini Urgenti

### Quando

- Esaurimento imprevisto
- Rottura strumentario
- Necessità clinica immediata

### Procedura

1. Verificare disponibilità presso altri fornitori
2. Richiedere consegna urgente (costo extra?)
3. Autorizzazione coordinatore/direzione
4. Documentare la motivazione

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Assistenti | Segnalazione, stoccaggio, verifica |
| Coordinatore | Ordini, rapporti fornitori |
| Direzione | Budget, approvazioni straordinarie |
