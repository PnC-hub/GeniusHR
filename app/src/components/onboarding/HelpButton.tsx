'use client'

import { useState } from 'react'
import {
  HelpCircle,
  X,
  Users,
  Calendar,
  FileText,
  ClipboardCheck,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Banknote,
  BarChart3,
  Settings,
  ChevronRight
} from 'lucide-react'

interface HelpItem {
  icon: React.ElementType
  title: string
  description: string
  path: string
  color: string
}

const HELP_ITEMS: HelpItem[] = [
  {
    icon: BarChart3,
    title: 'Dashboard',
    description: 'Panoramica generale dello studio con KPI, scadenze e attività recenti.',
    path: '/dashboard',
    color: 'blue'
  },
  {
    icon: Users,
    title: 'Dipendenti',
    description: 'Gestisci anagrafica, contratti e documenti di tutti i collaboratori.',
    path: '/employees',
    color: 'blue'
  },
  {
    icon: Calendar,
    title: 'Ferie e Permessi',
    description: 'Approva richieste ferie, gestisci permessi e visualizza il calendario assenze.',
    path: '/leaves',
    color: 'green'
  },
  {
    icon: ClipboardCheck,
    title: 'Presenze',
    description: 'Monitora timbrature, ritardi, straordinari e genera report mensili.',
    path: '/attendance',
    color: 'purple'
  },
  {
    icon: Banknote,
    title: 'Cedolini',
    description: 'Carica e distribuisci le buste paga ai dipendenti.',
    path: '/payslips',
    color: 'emerald'
  },
  {
    icon: GraduationCap,
    title: 'Formazione',
    description: 'Pianifica corsi, traccia certificazioni e gestisci scadenze formative.',
    path: '/training',
    color: 'amber'
  },
  {
    icon: ShieldCheck,
    title: 'Sicurezza 81/08',
    description: 'DVR, visite mediche, DPI e tutto ciò che serve per la compliance.',
    path: '/safety',
    color: 'red'
  },
  {
    icon: BookOpen,
    title: 'Manuale Operativo',
    description: 'Procedure, protocolli e checklist dello studio. Il tuo know-how centralizzato.',
    path: '/manual',
    color: 'emerald'
  },
  {
    icon: FileText,
    title: 'Firme Digitali',
    description: 'Invia documenti da firmare e traccia lo stato delle firme.',
    path: '/signatures',
    color: 'indigo'
  },
  {
    icon: Settings,
    title: 'Impostazioni',
    description: 'Personalizza lo studio, gestisci il team e configura le integrazioni.',
    path: '/settings',
    color: 'gray'
  }
]

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false)

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
      red: { bg: 'bg-red-100', text: 'text-red-600' },
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-600' },
    }
    return colors[color] || colors.blue
  }

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        title="Guida e Aiuto"
      >
        <HelpCircle className="w-7 h-7" />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Serve aiuto?
        </span>
      </button>

      {/* Help Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Guida Rapida</h2>
                <p className="text-sm text-gray-500 mt-1">Scopri cosa puoi fare in ogni sezione</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-3">
                {HELP_ITEMS.map((item) => {
                  const colors = getColorClasses(item.color)
                  const Icon = item.icon

                  return (
                    <a
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Hai bisogno di supporto?
                </p>
                <a
                  href="mailto:supporto@ordinia.it"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Contattaci →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
