# Conferma Appuntamenti

## Obiettivo
Ridurre il tasso di no-show attraverso un sistema efficace di promemoria e conferma degli appuntamenti.

## Sistema di Conferma

### Tempistiche

| Momento | Canale | Scopo |
|---------|--------|-------|
| Al momento della prenotazione | Verbale + SMS | Conferma iniziale |
| 48h prima | SMS automatico | Promemoria |
| 24h prima | SMS automatico | Richiesta conferma |
| 2h prima (opzionale) | SMS | Reminder finale |

### Canali di Comunicazione

| Canale | Utilizzo | Pro | Contro |
|--------|----------|-----|--------|
| SMS | Principale | Tasso lettura alto | Costo |
| WhatsApp | Alternativo | Gratuito, interattivo | Richiede opt-in |
| Email | Secondario | Gratuito, dettagliato | Tasso apertura basso |
| Telefonata | Backup | Personale | Tempo operatore |

## SMS Automatici

### Messaggio di Conferma (al momento)

```
{{ clinic.full_name }}: Appuntamento confermato per [DATA] alle ore [ORA].
{{ clinic.address }}, Monterotondo.
Info: {{ clinic.phone }}
```

### Promemoria 48h Prima

```
{{ clinic.full_name }}: Le ricordiamo l'appuntamento di dopodomani [DATA] alle ore [ORA].
Per disdire/modificare: {{ clinic.phone }}
```

### Richiesta Conferma 24h Prima

```
{{ clinic.full_name }}: Domani [DATA] ore [ORA] ha appuntamento con noi.
Conferma rispondendo SI.
Per disdire: {{ clinic.phone }}
```

### Promemoria Finale (2h prima)

```
{{ clinic.full_name }}: Tra 2 ore l'aspettiamo per il suo appuntamento.
Vi ricordiamo di portare [eventuale documentazione].
```

## Gestione Risposte

### Risposte Positive

| Risposta | Azione |
|----------|--------|
| "SI", "OK", "CONFERMO" | Marcare come confermato |
| Nessuna risposta | Procedere, contattare telefonicamente se possibile |

### Risposte Negative

| Risposta | Azione |
|----------|--------|
| "NO", "DISDICO" | Attivare procedura disdetta |
| "SPOSTO", "CAMBIO" | Contattare per nuova data |
| Risposta ambigua | Chiamare per chiarire |

## Conferma Telefonica

### Quando Utilizzarla

- Appuntamenti di chirurgia/implantologia
- Pazienti con storico di no-show
- Nuovi pazienti
- SMS non recapitato
- Assenza di risposta a SMS

### Script Telefonico

> "Buongiorno Sig./Sig.ra [Nome], sono [Nome] dello {{ clinic.full_name }}. La chiamo per confermare il suo appuntamento di domani alle ore [ORA]. Conferma? Perfetto, le ricordo di [eventuali istruzioni]. A domani!"

### Informazioni Aggiuntive

Per appuntamenti specifici, ricordare:

| Tipo Appuntamento | Ricordare |
|-------------------|-----------|
| Chirurgia | Profilassi antibiotica, digiuno, accompagnatore |
| Prima visita | Portare documentazione, tessera sanitaria |
| Igiene | Nessuna preparazione speciale |
| Protesi | Portare vecchia protesi se sostituzione |

## Gestione Non Conferme

### Workflow

```
24h PRIMA - SMS INVIATO
       │
       ▼
   Risposta?
   │       │
  SÌ      NO
   │       │
   ▼       ▼
Confermato? Telefonare
   │       │
  SÌ/NO   Risponde?
   │       │      │
   ▼      SÌ     NO
  OK       │      │
           ▼      ▼
      Gestire  2° tentativo
      risposta (4h prima)
                 │
                 ▼
              Risponde?
              │      │
             SÌ     NO
              │      │
              ▼      ▼
          Gestire  Mantenere
                   appuntamento*

* Annotare "Non confermato"
```

### Priorità Conferma Telefonica

1. Chirurgia e implantologia
2. Nuovi pazienti
3. Pazienti con storico no-show
4. Appuntamenti lunghi (>1h)
5. Altri

## Indicatori di Performance

### KPI da Monitorare

| Indicatore | Obiettivo | Formula |
|------------|-----------|---------|
| Tasso conferma SMS | > 80% | Risposte positive / SMS inviati |
| Tasso no-show | < 5% | No-show / Appuntamenti totali |
| Tasso raggiungibilità | > 95% | Pazienti contattati / Pazienti da contattare |

### Report Settimanale

Verificare:

- [ ] Numero conferme ricevute
- [ ] Numero no-show
- [ ] Appuntamenti non confermati
- [ ] Problemi di recapito SMS

## Casi Particolari

### Pazienti Anziani

- Preferire telefonata a SMS
- Chiamare con anticipo maggiore
- Coinvolgere familiari se necessario

### Pazienti Ripetutamente Assenti

1. Nota in cartella "RISCHIO NO-SHOW"
2. Doppia conferma obbligatoria (SMS + telefono)
3. Eventuale caparra (se policy attiva)
4. Colloquio con il paziente

### Emergenze Inserite Stesso Giorno

- Conferma immediata telefonica
- Ribadire orario e indirizzo
- Ricordare documentazione necessaria

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Sistema automatico | Invio SMS programmati |
| Segretaria | Gestione risposte, telefonate |
| Coordinatore | Monitoraggio KPI, gestione criticità |

## Configurazione Sistema SMS

### Parametri

| Parametro | Valore |
|-----------|--------|
| Mittente | {{ clinic.name }} |
| Orario invio | 09:00 - 20:00 |
| Giorni invio | Lun-Sab |
| Retry fallimento | 2 tentativi |
