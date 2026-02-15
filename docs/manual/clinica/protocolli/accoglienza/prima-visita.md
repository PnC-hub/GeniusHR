# Prima Visita

## Obiettivo

Garantire un'accoglienza eccellente al nuovo paziente, raccogliendo tutte le informazioni necessarie e creando le basi per un rapporto di fiducia duraturo. La prima visita è il momento più importante per l'acquisizione e la fidelizzazione del paziente.

!!! info "Importanza della Prima Visita"
    La prima visita determina:

    - La percezione della qualità dello studio
    - La fiducia nel team medico
    - La decisione di iniziare il trattamento
    - Il passaparola futuro

## Percorso del Paziente (Customer Journey)

```
CONTATTO       ARRIVO         VISITA         PREVENTIVO      CONGEDO
TELEFONICO  →  IN STUDIO  →   CLINICA    →   E PIANO     →   E FOLLOW-UP
    │              │             │              │               │
    ▼              ▼             ▼              ▼               ▼
 Raccolta     Accoglienza   Diagnosi      Presentazione   Fissare
 dati e       documenti     completa      trattamento     prossimo
 conferma     anamnesi      esami                         appuntamento
```

## Prima dell'Arrivo

### Conferma Appuntamento (24-48h prima)

- [ ] Inviare SMS/chiamata di conferma
- [ ] Verificare completezza dati anagrafici
- [ ] Ricordare documenti da portare (tessera sanitaria, referti precedenti)
- [ ] Confermare durata prevista (45-60 minuti)

**SMS di Conferma:**
```
{{ clinic.full_name }}: Gentile [Nome], le confermiamo l'appuntamento
per la prima visita domani [data] alle [ora].
Si ricordi di portare tessera sanitaria e eventuali referti.
{{ clinic.address }}, Monterotondo. Info: {{ clinic.phone }}
```

### Preparazione Documentazione

Preparare in cartellina dedicata:

| Documento | Copie | Note |
|-----------|-------|------|
| Scheda anagrafica | 1 | Da compilare |
| Questionario anamnestico | 1 | Completo di tutte le patologie |
| Informativa privacy (GDPR) | 2 | Una per il paziente |
| Consenso trattamento dati | 1 | Obbligatorio |
| Consenso marketing | 1 | Opzionale |
| Brochure studio | 1 | Presentazione servizi |

### Preparazione Postazione

- [ ] Riunito pronto e igienizzato
- [ ] Kit visita preparato (specchietto, sonda, pinzetta)
- [ ] Radiografico disponibile (se necessario)
- [ ] Fotocamera carica (documentazione fotografica)

## Arrivo del Paziente

### Accoglienza in Reception

!!! tip "Prima Impressione"
    I primi 30 secondi determinano la percezione che il paziente avrà dello studio. L'accoglienza deve essere impeccabile.

**Script di accoglienza:**

> "Buongiorno! Benvenuto allo {{ clinic.full_name }}. Sono [Nome]. Lei deve essere [Nome paziente], giusto? Si accomodi pure, siamo felici di averla qui."

**Sequenza operativa:**

1. **Alzarsi** per accogliere (mai restare seduti)
2. **Contatto visivo** e sorriso genuino
3. **Confermare** identità e appuntamento
4. **Accompagnare** al posto designato
5. **Offrire** bevanda (acqua, caffè)

### Compilazione Documenti

**Introduzione documenti:**

> "Prima della visita, le chiedo di compilare alcuni documenti importanti. Si tratta del questionario sulla sua salute generale, che serve al dottore per conoscerla meglio, e dell'informativa sulla privacy. Prenda pure il tempo necessario, se ha dubbi sono qui per aiutarla."

| Documento | Cosa Verificare |
|-----------|-----------------|
| Anamnesi | Completezza, allergie, farmaci in uso, patologie |
| Privacy | Firma presente, data corretta |
| Consenso marketing | Non insistere se rifiuta |

**Tempo stimato compilazione:** 10-15 minuti

### Verifica Anamnesi

!!! warning "Controllo Obbligatorio"
    Prima di passare il paziente all'operatore, verificare SEMPRE:

    - Allergie (lattice, farmaci, anestetici)
    - Farmaci anticoagulanti in uso
    - Patologie cardiache
    - Gravidanza in corso

