'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const COOKIE_CONSENT_KEY = 'cookie-consent'

type ConsentState = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if consent was already given
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!savedConsent) {
      setShowBanner(true)
    } else {
      try {
        const parsed = JSON.parse(savedConsent)
        setConsent(parsed)
      } catch {
        setShowBanner(true)
      }
    }
  }, [])

  const saveConsent = async (newConsent: ConsentState) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent))
    setConsent(newConsent)
    setShowBanner(false)

    // Optionally save to server for logged-in users
    try {
      const visitorId = localStorage.getItem('visitor-id') || crypto.randomUUID()
      localStorage.setItem('visitor-id', visitorId)

      await fetch('/api/cookies/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          ...newConsent,
        }),
      })
    } catch {
      // Silent fail - local storage is the source of truth
    }
  }

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true })
  }

  const acceptNecessary = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false })
  }

  const saveCustom = () => {
    saveConsent(consent)
  }

  if (!showBanner) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mx-auto max-w-4xl">
        {!showDetails ? (
          // Simple banner
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                Utilizziamo cookie tecnici necessari e, previo consenso, cookie analitici per
                migliorare la tua esperienza.{' '}
                <Link
                  href="/cookies"
                  className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Scopri di più
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowDetails(true)}
                className="rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Personalizza
              </button>
              <button
                onClick={acceptNecessary}
                className="rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Solo necessari
              </button>
              <button
                onClick={acceptAll}
                className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Accetta tutti
              </button>
            </div>
          </div>
        ) : (
          // Detailed preferences
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Preferenze Cookie
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                ← Indietro
              </button>
            </div>

            <div className="space-y-3">
              {/* Necessary - always on */}
              <div className="flex items-start justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Cookie Necessari</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Essenziali per il funzionamento del sito. Non possono essere disabilitati.
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-zinc-500">Sempre attivi</span>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Cookie Analitici</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Ci aiutano a capire come usi il sito per migliorarlo. Dati aggregati e anonimi.
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={consent.analytics}
                    onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-zinc-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-zinc-600"></div>
                </label>
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Cookie di Marketing</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Usati per mostrarti pubblicità pertinenti. Attualmente non utilizzati.
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={consent.marketing}
                    onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-zinc-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-zinc-600"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={acceptNecessary}
                className="rounded border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Rifiuta opzionali
              </button>
              <button
                onClick={saveCustom}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Salva preferenze
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
