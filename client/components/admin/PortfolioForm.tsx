'use client'

import { useState } from 'react'

interface Portfolio {
  _id: string
  title: string
  description: string
  url: string
  imageUrl: string
}

interface PortfolioFormProps {
  portfolios: Portfolio[]
  onAdd: (data: Partial<Portfolio>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function PortfolioForm({ portfolios, onAdd, onDelete }: PortfolioFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    imageUrl: '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onAdd(formData)
      setFormData({ title: '', description: '', url: '', imageUrl: '' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
            placeholder="Ex: Umacako - Hábitos"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <input
            type="text"
            value={formData.description}
            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            placeholder="Ex: App para Celular/PC"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL do projeto</label>
          <input
            type="url"
            value={formData.url}
            onChange={e => setFormData(p => ({ ...p, url: e.target.value }))}
            placeholder="https://..."
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL da imagem de capa</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={e => setFormData(p => ({ ...p, imageUrl: e.target.value }))}
            placeholder="https://..."
            className="w-full px-3 py-2 border rounded-lg"
          />
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="mt-2 w-full aspect-video object-cover rounded-lg"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? 'Adicionando...' : 'Adicionar'}
        </button>
      </form>

      <div className="space-y-3">
        {portfolios.map(item => (
          <div key={item._id} className="flex gap-3 p-3 border rounded-lg">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.title} className="w-20 h-14 object-cover rounded" />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{item.title}</h4>
              <p className="text-sm text-gray-500 truncate">{item.description}</p>
            </div>
            <button
              onClick={() => onDelete(item._id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