Se presenti condizioni particolari → segnalare immediatamente all'operatore.

### Inserimento Dati nel Gestionale

Durante la compilazione:

- [ ] Creare anagrafica paziente
- [ ] Inserire dati anagrafici completi
- [ ] Registrare provenienza ("Come ci ha conosciuto?")
- [ ] Annotare motivo della visita
- [ ] Segnalare eventuali urgenze cliniche

## Sala d'Attesa

### Accompagnamento

> "Prego, si accomodi nella nostra sala d'attesa. Il Dott. [Nome] sarà da lei tra pochi minuti. Posso offrirle qualcosa da bere?"

**Elementi da comunicare:**

- Password Wi-Fi (se richiesta)
- Posizione servizi igienici
- Tempo di attesa stimato

### Gestione dell'Attesa

| Situazione | Azione |
|------------|--------|
| Attesa < 5 min | Nessun intervento |
| Attesa 5-10 min | Informare paziente |
| Attesa > 10 min | Scusarsi, offrire bevanda, aggiornare |
| Attesa > 15 min | Scusarsi formalmente, proporre riprogrammazione |

## Accompagnamento alla Poltrona

### Procedura

1. **Chiamare** il paziente per nome (alzarsi dalla postazione)
2. **Accompagnare** personalmente (non indicare la strada)
3. **Presentare** l'operatore e l'assistente
4. **Far accomodare** sulla poltrona
5. **Verificare** il comfort (posizione, luce)
6. **Consegnare** l'anamnesi compilata all'operatore

**Script:**

> "Sig./Sig.ra [Cognome], prego mi segua. Le presento il Dott. [Nome] e [Nome] che si occuperanno di lei oggi. Si metta pure comodo."

## Durante la Prima Visita

### Colloquio Iniziale (5-10 minuti)

L'operatore deve seguire questa sequenza:

| Fase | Obiettivo | Durata |
|------|-----------|--------|
| **Accoglienza** | Presentarsi, rompere il ghiaccio | 1 min |
| **Ascolto** | Capire motivo visita, aspettative | 3-5 min |
| **Anamnesi** | Approfondire storia medica e dentale | 2-3 min |
| **Rassicurazione** | Spiegare cosa si farà | 1 min |

**Domande chiave:**

- "Cosa l'ha portata da noi oggi?"
- "Ha avuto problemi dentali in passato?"
- "C'è qualcosa che la preoccupa particolarmente?"
- "Quanto tempo è passato dall'ultima visita?"

### Visita Clinica Completa

**Protocollo visita:**

1. **Esame extraorale**
   - Simmetria facciale
   - Linfonodi
   - ATM (articolazione temporo-mandibolare)

2. **Esame intraorale**
   - Mucose
   - Gengive (sondaggio se indicato)
   - Denti (ispezione e percussione)
   - Occlusione

3. **Registrazione**
   - Odontogramma completo
   - Status parodontale (se necessario)
   - Annotazione problematiche

**Comunicazione durante la visita:**

- Spiegare ogni passaggio PRIMA di farlo
- Chiedere sempre il permesso prima di procedere
- Verificare periodicamente il comfort
- Usare tono calmo e rassicurante
- Evitare termini tecnici incomprensibili

### Esami Diagnostici

Se necessari (RX, foto intraorali):

| Esame | Quando | Cosa Spiegare |
|-------|--------|---------------|
| RX endorale | Sospetta patologia localizzata | "Ci serve per vedere l'interno del dente" |
| OPT (panoramica) | Visione generale | "È una foto completa di tutta la bocca" |
| Foto intraorali | Documentazione | "Ci aiutano a mostrarle cosa abbiamo visto" |

**Rispettare sempre i protocolli di radioprotezione.**

## Conclusione Prima Visita

### Comunicazione Diagnosi

**Principi:**

1. **Linguaggio semplice** - Evitare gergo medico
2. **Supporto visivo** - Usare foto, RX, specchio
3. **Gradualità** - Dal generale al particolare
4. **Verifica comprensione** - "Le è chiaro? Ha domande?"

