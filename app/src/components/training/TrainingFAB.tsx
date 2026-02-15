'use client';

import { useState } from 'react';
import { Sparkles, MessageCircle, BookOpen, BarChart3, X } from 'lucide-react';
import { TrainingDrawer } from './TrainingDrawer';

interface TrainingFABProps {
  context: string;
  contextId?: string;
  contextData?: Record<string, any>;
}

export function TrainingFAB({
  context,
  contextId,
  contextData
}: TrainingFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const menuItems = [
    {
      icon: MessageCircle,
      label: 'Chat Training',
      action: () => {
        setIsOpen(false);
        setIsDrawerOpen(true);
      },
      color: 'bg-violet-600 hover:bg-violet-700'
    },
    {
      icon: BookOpen,
      label: 'Regole AI',
      action: () => {
        setIsOpen(false);
        window.location.href = '/ai-training/rules';
      },
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: BarChart3,
      label: 'Statistiche',
      action: () => {
        setIsOpen(false);
        window.location.href = '/ai-training';
      },
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

  return (
    <>
      {/* FAB Container */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end gap-3">
        {/* Menu Items */}
        {isOpen && (
          <div className="flex flex-col-reverse gap-2 mb-2 animate-fade-in">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-white shadow-lg transition-all transform hover:scale-105 ${item.color}`}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Main FAB Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? 'bg-gray-700 hover:bg-gray-800 rotate-45'
              : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Sparkles className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Tooltip */}
        {showTooltip && !isOpen && (
          <div className="absolute bottom-16 right-0 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-lg">
            AI Training
            <div className="absolute bottom-[-6px] right-5 w-3 h-3 bg-gray-900 rotate-45" />
          </div>
        )}
      </div>

      {/* Training Drawer */}
      <TrainingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        context={context}
        contextId={contextId}
        contextData={contextData}
      />

      {/* Backdrop for menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
}
