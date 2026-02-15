# Gestione Incassi

## Obiettivo
Garantire una gestione efficiente e trasparente dei pagamenti, offrendo al paziente diverse modalità e agevolazioni.

## Metodi di Pagamento Accettati

| Metodo | Accettato | Tracciabile | Note |
|--------|-----------|-------------|------|
| Contanti | Sì | No | Limiti di legge |
| Bancomat/POS | Sì | Sì | Preferito |
| Carta di credito | Sì | Sì | Commissioni |
| Bonifico bancario | Sì | Sì | Anticipato |
| Assegno | Su accordo | Sì | Verificare copertura |
| Finanziamento | Sì | Sì | Tramite convenzionati |

## Tempistiche di Pagamento

### Policy Standard

| Importo | Modalità |
|---------|----------|
| < 200€ | Saldo a fine seduta |
| 200€ - 1.000€ | Acconto 30% + saldo a fine trattamento |
| 1.000€ - 3.000€ | 3 rate o finanziamento |
| > 3.000€ | Piano personalizzato o finanziamento |

### Piani di Pagamento

**Rateizzazione interna:**

- Massimo 6 rate
- Senza interessi
- Accordo scritto
- Ultima rata prima della fine del trattamento

**Finanziamento:**

- Tramite società convenzionate
- Tassi agevolati
- Importo minimo [specificare]
- Durata fino a 24-36 mesi

## Procedura di Incasso

### A Fine Seduta

1. **Verificare** importo dovuto per la seduta
2. **Comunicare** l'importo al paziente
3. **Proporre** i metodi di pagamento
4. **Incassare** con metodo scelto
5. **Emettere** documento fiscale
6. **Registrare** nel gestionale

### Script

> "Per la seduta di oggi l'importo è di [importo]. Come preferisce pagare? Accettiamo contanti, bancomat e carte."

## Gestione Contanti

### Limiti

!!! warning "Limite Contanti"
    Il limite per i pagamenti in contanti è stabilito dalla normativa vigente. Verificare sempre l'importo massimo consentito.

### Procedura

1. Contare il denaro davanti al paziente
2. Verificare l'autenticità delle banconote
3. Dare eventuale resto
4. Emettere fattura
5. Registrare l'incasso

### Gestione Cassa

- Fondo cassa iniziale: € [specificare]
- Chiusura cassa giornaliera obbligatoria
- Versamento in banca: quando cassa > € [specificare]

## Gestione POS

### Procedura

1. Inserire importo nel POS
2. Far inserire/avvicinare la carta al paziente
3. Attendere autorizzazione
4. Consegnare copia ricevuta
5. Emettere fattura
6. Registrare incasso

### Problemi Comuni

| Problema | Soluzione |
|----------|-----------|
| Transazione rifiutata | Chiedere altra carta o altro metodo |
| POS non funzionante | Utilizzare backup o altri metodi |
| Contestazione | Conservare ricevuta, verificare |

## Piani di Pagamento Personalizzati

### Creazione

1. Valutare situazione del paziente
2. Proporre piano sostenibile
3. Documentare per iscritto
4. Far firmare accordo
5. Impostare scadenze nel gestionale

### Accordo Scritto

Deve contenere:

- Importo totale
- Numero rate
- Importo rate
- Scadenze
- Conseguenze mancato pagamento
- Firme

### Monitoraggio

- Alert automatici per scadenze
- Sollecito pre-scadenza (3 giorni prima)
- Gestione ritardi (vedi Recupero Crediti)

## Finanziamenti

### Società Convenzionate

| Società | Contatto | Condizioni |
|---------|----------|------------|
| [Società 1] | [Contatto] | [Condizioni] |
| [Società 2] | [Contatto] | [Condizioni] |

### Procedura

1. Proporre il finanziamento al paziente
2. Verificare requisiti (documenti, reddito)
3. Compilare domanda
4. Attendere esito
5. Se approvato, iniziare trattamento
6. Lo studio riceve il pagamento dalla finanziaria

### Documenti Necessari

- Documento d'identità
- Codice fiscale
- Ultima busta paga / dichiarazione redditi
- Coordinate bancarie

## Convenzioni e Terze Parti

### Fondi Sanitari / Assicurazioni

1. Verificare copertura del paziente
2. Richiedere autorizzazione preventiva se necessaria
3. Emettere fattura secondo indicazioni
4. Inviare documentazione al fondo
5. Attendere rimborso

### Procedure Specifiche

Ogni fondo/assicurazione può avere procedure diverse:

- Verificare sempre i requisiti
- Conservare la documentazione
- Monitorare i rimborsi

## Chiusura Giornaliera

### Procedura

1. Stampare report incassi del giorno
2. Contare cassa contanti
3. Verificare corrispondenza
4. Registrare totali POS
5. Quadrare il totale
6. Documentare eventuali differenze

### Quadratura

| Voce | Importo |
|------|---------|
| Incassi contanti | € ___ |
| Incassi POS | € ___ |
| Incassi bonifici | € ___ |
| **Totale** | € ___ |
| vs Atteso | € ___ |
| **Differenza** | € ___ |

### Differenze di Cassa

Se si rilevano differenze:

1. Ricontrollare
2. Verificare transazioni
3. Documentare la differenza
4. Segnalare al coordinatore
5. Indagare la causa

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Segreteria | Incassi, chiusura cassa |
| Amministrazione | Piani pagamento, finanziamenti, quadrature |
| Coordinatore | Supervisione, gestione anomalie |
| Direzione | Policy, autorizzazioni speciali |
