import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GeniusHR - Gestione HR + Manuale Operativo | Compliance Art. 2086 c.c.",
  description: "Piattaforma SaaS completa: gestione dipendenti, ferie, buste paga, formazione sicurezza E manuale operativo digitale con validità legale ISO 9001. Compliance Art. 2086 c.c. su assetti organizzativi. Per studi dentistici, medici e PMI italiane.",
  openGraph: {
    title: "GeniusHR - HR Management + Manuale Operativo + Compliance Art. 2086",
    description: "Gestisci il personale E i documenti operativi. Compliance GDPR, D.Lgs 81/08, ISO 9001, Art. 2086 c.c. 14 giorni gratis.",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "GeniusHR",
            applicationCategory: "BusinessApplication",
            description: "Piattaforma SaaS per gestione risorse umane e manuali operativi digitali con validità legale ISO 9001",
            operatingSystem: "Web",
            offers: {
              "@type": "AggregateOffer",
              lowPrice: "29",
              highPrice: "199",
              priceCurrency: "EUR",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "127",
            },
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Cos'è GeniusHR?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "GeniusHR è una piattaforma SaaS con due anime: gestione HR completa (dipendenti, ferie, buste paga, formazione) e manuale operativo digitale con validità legale ISO 9001.",
                },
              },
              {
                "@type": "Question",
                name: "Il manuale operativo ha validità legale?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sì, il sistema di versionamento, firme digitali del personale e storico revisioni garantisce la validità legale per certificazioni ISO 9001 e accreditamenti sanitari.",
                },
              },
              {
                "@type": "Question",
                name: "È adatto a studi dentistici?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Assolutamente sì. GeniusHR è progettato per studi dentistici, medici e professionali italiani con funzionalità specifiche per la compliance GDPR, D.Lgs 81/08 e normative sanitarie.",
                },
              },
              {
                "@type": "Question",
                name: "Quanto costa?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Quattro piani: Starter €29/mese (5 dipendenti, HR base), Professional €79/mese (20 dipendenti, HR + Manuale), Enterprise €149/mese (illimitati, full), Partner €199/mese (white-label + API).",
                },
              },
            ],
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-emerald-50">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-b border-gray-200 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  GeniusHR
                </span>
              </div>
              <nav className="hidden md:flex items-center gap-8">
                <a href="#anime" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Funzionalità
                </a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Prezzi
                </a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Testimonianze
                </a>
              </nav>
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-4 py-2"
                >
                  Accedi
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  Registrati Gratis
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 px-5 py-2.5 rounded-full text-sm font-semibold mb-8 shadow-sm">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="bg-gradient-to-r from-blue-700 to-emerald-700 bg-clip-text text-transparent">
                  HR + Manuale Operativo in un&apos;unica piattaforma
                </span>
              </div>

              {/* H1 */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
                Gestisci il Personale<br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  e i Manuali Operativi
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                La prima piattaforma che unisce gestione HR completa e documentazione operativa digitale.
                <br />
                <span className="font-semibold text-gray-900">Compliance garantita</span> per GDPR, D.Lgs 81/08, ISO 9001 e Art. 2086 c.c.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link
                  href="/register"
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  Registrati Gratis
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a
                  href="#demo"
                  className="bg-white text-gray-700 px-10 py-5 rounded-2xl font-bold text-lg border-2 border-gray-300 hover:border-blue-400 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Guarda la Demo
                </a>
              </div>

              <p className="text-sm text-gray-500 font-medium">
                ✓ Gratis per sempre &nbsp;&nbsp;·&nbsp;&nbsp; ✓ Nessuna carta di credito &nbsp;&nbsp;·&nbsp;&nbsp; ✓ Upgrade quando vuoi
              </p>
            </div>
          </div>
        </section>

        {/* Le 2 Anime - Split Section */}
        <section id="anime" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">
                Due Anime, Una Sola Piattaforma
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                GeniusHR combina gestione delle risorse umane e documentazione operativa digitale.
                <br />
                Tutto ciò che serve per gestire uno studio professionale moderno.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Anima HR */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-10 rounded-3xl border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-blue-900">Gestione HR</h3>
                    <p className="text-blue-700 font-medium">Risorse umane complete</p>
                  </div>
                </div>

                <ul className="space-y-4">
                  {[
                    "Anagrafica dipendenti e contratti CCNL completi",
                    "Ferie, permessi, presenze e straordinari",
                    "Buste paga digitali con tracking lettura",
                    "Onboarding checklist automatizzate (4 fasi)",
                    "Formazione obbligatoria e sicurezza 81/08",
                    "Procedimento disciplinare Art. 7 + whistleblowing",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 font-medium leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Anima Manuale Operativo */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-10 rounded-3xl border-2 border-emerald-200 shadow-xl hover:shadow-2xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-emerald-900">Manuale Operativo</h3>
                    <p className="text-emerald-700 font-medium">Validità legale ISO 9001</p>
                  </div>
                </div>

                <ul className="space-y-4">
                  {[
                    "100+ articoli e procedure personalizzabili per settore",
                    "Checklist operative (giornaliere/settimanali/mensili)",
                    "Presa visione con firma digitale del personale",
                    "Versionamento documenti con storico completo",
                    "Ricerca full-text in tutta la documentazione",
                    "Validità legale per accreditamenti e certificazioni ISO",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 font-medium leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-emerald-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-black text-white mb-2">120+</div>
                <div className="text-blue-100 font-semibold text-lg">Studi Attivi</div>
              </div>
              <div>
                <div className="text-5xl font-black text-white mb-2">2.500+</div>
                <div className="text-blue-100 font-semibold text-lg">Dipendenti Gestiti</div>
              </div>
              <div>
                <div className="text-5xl font-black text-white mb-2">15.000+</div>
                <div className="text-blue-100 font-semibold text-lg">Articoli Pubblicati</div>
              </div>
              <div>
                <div className="text-5xl font-black text-white mb-2">8.400+</div>
                <div className="text-blue-100 font-semibold text-lg">Checklist Completate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid - Combinata */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">
                Tutto Ciò di Cui Hai Bisogno
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Una suite completa che integra gestione HR e documentazione operativa
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Dipendenti & Documenti</h3>
                <p className="text-gray-600 leading-relaxed">
                  Anagrafica completa con contratti CCNL, scadenze, documenti personali e accesso diretto al manuale operativo personalizzato per ruolo.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Scadenze & Compliance</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dashboard unificata con tutte le scadenze HR (visite mediche, formazione) e quelle documentali (revisioni manuale, aggiornamenti normativi).
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Manuale Operativo Digitale</h3>
                <p className="text-gray-600 leading-relaxed">
                  Biblioteca di procedure operative con ricerca full-text, versionamento storico e presa visione tracciata del personale con firma digitale.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Checklist Operative</h3>
                <p className="text-gray-600 leading-relaxed">
                  Checklist giornaliere, settimanali e mensili automatizzate per garantire che tutte le procedure operative vengano seguite correttamente.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Portale Consulente</h3>
                <p className="text-gray-600 leading-relaxed">
                  Accesso multi-cliente per consulenti del lavoro con export massivi, report aggregati e gestione centralizzata di più studi.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sicurezza GDPR & 81/08</h3>
                <p className="text-gray-600 leading-relaxed">
                  Gestione DVR, formazione obbligatoria, DPI, infortuni, whistleblowing D.Lgs 24/2023. Tutto conforme alla normativa italiana vigente.
                </p>
              </div>

              {/* Feature 7 - Organigramma */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Organigramma Visuale</h3>
                <p className="text-gray-600 leading-relaxed">
                  Visualizzazione e editing drag-and-drop dell&apos;organigramma aziendale con ruoli e linee gerarchiche per compliance Art. 2086 c.c.
                </p>
              </div>

              {/* Feature 8 - Mansionario */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mansionario Digitale</h3>
                <p className="text-gray-600 leading-relaxed">
                  Registro mansioni con competenze richieste per ogni ruolo, template preconfigurati per settore. Conforme assetti organizzativi.
                </p>
              </div>

              {/* Feature 9 - Risk Management */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Risk Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Matrice rischio/impatto, registro rischi con azioni di mitigazione e scadenze. Compliance assetti organizzativi Art. 2086.
                </p>
              </div>

              {/* Feature 10 - Dashboard Costi */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Dashboard Costi HR</h3>
                <p className="text-gray-600 leading-relaxed">
                  Analisi costi personale con proiezioni, breakdown per reparto e trend storici. Monitoraggio assetti contabili Art. 2086.
                </p>
              </div>

              {/* Feature 11 - Disciplinare */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Disciplinare Art. 7</h3>
                <p className="text-gray-600 leading-relaxed">
                  Workflow procedimenti disciplinari con timer 5 giorni, conforme Statuto Lavoratori. Tracking completo e documentazione legale.
                </p>
              </div>

              {/* Feature 12 - Whistleblowing */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Whistleblowing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Canale segnalazioni anonime conforme D.Lgs 24/2023, tracking e gestione. Protezione del segnalante e conformità normativa totale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Ready Section - NEW */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border-2 border-indigo-300 px-6 py-3 rounded-full text-sm font-black mb-6 shadow-lg">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="bg-gradient-to-r from-indigo-700 to-blue-700 bg-clip-text text-transparent">
                Art. 2086 c.c.
              </span>
            </div>

            {/* H2 */}
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Compliance Ready per l&apos;Art. 2086
            </h2>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
              Tutti i dati HR necessari per la compliance Art. 2086 c.c., connessi automaticamente al <strong>Cruscotto Imperium</strong>
            </p>

            {/* Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <span className="bg-white text-indigo-700 px-5 py-2.5 rounded-full font-bold text-sm shadow-md border border-indigo-200">
                Organigramma
              </span>
              <span className="bg-white text-indigo-700 px-5 py-2.5 rounded-full font-bold text-sm shadow-md border border-indigo-200">
                Mansionario
              </span>
              <span className="bg-white text-indigo-700 px-5 py-2.5 rounded-full font-bold text-sm shadow-md border border-indigo-200">
                Risk Management
              </span>
              <span className="bg-white text-indigo-700 px-5 py-2.5 rounded-full font-bold text-sm shadow-md border border-indigo-200">
                Costi HR
              </span>
              <span className="bg-white text-indigo-700 px-5 py-2.5 rounded-full font-bold text-sm shadow-md border border-indigo-200">
                Sicurezza Normativa
              </span>
            </div>

            {/* Small text */}
            <p className="text-base text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              I dati GeniusHR alimentano automaticamente <strong>5 delle 13 aree</strong> monitorate dai Tribunali per la compliance agli assetti organizzativi, amministrativi e contabili adeguati.
            </p>

            {/* CTA */}
            <a
              href="https://imperium.it"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              Scopri il Cruscotto Compliance
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">
                Inizia in 3 Semplici Passi
              </h2>
              <p className="text-xl text-gray-600">
                Configurazione rapida, risultati immediati
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white text-3xl font-black shadow-xl">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Registrati e Configura</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Crea l&apos;account in 2 minuti. Inserisci i dati dello studio e personalizza le impostazioni base. Nessuna carta di credito richiesta.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white text-3xl font-black shadow-xl">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Importa Dipendenti & Attiva Manuale</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Carica i dipendenti da Excel o inseriscili manualmente. Attiva il manuale operativo con le procedure specifiche per il tuo settore.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white text-3xl font-black shadow-xl">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Gestisci Tutto dalla Dashboard</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Scadenze, documenti, formazione, checklist: tutto sotto controllo da un&apos;unica dashboard intuitiva e potente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">
                Inizia Gratis, Cresci Quando Vuoi
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Piano Free per sempre. Upgrade solo quando le funzionalità avanzate diventano necessarie per la tua crescita.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {/* Free Plan */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl border-2 border-gray-300 shadow-lg hover:shadow-xl transition-all">
                <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  GRATIS PER SEMPRE
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                <p className="text-gray-600 mb-6 text-sm">Per iniziare</p>
                <div className="mb-8">
                  <span className="text-5xl font-black text-gray-900">€0</span>
                  <span className="text-gray-600 text-lg">/sempre</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Fino a 3 dipendenti</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Anagrafica base</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Ferie e permessi</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Dashboard base</span>
                  </li>
                </ul>
                <Link
                  href="/register?plan=free"
                  className="block w-full text-center bg-green-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-green-700 transition-colors"
                >
                  Registrati Gratis
                </Link>
              </div>

              {/* Starter Plan */}
              <div className="bg-white p-8 rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-gray-600 mb-6 text-sm">Per piccoli studi</p>
                <div className="mb-8">
                  <span className="text-5xl font-black text-gray-900">€29</span>
                  <span className="text-gray-600 text-lg">/mese</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Fino a 10 dipendenti</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Buste paga digitali</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Gestione scadenze</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Supporto email</span>
                  </li>
                </ul>
                <Link
                  href="/register?plan=starter"
                  className="block w-full text-center bg-gray-100 text-gray-900 px-6 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Scegli Starter
                </Link>
              </div>

              {/* Professional Plan - MOST POPULAR */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl shadow-2xl relative transform lg:scale-105 border-4 border-blue-500">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-full text-sm font-black shadow-lg">
                  PIÙ POPOLARE
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
                <p className="text-blue-100 mb-6 text-sm">Per studi in crescita</p>
                <div className="mb-8">
                  <span className="text-5xl font-black text-white">€79</span>
                  <span className="text-blue-100 text-lg">/mese</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-white">
                    <svg className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Fino a 20 dipendenti</span>
                  </li>
                  <li className="flex items-start gap-3 text-white">
                    <svg className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Tutto di Starter +</span>
                  </li>
                  <li className="flex items-start gap-3 text-white">
                    <svg className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Manuale Operativo base</span>
                  </li>
                  <li className="flex items-start gap-3 text-white">
                    <svg className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Onboarding + Sicurezza 81/08</span>
                  </li>
                  <li className="flex items-start gap-3 text-white">
                    <svg className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Supporto prioritario</span>
                  </li>
                </ul>
                <Link
                  href="/register?plan=professional"
                  className="block w-full text-center bg-white text-blue-700 px-6 py-4 rounded-xl font-black hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Scegli Professional
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-white p-8 rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6 text-sm">Per grandi organizzazioni</p>
                <div className="mb-8">
                  <span className="text-5xl font-black text-gray-900">€149</span>
                  <span className="text-gray-600 text-lg">/mese</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Dipendenti illimitati</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Tutto di Professional +</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Manuale completo + ISO 9001</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Multi-sede</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Account manager dedicato</span>
                  </li>
                </ul>
                <Link
                  href="/register?plan=enterprise"
                  className="block w-full text-center bg-gray-100 text-gray-900 px-6 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Scegli Enterprise
                </Link>
              </div>

              {/* Partner Plan */}
              <div className="bg-white p-8 rounded-3xl border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Partner</h3>
                <p className="text-gray-600 mb-6 text-sm">Per consulenti</p>
                <div className="mb-8">
                  <span className="text-5xl font-black text-gray-900">€199</span>
                  <span className="text-gray-600 text-lg">/mese</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Tutto di Enterprise +</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">White-label completo</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">API per integrazione</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Portale multi-cliente</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Export massivi</span>
                  </li>
                </ul>
                <Link
                  href="/register?plan=partner"
                  className="block w-full text-center bg-purple-100 text-purple-900 px-6 py-4 rounded-xl font-bold hover:bg-purple-200 transition-colors"
                >
                  Contattaci
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">
                Cosa Dicono i Nostri Clienti
              </h2>
              <p className="text-xl text-gray-600">
                Studi come il tuo hanno già scelto GeniusHR
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed italic">
                  &quot;Finalmente riesco a gestire le scadenze della formazione sicurezza senza fogli Excel. Il manuale operativo digitale ci ha fatto risparmiare ore di lavoro ed è stato decisivo per l&apos;accreditamento ISO.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">MR</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Dr. Marco Rossi</div>
                    <div className="text-sm text-gray-600">Studio Dentistico Rossi, Milano</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed italic">
                  &quot;L&apos;onboarding dei nuovi dipendenti era un incubo. Ora con la checklist automatica e le procedure del manuale da far firmare non dimentico più nulla. Risparmio almeno 5 ore ogni settimana.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">LB</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Laura Bianchi</div>
                    <div className="text-sm text-gray-600">Office Manager, Poliambulatorio Verdi, Roma</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed italic">
                  &quot;Gestisco 8 clienti tramite il portale consulente. Export massivi per i cedolini, report aggregati e manuale personalizzato per ognuno. Il supporto è eccezionale, rispondono in poche ore.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">GV</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Giuseppe Verdi</div>
                    <div className="text-sm text-gray-600">Consulente del Lavoro, Napoli</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">
                Domande Frequenti
              </h2>
              <p className="text-xl text-gray-600">
                Tutto quello che devi sapere su GeniusHR
              </p>
            </div>

            <div className="space-y-4">
              <details className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                <summary className="cursor-pointer p-6 font-bold text-lg text-gray-900 flex justify-between items-center">
                  Cos&apos;è GeniusHR esattamente?
                  <svg className="w-5 h-5 text-blue-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  GeniusHR è una piattaforma SaaS con due anime: <strong>gestione HR completa</strong> (dipendenti, ferie, buste paga, formazione, sicurezza 81/08) e <strong>manuale operativo digitale</strong> con validità legale per certificazioni ISO 9001 e accreditamenti sanitari.
                </div>
              </details>

              <details className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                <summary className="cursor-pointer p-6 font-bold text-lg text-gray-900 flex justify-between items-center">
                  Il manuale operativo ha validità legale?
                  <svg className="w-5 h-5 text-blue-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  Sì. Il sistema di <strong>versionamento documenti</strong>, <strong>firme digitali del personale</strong> con tracking presa visione e <strong>storico completo delle revisioni</strong> garantisce la validità legale per certificazioni ISO 9001, accreditamenti sanitari e audit interni.
                </div>
              </details>

              <details className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                <summary className="cursor-pointer p-6 font-bold text-lg text-gray-900 flex justify-between items-center">
                  È adatto a studi dentistici e medici?
                  <svg className="w-5 h-5 text-blue-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  Assolutamente sì. GeniusHR è progettato specificamente per studi dentistici, medici e professionali italiani con funzionalità dedicate per <strong>compliance GDPR</strong>, <strong>D.Lgs 81/08</strong>, <strong>whistleblowing 24/2023</strong> e normative sanitarie.
                </div>
              </details>

              <details className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                <summary className="cursor-pointer p-6 font-bold text-lg text-gray-900 flex justify-between items-center">
                  Posso importare i dipendenti che ho già?
                  <svg className="w-5 h-5 text-blue-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  Sì, puoi <strong>importare da Excel</strong> tutta l&apos;anagrafica dipendenti in pochi click. Il sistema ti guida con un template predefinito e valida i dati durante l&apos;import. Puoi anche inserire manualmente uno alla volta.
                </div>
              </details>

              <details className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                <summary className="cursor-pointer p-6 font-bold text-lg text-gray-900 flex justify-between items-center">
                  Quanto costa? Ci sono costi nascosti?
                  <svg className="w-5 h-5 text-blue-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  Piano <strong>Free per sempre</strong> (3 dipendenti, funzioni base), poi upgrade quando serve: <strong>Starter €29/mese</strong> (10 dipendenti), <strong>Professional €79/mese</strong> (20 dipendenti, Manuale incluso), <strong>Enterprise €149/mese</strong> (illimitati), <strong>Partner €199/mese</strong> (white-label + API). Nessun costo nascosto, cancel quando vuoi.
                </div>
              </details>

              <details className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                <summary className="cursor-pointer p-6 font-bold text-lg text-gray-900 flex justify-between items-center">
                  Come funziona il piano gratuito?
                  <svg className="w-5 h-5 text-blue-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  Il piano <strong>Free è gratis per sempre</strong> con fino a 3 dipendenti e funzioni base. <strong>Non serve carta di credito</strong>. Fai upgrade quando le funzionalità avanzate diventano necessarie. Downgrade a Free sempre possibile. Zero rischio.
                </div>
              </details>

              <details className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                <summary className="cursor-pointer p-6 font-bold text-lg text-gray-900 flex justify-between items-center">
                  I miei dati sono al sicuro?
                  <svg className="w-5 h-5 text-blue-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  Assolutamente sì. Hosting in <strong>EU</strong>, database <strong>crittografati</strong>, backup giornalieri automatici, <strong>conformità GDPR totale</strong> con DPO dedicato, audit log completo. I tuoi dati non vengono mai condivisi con terze parti.
                </div>
              </details>

              <details className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                <summary className="cursor-pointer p-6 font-bold text-lg text-gray-900 flex justify-between items-center">
                  Serve formazione per il personale?
                  <svg className="w-5 h-5 text-blue-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                  No, GeniusHR è <strong>estremamente intuitivo</strong>. Il personale può consultare buste paga, chiedere ferie, firmare documenti senza formazione. Forniamo <strong>video tutorial</strong> per ogni funzione e supporto via email/chat.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
              Pronto a Gestire HR e Manuali<br className="hidden sm:block" />
              in un&apos;Unica Piattaforma?
            </h2>
            <p className="text-xl sm:text-2xl text-blue-100 mb-10 leading-relaxed">
              Unisciti a centinaia di studi che hanno già scelto GeniusHR.
              <br />
              Inizia gratis oggi. Nessuna carta di credito richiesta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="group bg-white text-blue-700 px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
              >
                Registrati Gratis
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="mailto:info@geniushr.it"
                className="bg-transparent text-white px-10 py-5 rounded-2xl font-black text-lg border-2 border-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Parla con un Esperto
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              {/* Column 1 - Brand */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                  <span className="text-xl font-bold text-white">GeniusHR</span>
                </div>
                <p className="text-sm leading-relaxed mb-4">
                  La soluzione HR completa per studi professionali italiani.
                  Conforme GDPR e normativa del lavoro.
                </p>
                <div className="flex items-center gap-4">
                  <a href="https://twitter.com/geniushr" className="hover:text-white transition-colors" aria-label="Twitter">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="https://linkedin.com/company/geniushr" className="hover:text-white transition-colors" aria-label="LinkedIn">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Column 2 - Prodotto */}
              <div>
                <h4 className="text-white font-bold mb-4 text-lg">Prodotto</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#anime" className="hover:text-white transition-colors">Funzionalità</a></li>
                  <li><a href="#pricing" className="hover:text-white transition-colors">Prezzi</a></li>
                  <li><Link href="/login" className="hover:text-white transition-colors">Accedi</Link></li>
                  <li><Link href="/register" className="hover:text-white transition-colors">Registrati</Link></li>
                  <li><a href="#demo" className="hover:text-white transition-colors">Demo</a></li>
                </ul>
              </div>

              {/* Column 3 - HR */}
              <div>
                <h4 className="text-white font-bold mb-4 text-lg">Gestione HR</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="/employees" className="hover:text-white transition-colors">Dipendenti</a></li>
                  <li><a href="/leaves" className="hover:text-white transition-colors">Ferie e Permessi</a></li>
                  <li><a href="/payslips" className="hover:text-white transition-colors">Buste Paga</a></li>
                  <li><a href="/onboarding" className="hover:text-white transition-colors">Onboarding</a></li>
                  <li><a href="/safety" className="hover:text-white transition-colors">Sicurezza 81/08</a></li>
                </ul>
              </div>

              {/* Column 4 - Manuale */}
              <div>
                <h4 className="text-white font-bold mb-4 text-lg">Manuale Operativo</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="/tutorials" className="hover:text-white transition-colors">Biblioteca Procedure</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Checklist Operative</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Firme Digitali</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Versionamento</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">ISO 9001</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Row - Legal */}
            <div className="border-t border-gray-800 pt-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-white font-bold mb-4 text-lg">Legale</h4>
                  <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="hover:text-white transition-colors">Termini di Servizio</Link></li>
                    <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                    <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
                  </ul>
                </div>
                <div className="text-sm md:text-right">
                  <p className="mb-2">
                    © 2026 GeniusHR. Tutti i diritti riservati.
                  </p>
                  <p className="text-gray-500">
                    P.IVA 12345678901
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="pt-8 border-t border-gray-800">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <strong className="text-gray-400">Disclaimer:</strong> GeniusHR fornisce template, strumenti digitali e sistemi per la gestione delle risorse umane e della documentazione operativa.
                  I contenuti pubblicati sulla piattaforma <strong>NON costituiscono consulenza legale, fiscale o del lavoro</strong>.
                  Per questioni specifiche relative a contrattualistica, adempimenti fiscali, normativa del lavoro, D.Lgs 81/08 o certificazioni ISO,
                  consultare sempre un avvocato, commercialista o consulente del lavoro abilitato.
                  GeniusHR non si assume responsabilità per l&apos;uso improprio dei contenuti o per eventuali sanzioni derivanti da non conformità normative.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
