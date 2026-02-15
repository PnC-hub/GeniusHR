'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  MessageSquare,
  CheckCircle,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface StatsData {
  period: string;
  conversations: {
    total: number;
    active: number;
    resolved: number;
    byModule: Record<string, number>;
  };
  messages: {
    total: number;
    byRole: Record<string, number>;
    avgPerConversation: number;
  };
  corrections: {
    total: number;
    applied: number;
    pending: number;
    applicationRate: number;
    byModule: Record<string, number>;
  };
  rules: {
    total: number;
    active: number;
    avgConfidence: number;
    overallSuccessRate: number;
    totalUsage: number;
    byModule: Record<string, number>;
    top: Array<{
      id: string;
      name: string;
      module: string;
      usageCount: number;
      successRate: number;
      confidence: number;
    }>;
  };
  learningScore: number;
}

interface TrainingStatsProps {
  period?: '7d' | '30d' | '90d' | 'all';
  compact?: boolean;
}

export function TrainingStats({ period = '30d', compact = false }: TrainingStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  useEffect(() => {
    fetchStats();
  }, [selectedPeriod]);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/training/stats?period=${selectedPeriod}`);
      if (!response.ok) throw new Error('Errore caricamento statistiche');
      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Errore imprevisto');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Eccellente';
    if (score >= 60) return 'Buono';
    if (score >= 40) return 'In crescita';
    return 'Da migliorare';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  if (!stats) return null;

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Conversazioni</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.conversations.total}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <CheckCircle className="w-4 h-4" />
            <span>Correzioni</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.corrections.applied}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Regole Attive</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.rules.active}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Learning Score</span>
          </div>
          <p className={`text-2xl font-bold ${getScoreColor(stats.learningScore)}`}>
            {stats.learningScore}/100
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Statistiche Training</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as any)}
          className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="7d">Ultimi 7 giorni</option>
          <option value="30d">Ultimi 30 giorni</option>
          <option value="90d">Ultimi 90 giorni</option>
          <option value="all">Tutto il periodo</option>
        </select>
      </div>

      {/* Learning Score */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Learning Score</p>
            <p className="text-4xl font-bold mt-1">{stats.learningScore}/100</p>
            <p className="text-white/80 text-sm mt-1">{getScoreLabel(stats.learningScore)}</p>
          </div>
          <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center">
            <TrendingUp className="w-12 h-12 text-white/80" />
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <MessageSquare className="w-4 h-4" />
            <span>Conversazioni</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.conversations.total}</p>
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <span className="text-green-600">{stats.conversations.resolved} risolte</span>
            <span className="text-blue-600">{stats.conversations.active} attive</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <BarChart3 className="w-4 h-4" />
            <span>Messaggi</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.messages.total}</p>
          <div className="text-xs text-gray-500 mt-2">
            Media: {stats.messages.avgPerConversation} per conversazione
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <CheckCircle className="w-4 h-4" />
            <span>Correzioni</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.corrections.total}</p>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-green-600">{stats.corrections.applied} applicate</span>
            <span className="text-yellow-600">{stats.corrections.pending} in attesa</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Regole AI</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.rules.active}</p>
          <div className="text-xs text-gray-500 mt-2">
            Success rate: {stats.rules.overallSuccessRate}%
          </div>
        </div>
      </div>

      {/* Top Rules */}
      {stats.rules.top.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="px-5 py-4 border-b">
            <h3 className="font-semibold text-gray-900">Regole più utilizzate</h3>
          </div>
          <div className="divide-y">
            {stats.rules.top.map((rule, index) => (
              <div key={rule.id} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-sm font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{rule.name}</p>
                    <p className="text-xs text-gray-500">{rule.module}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {rule.usageCount} utilizzi
                  </p>
                  <p className="text-xs text-green-600">
                    {rule.successRate}% successo
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modules Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="px-5 py-4 border-b">
            <h3 className="font-semibold text-gray-900">Conversazioni per modulo</h3>
          </div>
          <div className="p-5">
            {Object.entries(stats.conversations.byModule).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.conversations.byModule).map(([module, count]) => (
                  <div key={module} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{module}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nessun dato disponibile</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="px-5 py-4 border-b">
            <h3 className="font-semibold text-gray-900">Regole per modulo</h3>
          </div>
          <div className="p-5">
            {Object.entries(stats.rules.byModule).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.rules.byModule).map(([module, count]) => (
                  <div key={module} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{module}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nessun dato disponibile</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
