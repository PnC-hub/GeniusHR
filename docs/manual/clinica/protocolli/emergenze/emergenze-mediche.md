# Gestione Emergenze Mediche

## Obiettivo
Fornire un protocollo chiaro e sequenziale per la gestione di qualsiasi emergenza medica in studio.

## Algoritmo Generale

```
EMERGENZA RILEVATA
        │
        ▼
┌───────────────────┐
│ SICUREZZA SCENA   │
│ (operatore, staff,│
│  altri pazienti)  │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ VALUTAZIONE       │
│ COSCIENZA         │──── Cosciente? ────┐
└────────┬──────────┘                    │
         │ NO                            │ SÌ
         ▼                               ▼
┌───────────────────┐         ┌───────────────────┐
│ CHIAMA 118        │         │ VALUTA GRAVITÀ    │
│ VALUTA RESPIRO    │         │ RASSICURA         │
└────────┬──────────┘         │ TRATTA SINTOMO    │
         │                    └───────────────────┘
         ▼
    Respira?
    │      │
   NO     SÌ
    │      │
    ▼      ▼
  RCP    PLS
```

## Valutazione Iniziale (30 secondi)

### Coscienza

- Chiamare il paziente per nome
- Stimolo doloroso (pizzicotto trapezio)
- Valutare la risposta

### Respiro (se incosciente)

- Estendere il capo
- Guardare-Ascoltare-Sentire (GAS) per 10 secondi
- Valutare movimenti toracici

### Circolo

- Polso carotideo (solo personale addestrato)
- Segni di circolo (movimenti, tosse)

## Emergenze Specifiche

### Arresto Cardiaco

!!! danger "Critico"
    Ogni minuto senza RCP riduce la sopravvivenza del 10%.

**Protocollo:**

1. Chiamare aiuto - "EMERGENZA!"
2. Far chiamare 118 + portare DAE
3. Posizionare su superficie rigida
4. Iniziare RCP: 30 compressioni + 2 ventilazioni
5. Applicare DAE appena disponibile
6. Continuare fino all'arrivo del 118

**Compressioni toraciche:**

- Centro del torace
- Profondità 5-6 cm
- Frequenza 100-120/min
- Rilascio completo
- Minimizzare interruzioni

### Crisi Anginosa

**Sintomi:**

- Dolore toracico costrittivo
- Irradiazione braccio sx, mandibola
- Sudorazione fredda
- Nausea

**Protocollo:**

1. Interrompere il trattamento
2. Posizione semiseduta
3. Somministrare O2 se disponibile
4. Nitroglicerina sublinguale (se prescritta al paziente)
5. Aspirina 300 mg (se non controindicata)
6. Chiamare 118
7. Monitorare fino all'arrivo soccorsi

### Crisi Ipertensiva

**Sintomi:**

- PA > 180/120 mmHg
- Cefalea intensa
- Disturbi visivi
- Epistassi

**Protocollo:**

1. Interrompere il trattamento
2. Posizione comoda, rassicurare
3. Ambiente tranquillo
4. Misurare PA ogni 5 minuti
5. Se sintomi gravi → 118
6. NON somministrare farmaci senza prescrizione

### Crisi Ipoglicemica

**Sintomi:**

- Sudorazione
- Tremore
- Confusione
- Tachicardia
- Pallore

**Protocollo:**

=== "Paziente Cosciente"

    1. Interrompere il trattamento
    2. Somministrare zucchero:
       - 15-20 g glucosio orale
       - Succo di frutta
       - Caramelle zuccherate
    3. Attendere 15 minuti
    4. Rivalutare
    5. Se non migliora → 118

=== "Paziente Incosciente"

    1. NON somministrare nulla per bocca
    2. Chiamare 118
    3. Posizione laterale di sicurezza
    4. Se disponibile: glucagone IM
    5. Monitorare fino all'arrivo soccorsi

### Convulsioni

**Protocollo:**

1. Proteggere da traumi (allontanare oggetti)
2. NON bloccare i movimenti
3. NON inserire nulla in bocca
4. Cronometrare la durata
5. Se > 5 minuti → 118
6. Al termine: PLS, monitoraggio

### Ostruzione Vie Aeree

=== "Ostruzione Parziale"

    - Il paziente tossisce
    - Incoraggiare a tossire
    - NON interferire
    - Monitorare

=== "Ostruzione Completa"

    **Paziente cosciente:**

    1. 5 colpi interscapolari
    2. 5 compressioni addominali (Heimlich)
    3. Alternare fino a risoluzione o perdita coscienza

    **Paziente incosciente:**

    1. Adagiare a terra
    2. Chiamare 118
    3. Iniziare RCP
    4. Prima di ventilare: controllare bocca

## Chiamata al 118

### Informazioni da Fornire

!!! info "Checklist Chiamata"

    1. **Chi chiama:** "Sono [nome] dello {{ clinic.full_name }}"
    2. **Cosa è successo:** "Ho un paziente con [sintomo/condizione]"
    3. **Dove:** "{{ clinic.address }}, Monterotondo"
    4. **Condizioni:** "Il paziente è [cosciente/incosciente], [respira/non respira]"
    5. **Confermare:** "Ho capito, restiamo in linea/attendiamo i soccorsi"

### Note Importanti

- Non riattaccare per primi
- Seguire le istruzioni della centrale
- Mandare qualcuno ad accogliere l'ambulanza
- Preparare documentazione del paziente

## Post-Emergenza

### Immediate

1. Assistere paziente fino a stabilizzazione/trasferimento
2. Rassicurare altri pazienti
3. Ripristinare kit emergenza
4. Ventilare i locali

### Documentazione

Compilare scheda emergenza:

| Campo | Informazione |
|-------|--------------|
| Data/Ora | Inizio evento |
| Paziente | Dati anagrafici |
| Evento | Descrizione |
| Sintomi | Rilevati |
| Azioni | Eseguite |
| Farmaci | Somministrati |
| Esito | Risoluzione/trasferimento |
| Operatori | Presenti e firme |

### Debriefing

Entro 24-48 ore:

- Riunione del team
- Analisi dell'accaduto
- Identificazione aree di miglioramento
- Aggiornamento protocolli se necessario

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Operatore | Leader emergenza, manovre salvavita |
| Assistente | Supporto, chiamata 118, documentazione |
| Segreteria | Gestione altri pazienti, accoglienza soccorsi |
| Coordinatore | Post-emergenza, debriefing |
