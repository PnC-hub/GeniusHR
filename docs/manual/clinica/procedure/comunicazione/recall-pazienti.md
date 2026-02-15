# Recall Pazienti

## Obiettivo

Garantire la continuità delle cure richiamando sistematicamente i pazienti per controlli periodici, igiene professionale e completamento dei piani di trattamento.

!!! info "Importanza del Recall"
    Il sistema di recall è fondamentale per:

    - **Salute del paziente:** prevenzione e diagnosi precoce
    - **Relazione:** mantenere il contatto con i pazienti
    - **Studio:** garantire flusso costante di appuntamenti

## Tipologie di Recall

### Recall Clinici

| Tipo | Frequenza Standard | Target | Priorità |
|------|-------------------|--------|----------|
| Igiene | 6 mesi | Tutti i pazienti | Alta |
| Controllo | 6-12 mesi | Tutti i pazienti | Alta |
| Parodontale | 3-4 mesi | Pazienti con parodontite | Molto Alta |
| Implantare | 6 mesi | Portatori di impianti | Molto Alta |
| Ortodontico | Secondo piano | Pazienti in trattamento | Media |
| Post-chirurgico | 7-14 giorni | Post interventi | Alta |

### Recall Commerciali

| Tipo | Quando | Target |
|------|--------|--------|
| Preventivo in sospeso | 30 giorni da prima visita | Pazienti con preventivo non accettato |
| Trattamento interrotto | 60 giorni | Pazienti che hanno sospeso le cure |
| Paziente perso | 18+ mesi | Pazienti senza appuntamenti recenti |

## Protocollo di Recall in 5 Step

### Step 1: Primo Contatto - SMS Automatico

**Quando:** Data recall raggiunta

**Messaggio tipo Igiene:**
```
{{ clinic.full_name }}: Gentile [Nome], sono passati 6 mesi
dalla sua ultima igiene professionale. La prevenzione
è importante! Prenoti al {{ clinic.phone }} o risponda OK
per essere richiamato.
```

**Messaggio tipo Controllo:**
```
{{ clinic.full_name }}: Gentile [Nome], è tempo del suo
controllo periodico. Prenoti al {{ clinic.phone }}.
La aspettiamo!
```

### Step 2: Secondo Contatto - SMS di Sollecito

**Quando:** 7 giorni dopo il primo SMS senza risposta

```
{{ clinic.full_name }}: Gentile [Nome], non abbiamo ancora
ricevuto sua risposta per l'appuntamento di controllo.
La richiamiamo nei prossimi giorni.
Per prenotare: {{ clinic.phone }}
```

### Step 3: Terzo Contatto - Telefonata

**Quando:** 7 giorni dopo il secondo SMS

**Script telefonico:**

> "Buongiorno Sig./Sig.ra [Cognome], sono [Nome] dello {{ clinic.full_name }}. La chiamo perché sono passati [X] mesi dalla sua ultima [igiene/visita] e volevamo invitarla per un controllo. La prevenzione è molto importante per mantenere la salute della bocca. Ha disponibilità nelle prossime settimane?"

**Se risponde:**
- Proporre 2-3 date/orari
- Fissare appuntamento
- Confermare via SMS

**Se non risponde:**
- Lasciare messaggio in segreteria
- Riprovare in orario diverso

### Step 4: Quarto Contatto - Ultima Telefonata

**Quando:** 7 giorni dopo la prima telefonata senza risposta

**Script:**

> "Buongiorno, sono ancora [Nome] dello {{ clinic.full_name }}. Abbiamo provato a contattarla nei giorni scorsi per invitarla a un controllo. Ci farebbe piacere rivederla. Quando ha un momento ci richiami al {{ clinic.phone }}. Grazie!"

### Step 5: Chiusura Ciclo

**Quando:** 7 giorni dopo l'ultimo tentativo

**Azioni:**

| Esito | Azione |
|-------|--------|
| Appuntamento fissato | Aggiornare prossimo recall |
| Paziente rimanda | Annotare e riprogrammare recall tra 30 giorni |
| Paziente rifiuta | Annotare motivo, recall tra 6 mesi |
| Non raggiungibile | Segnare come "non raggiunto", riprovare tra 60 giorni |

## Schema del Flusso

