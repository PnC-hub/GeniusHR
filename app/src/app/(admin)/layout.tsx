import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  const menuItems = [
    { href: '/admin', icon: '🏠', label: 'Dashboard' },
    { href: '/admin/tenants', icon: '🏢', label: 'Clienti' },
    { href: '/admin/subscriptions', icon: '💳', label: 'Abbonamenti' },
    { href: '/admin/invoices', icon: '🧾', label: 'Fatture' },
    { href: '/admin/analytics', icon: '📊', label: 'Analytics' },
    { href: '/admin/settings', icon: '⚙️', label: 'Impostazioni' }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-30">
        <div className="p-6">
          <Link href="/admin" className="text-2xl font-bold">
            <span className="text-blue-400">Genius</span>
            <span className="text-green-400">HR</span>
            <span className="text-xs text-gray-400 ml-2">ADMIN</span>
          </Link>
        </div>

        <nav className="px-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg mb-1 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Back to normal dashboard */}
        <div className="absolute bottom-20 left-0 right-0 px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span>←</span>
            <span>Torna alla Dashboard</span>
          </Link>
        </div>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {session.user.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                Super Admin
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 bg-gray-100 min-h-screen">
        {/* Top bar */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <span className="text-red-400 font-semibold">SUPER ADMIN MODE</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">
                {new Date().toLocaleDateString('it-IT', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="min-h-[calc(100vh-65px)]">
          {children}
        </div>
      </main>
    </div>
  )
}
