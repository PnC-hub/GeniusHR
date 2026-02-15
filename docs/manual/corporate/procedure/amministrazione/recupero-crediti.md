# Recupero Crediti

## Obiettivo
Gestire in modo efficace ed etico il recupero degli importi non pagati, mantenendo dove possibile il rapporto con il paziente.

## Classificazione Crediti

| Tipo | Definizione | Urgenza |
|------|-------------|---------|
| Corrente | Scadenza non ancora superata | Monitoraggio |
| Scaduto 1-30 gg | Ritardo lieve | Sollecito soft |
| Scaduto 31-60 gg | Ritardo moderato | Sollecito formale |
| Scaduto 61-90 gg | Ritardo significativo | Sollecito urgente |
| Scaduto >90 gg | Grave ritardo | Azioni legali |

## Procedura di Recupero

### Fase 1: Promemoria Amichevole (1-15 giorni)

**Azione:** SMS/Email di cortesia

**Template SMS:**
```
{{ clinic.full_name }}: Gentile paziente, le ricordiamo
che risulta un saldo di € [importo] scaduto il
[data]. Per info: {{ clinic.phone }}
```

**Template Email:**
```
Oggetto: Promemoria pagamento

Gentile Sig./Sig.ra [Nome],

le ricordiamo che alla data odierna risulta un saldo
di € [importo] relativo a [prestazioni/fattura n.].

La preghiamo di regolarizzare la posizione al più
presto o di contattarci per eventuali chiarimenti.

Cordiali saluti
{{ clinic.full_name }}
```

### Fase 2: Sollecito Telefonico (16-30 giorni)

**Azione:** Chiamata telefonica

**Script:**
> "Buongiorno Sig./Sig.ra [Nome], sono [Nome] dello {{ clinic.full_name }}. La contatto per un promemoria: risulta un saldo di € [importo] relativo alle cure effettuate. Come possiamo risolvere?"

**Possibili Esiti:**

| Risposta | Azione |
|----------|--------|
| Paga subito | Incassare, chiudere pratica |
| Chiede dilazione | Proporre piano, documentare |
| Contesta importo | Verificare, coinvolgere amministrazione |
| Non risponde | Riprovare, passare a fase 3 |

### Fase 3: Sollecito Formale Scritto (31-60 giorni)

**Azione:** Lettera raccomandata A/R o PEC

**Template:**
```
SOLLECITO DI PAGAMENTO

Gentile Sig./Sig.ra [Nome],

nonostante i precedenti solleciti, ad oggi risulta
ancora insoluto l'importo di € [importo] relativo
a [fattura/prestazioni].

La invitiamo a provvedere al pagamento entro 15
giorni dal ricevimento della presente, tramite:
- Bonifico su IBAN [IBAN]
- Pagamento presso lo studio

In difetto, ci vedremo costretti ad adire le vie
legali per il recupero del credito, con aggravio
di spese a Suo carico.

Restiamo comunque disponibili per concordare
eventuali modalità di pagamento rateale.

Cordiali saluti

[Firma Direzione]
```

### Fase 4: Messa in Mora (61-90 giorni)

**Azione:** Lettera di messa in mora tramite legale

**Contenuto:**
- Intimazione formale al pagamento
- Termine perentorio (solitamente 15 giorni)
- Avviso di azioni legali
- Quantificazione spese legali

### Fase 5: Azioni Legali (oltre 90 giorni)

**Opzioni:**

| Azione | Quando | Note |
|--------|--------|------|
| Decreto ingiuntivo | Importi certi, documentati | Più rapido |
| Causa ordinaria | Contestazioni | Più lungo |
| Recupero tramite agenzia | Piccoli importi | Costo % |

!!! warning "Valutazione Costi-Benefici"
    Prima di procedere con azioni legali, valutare sempre se i costi superano il beneficio del recupero.

## Gestione Casi Particolari

### Paziente in Difficoltà Economica

1. Ascoltare la situazione
2. Proporre piano di pagamento sostenibile
3. Anche rate molto piccole (€ 50/mese)
4. Documentare accordo
5. Monitorare rispetto accordi

### Paziente Irreperibile

1. Verificare tutti i contatti disponibili
2. Tentare contatti alternativi (familiari noti)
3. Verificare indirizzo via anagrafe (se necessario)
4. Documentare tutti i tentativi

### Contestazione del Debito

1. Ascoltare le ragioni
2. Verificare la fondatezza
3. Coinvolgere la direzione
4. Se infondato: ribadire il credito
5. Se fondato: correggere e chiudere

## Prevenzione

### Misure Preventive

| Misura | Efficacia |
|--------|-----------|
| Pagamento anticipato/contestuale | Alta |
| Piani di pagamento chiari | Alta |
| Monitoraggio continuo scadenze | Media |
| Controllo crediti prima di nuovi trattamenti | Alta |

### Blocco Trattamenti

!!! danger "Saldo Insoluto"
    Non iniziare nuovi trattamenti se il paziente ha saldi insoluti non giustificati.

**Eccezioni:**
- Urgenze non differibili
- Piano di rientro in corso e rispettato
- Autorizzazione della direzione

## Documentazione

### Scheda Recupero Crediti

| Campo | Informazione |
|-------|--------------|
| Paziente | Dati completi |
| Importo | Totale dovuto |
| Origine | Fatture/prestazioni |
| Scadenza originale | Data |
| Azioni intraprese | Cronologia |
| Esito | Stato attuale |

### Conservazione

- Tutta la corrispondenza
- Ricevute di invio raccomandate
- Accordi di pagamento firmati
- Comunicazioni legali

## Report

### Report Mensile Crediti

```
REPORT CREDITI MESE [MESE/ANNO]

Crediti totali: € ____
├── Correnti: € ____
├── Scaduti 1-30 gg: € ____
├── Scaduti 31-60 gg: € ____
├── Scaduti 61-90 gg: € ____
└── Scaduti >90 gg: € ____

Recuperato nel mese: € ____
Passato a legale: € ____
Inesigibili: € ____

Tasso di recupero: ___%
```

## Responsabilità

| Ruolo | Compito |
|-------|---------|
| Segreteria | Fase 1 (promemoria) |
| Amministrazione | Fasi 2-3 (solleciti) |
| Direzione | Fasi 4-5 (decisioni legali) |
| Legale | Messa in mora, azioni legali |
