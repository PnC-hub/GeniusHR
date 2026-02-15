'use client';

import { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  BookOpen,
  FileText,
  Calendar,
  DollarSign,
  Shield,
  UserPlus,
  AlertTriangle
} from 'lucide-react';
import { TrainingDrawer } from '@/components/training/TrainingDrawer';
import PageInfoTooltip from '@/components/PageInfoTooltip';

interface TrainingContext {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  examples: string[];
}

const trainingContexts: TrainingContext[] = [
  {
    id: 'attendance',
    name: 'Presenze',
    description: 'Addestra l\'AI sulla gestione delle presenze, orari, straordinari e anomalie',
    icon: Calendar,
    color: 'bg-blue-500',
    examples: [
      'Le ore di straordinario del sabato vanno sempre maggiorate',
      'I turni notturni partono dalle 22:00',
      'Il lavoro domenicale richiede autorizzazione'
    ]
  },
  {
    id: 'payslip',
    name: 'Cedolini',
    description: 'Addestra l\'AI sulla gestione dei cedolini e calcoli retributivi',
    icon: FileText,
    color: 'bg-green-500',
    examples: [
      'Il bonus produzione va calcolato sul lordo',
      'Le trattenute sindacali sono facoltative',
      'Il TFR si calcola mensilmente'
    ]
  },
  {
    id: 'leaves',
    name: 'Ferie e Permessi',
    description: 'Addestra l\'AI sulla gestione delle assenze e delle richieste',
    icon: Calendar,
    color: 'bg-amber-500',
    examples: [
      'Le ferie estive vanno richieste entro maggio',
      'I permessi ROL scadono a fine anno',
      'Il congedo parentale richiede preavviso'
    ]
  },
  {
    id: 'expenses',
    name: 'Note Spese',
    description: 'Addestra l\'AI sulla gestione delle spese e dei rimborsi',
    icon: DollarSign,
    color: 'bg-violet-500',
    examples: [
      'Le spese oltre 50€ richiedono scontrino',
      'Il rimborso km usa le tabelle ACI',
      'I pasti aziendali hanno un limite giornaliero'
    ]
  },
  {
    id: 'safety',
    name: 'Sicurezza 81/08',
    description: 'Addestra l\'AI sulla sicurezza sul lavoro e compliance',
    icon: Shield,
    color: 'bg-red-500',
    examples: [
      'La visita medica va rinnovata ogni 2 anni',
      'I DPI sono obbligatori in cantiere',
      'La formazione antincendio dura 4 ore'
    ]
  },
  {
    id: 'onboarding',
    name: 'Onboarding',
    description: 'Addestra l\'AI sul processo di inserimento nuovi dipendenti',
    icon: UserPlus,
    color: 'bg-cyan-500',
    examples: [
      'Il badge va consegnato il primo giorno',
      'La formazione iniziale dura 3 giorni',
      'I documenti vanno firmati entro la prima settimana'
    ]
  },
  {
    id: 'disciplinary',
    name: 'Disciplinare',
    description: 'Addestra l\'AI sulle procedure disciplinari e contestazioni',
    icon: AlertTriangle,
    color: 'bg-orange-500',
    examples: [
      'Il richiamo verbale precede quello scritto',
      'La contestazione va inviata entro 5 giorni',
      'Il dipendente ha diritto di replica'
    ]
  }
];

export default function TrainPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedContext, setSelectedContext] = useState<TrainingContext | null>(null);

  const handleContextSelect = (context: TrainingContext) => {
    setSelectedContext(context);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Interattivo</h1>
          <p className="text-gray-500 text-sm">
            Seleziona un'area per iniziare ad addestrare l'AI
          </p>
        </div>
        <PageInfoTooltip
          title="Training Interattivo"
          description="Qui puoi chattare con l'AI per correggere errori e insegnarle le regole specifiche del tuo business. Seleziona un'area tematica per iniziare."
          tips={[
            'Seleziona il contesto di training',
            'Chatta in linguaggio naturale',
            'L\'AI estrae automaticamente le regole',
            'Le correzioni migliorano i suggerimenti futuri'
          ]}
        />
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-violet-100 rounded-lg">
            <MessageSquare className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="font-medium text-violet-900">Come funziona il Training</h3>
            <p className="text-sm text-violet-700 mt-1">
              Descrivi un problema o un errore che hai riscontrato. L'AI analizzerà la tua descrizione,
              estrarrà la correzione e creerà automaticamente una regola per evitare errori simili in futuro.
            </p>
          </div>
        </div>
      </div>

      {/* Context Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainingContexts.map((context) => (
          <button
            key={context.id}
            onClick={() => handleContextSelect(context)}
            className="text-left bg-white rounded-lg border shadow-sm p-5 hover:shadow-md hover:border-violet-300 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${context.color}`}>
                <context.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
                  {context.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {context.description}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-400 mb-2">Esempi di correzioni:</p>
              <ul className="space-y-1">
                {context.examples.slice(0, 2).map((example, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                    <span className="text-violet-500 mt-0.5">•</span>
                    <span className="line-clamp-1">{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Start */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-violet-600" />
          Guida Rapida al Training
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Seleziona il Contesto</h3>
              <p className="text-sm text-gray-500 mt-1">
                Scegli l'area tematica relativa al problema che vuoi correggere
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Descrivi il Problema</h3>
              <p className="text-sm text-gray-500 mt-1">
                Spiega in linguaggio naturale cosa è sbagliato e come dovrebbe essere
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-medium text-gray-900">L'AI Impara</h3>
              <p className="text-sm text-gray-500 mt-1">
                L'AI estrae la regola e la applicherà automaticamente in futuro
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Training Drawer */}
      {selectedContext && (
        <TrainingDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedContext(null);
          }}
          context={selectedContext.id}
          title={`Training ${selectedContext.name}`}
        />
      )}
    </div>
  );
}
