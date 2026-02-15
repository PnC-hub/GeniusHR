'use client';

import { useState } from 'react';
import { X, Wand2, Check, AlertTriangle, Loader2 } from 'lucide-react';

interface Suggestion {
  ruleId: string;
  ruleName: string;
  field: string;
  suggestedValue: any;
  confidence: number;
  reason: string;
}

interface QuickFixDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: string;
  entityId: string;
  currentData: Record<string, any>;
  onApplyFix: (field: string, value: any, ruleId: string) => Promise<void>;
}

export function QuickFixDialog({
  isOpen,
  onClose,
  entityType,
  entityId,
  currentData,
  onApplyFix
}: QuickFixDialogProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/training/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: entityType,
          entityType,
          entityData: currentData
        })
      });

      if (!response.ok) throw new Error('Errore recupero suggerimenti');

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err: any) {
      setError(err.message || 'Errore imprevisto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (suggestion: Suggestion) => {
    setApplying(suggestion.ruleId);
    try {
      await onApplyFix(suggestion.field, suggestion.suggestedValue, suggestion.ruleId);
      setApplied(prev => new Set([...prev, suggestion.ruleId]));
    } catch (err) {
      console.error('Error applying fix:', err);
    } finally {
      setApplying(null);
    }
  };

  // Fetch suggestions when dialog opens
  useState(() => {
    if (isOpen) {
      fetchSuggestions();
    }
  });

  if (!isOpen) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-violet-600 to-purple-600 text-white">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            <h2 className="font-semibold">Suggerimenti AI</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600 mb-2" />
              <p className="text-gray-500">Analisi in corso...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && !error && suggestions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Check className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p className="font-medium">Nessuna correzione suggerita</p>
              <p className="text-sm mt-1">
                I dati sembrano conformi alle regole apprese
              </p>
            </div>
          )}

          {!isLoading && !error && suggestions.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Trovati {suggestions.length} suggerimenti basati sulle regole apprese:
              </p>

              {suggestions.map((suggestion) => {
                const isApplied = applied.has(suggestion.ruleId);
                const isApplying = applying === suggestion.ruleId;

                return (
                  <div
                    key={suggestion.ruleId}
                    className={`p-4 rounded-lg border ${
                      isApplied ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {suggestion.field}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            getConfidenceColor(suggestion.confidence)
                          }`}>
                            {Math.round(suggestion.confidence * 100)}%
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          {suggestion.reason}
                        </p>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">Valore attuale:</span>
                          <code className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">
                            {JSON.stringify(currentData[suggestion.field])}
                          </code>
                        </div>

                        <div className="flex items-center gap-2 text-sm mt-1">
                          <span className="text-gray-500">Suggerito:</span>
                          <code className="px-1.5 py-0.5 bg-violet-100 rounded text-violet-700">
                            {JSON.stringify(suggestion.suggestedValue)}
                          </code>
                        </div>
                      </div>

                      <button
                        onClick={() => handleApply(suggestion)}
                        disabled={isApplied || isApplying}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                          isApplied
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50'
                        }`}
                      >
                        {isApplying ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isApplied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          'Applica'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Basato su {suggestions.length > 0 ? 'regole apprese' : 'analisi AI'}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
