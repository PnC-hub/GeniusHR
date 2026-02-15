'use client';

import { Bot, User, CheckCircle, AlertCircle, Wrench } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  functionCall?: string;
  functionResult?: any;
  createdAt: Date;
}

export function ChatMessage({
  role,
  content,
  functionCall,
  functionResult,
  createdAt
}: ChatMessageProps) {
  const isUser = role === 'user';
  const isSystem = role === 'system';
  const isFunction = role === 'function';

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFunctionIcon = (fn: string) => {
    switch (fn) {
      case 'extract_correction':
        return <Wrench className="w-3 h-3" />;
      case 'create_rule':
        return <CheckCircle className="w-3 h-3" />;
      case 'query_data':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <Wrench className="w-3 h-3" />;
    }
  };

  const getFunctionLabel = (fn: string) => {
    switch (fn) {
      case 'extract_correction':
        return 'Correzione estratta';
      case 'create_rule':
        return 'Regola creata';
      case 'query_data':
        return 'Dati consultati';
      case 'suggest_fix':
        return 'Suggerimento generato';
      default:
        return fn;
    }
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
          {content}
        </div>
      </div>
    );
  }

  if (isFunction) {
    return (
      <div className="flex justify-center my-2">
        <div className="px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-lg text-xs text-violet-700 flex items-center gap-2">
          {getFunctionIcon(functionCall || '')}
          <span>{getFunctionLabel(functionCall || '')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-violet-600 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <div className="flex items-start gap-2">
          {!isUser && (
            <Bot className="w-4 h-4 mt-0.5 text-violet-600 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className="text-sm whitespace-pre-wrap">{content}</p>

            {/* Function call indicator */}
            {functionCall && (
              <div className={`mt-2 text-xs flex items-center gap-1 ${
                isUser ? 'text-white/70' : 'text-gray-500'
              }`}>
                {getFunctionIcon(functionCall)}
                <span>{getFunctionLabel(functionCall)}</span>
              </div>
            )}

            {/* Function result preview */}
            {functionResult && (
              <div className={`mt-2 p-2 rounded text-xs ${
                isUser ? 'bg-white/10' : 'bg-white border'
              }`}>
                <pre className="overflow-x-auto">
                  {typeof functionResult === 'object'
                    ? JSON.stringify(functionResult, null, 2).substring(0, 200) + '...'
                    : String(functionResult).substring(0, 200)
                  }
                </pre>
              </div>
            )}

            {/* Timestamp */}
            <div className={`mt-1 text-xs ${
              isUser ? 'text-white/60' : 'text-gray-400'
            }`}>
              {formatTime(createdAt)}
            </div>
          </div>
          {isUser && (
            <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
}
