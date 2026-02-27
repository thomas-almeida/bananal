'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import ProfileForm from '@/components/admin/ProfileForm'
import PortfolioForm from '@/components/admin/PortfolioForm'
import CompanyForm from '@/components/admin/CompanyForm'
import TestimonialForm from '@/components/admin/TestimonialForm'

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

interface Portfolio {
  _id: string
  title: string
  description: string
  url: string
  imageUrl: string
}

interface Company {
  _id: string
  name: string
  url: string
  faviconUrl: string
}

interface Testimonial {
  _id: string
  authorName: string
  authorImage: string
  text: string
  approved: boolean
  createdAt: string
}

type Tab = 'profile' | 'portfolio' | 'companies' | 'testimonials'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/login'
    }
  }, [status])

  useEffect(() => {
    if (session?.user?.id) {
      loadData()
    }
  }, [session])

  const loadData = async () => {
    try {
      const [profileRes, portfolioRes, companyRes, testimonialRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/portfolio'),
        fetch('/api/companies'),
        fetch('/api/testimonials'),
      ])
      
      const profileData = await profileRes.json()
      const portfolioData = await portfolioRes.json()
      const companyData = await companyRes.json()
      const testimonialData = await testimonialRes.json()

      setProfile(profileData)
      setPortfolios(portfolioData)
      setCompanies(companyData)
      setTestimonials(testimonialData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async (data: Partial<Profile>) => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to save')
    await loadData()
  }

  const handleAddPortfolio = async (data: Partial<Portfolio>) => {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to add')
    await loadData()
  }

  const handleDeletePortfolio = async (id: string) => {
    const res = await fetch(`/api/portfolio?id=${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete')
    await loadData()
  }

  const handleAddCompany = async (data: Partial<Company>) => {
    const res = await fetch('/api/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to add')
    await loadData()
  }

  const handleUpdateCompany = async (id: string, data: Partial<Company>) => {
    const res = await fetch(`/api/companies?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update')
    await loadData()
  }

  const handleDeleteCompany = async (id: string) => {
    const res = await fetch(`/api/companies?id=${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete')
    await loadData()
  }

  const handleApproveTestimonial = async (id: string, approved: boolean) => {
    const res = await fetch(`/api/testimonials?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved }),
    })
    if (!res.ok) throw new Error('Failed to update')
    await loadData()
  }

  const handleDeleteTestimonial = async (id: string) => {
    const res = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete')
    await loadData()
  }

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profile?.image && (
              <img src={profile.image} alt={profile.name} className="w-10 h-10 rounded-full object-cover" />
            )}
            <span className="font-medium">{profile?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            {profile?.username && (
              <a
                href={`/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Ver minha página
              </a>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <nav className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {(['profile', 'portfolio', 'companies', 'testimonials'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab ? 'bg-white shadow text-black' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'profile' && 'Perfil'}
              {tab === 'portfolio' && 'Portfólio'}
              {tab === 'companies' && 'Empresas'}
              {tab === 'testimonials' && 'Depoimentos'}
            </button>
          ))}
        </nav>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          {activeTab === 'profile' && (
            <ProfileForm
              profile={profile}
              onSave={handleSaveProfile}
            />
          )}
          {activeTab === 'profile' && <h1 className="text-xl font-bold mb-4">Editar Perfil</h1>}

          {activeTab === 'portfolio' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Portfólio</h2>
              <PortfolioForm
                portfolios={portfolios}
                onAdd={handleAddPortfolio}
                onDelete={handleDeletePortfolio}
              />
            </div>
          )}

          {activeTab === 'companies' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Empresas</h2>
              <CompanyForm
                companies={companies}
                onAdd={handleAddCompany}
                onUpdate={handleUpdateCompany}
                onDelete={handleDeleteCompany}
              />
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Depoimentos</h2>
              <TestimonialForm
                testimonials={testimonials}
                onApprove={handleApproveTestimonial}
                onDelete={handleDeleteTestimonial}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
