'use client'

import { useState, useEffect } from 'react'

interface Profile {
  name: string
  image: string
  username: string
  location: string
  headline: string
  description: string
  whatsapp: string
  ctaLabel: string
  ctaUrl: string
  jobTitle: string
  jobCompany: string
  studyCourse: string
  studyInstitution: string
  email: string
}

interface ProfileFormProps {
  profile: Profile | null
  onSave: (data: Partial<Profile>) => Promise<void>
}

export default function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: '',
    image: '',
    username: '',
    location: '',
    headline: '',
    description: '',
    whatsapp: '',
    ctaLabel: '',
    ctaUrl: '',
    jobTitle: '',
    jobCompany: '',
    studyCourse: '',
    studyInstitution: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave(formData)
    } catch (err: any) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium mb-1">Foto de perfil</label>
        <input
          type="text"
          name="image"
          value={formData.image || ''}
          onChange={handleChange}
          placeholder="URL da imagem"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nome</label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Username (slug)
          <span className="text-gray-500 font-normal ml-2">
            seusite.com/{formData.username}
          </span>
        </label>
        <input
          type="text"
          name="username"
          value={formData.username || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Localização</label>
        <input
          type="text"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          placeholder="Ex: 25y, São Paulo"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Título (H1)</label>
        <input
          type="text"
          name="headline"
          value={formData.headline || ''}
          onChange={handleChange}
          placeholder="Título da sua página pública"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">WhatsApp (com DDI)</label>
        <input
          type="text"
          name="whatsapp"
          value={formData.whatsapp || ''}
          onChange={handleChange}
          placeholder="5511999999999"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">CTA Label</label>
          <input
            type="text"
            name="ctaLabel"
            value={formData.ctaLabel || ''}
            onChange={handleChange}
            placeholder="Texto do botão"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CTA URL</label>
          <input
            type="url"
            name="ctaUrl"
            value={formData.ctaUrl || ''}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium mb-2">Atualmente</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cargo</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle || ''}
              onChange={handleChange}
              placeholder="Ex: Desenvolvedor"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Empresa</label>
            <input
              type="text"
              name="jobCompany"
              value={formData.jobCompany || ''}
              onChange={handleChange}
              placeholder="Nome da empresa"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Curso</label>
            <input
              type="text"
              name="studyCourse"
              value={formData.studyCourse || ''}
              onChange={handleChange}
              placeholder="Ex: Ciência da Computação"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instituição</label>
            <input
              type="text"
              name="studyInstitution"
              value={formData.studyInstitution || ''}
              onChange={handleChange}
              placeholder="Nome da instituição"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {saving ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  )
}
