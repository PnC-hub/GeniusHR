# Tracciabilità della Sterilizzazione

## Obiettivo
Garantire la completa tracciabilità di ogni strumento sterilizzato, dal ciclo di sterilizzazione al paziente su cui viene utilizzato.

## Sistema di Tracciabilità

### Identificazione del Lotto

Ogni ciclo di sterilizzazione è identificato da un **codice lotto** univoco:

```
FORMATO: AAAA-MM-GG-XX

Esempio: 2026-01-24-03

Dove:
- AAAA = Anno
- MM = Mese
- GG = Giorno
- XX = Numero progressivo ciclo del giorno
```

### Etichettatura

Ogni busta deve riportare:

| Informazione | Obbligatorio |
|--------------|--------------|
| Codice lotto | ✓ |
| Data sterilizzazione | ✓ |
| Data scadenza | ✓ |
| Operatore | ✓ |
| Contenuto | ✓ |
| Indicatore chimico | ✓ |

### Registro di Sterilizzazione

Il registro può essere:

- **Cartaceo**: Registro vidimato con pagine numerate
- **Digitale**: Software gestionale con backup

**Dati da registrare per ogni ciclo:**

1. Data e ora inizio/fine ciclo
2. Numero ciclo progressivo
3. Tipo di ciclo (B, S, N)
4. Parametri raggiunti (T°, pressione, tempo)
5. Esito test Bowie-Dick (se applicabile)
6. Contenuto del carico
7. Esito controllo visivo buste
8. Firma operatore

## Collegamento Paziente-Lotto

### Registrazione in Cartella Clinica

Per ogni prestazione che prevede l'uso di strumenti sterili:

```
ESEMPIO REGISTRAZIONE:

Data: 24/01/2026
Paziente: Mario Rossi
Prestazione: Estrazione 4.8
Lotto strumentario: 2026-01-24-01
Operatore: Dr. Bianchi
Assistente: Sig.ra Verdi
```

### Procedura di Registrazione

1. Prima della prestazione, verificare integrità busta
2. Annotare codice lotto nella cartella clinica
3. A fine prestazione, confermare utilizzo
4. Conservare etichetta lotto (opzionale)

## Conservazione Documentazione

| Documento | Tempo Conservazione |
|-----------|---------------------|
| Registro sterilizzazione | 10 anni |
| Esiti test biologici | 10 anni |
| Cartelle cliniche | Illimitato |
| Certificati manutenzione | 10 anni |

## Richiamo Prodotti (Recall)

In caso di non conformità rilevata post-utilizzo:

### Procedura di Recall

1. **Identificare** tutti i pazienti trattati con il lotto in questione
2. **Valutare** il rischio con la Direzione Sanitaria
3. **Contattare** i pazienti se necessario
4. **Documentare** tutte le azioni intraprese
5. **Analizzare** le cause della non conformità

### Registro Non Conformità

| Campo | Descrizione |
|-------|-------------|
| Data rilevazione | Quando è stata scoperta |
| Lotto coinvolto | Codice/i lotto interessati |
| Tipo di NC | Descrizione del problema |
| Pazienti coinvolti | Numero e identificativi |
| Azioni intraprese | Cosa è stato fatto |
| Esito | Risoluzione |

## Audit della Tracciabilità

### Verifica Mensile

- [ ] Completezza registri
- [ ] Corrispondenza lotti-cartelle
- [ ] Integrità archivio
- [ ] Funzionamento sistema

### Verifica Annuale

- [ ] Audit completo del sistema
- [ ] Revisione procedure
- [ ] Formazione personale
- [ ] Aggiornamento documentazione

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Assistente | Registrazione cicli, etichettatura |
| Operatore clinico | Annotazione lotto in cartella |
| Coordinatore | Supervisione, audit mensili |
| Direzione Sanitaria | Gestione recall, audit annuali |