```
DATA RECALL RAGGIUNTA
         │
         ▼
    STEP 1: SMS
    (automatico)
         │
    ┌────┴────┐
Risponde     Non risponde
    │              │
    ▼              ▼
PRENOTA     STEP 2: SMS SOLLECITO
             (7 giorni dopo)
                   │
              ┌────┴────┐
         Risponde     Non risponde
              │              │
              ▼              ▼
          PRENOTA     STEP 3: TELEFONATA
                       (7 giorni dopo)
                            │
                       ┌────┴────┐
                  Risponde     Non risponde
                       │              │
                       ▼              ▼
                   PRENOTA     STEP 4: ULTIMA CHIAMATA
                               (7 giorni dopo)
                                    │
                               ┌────┴────┐
                          Risponde     Non risponde
                               │              │
                               ▼              ▼
                           PRENOTA     STEP 5: CHIUSURA
                                       (segnare esito)
```

## Frequenze Personalizzate

### Valutazione del Rischio

| Livello Rischio | Frequenza Igiene | Frequenza Controllo | Criteri |
|-----------------|------------------|---------------------|---------|
| Basso | 12 mesi | 12 mesi | Buona igiene, no patologie |
| Medio | 6 mesi | 6 mesi | Igiene media, rischio carie |
| Alto | 3-4 mesi | 6 mesi | Parodontite, fumatori, diabetici |

### Fattori di Rischio Alto

- Parodontite attiva o trattata
- Fumatori
- Diabetici
- Scarsa igiene domiciliare
- Elevata cariorecettività
- Portatori di impianti
- Pazienti oncologici

## Messaggi per Ogni Tipologia

### SMS Recall Igiene

```
{{ clinic.full_name }}: Gentile [Nome], sono passati 6 mesi
dalla sua ultima igiene. È tempo di un controllo!
Prenoti al {{ clinic.phone }} o risponda a questo messaggio.
```

### SMS Recall Parodontale

```
{{ clinic.full_name }}: Gentile [Nome], è tempo del suo
appuntamento di mantenimento parodontale.
La regolarità è fondamentale per la salute delle
sue gengive. Prenoti al {{ clinic.phone }}.
```

### SMS Recall Implantare

```
{{ clinic.full_name }}: Gentile [Nome], è passato tempo
dall'ultimo controllo dei suoi impianti.
La manutenzione regolare è importante!
Prenoti al {{ clinic.phone }}.
```

### SMS Preventivo in Sospeso

```
{{ clinic.full_name }}: Gentile [Nome], abbiamo notato
che il piano di trattamento discusso non è stato
ancora avviato. Restiamo a disposizione per
chiarimenti. Ci chiami al {{ clinic.phone }}.
```

### Email Recall Completa

```
Oggetto: È tempo del suo controllo periodico

Gentile [Nome] [Cognome],

sono trascorsi [X] mesi dalla sua ultima visita presso
il nostro studio.

La prevenzione è la migliore cura: un controllo
periodico permette di individuare eventuali problemi
prima che diventino più seri e costosi da trattare.

La invitiamo a contattarci per fissare un appuntamento:

📞 {{ clinic.phone }}
📧 {{ clinic.email }}

Orari segreteria:
Lun-Ven: 09:00-13:00 / 14:30-19:30

La aspettiamo!

Cordiali saluti,
{{ clinic.full_name }}
{{ clinic.address }}, Monterotondo
```

## Gestione delle Risposte

### Paziente Prenota

1. ✅ Fissare appuntamento in agenda
2. ✅ Aggiornare data prossimo recall
3. ✅ Inviare conferma appuntamento
4. ✅ Annotare in cartella

### Paziente Rimanda

1. Chiedere gentilmente il motivo (senza insistere)
2. Proporre periodo alternativo
3. Annotare in cartella il motivo
4. Impostare nuovo recall tra 30 giorni

**Script:**
> "Capisco perfettamente. Quando pensa di poter trovare un momento? Posso ricontattarla tra qualche settimana?"

### Paziente Rifiuta

1. Accogliere il rifiuto con rispetto
2. Sottolineare brevemente l'importanza della prevenzione
3. Lasciare la porta aperta
4. Annotare in cartella
5. Recall tra 6 mesi

