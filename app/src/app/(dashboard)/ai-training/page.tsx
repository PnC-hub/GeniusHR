'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MessageSquare,
  BookOpen,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { TrainingStats } from '@/components/training/TrainingStats';
import PageInfoTooltip from '@/components/PageInfoTooltip';

interface QuickStat {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  href: string;
}

interface RecentActivity {
  id: string;
  type: 'conversation' | 'rule' | 'correction';
  title: string;
  description: string;
  createdAt: string;
  module: string;
}

export default function AITrainingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/training/stats?period=30d');
      if (!response.ok) throw new Error('Errore caricamento dati');
      const data = await response.json();

      setQuickStats([
        {
          label: 'Conversazioni',
          value: data.conversations?.total || 0,
          icon: MessageSquare,
          color: 'bg-blue-500',
          href: '/ai-training/conversations'
        },
        {
          label: 'Regole Apprese',
          value: data.rules?.active || 0,
          icon: BookOpen,
          color: 'bg-violet-500',
          href: '/ai-training/rules'
        },
        {
          label: 'Correzioni Applicate',
          value: data.corrections?.applied || 0,
          icon: CheckCircle,
          color: 'bg-green-500',
          href: '/ai-training/conversations'
        },
        {
          label: 'Learning Score',
          value: data.learningScore || 0,
          icon: TrendingUp,
          color: 'bg-amber-500',
          href: '/ai-training'
        }
      ]);

      // Fetch recent conversations for activity
      const convResponse = await fetch('/api/training/conversations?limit=5');
      if (convResponse.ok) {
        const convData = await convResponse.json();
        const activities: RecentActivity[] = (convData.conversations || []).map((conv: any) => ({
          id: conv.id,
          type: 'conversation' as const,
          title: conv.title || 'Conversazione senza titolo',
          description: `${conv._count?.messages || 0} messaggi`,
          createdAt: conv.createdAt,
          module: conv.context || 'generale'
        }));
        setRecentActivity(activities);
      }
    } catch (err: any) {
      setError(err.message || 'Errore imprevisto');
    } finally {
      setIsLoading(false);
    }
  };

  const getModuleLabel = (module: string) => {
    const labels: Record<string, string> = {
      attendance: 'Presenze',
      payslip: 'Cedolini',
      safety: 'Sicurezza',
      onboarding: 'Onboarding',
      leaves: 'Ferie',
      expenses: 'Note Spese',
      disciplinary: 'Disciplinare',
      generale: 'Generale'
    };
    return labels[module] || module;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Training</h1>
            <p className="text-gray-500 text-sm">
              Addestra l'intelligenza artificiale per il tuo business
            </p>
          </div>
          <PageInfoTooltip
            title="AI Training"
            description="Sistema di apprendimento automatico che impara dalle tue correzioni per migliorare suggerimenti e automazioni nel tempo."
            tips={[
              'Chat con l\'AI per correggere errori',
              'Regole apprese automaticamente',
              'Suggerimenti intelligenti basati sul contesto',
              'Statistiche di apprendimento'
            ]}
          />
        </div>
        <Link
          href="/ai-training/train"
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Inizia Training
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-white p-5 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.label === 'Learning Score' ? `${stat.value}/100` : stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics */}
        <div className="lg:col-span-2">
          <TrainingStats period="30d" />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Attività Recente</h3>
            <Link
              href="/ai-training/conversations"
              className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              Vedi tutte
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y max-h-[400px] overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/ai-training/conversations/${activity.id}`}
                  className="block px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-violet-100 rounded-lg mt-0.5">
                      <MessageSquare className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                          {getModuleLabel(activity.module)}
                        </span>
                        <span>{activity.description}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>Nessuna attività recente</p>
                <p className="text-sm mt-1">Inizia una conversazione per addestrare l'AI</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/ai-training/train"
          className="flex items-center gap-4 p-5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg text-white hover:from-violet-700 hover:to-purple-700 transition-colors"
        >
          <div className="p-3 bg-white/20 rounded-lg">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Inizia Training</h3>
            <p className="text-sm text-white/80">Chatta con l'AI per correggere errori</p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto" />
        </Link>

        <Link
          href="/ai-training/rules"
          className="flex items-center gap-4 p-5 bg-white border rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-3 bg-blue-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Regole AI</h3>
            <p className="text-sm text-gray-500">Visualizza le regole apprese</p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
        </Link>

        <Link
          href="/ai-training/conversations"
          className="flex items-center gap-4 p-5 bg-white border rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Storico</h3>
            <p className="text-sm text-gray-500">Conversazioni e correzioni</p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
        </Link>
      </div>
    </div>
  );
}
