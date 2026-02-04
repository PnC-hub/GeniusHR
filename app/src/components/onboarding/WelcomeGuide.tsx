'use client'

import { useState } from 'react'
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Users,
  FileText,
  Calendar,
  ClipboardCheck,
  GraduationCap,
  ShieldCheck,
  Settings,
  BookOpen,
  HelpCircle,
  Sparkles
} from 'lucide-react'

interface WelcomeGuideProps {
  userName?: string
  onClose: () => void
  onComplete: () => void
}

const TOUR_STEPS = [
  {
    id: 'welcome',
    title: 'Benvenuto in GeniusHR! 👋',
    description: 'Ti guideremo attraverso le funzionalità principali della piattaforma. Questa guida ti aiuterà a capire come gestire al meglio il tuo studio.',
    icon: Sparkles,
    color: 'blue'
  },
  {
    id: 'employees',
    title: 'Gestione Dipendenti',
    description: 'Qui puoi aggiungere, modificare e visualizzare tutti i tuoi dipendenti. Tieni traccia di contratti, documenti e informazioni personali.',
    icon: Users,
    color: 'blue',
    path: '/employees',
    tip: 'Clicca su "Dipendenti" nel menu a sinistra per iniziare'
  },
  {
    id: 'leaves',
    title: 'Ferie e Permessi',
    description: 'Gestisci le richieste di ferie e permessi. I dipendenti possono richiedere giorni liberi e tu puoi approvarli o rifiutarli.',
    icon: Calendar,
    color: 'green',
    path: '/leaves',
    tip: 'Trovi questa sezione sotto "Gestione HR" nel menu'
  },
  {
    id: 'attendance',
    title: 'Presenze e Timbrature',
    description: 'Monitora le presenze giornaliere, controlla ritardi e straordinari. Tutto in un unico posto.',
    icon: ClipboardCheck,
    color: 'purple',
    path: '/attendance',
    tip: 'Puoi vedere il riepilogo settimanale di ogni dipendente'
  },
  {
    id: 'training',
    title: 'Formazione',
    description: 'Gestisci i corsi di formazione obbligatori e facoltativi. Tieni traccia delle scadenze e delle certificazioni.',
    icon: GraduationCap,
    color: 'amber',
    path: '/training',
    tip: 'Importante per la compliance 81/08!'
  },
  {
    id: 'safety',
    title: 'Sicurezza 81/08',
    description: 'DVR, DPI, visite mediche e tutto ciò che serve per la sicurezza sul lavoro. Mai più scadenze dimenticate.',
    icon: ShieldCheck,
    color: 'red',
    path: '/safety',
    tip: 'Riceverai notifiche automatiche prima delle scadenze'
  },
  {
    id: 'manual',
    title: 'Manuale Operativo',
    description: 'Accedi al manuale operativo dello studio con procedure, protocolli e checklist. Tutto il know-how in un unico posto.',
    icon: BookOpen,
    color: 'emerald',
    path: '/manual',
    tip: 'Puoi anche creare nuovi articoli e checklist personalizzate'
  },
  {
    id: 'settings',
    title: 'Impostazioni',
    description: 'Personalizza GeniusHR per il tuo studio: logo, colori, team e integrazioni.',
    icon: Settings,
    color: 'gray',
    path: '/settings',
    tip: 'Aggiungi altri amministratori in "Gestione Team"'
  }
]

const QUICK_START_CHECKLIST = [
  { id: 'add-employee', label: 'Aggiungi il primo dipendente', path: '/employees', done: false },
  { id: 'setup-leaves', label: 'Configura le policy ferie', path: '/settings', done: false },
  { id: 'check-manual', label: 'Esplora il Manuale Operativo', path: '/manual', done: false },
  { id: 'safety-check', label: 'Verifica scadenze sicurezza', path: '/safety', done: false },
]

export default function WelcomeGuide({ userName, onClose, onComplete }: WelcomeGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showChecklist, setShowChecklist] = useState(false)
  const [checklist, setChecklist] = useState(QUICK_START_CHECKLIST)

  const step = TOUR_STEPS[currentStep]
  const isLastStep = currentStep === TOUR_STEPS.length - 1
  const isFirstStep = currentStep === 0

  const handleNext = () => {
    if (isLastStep) {
      setShowChecklist(true)
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (showChecklist) {
      setShowChecklist(false)
    } else if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    onComplete()
    onClose()
  }

  const handleCheckItem = (id: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    ))
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
      red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
    }
    return colors[color] || colors.blue
  }

  const colors = getColorClasses(step.color)
  const Icon = step.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: showChecklist ? '100%' : `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!showChecklist ? (
          /* Tour content */
          <div className="p-8 pt-10">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mb-6`}>
              <Icon className={`w-8 h-8 ${colors.text}`} />
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {step.title}
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {step.description}
            </p>

            {step.tip && (
              <div className={`p-4 rounded-xl ${colors.bg} ${colors.border} border`}>
                <div className="flex items-start gap-3">
                  <HelpCircle className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                  <p className={`text-sm ${colors.text} font-medium`}>
                    💡 {step.tip}
                  </p>
                </div>
              </div>
            )}

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mt-8 mb-6">
              {TOUR_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentStep
                      ? 'w-6 bg-blue-500'
                      : idx < currentStep
                        ? 'bg-blue-300'
                        : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={isFirstStep}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  isFirstStep
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Indietro
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {isLastStep ? 'Inizia!' : 'Avanti'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Checklist */
          <div className="p-8 pt-10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Pronti a partire! 🚀
            </h2>
            <p className="text-gray-600 mb-6">
              Ecco una checklist per iniziare. Puoi completarla quando vuoi.
            </p>

            <div className="space-y-3 mb-8">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    item.done
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => handleCheckItem(item.id)}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className={`flex-1 ${item.done ? 'text-emerald-700 line-through' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Rivedi tour
              </button>

              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                <Sparkles className="w-5 h-5" />
                Inizia a usare GeniusHR
              </button>
            </div>
          </div>
        )}

        {/* Skip link */}
        <div className="px-8 pb-6 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Salta la guida (puoi rivederla dalle impostazioni)
          </button>
        </div>
      </div>
    </div>
  )
}
