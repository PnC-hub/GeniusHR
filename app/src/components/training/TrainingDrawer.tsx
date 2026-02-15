'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Bot, User, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
  functionCall?: string;
  functionResult?: any;
}

interface Correction {
  entityType: string;
  fieldPath?: string;
  originalValue: any;
  correctedValue: any;
  ruleExtracted?: string;
}

interface TrainingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context: string;
  contextId?: string;
  contextData?: Record<string, any>;
  title?: string;
}

export function TrainingDrawer({
  isOpen,
  onClose,
  context,
  contextId,
  contextData,
  title = 'Assistente AI Training'
}: TrainingDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset on context change
  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setConversationId(null);
      setCorrections([]);
      setError(null);
    }
  }, [context, contextId, isOpen]);

  const createConversation = async () => {
    try {
      const response = await fetch('/api/training/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          contextId,
          contextData,
          title: `Training ${context} - ${new Date().toLocaleDateString('it-IT')}`
        })
      });

      if (!response.ok) throw new Error('Errore creazione conversazione');

      const data = await response.json();
      setConversationId(data.id);
      return data.id;
    } catch (err) {
      console.error('Error creating conversation:', err);
      throw err;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    // Add user message immediately
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, tempUserMessage]);
    setIsLoading(true);

    try {
      // Create conversation if not exists
      let convId = conversationId;
      if (!convId) {
        convId = await createConversation();
      }

      // Send message
      const response = await fetch(`/api/training/conversations/${convId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userMessage })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore invio messaggio');
      }

      const data = await response.json();

      // Update messages with real IDs
      setMessages(prev => {
        const updated = prev.filter(m => m.id !== tempUserMessage.id);
        return [
          ...updated,
          {
            id: data.userMessage.id,
            role: 'user',
            content: data.userMessage.content,
            createdAt: new Date(data.userMessage.createdAt)
          },
          {
            id: data.assistantMessage.id,
            role: 'assistant',
            content: data.assistantMessage.content,
            createdAt: new Date(data.assistantMessage.createdAt),
            functionCall: data.assistantMessage.functionCall,
            functionResult: data.assistantMessage.functionResult
          }
        ];
      });

      // Handle corrections
      if (data.correction) {
        setCorrections(prev => [...prev, data.correction]);
      }

    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Errore durante l\'invio del messaggio');
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getContextLabel = (ctx: string) => {
    const labels: Record<string, string> = {
      attendance: 'Presenze',
      payslip: 'Cedolini',
      safety: 'Sicurezza',
      onboarding: 'Onboarding',
      leaves: 'Ferie',
      expenses: 'Note Spese',
      disciplinary: 'Disciplinare'
    };
    return labels[ctx] || ctx;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-violet-600 to-purple-600 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <div>
              <h2 className="font-semibold">{title}</h2>
              <p className="text-xs text-white/80">
                Contesto: {getContextLabel(context)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Context Data Preview */}
        {contextData && Object.keys(contextData).length > 0 && (
          <div className="px-4 py-2 bg-gray-50 border-b text-xs">
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <Lightbulb className="w-3 h-3" />
              <span>Dati di contesto caricati</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(contextData).slice(0, 5).map(([key, value]) => (
                <span key={key} className="px-2 py-0.5 bg-white rounded border text-gray-700">
                  {key}: {typeof value === 'object' ? '...' : String(value).substring(0, 20)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bot className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="font-medium">Come posso aiutarti?</p>
              <p className="text-sm mt-1">
                Descrivi un problema o una correzione da applicare
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-400">Esempi:</p>
                <button
                  onClick={() => setInput('Le ore di straordinario di ieri sono sbagliate')}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  "Le ore di straordinario sono sbagliate"
                </button>
                <button
                  onClick={() => setInput('Quando un dipendente lavora di sabato, le ore sono sempre straordinario')}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors block mx-auto"
                >
                  "Sabato = ore straordinario"
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.role === 'assistant' && (
                    <Bot className="w-4 h-4 mt-0.5 text-violet-600 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.functionCall && (
                      <div className="mt-2 text-xs opacity-70 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Azione: {message.functionCall}
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <Loader2 className="w-5 h-5 animate-spin text-violet-600" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Corrections Banner */}
        {corrections.length > 0 && (
          <div className="px-4 py-2 bg-green-50 border-t border-green-200">
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>{corrections.length} correzione/i estratte</span>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-200">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Descrivi il problema o la correzione..."
              className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Premi Invio per inviare, Shift+Invio per andare a capo
          </p>
        </div>
      </div>
    </div>
  );
}
