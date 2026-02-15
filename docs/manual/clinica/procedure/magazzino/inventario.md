# Inventario

## Obiettivo
Conoscere in ogni momento la consistenza delle scorte per una gestione ottimale del magazzino.

## Tipi di Inventario

| Tipo | Frequenza | Scopo |
|------|-----------|-------|
| Continuo | Quotidiano | Monitoraggio real-time |
| Parziale | Settimanale | Controllo prodotti critici |
| Completo | Mensile/Trimestrale | Verifica totale |
| Annuale | Annuale | Chiusura contabile |

## Inventario Continuo

### Gestione a Sistema

Nel gestionale:

1. Carico merce alla ricezione
2. Scarico automatico all'utilizzo
3. Alert automatici sotto soglia
4. Report in tempo reale

### Aggiornamento Manuale

Se non automatizzato:

- Annotare ogni prelievo
- Aggiornare schede prodotto
- Segnalare discrepanze

## Inventario Parziale (Settimanale)

### Prodotti da Controllare

**Priorità alta (controllo settimanale):**

- Anestetici
- Guanti (tutte le misure)
- Mascherine
- Materiali da impronta
- Compositi più usati
- Aghi e siringhe

### Procedura

1. Lista prodotti critici
2. Conteggio fisico
3. Confronto con sistema
4. Correzione eventuali discrepanze
5. Verifica scorte minime
6. Generazione ordini se necessario

### Scheda Controllo Settimanale

```
CONTROLLO SCORTE - Settimana: __________

| Prodotto | Sistema | Fisico | Diff | Sotto soglia |
|----------|---------|--------|------|--------------|
| Guanti S | ___ | ___ | ___ | ○ Sì ○ No |
| Guanti M | ___ | ___ | ___ | ○ Sì ○ No |
| Guanti L | ___ | ___ | ___ | ○ Sì ○ No |
| Mascherine | ___ | ___ | ___ | ○ Sì ○ No |
| Anestetico | ___ | ___ | ___ | ○ Sì ○ No |
| ... | ... | ... | ... | ... |

Firma: ___________ Data: ___________
```

## Inventario Completo

### Frequenza

- **Minimo:** Trimestrale
- **Consigliato:** Mensile
- **Obbligatorio:** Annuale (chiusura bilancio)

### Preparazione

1. Scegliere data/orario (fuori orario clinico)
2. Preparare schede inventario
3. Organizzare il personale
4. Sistemare il magazzino

### Procedura

**Fase 1: Conteggio**

1. Suddividere le aree
2. Assegnare responsabili
3. Contare ogni prodotto
4. Annotare su scheda cartacea
5. Verificare scadenze

**Fase 2: Registrazione**

1. Inserire dati nel sistema
2. Confrontare con giacenze precedenti
3. Evidenziare discrepanze

**Fase 3: Analisi**

1. Analizzare differenze inventariali
2. Identificare cause (errori, sprechi, furti?)
3. Azioni correttive

### Scheda Inventario Completo

```
INVENTARIO COMPLETO - Data: __/__/____

SEZIONE: ______________
Responsabile: ______________

| Cod. | Prodotto | Unità | Q.tà Sistema | Q.tà Fisica | Scadenza | Note |
|------|----------|-------|--------------|-------------|----------|------|
| | | | | | | |
| | | | | | | |
| | | | | | | |

Firma rilevatore: _______________
Firma supervisore: _______________
```

## Gestione Discrepanze

### Tipologie

| Tipo | Possibili Cause |
|------|-----------------|
| Ammanco | Errore carico/scarico, furto, rotture non registrate |
| Eccedenza | Errore carico, reso non registrato |
| Scaduti | Mancato controllo, sovrastoccaggio |

### Procedura

1. **Verificare** il conteggio
2. **Ricercare** la causa
3. **Documentare** la discrepanza
4. **Correggere** il sistema
5. **Implementare** azioni preventive

### Soglie di Attenzione

| Discrepanza | Azione |
|-------------|--------|
| < 2% del valore | Correzione standard |
| 2-5% del valore | Analisi approfondita |
| > 5% del valore | Segnalazione direzione |

## Valorizzazione Magazzino

### Metodo di Valutazione

Scegliere uno dei metodi:

- **FIFO** (First In First Out) - Consigliato
- **Costo medio ponderato**
- **Ultimo costo**

### Calcolo Valore

```
Valore Magazzino = Σ (Quantità × Prezzo unitario)

Per prodotto:
Valore = Q.tà in stock × Costo d'acquisto
```

### Report Valore

```
VALORIZZAZIONE MAGAZZINO - Data: __/__/____

| Categoria | Valore |
|-----------|--------|
| Monouso | € _____ |
| Materiali clinici | € _____ |
| Strumentario | € _____ |
| Farmaci | € _____ |
| TOTALE | € _____ |

Variazione vs mese precedente: ____%
```

## KPI Magazzino

| Indicatore | Formula | Obiettivo |
|------------|---------|-----------|
| Rotazione | Consumo annuo / Stock medio | > 6 |
| Giorni copertura | Stock / Consumo giornaliero | 15-30 gg |
| Accuratezza | Corrispondenza sistema/fisico | > 98% |
| Scaduti | Valore scaduti / Valore totale | < 1% |

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Assistenti | Conteggio, segnalazioni |
| Coordinatore | Supervisione, analisi, azioni correttive |
| Direzione | Valorizzazione, budget |
