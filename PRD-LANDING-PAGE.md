# PRD: Landing Page Marketing GeniusHR — 2 Anime

## Obiettivo
Riscrivere la homepage (page.tsx) come pagina di vendita professionale che comunichi chiaramente le 2 anime di GeniusHR:
1. **HR Management** — Gestione risorse umane completa
2. **Manuale Operativo** — Documenti, procedure, checklist con validità legale

## Target
- Studi dentistici e medici italiani
- PMI con esigenze ISO 9001
- Consulenti del lavoro che gestiscono più clienti

## Struttura Landing Page

### 1. Header (fisso, scroll-aware)
- Logo GeniusHR + nav: Funzionalità, Prezzi, Testimonianze
- CTA: "Accedi" + "Prova Gratis 14 giorni"

### 2. Hero Section
- Badge: "HR + Manuale Operativo in un'unica piattaforma"
- H1: "Gestisci il Personale e i Manuali Operativi in un'unica piattaforma"
- Subtitle: menzione compliance GDPR, D.Lgs 81/08, ISO 9001
- 2 CTA: "Inizia la Prova Gratuita" + "Guarda la Demo"
- Sotto: "14 giorni gratis — Nessuna carta di credito"

### 3. Le 2 Anime — Sezione Split
Card affiancate con icone, titolo, 4-5 bullet points ciascuna:

**Anima HR:**
- Anagrafica dipendenti e contratti CCNL
- Ferie, permessi, presenze, straordinari
- Buste paga digitali e note spese
- Onboarding checklist automatico
- Formazione, sicurezza 81/08, DPI
- Disciplinare Art. 7 e whistleblowing

**Anima Manuale Operativo:**
- 100+ articoli e procedure personalizzabili
- Checklist operative giornaliere/settimanali/mensili
- Presa visione con firma digitale del personale
- Versionamento documenti con storico revisioni
- Ricerca full-text in tutto il manuale
- Validità legale ISO 9001 per accreditamenti

### 4. Social Proof — Numeri
- Studi attivi, dipendenti gestiti, articoli pubblicati, checklist completate

### 5. Features Grid (6 card)
Combina HR + Manuale:
1. Dipendenti & Documenti
2. Scadenze & Compliance
3. Manuale Operativo Digitale
4. Checklist Operative
5. Portale Consulente
6. Sicurezza GDPR & 81/08

### 6. Come Funziona (3 step)
1. Registrati e configura lo studio
2. Importa dipendenti e attiva il manuale
3. Gestisci tutto dalla dashboard

### 7. Pricing (4 piani dal PRD)
| Piano | Prezzo | Dipendenti | Include |
|-------|--------|------------|---------|
| Starter | €29/mese | 5 | HR base |
| Professional | €79/mese | 20 | HR + Manuale base |
| Enterprise | €149/mese | illimitati | HR + Manuale completo + multi-sede |
| Partner | €199/mese | illimitati | White-label + API + consulente |

### 8. Testimonianze (3 reali/verosimili)
Studi dentistici italiani con focus su vantaggi specifici

### 9. FAQ (6-8 domande)
Schema.org FAQPage per SEO

### 10. CTA Finale
Background blu, CTA grande

### 11. Footer
Colonne: Prodotto, HR, Manuale, Legale
Disclaimer: "Non costituisce consulenza legale"
P.IVA, copyright 2026

## Requisiti Tecnici
- Server Component (no 'use client') per SEO
- Schema.org JSON-LD: SoftwareApplication + FAQPage
- Meta tags OG completi
- Animazioni CSS pure (no JS libraries)
- Mobile-first responsive
- Accenti italiani corretti (à, è, é, ì, ò, ù)
- NO "gratuito" su servizi medici (normativa sanitaria — qui è software, OK)

## File da modificare
- `src/app/page.tsx` — Riscrittura completa
- `src/app/layout.tsx` — Verificare meta tags
