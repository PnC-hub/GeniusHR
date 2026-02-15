# Campagne SMS

## Obiettivo
Utilizzare gli SMS come strumento di comunicazione efficace per mantenere il contatto con i pazienti e promuovere i servizi dello studio.

## Tipologie di Campagne

### Campagne Operative

| Tipo | Scopo | Consenso |
|------|-------|----------|
| Promemoria appuntamento | Ridurre no-show | Base |
| Conferma appuntamento | Conferma 24h | Base |
| Recall | Richiamo periodico | Base |
| Comunicazioni di servizio | Orari, chiusure | Base |

### Campagne Marketing

| Tipo | Scopo | Consenso |
|------|-------|----------|
| Promozioni | Offerte speciali | Marketing |
| Nuovi servizi | Lancio novità | Marketing |
| Eventi | Open day, incontri | Marketing |
| Auguri | Fidelizzazione | Marketing |

!!! warning "Consenso Obbligatorio"
    Per le campagne marketing è necessario il consenso esplicito del paziente.

## Pianificazione Campagne

### Template Campagna

| Campo | Contenuto |
|-------|-----------|
| Nome campagna | Identificativo |
| Obiettivo | Cosa vogliamo ottenere |
| Target | A chi inviare |
| Messaggio | Testo SMS |
| Data invio | Quando |
| Budget | Costo previsto |
| KPI attesi | Risultati target |

### Calendario Suggerito

| Periodo | Campagna Suggerita |
|---------|-------------------|
| Gennaio | Buoni propositi (prevenzione) |
| Marzo | Primavera (sbiancamento) |
| Maggio | Pre-estate (estetica) |
| Settembre | Back to school (bambini) |
| Ottobre | Mese prevenzione |
| Dicembre | Auguri + gift card |

## Creazione del Messaggio

### Regole di Base

- **Lunghezza:** Max 160 caratteri (1 SMS)
- **Mittente:** "{{ clinic.name }}" (riconoscibile)
- **Call to action:** Chiara e unica
- **Contatto:** Sempre presente
- **Tono:** Professionale ma cordiale

### Struttura Efficace

```
[Mittente]: [Saluto/Hook]
[Messaggio principale]
[Call to action]
[Contatto]
```

### Esempi

**Promozione:**
```
{{ clinic.name }}: Sorriso splendente per l'estate!
Sbiancamento professionale a € 199 (invece di € 299).
Prenota entro il 30/6: {{ clinic.phone }}
```

**Nuovo servizio:**
```
{{ clinic.name }}: Novità! Ora offriamo ortodonzia invisibile
con Invisalign. Prima consulenza gratuita.
Info: {{ clinic.phone }}
```

**Auguri:**
```
{{ clinic.name }}: Buon Natale! Ti auguriamo feste serene
e un 2026 pieno di sorrisi.
Il tuo {{ clinic.full_name }}
```

## Segmentazione Target

### Criteri di Segmentazione

| Criterio | Esempi |
|----------|--------|
| Demografico | Età, genere |
| Geografico | CAP, distanza |
| Comportamentale | Ultimo trattamento, frequenza |
| Clinico | Tipo di cure effettuate |
| Economico | Fascia spesa |

### Segmenti Utili

| Segmento | Definizione | Campagne Adatte |
|----------|-------------|-----------------|
| Igiene regolari | Igiene ogni 6 mesi | Cross-sell altri servizi |
| Inattivi | No visite >12 mesi | Recupero |
| Famiglie | Genitori con figli | Promozioni famiglia |
| Over 60 | Età >60 | Protesi, impianti |
| Giovani adulti | 25-35 anni | Estetica, ortodonzia |

## Invio Campagna

### Checklist Pre-Invio

- [ ] Messaggio approvato
- [ ] Target definito e verificato
- [ ] Consensi verificati (per marketing)
- [ ] Test invio effettuato
- [ ] Orario appropriato
- [ ] Budget confermato

### Orari Consigliati

| Giorno | Orario Ottimale |
|--------|-----------------|
| Lun-Ven | 10:00-12:00 / 15:00-17:00 |
| Sabato | 10:00-12:00 |
| Domenica | Evitare |

### Frequenza

- Max 1-2 SMS marketing al mese
- Evitare accumulo di messaggi
- Rispettare stagionalità

## Gestione Risposte

### Risposte Positive

> "Sì, vorrei prenotare"

→ Chiamare tempestivamente per fissare

### Risposte Negative

> "Non sono interessato"

→ Ringraziare, annotare preferenza

### Richieste di Cancellazione

> "STOP" / "Non voglio più ricevere SMS"

→ Rimuovere IMMEDIATAMENTE dal marketing
→ Mantenere solo comunicazioni di servizio

## Monitoraggio e Analisi

### KPI da Tracciare

| KPI | Formula | Benchmark |
|-----|---------|-----------|
| Tasso consegna | Consegnati / Inviati | > 95% |
| Tasso risposta | Risposte / Consegnati | 5-15% |
| Tasso conversione | Prenotazioni / Inviati | 2-5% |
| ROI | (Ricavi - Costi) / Costi | > 3x |

### Report Campagna

```
REPORT CAMPAGNA SMS

Nome: _______________________
Data invio: __/__/____

INVIO
- SMS inviati: ____
- Consegnati: ____ (___%)
- Non consegnati: ____ (___%)

RISPOSTE
- Risposte totali: ____
- Positive: ____
- Negative: ____
- Opt-out: ____

CONVERSIONI
- Prenotazioni: ____
- Valore stimato: € ____

COSTI
- Costo SMS: € ____
- Costo per conversione: € ____

ROI: ___x

Note: ________________________
```

## Compliance e Privacy

### Requisiti GDPR

- Consenso esplicito per marketing
- Possibilità di opt-out sempre presente
- Registro dei consensi aggiornato
- Tempi di risposta alle richieste

### Gestione Opt-out

1. Registrare la richiesta
2. Rimuovere dal marketing entro 48h
3. Confermare la cancellazione
4. Non ricontattare per marketing

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Segreteria | Gestione risposte, prenotazioni |
| Coordinatore | Pianificazione, invio, analisi |
| Direzione | Approvazione contenuti, budget |
