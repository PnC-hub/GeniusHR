'use client'

import Link from 'next/link'

export function DisclaimerBanner() {
  return (
    <div className="border-t border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-3 text-center text-xs text-zinc-600 dark:text-zinc-400">
        <p>
          Ordinia fornisce strumenti e template per la gestione HR.{' '}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            I contenuti NON costituiscono consulenza legale professionale.
          </span>{' '}
          Consultare sempre un avvocato/commercialista per questioni specifiche.
        </p>
        <div className="mt-2 flex items-center justify-center gap-4">
          <Link
            href="/privacy"
            className="text-zinc-700 underline hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-zinc-700 underline hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Termini
          </Link>
          <Link
            href="/cookies"
            className="text-zinc-700 underline hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Cookie
          </Link>
        </div>
      </div>
    </div>
  )
}
