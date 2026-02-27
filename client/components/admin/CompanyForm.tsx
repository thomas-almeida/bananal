'use client'

import { useState } from 'react'

interface Company {
  _id: string
  name: string
  url: string
  faviconUrl: string
}

interface CompanyFormProps {
  companies: Company[]
  onAdd: (data: Partial<Company>) => Promise<void>
  onUpdate: (id: string, data: Partial<Company>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function CompanyForm({ companies, onAdd, onUpdate, onDelete }: CompanyFormProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<{ name: string; faviconUrl: string } | null>(null)
  const [editingName, setEditingName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingNameList, setEditingNameList] = useState<{ [key: string]: string }>({})

  const handleCheck = async () => {
    if (!url) return
    setLoading(true)
    try {
      const res = await fetch(`/api/meta?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      if (data.name || data.faviconUrl) {
        setPreview({ name: data.name, faviconUrl: data.faviconUrl })
        setEditingName(data.name || '')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!preview) return
    await onAdd({ name: editingName, faviconUrl: preview.faviconUrl, url })
    setUrl('')
    setPreview(null)
    setEditingName('')
  }

  const handleEditStart = (company: Company) => {
    setEditingId(company._id)
    setEditingNameList(prev => ({ ...prev, [company._id]: company.name }))
  }

  const handleEditSave = async (id: string) => {
    const newName = editingNameList[id]
    if (newName) {
      await onUpdate(id, { name: newName })
    }
    setEditingId(null)
    setEditingNameList(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditingNameList(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(k => delete next[k])
      return next
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">URL do site da empresa</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={e => { setUrl(e.target.value); setPreview(null) }}
            placeholder="https://..."
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <button
            type="button"
            onClick={handleCheck}
            disabled={loading || !url}
            className="px-4 py-2 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? '...' : 'Buscar'}
          </button>
        </div>
      </div>

      {preview && (
        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <img src={preview.faviconUrl} alt={preview.name} className="w-10 h-10 rounded" />
          <input
            type="text"
            value={editingName}
            onChange={e => setEditingName(e.target.value)}
            className="flex-1 px-2 py-1 border rounded text-sm font-medium"
            placeholder="Nome da empresa"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Confirmar
          </button>
        </div>
      )}

      <div className="space-y-2">
        {companies.map(company => (
          <div key={company._id} className="flex items-center gap-3 p-3 border rounded-lg">
            <img src={company.faviconUrl} alt={company.name} className="w-8 h-8 rounded" />
            {editingId === company._id ? (
              <>
                <input
                  type="text"
                  value={editingNameList[company._id] || ''}
                  onChange={e => setEditingNameList(prev => ({ ...prev, [company._id]: e.target.value }))}
                  className="flex-1 px-2 py-1 border rounded text-sm font-medium"
                  autoFocus
                />
                <button
                  onClick={() => handleEditSave(company._id)}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Salvar
                </button>
                <button
                  onClick={handleEditCancel}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 font-medium">{company.name}</span>
                <button
                  onClick={() => handleEditStart(company)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(company._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remover
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