**Script:**
> "Comprendo. Le ricordo solo che la prevenzione è importante per evitare problemi più seri. Restiamo comunque a disposizione quando vorrà. La ricontatteremo tra qualche mese."

### Paziente Irraggiungibile

1. Documentare tutti i tentativi effettuati
2. Verificare correttezza numero telefono
3. Provare canali alternativi (email)
4. Segnare come "non raggiunto"
5. Riprovare dopo 60 giorni
6. Dopo 3 cicli falliti: valutare se continuare

## Recupero Pazienti Persi

### Definizione

Pazienti senza appuntamenti da oltre **18 mesi**.

### Procedura di Recupero

1. **Identificazione** - Estrarre lista dal gestionale
2. **Segmentazione** - Dividere per valore/potenziale
3. **Campagna dedicata** - Messaggio personalizzato
4. **Eventuale incentivo** - Visita di controllo gratuita
5. **Follow-up telefonico** - Per chi non risponde

### Messaggio Recupero

```
{{ clinic.full_name }}: Gentile [Nome], è passato molto tempo
dalla sua ultima visita e ci farebbe piacere rivederla.
Le offriamo una visita di controllo gratuita.
Prenoti al {{ clinic.phone }}. La aspettiamo!
```

### Script Telefonico Recupero

> "Buongiorno Sig./Sig.ra [Cognome], sono [Nome] dello {{ clinic.full_name }}. È passato un po' di tempo dalla sua ultima visita e volevamo sapere come sta. Ci farebbe molto piacere rivederla, anche solo per un controllo. In questo periodo offriamo la visita di controllo gratuita per i nostri pazienti storici. Posso proporle un appuntamento?"

## Monitoraggio e KPI

### Indicatori di Performance

| KPI | Formula | Obiettivo |
|-----|---------|-----------|
| Tasso di invio | Recall inviati / Recall programmati | 100% |
| Tasso di risposta | Risposte / Recall inviati | > 40% |
| Tasso di prenotazione | Prenotati / Recall inviati | > 30% |
| Tasso di presentazione | Presentati / Prenotati | > 90% |
| Pazienti recuperati | Recuperati / Persi contattati | > 15% |

### Report Mensile Recall

```
╔══════════════════════════════════════════════════╗
║        REPORT RECALL - Mese: __________          ║
╠══════════════════════════════════════════════════╣
║ Recall programmati:          ____ (100%)         ║
║ Recall inviati:              ____ (___%)         ║
║ Risposte ricevute:           ____ (___%)         ║
║ Appuntamenti fissati:        ____ (___%)         ║
║ Pazienti presentati:         ____ (___%)         ║
╠══════════════════════════════════════════════════╣
║ Pazienti non raggiunti:      ____                ║
║ Pazienti che hanno rifiutato: ____               ║
║ Pazienti recuperati:         ____                ║
╠══════════════════════════════════════════════════╣
║ NOTE E AZIONI:                                   ║
║ ____________________________________________     ║
║ ____________________________________________     ║
╚══════════════════════════════════════════════════╝
```

## Impostazione nel Gestionale

### Per Ogni Paziente

| Campo | Valore | Note |
|-------|--------|------|
| Tipo recall | Igiene/Controllo/Parodontale/Implantare | Può averne multipli |
| Frequenza | Mesi (3/4/6/12) | Secondo rischio |
| Data prossimo | Calcolata automaticamente | Dall'ultima prestazione |
| Canale preferito | SMS/Tel/Email/WhatsApp | Chiedere al paziente |
| Note | Particolarità | Orari preferiti, etc. |

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Sistema/Gestionale | Generazione automatica recall, invio SMS |
| Segreteria | Telefonate, gestione risposte, prenotazioni |
| Coordinatore | Monitoraggio KPI, azioni correttive, report |
| Operatore clinico | Impostare frequenza recall in cartella, comunicare al paziente |

## Calendario Attività

| Attività | Frequenza | Responsabile |
|----------|-----------|--------------|
| Verifica recall da inviare | Giornaliera | Segreteria |
| Telefonate follow-up | Giornaliera | Segreteria |
| Analisi KPI recall | Settimanale | Coordinatore |
| Report mensile | Mensile | Coordinatore |
| Campagna recupero persi | Trimestrale | Marketing/Segreteria |
