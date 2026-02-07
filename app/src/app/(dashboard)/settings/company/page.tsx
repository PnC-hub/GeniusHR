'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface CompanyData {
  name: string
  legalName: string
  vatNumber: string
  fiscalCode: string
  address: string
  city: string
  postalCode: string
  province: string
  country: string
  phone: string
  email: string
  pec: string
  website: string
  sdiCode: string
}

export default function SettingsCompanyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [company, setCompany] = useState<CompanyData>({
    name: '',
    legalName: '',
    vatNumber: '',
    fiscalCode: '',
    address: '',
    city: '',
    postalCode: '',
    province: '',
    country: 'Italia',
    phone: '',
    email: '',
    pec: '',
    website: '',
    sdiCode: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchCompanyData()
    }
  }, [status, router])

  async function fetchCompanyData() {
    try {
      const res = await fetch('/api/settings/company')
      if (res.ok) {
        const data = await res.json()
        if (data) {
          setCompany(prev => ({ ...prev, ...data }))
        }
      }
    } catch (err) {
      console.error('Error fetching company data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')

      const res = await fetch('/api/settings/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore nel salvataggio')
      }

      setSuccess('Dati aziendali salvati con successo!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    } finally {
      setSaving(false)
    }
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/settings" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← Torna alle impostazioni
        </Link>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dati Aziendali
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestisci le informazioni della tua azienda
            </p>
          </div>
          <PageInfoTooltip
            title="Dati Aziendali"
            description="Configura ragione sociale, P.IVA, indirizzo e contatti aziendali"
            tips={[
              "Il codice SDI e la PEC sono necessari per la fatturazione elettronica",
              "Questi dati appariranno nei documenti generati",
            ]}
          />
        </div>
      </div>

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg mb-6">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Dati Generali */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Dati Generali
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome Azienda
              </label>
              <input
                type="text"
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                placeholder="Nome visualizzato"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ragione Sociale
              </label>
              <input
                type="text"
                value={company.legalName}
                onChange={(e) => setCompany({ ...company, legalName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                placeholder="Ragione sociale completa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Partita IVA
              </label>
              <input
                type="text"
                value={company.vatNumber}
                onChange={(e) => setCompany({ ...company, vatNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                placeholder="IT12345678901"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Codice Fiscale
              </label>
              <input
                type="text"
                value={company.fiscalCode}
                onChange={(e) => setCompany({ ...company, fiscalCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                placeholder="Codice fiscale azienda"
              />
            </div>
          </div>
        </div>

        {/* Indirizzo */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sede Legale
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Indirizzo
              </label>
              <input
                type="text"
                value={company.address}
                onChange={(e) => setCompany({ ...company, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                placeholder="Via/Piazza e numero civico"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Citta
              </label>
              <input
                type="text"
                value={company.city}
                onChange={(e) => setCompany({ ...company, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CAP
                </label>
                <input
                  type="text"
                  value={company.postalCode}
                  onChange={(e) => setCompany({ ...company, postalCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Provincia
                </label>
                <input
                  type="text"
                  value={company.province}
                  onChange={(e) => setCompany({ ...company, province: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  maxLength={2}
                  placeholder="RM"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contatti */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contatti
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefono
              </label>
              <input
                type="tel"
                value={company.phone}
                onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={company.email}
                onChange={(e) => setCompany({ ...company, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                PEC
              </label>
              <input
                type="email"
                value={company.pec}
                onChange={(e) => setCompany({ ...company, pec: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                placeholder="azienda@pec.it"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sito Web
              </label>
              <input
                type="url"
                value={company.website}
                onChange={(e) => setCompany({ ...company, website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                placeholder="https://www.azienda.it"
              />
            </div>
          </div>
        </div>

        {/* Fatturazione Elettronica */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Fatturazione Elettronica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Codice SDI
              </label>
              <input
                type="text"
                value={company.sdiCode}
                onChange={(e) => setCompany({ ...company, sdiCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                maxLength={7}
                placeholder="XXXXXXX"
              />
              <p className="text-xs text-gray-500 mt-1">
                Codice destinatario per la ricezione delle fatture elettroniche
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/settings"
            className="px-6 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
          >
            Annulla
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Salvataggio...' : 'Salva Modifiche'}
          </button>
        </div>
      </form>
    </div>
  )
}
