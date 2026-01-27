# Seed Script per GeniusHR

## Script Disponibili

### 1. seed-smiledoc.ts
Popola il database con dati demo realistici dello studio Smiledoc.

**Contenuto:**
- **Tenant**: Smiledoc S.r.l. (Via Monte Circeo 12, Monterotondo)
- **Admin User**: direzione@smiledoc.it / Smiledoc2025!
- **8 Dipendenti** con dati completi:
  - Maria Rossi - Segretaria Reception
  - Giuseppe Bianchi - Igienista Dentale
  - Anna Verdi - ASO
  - Marco Neri - Odontoiatra
  - Laura Gialli - Responsabile Amministrazione
  - Fabio Blu - ASO
  - Sara Viola - Segretaria
  - Luca Arancio - Apprendista (in onboarding)

**Dati correlati:**
- SafetyTraining (alcuni scaduti per test)
- LeaveBalance con saldi ferie/ROL
- LeaveRequest (1 pending, 3 approved)
- ExpenseRequest (1 pending, 2 approved)
- Payslips ultimi 3 mesi
- DVR Acknowledgments
- Disciplinary Code
- Onboarding Timeline per Luca Arancio
- Documenti template

## Utilizzo

### Eseguire il seed Smiledoc
```bash
cd app
npm run db:seed-smiledoc
```

### Eseguire il seed base
```bash
cd app
npm run db:seed
```

## Note
- Lo script è **idempotente**: può essere eseguito più volte senza duplicare i dati (usa `upsert`)
- Alcuni dati hanno valori "anomali" per testare alert e notifiche:
  - Giuseppe Bianchi: formazione sicurezza scaduta
  - Luca Arancio: onboarding in corso, formazione non iniziata
  - Alcune richieste ferie in stato "pending"

## Credenziali di Accesso

**Admin Smiledoc:**
- Email: direzione@smiledoc.it
- Password: Smiledoc2025!

## Sviluppo

Per modificare i dati demo, edita il file:
```
app/prisma/seed-smiledoc.ts
```

Per aggiungere nuovi dipendenti, modifica l'array `employees` seguendo la struttura esistente.
