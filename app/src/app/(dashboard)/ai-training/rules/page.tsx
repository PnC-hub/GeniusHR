'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Eye
} from 'lucide-react';
import PageInfoTooltip from '@/components/PageInfoTooltip';

interface AIRule {
  id: string;
  name: string;
  description: string;
  module: string;
  ruleType: string;
  conditions: any;
  actions: any;
  confidence: number;
  usageCount: number;
  successRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function RulesPage() {
  const [rules, setRules] = useState<AIRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRule, setSelectedRule] = useState<AIRule | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/training/rules');
      if (!response.ok) throw new Error('Errore caricamento regole');
      const data = await response.json();
      setRules(data.rules || []);
    } catch (err: any) {
      setError(err.message || 'Errore imprevisto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/training/rules/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (!response.ok) throw new Error('Errore aggiornamento');
      setRules(prev => prev.map(r =>
        r.id === id ? { ...r, isActive: !currentStatus } : r
      ));
    } catch (err: any) {
      alert(err.message || 'Errore durante l\'aggiornamento');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa regola?')) return;

    try {
      const response = await fetch(`/api/training/rules/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Errore eliminazione');
      setRules(prev => prev.filter(r => r.id !== id));
      setSelectedRule(null);
    } catch (err: any) {
      alert(err.message || 'Errore durante l\'eliminazione');
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
      disciplinary: 'Disciplinare'
    };
    return labels[module] || module;
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
          <CheckCircle className="w-3 h-3" />
          Alta ({Math.round(confidence * 100)}%)
        </span>
      );
    }
    if (confidence >= 0.6) {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
          <AlertTriangle className="w-3 h-3" />
          Media ({Math.round(confidence * 100)}%)
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
        <XCircle className="w-3 h-3" />
        Bassa ({Math.round(confidence * 100)}%)
      </span>
    );
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = moduleFilter === 'all' || rule.module === moduleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && rule.isActive) ||
      (statusFilter === 'inactive' && !rule.isActive);
    return matchesSearch && matchesModule && matchesStatus;
  });

  const modules = [...new Set(rules.map(r => r.module))];

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
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Regole AI</h1>
            <p className="text-gray-500 text-sm">
              Regole apprese automaticamente dall'AI
            </p>
          </div>
          <PageInfoTooltip
            title="Regole AI"
            description="Le regole vengono create automaticamente dall'AI quando identifichi e correggi errori. Più la regola viene usata con successo, più alta diventa la sua confidenza."
            tips={[
              'Visualizza tutte le regole apprese',
              'Attiva/disattiva regole singole',
              'Monitora successo e utilizzo',
              'Elimina regole non utili'
            ]}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{rules.filter(r => r.isActive).length}</p>
            <p className="text-sm text-gray-500">Regole Attive</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca regole..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">Tutti i moduli</option>
            {modules.map(mod => (
              <option key={mod} value={mod}>{getModuleLabel(mod)}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">Tutti gli stati</option>
            <option value="active">Attive</option>
            <option value="inactive">Disattivate</option>
          </select>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRules.length > 0 ? (
          filteredRules.map((rule) => (
            <div
              key={rule.id}
              className={`bg-white rounded-lg border shadow-sm overflow-hidden ${
                !rule.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-gray-900 truncate">
                        {rule.name}
                      </h3>
                      {getConfidenceBadge(rule.confidence)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {rule.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleActive(rule.id, rule.isActive)}
                    className="flex-shrink-0"
                    title={rule.isActive ? 'Disattiva regola' : 'Attiva regola'}
                  >
                    {rule.isActive ? (
                      <ToggleRight className="w-8 h-8 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-4 text-sm">
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                    {getModuleLabel(rule.module)}
                  </span>
                  <div className="flex items-center gap-1 text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    {rule.usageCount} utilizzi
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    {rule.successRate}% successo
                  </div>
                </div>
              </div>

              <div className="px-4 py-2 bg-gray-50 border-t flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Creata il {new Date(rule.createdAt).toLocaleDateString('it-IT')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRule(rule)}
                    className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
                    title="Visualizza dettagli"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Elimina regola"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-8 text-center text-gray-500 bg-white rounded-lg border">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="font-medium">Nessuna regola trovata</p>
            <p className="text-sm mt-1">
              {searchQuery || moduleFilter !== 'all' || statusFilter !== 'all'
                ? 'Prova a modificare i filtri di ricerca'
                : 'Le regole vengono create automaticamente durante il training'}
            </p>
          </div>
        )}
      </div>

      {/* Rule Detail Modal */}
      {selectedRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSelectedRule(null)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden">
            <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-600 to-violet-600 text-white">
              <h2 className="font-semibold">Dettaglio Regola</h2>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <h3 className="font-medium text-lg text-gray-900">{selectedRule.name}</h3>
              <p className="text-gray-600 mt-2">{selectedRule.description}</p>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Modulo</label>
                  <p className="text-gray-900">{getModuleLabel(selectedRule.module)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <p className="text-gray-900">{selectedRule.ruleType}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Condizioni</label>
                  <pre className="mt-1 p-3 bg-gray-100 rounded text-sm overflow-x-auto">
                    {JSON.stringify(selectedRule.conditions, null, 2)}
                  </pre>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Azioni</label>
                  <pre className="mt-1 p-3 bg-gray-100 rounded text-sm overflow-x-auto">
                    {JSON.stringify(selectedRule.actions, null, 2)}
                  </pre>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(selectedRule.confidence * 100)}%
                    </p>
                    <p className="text-sm text-gray-500">Confidenza</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedRule.usageCount}
                    </p>
                    <p className="text-sm text-gray-500">Utilizzi</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedRule.successRate}%
                    </p>
                    <p className="text-sm text-gray-500">Successo</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setSelectedRule(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
