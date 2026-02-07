'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface Subscription {
  plan: string
  status: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

interface Invoice {
  id: string
  number: string
  amount: number
  status: string
  date: string
  pdfUrl: string | null
}

const planLabels: Record<string, string> = {
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
  partner: 'Partner',
}

const planPrices: Record<string, number> = {
  starter: 29,
  professional: 79,
  enterprise: 149,
  partner: 199,
}

const planFeatures: Record<string, string[]> = {
  starter: ['3 utenti', 'Moduli base', 'Email support'],
  professional: ['10 utenti', 'Tutti i moduli', 'Priority support', 'Report avanzati'],
  enterprise: ['Utenti illimitati', 'API access', 'Supporto dedicato', 'SLA garantito'],
  partner: ['Multi-azienda', 'White-label', 'Formazione inclusa', 'Account manager'],
}

export default function SettingsBillingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchBillingData()
    }
  }, [status, router])

  async function fetchBillingData() {
    try {
      const [subRes, invRes] = await Promise.all([
        fetch('/api/settings/billing/subscription'),
        fetch('/api/settings/billing/invoices'),
      ])

      if (subRes.ok) {
        const data = await subRes.json()
        setSubscription(data)
      }

      if (invRes.ok) {
        const data = await invRes.json()
        setInvoices(data)
      }
    } catch (err) {
      console.error('Error fetching billing:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleManageSubscription() {
    try {
      setProcessing(true)
      const res = await fetch('/api/settings/billing/portal', {
        method: 'POST',
      })

      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        }
      } else {
        throw new Error('Errore apertura portale')
      }
    } catch (err) {
      setError('Errore nel caricamento del portale di fatturazione')
    } finally {
      setProcessing(false)
    }
  }

  async function handleUpgrade(plan: string) {
    try {
      setProcessing(true)
      const res = await fetch('/api/settings/billing/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        }
      } else {
        throw new Error('Errore upgrade')
      }
    } catch (err) {
      setError('Errore nel processo di upgrade')
    } finally {
      setProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  if (status === 'loading' || loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
      </div>
    )
  }

  const currentPlan = subscription?.plan || 'professional'

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/settings" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← Torna alle impostazioni
        </Link>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Abbonamento e Fatturazione
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestisci il tuo piano e visualizza le fatture
            </p>
          </div>
          <PageInfoTooltip
            title="Fatturazione"
            description="Visualizza il tuo piano attuale, effettua upgrade e scarica le fatture"
            tips={[
              "Il cambio piano e immediato",
              "Le fatture sono disponibili in formato PDF",
              "Puoi annullare in qualsiasi momento",
            ]}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Current Plan */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Piano Attuale
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-blue-600">
                {planLabels[currentPlan] || currentPlan}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                {subscription?.status === 'active' ? 'Attivo' : 'Trial'}
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {formatCurrency(planPrices[currentPlan] || 79)}/mese
            </p>
            {subscription?.currentPeriodEnd && (
              <p className="text-sm text-gray-500 mt-1">
                Prossimo rinnovo: {formatDate(subscription.currentPeriodEnd)}
              </p>
            )}
          </div>
          <button
            onClick={handleManageSubscription}
            disabled={processing}
            className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50"
          >
            {processing ? 'Caricamento...' : 'Gestisci Abbonamento'}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-zinc-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Funzionalita incluse:
          </h3>
          <ul className="grid grid-cols-2 gap-2">
            {(planFeatures[currentPlan] || []).map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-green-500">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Available Plans */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Piani Disponibili
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(planLabels).map(([key, label]) => (
            <div
              key={key}
              className={`bg-white dark:bg-zinc-800 rounded-xl border p-6 ${
                key === currentPlan
                  ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                  : 'border-gray-200 dark:border-zinc-700'
              }`}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">{label}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {formatCurrency(planPrices[key])}
                <span className="text-sm font-normal text-gray-500">/mese</span>
              </p>
              <ul className="mt-4 space-y-2">
                {(planFeatures[key] || []).map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(key)}
                disabled={key === currentPlan || processing}
                className={`w-full mt-4 px-4 py-2 rounded-lg font-medium ${
                  key === currentPlan
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-zinc-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {key === currentPlan ? 'Piano Attuale' : 'Passa a questo piano'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Storico Fatture
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Numero
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Importo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Stato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nessuna fattura disponibile
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-zinc-750">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {invoice.number}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {invoice.status === 'paid' ? 'Pagata' : invoice.status === 'pending' ? 'In attesa' : 'Non pagata'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {invoice.pdfUrl && (
                        <a
                          href={invoice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Scarica PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
