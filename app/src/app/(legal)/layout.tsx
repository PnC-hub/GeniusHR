import Link from 'next/link'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-white">
            Ordinia
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">{children}</main>

      {/* Footer with legal links */}
      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <nav className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white">
              Termini di Servizio
            </Link>
            <Link href="/cookies" className="hover:text-zinc-900 dark:hover:text-white">
              Cookie Policy
            </Link>
          </nav>
          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
            Ordinia - Gestione HR per Studi Odontoiatrici
          </p>
        </div>
      </footer>
    </div>
  )
}
