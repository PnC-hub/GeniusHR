# Gestione Disdette e No-Show

## Obiettivo
Gestire efficacemente le disdette minimizzando l'impatto sull'agenda e prevenendo i no-show futuri.

## Definizioni

| Termine | Definizione |
|---------|-------------|
| **Disdetta** | Cancellazione comunicata dal paziente |
| **No-show** | Mancata presentazione senza preavviso |
| **Ritardo** | Arrivo oltre 15 minuti dall'orario |
| **Cancellazione tardiva** | Disdetta < 24h prima |

## Gestione Disdette

### Ricezione della Disdetta

**Script:**

> "Mi dispiace che debba disdire. Posso chiederle il motivo? [Ascoltare] Capisco. Vuole che fissiamo subito un nuovo appuntamento?"

**Informazioni da raccogliere:**

1. Motivo della disdetta (senza insistere)
2. Disponibilità per nuovo appuntamento
3. Preferenze di orario

### Classificazione Motivi

| Categoria | Esempi | Azione |
|-----------|--------|--------|
| Imprevisto serio | Malattia, emergenza familiare | Comprensione, riprogrammazione |
| Impegno lavorativo | Riunione, viaggio | Proporre orari alternativi |
| Dimenticanza | "Me ne sono dimenticato" | Migliorare sistema conferme |
| Paura/ansia | "Non me la sento" | Rassicurare, coinvolgere operatore |
| Motivo economico | "Non posso permettermelo" | Proporre piano pagamento |

### Riprogrammazione

1. Proporre disponibilità immediata
2. Se rifiuta, concordare periodo
3. Inserire in agenda
4. Inviare conferma
5. Attivare reminder rinforzato

### Aggiornamento Agenda

1. **Cancellare** l'appuntamento
2. **Annotare** il motivo
3. **Liberare** lo slot
4. **Attivare** lista d'attesa

## Gestione Slot Liberati

### Priorità di Riassegnazione

```
SLOT LIBERATO
     │
     ▼
Lista d'attesa
(stessa prestazione)
     │
     ▼
Lista d'attesa
(qualsiasi prestazione)
     │
     ▼
Anticipi da richiamare
     │
     ▼
Rimanere libero
(per emergenze)
```

### Contatto Lista d'Attesa

> "Buongiorno Sig./Sig.ra [Nome], sono [Nome] dello {{ clinic.full_name }}. Si è liberato un posto per [GIORNO] alle ore [ORA]. Le farebbe comodo? Perfetto, la segno subito!"

## Gestione No-Show

### Procedura Immediata

1. **Attendere 15 minuti** oltre l'orario
2. **Tentare di contattare** il paziente (telefono)
3. **Documentare** il tentativo di contatto
4. **Liberare** lo slot se non risponde
5. **Registrare** il no-show in cartella

### Contatto Successivo

Entro 24 ore:

> "Buongiorno Sig./Sig.ra [Nome], ieri l'aspettavamo per il suo appuntamento ma non si è presentato/a. È tutto a posto? Vuole fissare un nuovo appuntamento?"

### Registrazione in Cartella

Annotare:

- Data del no-show
- Tentativo di contatto
- Esito del contatto
- Eventuali giustificazioni
- Nuovo appuntamento fissato

## Policy No-Show

### Primo No-Show

- Contatto cordiale
- Comprensione
- Riprogrammazione
- Nota in cartella

### Secondo No-Show

- Contatto più strutturato
- Richiesta spiegazione
- Avviso informale della policy
- Conferma obbligatoria telefonica per prossimi appuntamenti

### Terzo No-Show

!!! warning "Attenzione"
    Al terzo no-show valutare l'applicazione di misure più restrittive.

Opzioni:

1. Colloquio con il coordinatore/direzione
2. Richiesta caparra per prenotazioni future
3. Solo appuntamenti confermati telefonicamente
4. In casi estremi: sospensione del rapporto

### Comunicazione Policy

**Esempio lettera/email:**

> Gentile Paziente,
>
> abbiamo notato che nelle ultime occasioni non si è presentato/a agli appuntamenti concordati. Comprendiamo che possano verificarsi imprevisti, tuttavia le assenze non comunicate creano disagi all'organizzazione e tolgono disponibilità ad altri pazienti.
>
> Le chiediamo cortesemente di avvisarci con almeno 24 ore di anticipo in caso di impossibilità. Per i prossimi appuntamenti richiederemo una conferma telefonica.
>
> Restiamo a disposizione per qualsiasi chiarimento.
>
> Cordiali saluti

## Analisi e Prevenzione

### Monitoraggio

| Indicatore | Frequenza | Obiettivo |
|------------|-----------|-----------|
| Tasso no-show | Settimanale | < 5% |
| No-show per paziente | Mensile | Identificare recidivi |
| Costo no-show | Mensile | Quantificare impatto |
| Motivi disdetta | Mensile | Identificare pattern |

### Calcolo Impatto Economico

```
COSTO NO-SHOW = Durata slot × Tariffa oraria media

Esempio:
Slot 1 ora × 100€/ora = 100€ persi
10 no-show/mese = 1.000€/mese
```

### Azioni Preventive

| Azione | Efficacia |
|--------|-----------|
| SMS conferma 24h | Alta |
| Telefonata conferma | Molto alta |
| Lista d'attesa attiva | Alta |
| Educazione paziente | Media-Alta |
| Policy chiara | Media |
| Caparra (casi selezionati) | Alta |

## Report

### Report Settimanale

```
REPORT DISDETTE E NO-SHOW
Settimana: __/__/____ - __/__/____

Disdette totali: ___
- Con preavviso >24h: ___
- Con preavviso <24h: ___

No-show totali: ___

Slot recuperati (da lista attesa): ___
Slot rimasti vuoti: ___

Tasso no-show: ___%
Tasso recupero slot: ___%
```

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Segretaria | Gestione operativa, contatti |
| Coordinatore | Monitoraggio, policy, casi difficili |
| Direzione | Policy generale, casi estremi |
