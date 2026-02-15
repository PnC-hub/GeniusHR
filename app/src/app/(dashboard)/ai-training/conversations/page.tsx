'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2
} from 'lucide-react';
import PageInfoTooltip from '@/components/PageInfoTooltip';

interface Conversation {
  id: string;
  title: string;
  context: string;
  status: 'ACTIVE' | 'RESOLVED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  _count: {
    messages: number;
    corrections: number;
  };
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [contextFilter, setContextFilter] = useState<string>('all');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/training/conversations');
      if (!response.ok) throw new Error('Errore caricamento conversazioni');
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (err: any) {
      setError(err.message || 'Errore imprevisto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa conversazione?')) return;

    try {
      const response = await fetch(`/api/training/conversations/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Errore eliminazione');
      setConversations(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message || 'Errore durante l\'eliminazione');
    }
  };

  const getContextLabel = (context: string) => {
    const labels: Record<string, string> = {
      attendance: 'Presenze',
      payslip: 'Cedolini',
      safety: 'Sicurezza',
      onboarding: 'Onboarding',
      leaves: 'Ferie',
      expenses: 'Note Spese',
      disciplinary: 'Disciplinare'
    };
    return labels[context] || context;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            Attiva
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" />
            Risolta
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
            Archiviata
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
    const matchesContext = contextFilter === 'all' || conv.context === contextFilter;
    return matchesSearch && matchesStatus && matchesContext;
  });

  const contexts = [...new Set(conversations.map(c => c.context))];

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
          <div className="p-2 bg-violet-100 rounded-lg">
            <MessageSquare className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Conversazioni Training</h1>
            <p className="text-gray-500 text-sm">
              Storico delle sessioni di addestramento AI
            </p>
          </div>
          <PageInfoTooltip
            title="Conversazioni Training"
            description="Elenco di tutte le sessioni di training con l'AI. Ogni conversazione può contenere correzioni che generano nuove regole."
            tips={[
              'Visualizza lo storico delle chat',
              'Filtra per stato e contesto',
              'Vedi le correzioni estratte',
              'Riprendi conversazioni attive'
            ]}
          />
        </div>
        <Link
          href="/ai-training/train"
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Nuova Conversazione
        </Link>
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
              placeholder="Cerca conversazioni..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">Tutti gli stati</option>
            <option value="ACTIVE">Attive</option>
            <option value="RESOLVED">Risolte</option>
            <option value="ARCHIVED">Archiviate</option>
          </select>

          <select
            value={contextFilter}
            onChange={(e) => setContextFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">Tutti i contesti</option>
            {contexts.map(ctx => (
              <option key={ctx} value={ctx}>{getContextLabel(ctx)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Conversations List */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        {filteredConversations.length > 0 ? (
          <div className="divide-y">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <Link
                  href={`/ai-training/conversations/${conv.id}`}
                  className="flex-1 flex items-center gap-4"
                >
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conv.title}
                      </h3>
                      {getStatusBadge(conv.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {getContextLabel(conv.context)}
                      </span>
                      <span>{conv._count.messages} messaggi</span>
                      {conv._count.corrections > 0 && (
                        <span className="text-green-600">
                          {conv._count.corrections} correzioni
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(conv.createdAt)}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(conv.id);
                  }}
                  className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Elimina conversazione"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="font-medium">Nessuna conversazione trovata</p>
            <p className="text-sm mt-1">
              {searchQuery || statusFilter !== 'all' || contextFilter !== 'all'
                ? 'Prova a modificare i filtri di ricerca'
                : 'Inizia una nuova conversazione per addestrare l\'AI'}
            </p>
            <Link
              href="/ai-training/train"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Nuova Conversazione
            </Link>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {conversations.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border text-center">
            <p className="text-2xl font-bold text-gray-900">
              {conversations.filter(c => c.status === 'ACTIVE').length}
            </p>
            <p className="text-sm text-gray-500">Attive</p>
          </div>
          <div className="bg-white p-4 rounded-lg border text-center">
            <p className="text-2xl font-bold text-gray-900">
              {conversations.filter(c => c.status === 'RESOLVED').length}
            </p>
            <p className="text-sm text-gray-500">Risolte</p>
          </div>
          <div className="bg-white p-4 rounded-lg border text-center">
            <p className="text-2xl font-bold text-green-600">
              {conversations.reduce((sum, c) => sum + c._count.corrections, 0)}
            </p>
            <p className="text-sm text-gray-500">Correzioni Totali</p>
          </div>
        </div>
      )}
    </div>
  );
}
