# Gestione Scadenze

## Obiettivo
Garantire l'utilizzo di materiali sempre in validità, prevenendo sprechi e rischi per la sicurezza.

## Principio FIFO

!!! warning "Regola Fondamentale"
    **First In First Out**: utilizzare sempre prima i prodotti con scadenza più prossima.

### Applicazione

- Prodotti nuovi: posizionare dietro/sotto
- Prodotti esistenti: portare avanti/sopra
- Al prelievo: prendere da davanti/sopra
- Etichettare se necessario

## Controllo Scadenze

### Frequenza

| Controllo | Frequenza | Responsabile |
|-----------|-----------|--------------|
| Farmaci emergenza | Settimanale | Assistente |
| Anestetici | Settimanale | Assistente |
| Materiali critici | Mensile | Coordinatore |
| Inventario completo | Trimestrale | Coordinatore |

### Prodotti Critici

**Scadenza breve (controllo frequente):**

- Anestetici locali
- Farmaci kit emergenza
- Soluzioni disinfettanti
- Alcuni materiali da impronta

**Scadenza media:**

- Compositi
- Adesivi
- Cementi
- Materiali endodontici

**Scadenza lunga:**

- Strumentario sterile (confezionato)
- Materiali monouso
- Gessi

## Registrazione Scadenze

### Nel Gestionale

Per ogni prodotto registrare:

| Campo | Dato |
|-------|------|
| Lotto | Numero |
| Scadenza | Data |
| Quantità | Per lotto |
| Ubicazione | Dove è stoccato |

### Sistema Alert

Configurare avvisi automatici:

| Tempo alla Scadenza | Azione |
|--------------------|--------|
| 90 giorni | Alert giallo - Pianificare utilizzo |
| 30 giorni | Alert arancione - Priorità utilizzo |
| 15 giorni | Alert rosso - Utilizzo urgente o smaltimento |
| Scaduto | Blocco - Rimozione immediata |

## Prodotti in Scadenza

### Prioritizzazione Utilizzo

Quando un prodotto si avvicina alla scadenza:

1. **Verificare** la quantità residua
2. **Valutare** se utilizzabile prima della scadenza
3. **Comunicare** al team clinico
4. **Posizionare** in evidenza per utilizzo prioritario

### Possibili Azioni

| Situazione | Azione |
|------------|--------|
| Utilizzabile prima della scadenza | Prioritizzare l'uso |
| Quantità eccessiva | Contattare fornitore per reso/cambio |
| Non utilizzabile | Smaltire correttamente |
| Prodotto critico | Valutare donazione (se consentito) |

## Prodotti Scaduti

### Identificazione

- Controllo visivo data scadenza
- Alert dal sistema
- Durante inventario

### Gestione Immediata

!!! danger "Mai Utilizzare Prodotti Scaduti"
    I prodotti scaduti non devono MAI essere utilizzati sui pazienti.

**Procedura:**

1. **Rimuovere** immediatamente dal magazzino operativo
2. **Isolare** in area dedicata "Da smaltire"
3. **Registrare** nel sistema (scarico per scadenza)
4. **Smaltire** secondo normativa

### Smaltimento

| Tipo Prodotto | Smaltimento |
|---------------|-------------|
| Farmaci | Rifiuto speciale, farmacia |
| Materiali chimici | Secondo scheda sicurezza |
| Monouso sterile | Rifiuti ordinari (se non contaminato) |
| Dispositivi medici | Secondo indicazioni produttore |

### Documentazione

Registrare ogni prodotto scaduto:

| Campo | Dato |
|-------|------|
| Data rilevazione | Quando scoperto |
| Prodotto | Nome e descrizione |
| Lotto | Numero lotto |
| Quantità | Scaduta |
| Valore | Economico |
| Causa | Perché è scaduto |
| Azione | Cosa è stato fatto |

## Prevenzione Scadenze

### Buone Pratiche

| Pratica | Beneficio |
|---------|-----------|
| Ordini frequenti, piccole quantità | Minore rischio scadenza |
| Rotazione corretta (FIFO) | Utilizzo ordinato |
| Controlli regolari | Identificazione precoce |
| Negoziazione con fornitori | Possibilità di reso |

### Analisi Cause

Se i prodotti scadono frequentemente:

1. **Sovrastima** dei consumi → Ridurre ordini
2. **Mancata rotazione** → Migliorare FIFO
3. **Forniture con scadenza breve** → Verificare con fornitore
4. **Cambio protocolli** → Aggiornare liste ordine

## Report Scadenze

### Report Mensile

```
REPORT SCADENZE - Mese: __________

PRODOTTI IN SCADENZA (prossimi 90 giorni):
| Prodotto | Lotto | Scadenza | Q.tà | Valore | Azione |
|----------|-------|----------|------|--------|--------|
| | | | | | |

PRODOTTI SCADUTI NEL MESE:
| Prodotto | Lotto | Q.tà | Valore | Causa |
|----------|-------|------|--------|-------|
| | | | | |

TOTALE VALORE SCADUTI: € _______
% su valore magazzino: _____%

Azioni correttive proposte:
________________________________
```

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Assistenti | Controlli settimanali, segnalazioni |
| Coordinatore | Controlli mensili, gestione scaduti, report |
| Direzione | Analisi trend, decisioni su forniture |
