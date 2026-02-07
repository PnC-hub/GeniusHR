'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageInfoTooltip from '@/components/PageInfoTooltip'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  lastLogin: string | null
  createdAt: string
}

const roleLabels: Record<string, string> = {
  ADMIN: 'Amministratore',
  MANAGER: 'Manager',
  HR: 'HR',
  EMPLOYEE: 'Dipendente',
}

const roleColors: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  MANAGER: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  HR: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  EMPLOYEE: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

export default function SettingsUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('EMPLOYEE')
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchUsers()
    }
  }, [status, router])

  async function fetchUsers() {
    try {
      const res = await fetch('/api/settings/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (err) {
      setError('Errore nel caricamento utenti')
    } finally {
      setLoading(false)
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    try {
      setInviting(true)
      setError('')

      const res = await fetch('/api/settings/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Errore invito')
      }

      setShowInviteModal(false)
      setInviteEmail('')
      setInviteRole('EMPLOYEE')
      fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    } finally {
      setInviting(false)
    }
  }

  async function handleDeactivate(userId: string) {
    if (!confirm('Sei sicuro di voler disattivare questo utente?')) return

    try {
      const res = await fetch(`/api/settings/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'INACTIVE' }),
      })

      if (!res.ok) throw new Error('Errore disattivazione')
      fetchUsers()
    } catch (err) {
      setError('Errore nella disattivazione')
    }
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'short',
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/settings" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← Torna alle impostazioni
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gestione Utenti
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Invita utenti e gestisci i permessi di accesso
              </p>
            </div>
            <PageInfoTooltip
              title="Gestione Utenti"
              description="Aggiungi nuovi utenti, modifica i ruoli e gestisci gli accessi alla piattaforma"
              tips={[
                "Gli Amministratori hanno accesso completo",
                "I Manager possono gestire il proprio team",
                "HR puo gestire tutti i dipendenti",
              ]}
            />
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            + Invita Utente
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-gray-200 dark:border-zinc-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Totale Utenti</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Attivi</p>
          <p className="text-3xl font-bold text-green-600">
            {users.filter(u => u.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">In Attesa</p>
          <p className="text-3xl font-bold text-yellow-600">
            {users.filter(u => u.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-red-200 dark:border-red-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Amministratori</p>
          <p className="text-3xl font-bold text-red-600">
            {users.filter(u => u.role === 'ADMIN').length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Utente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Ruolo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Stato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Ultimo Accesso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nessun utente trovato
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-750">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.name || 'Nome non impostato'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${roleColors[user.role] || 'bg-gray-100 text-gray-700'}`}>
                        {roleLabels[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        user.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : user.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {user.status === 'ACTIVE' ? 'Attivo' : user.status === 'PENDING' ? 'In attesa' : 'Disattivato'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Mai'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/settings/users/${user.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Modifica
                        </Link>
                        {user.status === 'ACTIVE' && user.email !== session?.user?.email && (
                          <button
                            onClick={() => handleDeactivate(user.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Disattiva
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Invita Nuovo Utente
            </h2>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                  placeholder="email@esempio.it"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ruolo
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                >
                  <option value="EMPLOYEE">Dipendente</option>
                  <option value="HR">HR</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Amministratore</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {inviting ? 'Invio...' : 'Invia Invito'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