**Struttura comunicazione:**

> "Allora [Nome], le spiego quello che abbiamo trovato. In generale la situazione è [buona/da tenere sotto controllo/da trattare]. Nello specifico abbiamo visto..."

### Presentazione Piano di Trattamento

**Sequenza:**

1. **Riassumere** le problematiche riscontrate
2. **Prioritizzare** (urgenze vs trattamenti differibili)
3. **Illustrare** le opzioni terapeutiche
4. **Presentare** il preventivo scritto
5. **NON mettere fretta** nella decisione

**Script:**

> "Sulla base di quello che abbiamo visto, le propongo questo piano di trattamento. Glielo spiego passo per passo, poi le lascio il preventivo scritto così può valutarlo con calma."

### Gestione del Preventivo

| Situazione | Azione |
|------------|--------|
| Paziente accetta subito | Fissare primo appuntamento |
| Paziente vuole pensare | "Capisco, si prenda il tempo. La ricontattiamo tra qualche giorno?" |
| Paziente ha dubbi economici | Proporre priorità, dilazione pagamenti |
| Paziente rifiuta | Ringraziare, lasciare porta aperta |

!!! warning "Importante"
    Mai insistere o mettere pressione. Il paziente deve sentirsi libero di decidere.

## Congedo

### In Reception

- [ ] Consegnare copia preventivo
- [ ] Fissare eventuale prossimo appuntamento
- [ ] Fornire biglietto da visita con contatti
- [ ] Raccogliere feedback ("Come si è trovato?")
- [ ] Saluto cordiale

**Script finale:**

> "È stato un piacere conoscerla, [Nome]. Se ha domande sul preventivo o su qualsiasi altra cosa, non esiti a contattarci. Le auguro una buona giornata!"

### Follow-up Post Prima Visita

**Entro 24-48 ore:**

- [ ] Inviare email/SMS di ringraziamento
- [ ] Allegare preventivo in formato digitale (se richiesto)

**Entro 7 giorni (se non ha fissato):**

- [ ] Chiamata di cortesia per feedback
- [ ] Proporre appuntamento

**SMS di ringraziamento:**
```
{{ clinic.full_name }}: Gentile [Nome], grazie per la visita di oggi.
Per qualsiasi domanda siamo a disposizione al {{ clinic.phone }}.
A presto!
```

## Checklist Completa Prima Visita

### Pre-Visita
- [ ] Conferma appuntamento inviata
- [ ] Documentazione preparata
- [ ] Postazione clinica pronta

### Documenti Raccolti
- [ ] Anamnesi compilata e firmata
- [ ] Informativa privacy firmata
- [ ] Consenso trattamento dati firmato
- [ ] Consenso marketing (se accettato)
- [ ] Documento identità (visionato)
- [ ] Tessera sanitaria (copiata)

### Dati Inseriti nel Gestionale
- [ ] Anagrafica completa
- [ ] Anamnesi digitalizzata
- [ ] Odontogramma iniziale
- [ ] Foto/RX (se effettuati)
- [ ] Piano di trattamento
- [ ] Preventivo salvato

### Post-Visita
- [ ] Email/SMS ringraziamento inviato
- [ ] Appuntamento successivo fissato (o recall impostato)
- [ ] Preventivo consegnato

## Responsabilità

| Fase | Responsabile | Backup |
|------|--------------|--------|
| Conferma appuntamento | Segreteria | Sistema automatico |
| Accoglienza e documenti | Segreteria | Assistente |
| Verifica anamnesi | Segreteria | Operatore |
| Accompagnamento | Segreteria/Assistente | - |
| Visita clinica | Operatore | - |
| Comunicazione diagnosi | Operatore | - |
| Preventivo | Operatore + Segreteria | - |
| Congedo e follow-up | Segreteria | - |

## Indicatori di Qualità

| KPI | Obiettivo | Monitoraggio |
|-----|-----------|--------------|
| Tempo attesa in sala | < 10 minuti | Giornaliero |
| Documenti completi | 100% | Per paziente |
| Conversione preventivi | > 50% | Mensile |
| Soddisfazione prima visita | > 4.5/5 | Trimestrale |
