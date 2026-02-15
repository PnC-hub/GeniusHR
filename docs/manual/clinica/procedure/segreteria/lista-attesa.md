# Lista d'Attesa

## Obiettivo
Gestire efficacemente i pazienti in attesa di appuntamento per ottimizzare l'occupazione dell'agenda e ridurre i tempi di attesa.

## Quando Utilizzare la Lista d'Attesa

### Inserimento in Lista

- Paziente richiede appuntamento ma non ci sono disponibilità gradite
- Paziente preferisce essere chiamato in caso di disdette
- Paziente vuole anticipare un appuntamento già fissato
- Urgenze non immediate da inserire appena possibile

### Tipologie di Attesa

| Tipo | Descrizione | Priorità |
|------|-------------|----------|
| Urgenza differibile | Problema da risolvere presto | Alta |
| Anticipo | Ha già appuntamento, vuole prima | Media |
| Preferenza orario | Attende slot specifico | Bassa |
| Disponibilità generica | Qualsiasi slot va bene | Flessibile |

## Procedura di Inserimento

### Dati da Raccogliere

| Campo | Obbligatorio | Note |
|-------|--------------|------|
| Nome paziente | ✓ | Collegato ad anagrafica |
| Telefono | ✓ | Per contatto rapido |
| Tipo prestazione | ✓ | Per matching con slot |
| Durata necessaria | ✓ | Per matching con slot |
| Urgenza | ✓ | Alta/Media/Bassa |
| Preferenze orario | | Mattina/Pomeriggio/Specifico |
| Giorni preferiti | | Per facilitare contatto |
| Note | | Altre informazioni utili |
| Data inserimento | ✓ | Automatica |

### Script di Inserimento

> "Al momento non ho disponibilità per [giorno/orario richiesto]. La inserisco nella nostra lista d'attesa: in caso di disdette la contattiamo subito. Mi conferma che possiamo chiamarla a questo numero? Ha preferenze particolari di orario?"

## Gestione della Lista

### Controllo Quotidiano

1. Verificare nuovi slot disponibili
2. Confrontare con lista d'attesa
3. Contattare pazienti compatibili
4. Aggiornare lo stato

### Matching Slot-Paziente

```
SLOT DISPONIBILE
       │
       ▼
Durata sufficiente?
       │
      SÌ
       │
       ▼
Prestazione compatibile?
       │
      SÌ
       │
       ▼
Orario nelle preferenze?
       │
    SÌ / Flessibile
       │
       ▼
CONTATTARE IL PAZIENTE
```

### Priorità di Contatto

1. **Urgenza alta** - Contattare sempre per primi
2. **Data inserimento** - A parità di urgenza, chi aspetta da più tempo
3. **Flessibilità** - Chi accetta qualsiasi orario
4. **Match perfetto** - Orario/giorno preferito disponibile

## Contatto del Paziente

### Chiamata Telefonica

> "Buongiorno Sig./Sig.ra [Nome], sono [Nome] dello {{ clinic.full_name }}. Si è liberato un appuntamento per [GIORNO] alle ore [ORA]. Le andrebbe bene?"

### Possibili Risposte

| Risposta | Azione |
|----------|--------|
| "Sì, perfetto!" | Prenotare, rimuovere da lista |
| "No, quell'orario no" | Lasciare in lista, annotare |
| "Non mi serve più" | Rimuovere da lista |
| "Ho già risolto altrove" | Rimuovere da lista |

### Se Non Risponde

1. Lasciare messaggio in segreteria
2. Inviare SMS: "{{ clinic.full_name }}: abbiamo disponibilità per [GIORNO] [ORA]. Interessato? Chiami {{ clinic.phone }}"
3. Annotare tentativo
4. Passare al paziente successivo
5. Riprovare dopo se slot ancora libero

## Manutenzione della Lista

### Pulizia Periodica (Settimanale)

Verificare e rimuovere:

- Pazienti che hanno già ottenuto appuntamento
- Richieste obsolete (>30 giorni senza risposta)
- Pazienti non più interessati

### Verifica Mensile

- Contattare pazienti in lista da oltre 2 settimane
- Verificare se ancora interessati
- Aggiornare preferenze
- Rimuovere se non più necessario

## Integrazione con il Gestionale

### Funzionalità Necessarie

- [ ] Lista d'attesa dedicata
- [ ] Filtri per urgenza/prestazione/orario
- [ ] Alert per slot compatibili
- [ ] Storico contatti
- [ ] Report statistici

### Workflow Ideale

```
1. Slot si libera
       │
       ▼
2. Sistema notifica: "Pazienti compatibili in lista"
       │
       ▼
3. Operatore visualizza lista ordinata
       │
       ▼
4. Contatta il primo paziente
       │
       ▼
5. Registra esito
       │
    Accetta?
    │      │
   SÌ     NO
    │      │
    ▼      ▼
Prenota  Prossimo in lista
```

## Indicatori di Performance

| KPI | Obiettivo | Calcolo |
|-----|-----------|---------|
| Tempo medio in lista | < 7 giorni | Somma giorni attesa / N pazienti |
| Tasso conversione | > 70% | Prenotati / Contattati |
| Slot recuperati | > 80% | Slot assegnati da lista / Slot liberati |
| Pazienti in lista | < 20 | Conteggio attuale |

## Casi Particolari

### Urgenze

- Inserire con priorità ALTA
- Contattare proattivamente per ogni slot che si libera
- Valutare inserimento in buffer/emergenze anche se non perfetto

### Bambini

- Verificare orari compatibili con scuola
- Preferire primo pomeriggio
- Annotare età per durata appropriata

### Pazienti Difficili da Contattare

- Annotare orari migliori per chiamare
- Utilizzare SMS/WhatsApp se preferito
- Tentare più volte in fasce diverse

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Segretaria | Inserimento, contatti, aggiornamento |
| Coordinatore | Supervisione, pulizia periodica, KPI |
