import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getUserByUsername } from '@/lib/models/User'
import { getApprovedTestimonials } from '@/lib/models/Testimonial'
import { getPortfolios } from '@/lib/models/Portfolio'
import { getCompanies } from '@/lib/models/Company'
import ProfileHeader from '@/components/public/ProfileHeader'
import ContactLinks from '@/components/public/ContactLinks'
import CTABanner from '@/components/public/CTABanner'
import CurrentlySection from '@/components/public/CurrentlySection'
import TestimonialsSection from '@/components/public/TestimonialsSection'
import PortfolioSection from '@/components/public/PortfolioSection'
import CompaniesSection from '@/components/public/CompaniesSection'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const profile = await getUserByUsername(username)
  
  if (!profile) return {}
  
  return {
    title: `${profile.name} — Portfólio`,
    description: profile.description,
    openGraph: {
      images: profile.image ? [profile.image] : [],
    },
  }
}

export default async function PublicPage({ params }: Props) {
  const { username } = await params
  const profile = await getUserByUsername(username)
  
  if (!profile) {
    notFound()
  }

  const [testimonials, portfolios, companies] = await Promise.all([
    getApprovedTestimonials(profile._id),
    getPortfolios(profile._id),
    getCompanies(profile._id),
  ])

  return (
    <main className="max-w-[480px] mx-auto px-5 pb-[60px] bg-white min-h-screen">
      <ProfileHeader profile={profile} />
      <ContactLinks email={profile.email} whatsapp={profile.whatsapp} />
      <CTABanner 
        headline={profile.headline} 
        description={profile.description} 
        ctaLabel={profile.ctaLabel} 
        ctaUrl={profile.ctaUrl} 
      />
      <CurrentlySection profile={profile} />
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
      {portfolios.length > 0 && <PortfolioSection portfolios={portfolios} />}
      {companies.length > 0 && <CompaniesSection companies={companies} />}
    </main>
  )
}
