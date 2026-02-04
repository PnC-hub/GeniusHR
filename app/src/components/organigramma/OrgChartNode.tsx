'use client'

import { useState } from 'react'

export interface OrgNode {
  id: string
  name: string
  position: string
  department: 'CLINICAL' | 'ADMIN' | 'MANAGEMENT'
  employeeId?: string
  isVacant?: boolean
  children?: OrgNode[]
}

interface OrgChartNodeProps {
  node: OrgNode
  onToggle?: (nodeId: string) => void
  expanded?: boolean
}

const departmentColors = {
  CLINICAL: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
  },
  ADMIN: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
    badge: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
  },
  MANAGEMENT: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
  }
}

const departmentLabels = {
  CLINICAL: 'Clinico',
  ADMIN: 'Amministrativo',
  MANAGEMENT: 'Direzione'
}

export default function OrgChartNode({ node, onToggle, expanded = true }: OrgChartNodeProps) {
  const hasChildren = node.children && node.children.length > 0
  const colors = departmentColors[node.department]

  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0]
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div
        className={`
          relative w-64 p-4 rounded-xl shadow-md border-2 transition-all
          ${colors.bg} ${colors.border}
          ${node.isVacant ? 'opacity-70' : ''}
          hover:shadow-lg
        `}
      >
        {/* Vacant Badge */}
        {node.isVacant && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Vacante
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Avatar Circle */}
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center font-bold text-white
            ${node.department === 'CLINICAL' ? 'bg-blue-500' :
              node.department === 'ADMIN' ? 'bg-green-500' : 'bg-purple-500'}
          `}>
            {node.isVacant ? '?' : getInitials(node.name)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {node.isVacant ? node.position : node.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {node.isVacant ? '(Posizione aperta)' : node.position}
            </p>
          </div>
        </div>

        {/* Department Badge */}
        <div className="mt-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.badge}`}>
            {departmentLabels[node.department]}
          </span>
        </div>

        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={() => onToggle?.(node.id)}
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md"
          >
            <span className="text-gray-600 dark:text-gray-400 font-bold text-sm">
              {expanded ? '−' : '+'}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
