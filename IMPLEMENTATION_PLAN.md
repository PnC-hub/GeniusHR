# GeniusHR - Piano Implementazione a Blocchi

**Strategia**: Ogni blocco viene eseguito da un Task agent dedicato per evitare accumulo contesto.

---

## FASE 2: Enhancement (Da PRD)

### BLOCCO 1: Fix Filtri Employees ✅
**Scope**: Rendere funzionanti i filtri nella pagina employees
- [ ] Search box funzionante
- [ ] Filtro status (tutti/attivi/inattivi)
- [ ] Filtro tipo contratto
**Stima complessità**: Bassa

### BLOCCO 2: Employee Detail Page
**Scope**: Pagina dettaglio dipendente completa
- [ ] Card anagrafica con tutti i dati
- [ ] Tab documenti firmati
- [ ] Tab formazione sicurezza
- [ ] Tab ferie/permessi
- [ ] Tab provvedimenti disciplinari
- [ ] Edit inline dei campi
**Stima complessità**: Media

### BLOCCO 3: Dashboard Real Data
**Scope**: Sostituire dati hardcoded con query reali
- [ ] Compliance score calcolato da DB
- [ ] Statistiche reali dipendenti
- [ ] Scadenze da API
- [ ] Widget attività recenti
**Stima complessità**: Bassa

### BLOCCO 4: Tooltip e Info Icons
**Scope**: Aggiungere icone (i) con tooltip in tutte le pagine
- [ ] Componente InfoTooltip riutilizzabile
- [ ] Tooltip in dashboard
- [ ] Tooltip in employees
- [ ] Tooltip in leaves
- [ ] Tooltip in expenses
- [ ] Tooltip in payslips
**Stima complessità**: Bassa

### BLOCCO 5: Seed Dati Demo Smiledoc
**Scope**: Popolare DB con dati demo realistici
- [ ] 8 dipendenti da PRD
- [ ] Documenti precaricati
- [ ] Storico presenze
- [ ] Richieste ferie esempio
- [ ] Note spese esempio
**Stima complessità**: Media

### BLOCCO 6: Leaves Page Complete
**Scope**: Completare funzionalità ferie/permessi
- [ ] Calendario visuale
- [ ] Approvazione con commento
- [ ] Saldi aggiornati real-time
- [ ] Export per consulente
**Stima complessità**: Media

### BLOCCO 7: Expenses Page Complete
**Scope**: Completare note spese e rimborsi
- [ ] Upload scontrino con preview
- [ ] OCR simulato (placeholder per futuro)
- [ ] Rimborso chilometrico con calcolo
- [ ] Workflow approvazione
**Stima complessità**: Media

### BLOCCO 8: Attendance Page
**Scope**: Gestione presenze e timbrature
- [ ] Vista giornaliera/settimanale/mensile
- [ ] Timbratura manuale
- [ ] Gestione anomalie
- [ ] Calcolo straordinari
**Stima complessità**: Alta

### BLOCCO 9: Payslips Complete
**Scope**: Gestione cedolini
- [ ] Upload massivo PDF
- [ ] Smistamento automatico
- [ ] Notifica consegna
- [ ] Archivio storico dipendente
**Stima complessità**: Media

### BLOCCO 10: Onboarding Workflow
**Scope**: Workflow onboarding completo
- [ ] Checklist interattiva
- [ ] Timeline visuale
- [ ] Firma documenti integrata
- [ ] Progress tracking
**Stima complessità**: Alta

### BLOCCO 11: Safety/Compliance
**Scope**: Gestione sicurezza D.Lgs. 81/08
- [ ] Scadenzario formazione
- [ ] DVR acknowledgment
- [ ] Consegna DPI
- [ ] Alert automatici
**Stima complessità**: Media

### BLOCCO 12: Disciplinary Module
**Scope**: Procedura disciplinare Art. 7
- [ ] Workflow contestazione
- [ ] Timer 5 giorni difesa
- [ ] Template documenti
- [ ] Registro provvedimenti
**Stima complessità**: Alta

### BLOCCO 13: Whistleblowing
**Scope**: Canale segnalazioni D.Lgs. 24/2023
- [ ] Form segnalazione anonima
- [ ] Messaggistica sicura
- [ ] Tracking stato
- [ ] Dashboard gestione
**Stima complessità**: Media

### BLOCCO 14: Consultant Portal
**Scope**: Accesso consulente del lavoro
- [ ] Dashboard dedicata
- [ ] Export presenze
- [ ] Upload cedolini
- [ ] Comunicazioni
**Stima complessità**: Media

### BLOCCO 15: Tutorial Center
**Scope**: Centro tutorial integrato
- [ ] 8 moduli tutorial da PRD
- [ ] Video placeholder
- [ ] Link contestuali da pagine
- [ ] Progress tracking
**Stima complessità**: Bassa

---

## Come Eseguire

Per ogni blocco, chiedere:
```
Esegui BLOCCO X: [nome blocco]
```

Claude userà un Task agent dedicato per implementare il blocco senza accumulare contesto.

---

## Stato Attuale

| Blocco | Stato | Note |
|--------|-------|------|
| 1 | TODO | Priorità alta |
| 2 | TODO | Priorità alta |
| 3 | TODO | Priorità media |
| 4 | TODO | Priorità media |
| 5 | TODO | Priorità media |
| 6-15 | TODO | Fase successiva |

---

*Ultimo aggiornamento: 27 Gennaio 2026*
