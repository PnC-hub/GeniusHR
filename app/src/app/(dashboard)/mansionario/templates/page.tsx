'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Template {
  id: string
  title: string
  ccnlLevel: string
  department: string
  duties: string[]
  skills: string[]
  responsibilities: string[]
  kpis: string[]
}

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/mansionario/templates')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setTemplates(data)
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUseTemplate = async (template: Template) => {
    try {
      const res = await fetch('/api/mansionario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: template.title,
          ccnlLevel: template.ccnlLevel,
          department: template.department,
          duties: template.duties,
          skills: template.skills,
          responsibilities: template.responsibilities,
          kpis: template.kpis,
          assignedEmployees: []
        })
      })

      if (!res.ok) throw new Error('Failed to create')

      const newMansionario = await res.json()
      router.push(`/mansionario/${newMansionario.id}`)
    } catch (error) {
      console.error('Error creating from template:', error)
      alert('Errore durante la creazione')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Caricamento...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/mansionario" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Torna ai Mansionari
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Mansionari</h1>
        <p className="text-gray-600">
          Seleziona un template predefinito per velocizzare la creazione di nuovi mansionari
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
              <div className="text-sm text-gray-600 mb-1">{template.ccnlLevel}</div>
              <div className="inline-block px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700">
                {template.department}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Mansioni</span>
                <span className="font-medium text-gray-900">{template.duties.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Competenze</span>
                <span className="font-medium text-gray-900">{template.skills.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Responsabilità</span>
                <span className="font-medium text-gray-900">{template.responsibilities.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">KPI</span>
                <span className="font-medium text-gray-900">{template.kpis.length}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTemplate(template)}
                className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                👁️ Anteprima
              </button>
              <button
                onClick={() => handleUseTemplate(template)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Usa Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTemplate.title}</h2>
                  <div className="flex items-center gap-3 text-gray-600">
                    <span>{selectedTemplate.ccnlLevel}</span>
                    <span>•</span>
                    <span>{selectedTemplate.department}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Mansioni */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mansioni Principali</h3>
                <ul className="space-y-2">
                  {selectedTemplate.duties.map((duty, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-gray-700">{duty}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Competenze */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Competenze Richieste</h3>
                <ul className="space-y-2">
                  {selectedTemplate.skills.map((skill, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-gray-700">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Responsabilità */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Responsabilità</h3>
                <ul className="space-y-2">
                  {selectedTemplate.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">⚠️</span>
                      <span className="text-gray-700">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* KPI */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">KPI di Ruolo</h3>
                <ul className="space-y-2">
                  {selectedTemplate.kpis.map((kpi, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">📊</span>
                      <span className="text-gray-700">{kpi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Chiudi
                </button>
                <button
                  onClick={() => {
                    handleUseTemplate(selectedTemplate)
                    setSelectedTemplate(null)
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Usa Questo Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
