'use client'

import { useState } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import { OrgNode } from '@/components/organigramma/OrgChartNode'
import Link from 'next/link'

const initialOrgData: OrgNode[] = [
  {
    id: '1',
    name: 'Dott. Piernatale Civero',
    position: 'Direttore Sanitario',
    department: 'MANAGEMENT',
    children: [
      {
        id: '2',
        name: 'Dott.ssa Annita Di Vozzo',
        position: 'Odontoiatra',
        department: 'CLINICAL',
      },
      {
        id: '3',
        name: 'Maria Rossi',
        position: 'Igienista Dentale',
        department: 'CLINICAL',
      },
      {
        id: '5',
        name: 'Giuseppe Bianchi',
        position: 'ASO - Assistente di Poltrona',
        department: 'CLINICAL',
        children: [
          {
            id: '6',
            name: 'Anna Verdi',
            position: 'ASO - Assistente di Poltrona',
            department: 'CLINICAL',
          }
        ]
      },
      {
        id: '7',
        name: 'Raffaella Cretella',
        position: 'Responsabile Amministrativa',
        department: 'ADMIN',
        children: [
          {
            id: '8',
            name: 'Laura Gialli',
            position: 'Segreteria',
            department: 'ADMIN',
          },
          {
            id: '9',
            name: 'Sara Viola',
            position: 'Amministrazione',
            department: 'ADMIN',
          }
        ]
      }
    ]
  }
]

export default function EditOrganigrammaPage() {
  const [orgData, setOrgData] = useState<OrgNode[]>(initialOrgData)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newNode, setNewNode] = useState({
    name: '',
    position: '',
    department: 'CLINICAL' as const,
    isVacant: false,
    parentId: ''
  })
  const [saving, setSaving] = useState(false)

  // Flatten tree to list for easier manipulation
  const flattenTree = (nodes: OrgNode[], parentId: string | null = null): Array<OrgNode & { parentId: string | null }> => {
    const result: Array<OrgNode & { parentId: string | null }> = []
    nodes.forEach(node => {
      result.push({ ...node, parentId })
      if (node.children) {
        result.push(...flattenTree(node.children, node.id))
      }
    })
    return result
  }

  const allNodes = flattenTree(orgData)

  const handleAddNode = () => {
    if (!newNode.position) {
      alert('Inserisci almeno il ruolo della posizione')
      return
    }

    const nodeToAdd: OrgNode = {
      id: `new-${Date.now()}`,
      name: newNode.name,
      position: newNode.position,
      department: newNode.department,
      isVacant: newNode.isVacant || !newNode.name,
      children: []
    }

    if (!newNode.parentId) {
      // Add as root
      setOrgData([...orgData, nodeToAdd])
    } else {
      // Add as child
      const addToParent = (nodes: OrgNode[]): OrgNode[] => {
        return nodes.map(node => {
          if (node.id === newNode.parentId) {
            return {
              ...node,
              children: [...(node.children || []), nodeToAdd]
            }
          }
          if (node.children) {
            return {
              ...node,
              children: addToParent(node.children)
            }
          }
          return node
        })
      }
      setOrgData(addToParent(orgData))
    }

    setShowAddModal(false)
    setNewNode({ name: '', position: '', department: 'CLINICAL', isVacant: false, parentId: '' })
  }

  const handleDeleteNode = (nodeId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo nodo e tutti i suoi figli?')) {
      return
    }

    const removeNode = (nodes: OrgNode[]): OrgNode[] => {
      return nodes.filter(node => node.id !== nodeId).map(node => ({
        ...node,
        children: node.children ? removeNode(node.children) : undefined
      }))
    }

    setOrgData(removeNode(orgData))
    setSelectedNode(null)
  }

  const handleToggleVacant = (nodeId: string) => {
    const toggleVacant = (nodes: OrgNode[]): OrgNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, isVacant: !node.isVacant }
        }
        if (node.children) {
          return { ...node, children: toggleVacant(node.children) }
        }
        return node
      })
    }

    setOrgData(toggleVacant(orgData))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/organigramma', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tree: orgData })
      })

      if (response.ok) {
        alert('Organigramma salvato con successo!')
      } else {
        throw new Error('Errore nel salvataggio')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Errore nel salvataggio dell\'organigramma')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <DashboardHeader
          title="Modifica Organigramma"
          subtitle="Gestisci la struttura organizzativa"
          tooltipTitle="Modifica Organigramma"
          tooltipDescription="Da qui puoi aggiungere, modificare ed eliminare nodi dell'organigramma. Ogni nodo rappresenta una posizione che può essere assegnata a un dipendente o rimanere vacante."
          tooltipTips={[
            'Aggiungi nuove posizioni specificando ruolo e dipartimento',
            'Elimina posizioni con conferma per evitare errori',
            'Marca posizioni come vacanti se non ancora assegnate'
          ]}
        />
      </div>

      {/* Action Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>Aggiungi Nodo</span>
          </button>
        </div>

        <div className="flex gap-2">
          <Link
            href="/organigramma"
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Annulla
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Salvataggio...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Salva Modifiche</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Node List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tutte le Posizioni ({allNodes.length})
          </h2>

          <div className="space-y-2">
            {allNodes.map(node => {
              const parent = allNodes.find(n => n.id === node.parentId)
              return (
                <div
                  key={node.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedNode === node.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {node.isVacant ? `[VACANTE] ${node.position}` : node.name}
                        </h3>
                        {node.isVacant && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full">
                            Vacante
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          node.department === 'CLINICAL' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                          node.department === 'ADMIN' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                          'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                        }`}>
                          {node.department === 'CLINICAL' ? 'Clinico' :
                           node.department === 'ADMIN' ? 'Amministrativo' : 'Direzione'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {node.isVacant ? '(Posizione da assegnare)' : node.position}
                      </p>
                      {parent && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Riporta a: {parent.name || parent.position}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {selectedNode === node.id ? 'Deseleziona' : 'Seleziona'}
                      </button>
                      <button
                        onClick={() => handleToggleVacant(node.id)}
                        className="px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                      >
                        {node.isVacant ? 'Assegna' : 'Marca Vacante'}
                      </button>
                      <button
                        onClick={() => handleDeleteNode(node.id)}
                        className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Add Node Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Aggiungi Nuova Posizione
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome Dipendente (opzionale)
                </label>
                <input
                  type="text"
                  value={newNode.name}
                  onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
                  placeholder="Lascia vuoto per posizione vacante"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ruolo / Posizione *
                </label>
                <input
                  type="text"
                  value={newNode.position}
                  onChange={(e) => setNewNode({ ...newNode, position: e.target.value })}
                  placeholder="es. Odontoiatra, Segretaria"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dipartimento *
                </label>
                <select
                  value={newNode.department}
                  onChange={(e) => setNewNode({ ...newNode, department: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CLINICAL">Clinico</option>
                  <option value="ADMIN">Amministrativo</option>
                  <option value="MANAGEMENT">Direzione</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Riporta a (opzionale)
                </label>
                <select
                  value={newNode.parentId}
                  onChange={(e) => setNewNode({ ...newNode, parentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Nessuno (radice) --</option>
                  {allNodes.map(node => (
                    <option key={node.id} value={node.id}>
                      {node.name || node.position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vacant"
                  checked={newNode.isVacant}
                  onChange={(e) => setNewNode({ ...newNode, isVacant: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="vacant" className="text-sm text-gray-700 dark:text-gray-300">
                  Posizione vacante (da assegnare)
                </label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleAddNode}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Aggiungi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
