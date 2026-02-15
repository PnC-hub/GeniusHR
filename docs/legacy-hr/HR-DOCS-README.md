# Geniusmile-HR-Smiledoc

Portale dipendenti e sistema gestione HR Smiledoc accessibile da `hr-smiledoc.geniusmile.com`

## Descrizione

Portale unificato con due aree:

### Area Dipendente
- Dashboard personale
- Documenti onboarding
- Modulistica HR (ferie, permessi, variazioni dati)
- Policy aziendali
- Informazioni sicurezza sul lavoro
- Contatti HR

### Gestione HR (Amministrazione)
- Checklist onboarding nuovi dipendenti
- Timeline fasi procedurali (giorni 1-60)
- Tracker dipendenti con progress bar
- Template email (richiami, contestazioni, esiti prova)
- Procedure disciplinari (Art. 7 L. 300/1970)
- Guida completa con riferimenti normativi

## Struttura

```
/
├── index.html              # Portale unificato (dipendenti + HR)
├── documenti/
│   ├── onboarding/         # Documenti primo giorno
│   │   ├── Modulo_Dati_Personali.docx
│   │   ├── Informativa_Privacy_Dipendenti.docx
│   │   ├── Patto_di_Riservatezza_NDA.docx
│   │   ├── Nomina_Autorizzato_Trattamento_Dati.docx
│   │   ├── Modulo_Presa_Visione_Regolamento.docx
│   │   ├── Checklist_Onboarding_Dipendenti.docx
│   │   └── GUIDA_Gestione_Documentale_Onboarding.docx
│   ├── sicurezza/          # D.Lgs. 81/2008
│   │   ├── Verbale_Consegna_DPI.docx
│   │   ├── Scheda_Formazione_Sicurezza.docx
│   │   └── Modulo_Segnalazione_Infortunio.docx
│   ├── amministrazione/    # Modulistica
│   │   ├── Modulo_Variazione_Dati.docx
│   │   ├── Modulo_Richiesta_Ferie_Permessi.docx
│   │   ├── Registro_Provvedimenti_Disciplinari.docx
│   │   └── QUADRO_COMPLETO_Gestione_Documentale.docx
│   ├── disciplina/         # Procedure disciplinari
│   │   ├── Template Richiamo Disciplinare Via Email.docx
│   │   ├── Template_Lettera_Contestazione_Disciplinare.docx
│   │   ├── Template Contestazione Disciplinare Grave.docx
│   │   ├── Procedura Disciplinare Interna Smiledoc.docx
│   │   └── Procedura Licenziamento Disciplinare Smiledoc.docx
│   ├── policy/             # Regolamenti aziendali
│   │   ├── Regolamento Interno Smiledoc Short.docx
│   │   ├── Regolamento Aziendale Smiledoc Completo.docx
│   │   ├── Policy Uso Email Aziendali Smiledoc.docx
│   │   ├── Manuale Aziendale Smiledoc – Comunicazioni E Disciplina.docx
│   │   └── [altri documenti policy email]
│   └── templates/          # Template email e comunicazioni
└── README.md
```

## Uso del Portale

### Accesso Dipendente (default)
Il portale si apre in modalita dipendente. I dipendenti possono:
- Scaricare moduli (ferie, permessi, variazioni dati)
- Consultare policy aziendali
- Vedere informazioni sulla sicurezza
- Contattare HR

### Accesso Gestione HR
Cliccando su "Gestione HR" si accede all'area amministrativa per:
- Gestire onboarding nuovi assunti (checklist giorno per giorno)
- Tracciare lo stato di ogni dipendente
- Copiare template email per richiami/contestazioni
- Consultare procedure disciplinari

## Deploy

Il sito e statico (HTML/CSS/JS) e puo essere servito da:
- GitHub Pages
- Nginx sul server
- Qualsiasi hosting statico

### Configurazione DNS

Aggiungere record A o CNAME per `hr-smiledoc.geniusmile.com` che punta al server.

### Configurazione Nginx (esempio)

```nginx
server {
    listen 80;
    server_name hr-smiledoc.geniusmile.com;
    root /var/www/hr-smiledoc;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

## Conformita

- D.Lgs. 81/2008 (Sicurezza sul Lavoro)
- L. 300/1970 Art. 7 (Statuto dei Lavoratori - Disciplina)
- GDPR Reg. UE 2016/679 (Privacy)
- CCNL Studi Professionali
- D.Lgs. 24/2023 (Whistleblowing)

## Conservazione Documenti

| Documento | Durata |
|-----------|--------|
| Fascicolo personale | 10 anni da cessazione |
| Scheda formazione | 10 anni |
| Registro DPI | 10 anni da consegna |
| Provvedimenti disciplinari | 10 anni (2 anni per recidiva) |
| Buste paga | 5 anni da cessazione |

## Accesso

Il portale e destinato esclusivamente ai dipendenti Smiledoc e all'ufficio HR.
Per accessi non autorizzati fare riferimento alle policy aziendali.

---

Smiledoc - Via Monte Circeo 12, Monterotondo (RM)
Versione 2.0 - Gennaio 2026
