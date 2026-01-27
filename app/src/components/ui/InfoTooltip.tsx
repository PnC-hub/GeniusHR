'use client'

import { useState } from 'react'

interface InfoTooltipProps {
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

/**
 * InfoTooltip - Inline tooltip component
 *
 * Usage:
 * <InfoTooltip content="This is a helpful tooltip" />
 * <InfoTooltip content="Bottom tooltip" position="bottom" />
 *
 * Features:
 * - Hover on desktop, click on mobile
 * - Auto-positioning with arrow
 * - Dark mode support
 * - Smooth fade-in animation
 * - WCAG accessible with ARIA labels
 */
export default function InfoTooltip({
  content,
  position = 'top',
  className = ''
}: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Position classes
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  // Arrow position classes
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900 dark:border-t-zinc-700',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900 dark:border-b-zinc-700',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900 dark:border-l-zinc-700',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900 dark:border-r-zinc-700',
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Info Icon Button */}
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/70 transition-all duration-200 cursor-help focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-label="Informazioni aggiuntive"
        aria-describedby={isOpen ? 'tooltip-content' : undefined}
        type="button"
      >
        <svg
          className="w-3 h-3"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Tooltip Content */}
      {isOpen && (
        <>
          <div
            id="tooltip-content"
            role="tooltip"
            className={`absolute z-50 ${positionClasses[position]} w-64 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-zinc-700 rounded-lg shadow-lg pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            {content}

            {/* Arrow */}
            <div
              className={`absolute ${arrowClasses[position]} w-0 h-0 border-4`}
            />
          </div>
        </>
      )}
    </div>
  )
}
