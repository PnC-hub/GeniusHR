'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface DpiRecord {
  id: string
  name: string
  category: string | null
  expiresAt: string | null
  createdAt: string
  employee: {
    id: string
    firstName: string
    lastName: string
    department: string | null
    jobTitle: string | null
  }
}

export default function DpiPage() {
  const [dpiRecords, setDpiRecords] = useState<DpiRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchDpi() {
      try {
        const res = await fetch('/api/safety/dpi')
        if (!res.ok) throw new Error('Errore nel caricamento')
        const data = await res.json()
        setDpiRecords(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto')
      } finally {
        setLoading(false)
      }
    }
    fetchDpi()
  }, [])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
    }).format(new Date(dateStr))
  }

  const getDaysUntilExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return null
    const days = Math.floor((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  // Raggruppa per dipendente
  const dpiByEmployee = dpiRecords.reduce((acc, dpi) => {
    const empId = dpi.employee.id
    if (!acc[empId]) {
      acc[empId] = {
        employee: dpi.employee,
        items: []
      }
    }
    acc[empId].items.push(dpi)
    return acc
  }, {} as Record<string, { employee: any; items: DpiRecord[] }>)

  const employeeList = Object.values(dpiByEmployee)

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <Link href="/safety" className="hover:text-blue-600">Sicurezza</Link>
              <span>/</span>
              <span>DPI</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              DPI - Dispositivi di Protezione Individuale
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Verbali consegna e scadenze dispositivi
            </p>
          </div>
          <PageInfoTooltip
            title="Gestione DPI"
            description="Traccia la consegna dei Dispositivi di Protezione Individuale obbligatori: scarpe antinfortunistiche, guanti, occhiali, mascherine, camici. Gestisci le scadenze e i rinnovi."
            tips={[
              'Scarpe antinfortunistiche: rinnovo ogni 12-18 mesi',
              'Guanti: rinnovo variabile in base a tipo e usura',
              'Occhiali di protezione: verifica integrità ogni 6 mesi',
              'Dispositivi medici: segui date scadenza produttore',
              'Conserva sempre il verbale firmato dal dipendente'
            ]}
          />
        </div>
        <Link
          href="/safety/dpi/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nuovo Verbale
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-gray-200 dark:border-zinc-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Dipendenti con DPI</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {employeeList.length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-gray-200 dark:border-zinc-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Totale Dispositivi</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {dpiRecords.length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-gray-200 dark:border-zinc-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">In scadenza (90gg)</p>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {dpiRecords.filter(d => {
              const days = getDaysUntilExpiry(d.expiresAt)
              return days !== null && days > 0 && days <= 90
            }).length}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Caricamento...</div>
      ) : employeeList.length === 0 ? (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-12 text-center">
          <div className="text-6xl mb-4">🦺</div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Nessun verbale DPI registrato
          </p>
          <Link
            href="/safety/dpi/new"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crea primo verbale
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {employeeList.map(({ employee, items }) => (
            <div
              key={employee.id}
              className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden"
            >
              <div className="bg-gray-50 dark:bg-zinc-900 px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {employee.jobTitle || employee.department || '-'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {items.length} dispositiv{items.length === 1 ? 'o' : 'i'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-zinc-700">
                {items.map((dpi) => {
                  const daysUntilExpiry = getDaysUntilExpiry(dpi.expiresAt)
                  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry < 90 && daysUntilExpiry > 0
                  const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0

                  return (
                    <div key={dpi.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <span className="text-green-600 dark:text-green-400 text-xl">🦺</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {dpi.name}
                            </p>
                            {dpi.category && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {dpi.category}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Consegnato il
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {formatDate(dpi.createdAt)}
                          </p>
                        </div>

                        {dpi.expiresAt && (
                          <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Scadenza
                            </p>
                            <p className={`text-sm font-medium ${
                              isExpired ? 'text-red-600 dark:text-red-400' :
                              isExpiringSoon ? 'text-amber-600 dark:text-amber-400' :
                              'text-gray-700 dark:text-gray-300'
                            }`}>
                              {formatDate(dpi.expiresAt)}
                              {isExpiringSoon && ` (${daysUntilExpiry}gg)`}
                              {isExpired && ' (scaduto)'}
                            </p>
                          </div>
                        )}

                        {isExpiringSoon && (
                          <span className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 rounded">
                            In scadenza
                          </span>
                        )}
                        {isExpired && (
                          <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded">
                            Scaduto
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
