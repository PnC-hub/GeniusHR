'use client'

import { useState } from 'react'
import OrgChartNode, { OrgNode } from './OrgChartNode'

interface OrgChartTreeProps {
  nodes: OrgNode[]
}

export default function OrgChartTree({ nodes }: OrgChartTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(nodes.map(n => n.id)))

  const handleToggle = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }

  const renderNode = (node: OrgNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node */}
        <OrgChartNode
          node={node}
          onToggle={handleToggle}
          expanded={isExpanded}
        />

        {/* Vertical Line to Children */}
        {hasChildren && isExpanded && (
          <div className="w-0.5 h-12 bg-gray-300 dark:bg-gray-600 my-2" />
        )}

        {/* Children Container */}
        {hasChildren && isExpanded && (
          <div className="relative">
            {/* Horizontal Line Above Children */}
            {node.children!.length > 1 && (
              <div
                className="absolute top-0 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600"
                style={{
                  width: `calc(100% - 32px)`,
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              />
            )}

            {/* Children Grid */}
            <div className="flex gap-8 pt-12">
              {node.children!.map((child, index) => (
                <div key={child.id} className="relative flex flex-col items-center">
                  {/* Vertical Line from Horizontal Line to Child */}
                  {node.children!.length > 1 && (
                    <div className="absolute w-0.5 h-12 bg-gray-300 dark:bg-gray-600 -top-12 left-1/2 transform -translate-x-1/2" />
                  )}
                  {renderNode(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto pb-8">
      <div className="inline-block min-w-full">
        <div className="flex flex-col items-center py-8 px-4">
          {nodes.map(node => renderNode(node))}
        </div>
      </div>
    </div>
  )
}
