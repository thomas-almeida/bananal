import { NextRequest, NextResponse } from 'next/server'
import { getUserByUsername } from '@/lib/models/User'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const user = await getUserByUsername(username)

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    _id: user._id,
    name: user.name,
    image: user.image,
    username: user.username,
    location: user.location,
    headline: user.headline,
    description: user.description,
    whatsapp: user.whatsapp,
    ctaLabel: user.ctaLabel,
    ctaUrl: user.ctaUrl,
    jobTitle: user.jobTitle,
    jobCompany: user.jobCompany,
    studyCourse: user.studyCourse,
    studyInstitution: user.studyInstitution,
    email: user.email,
  })
}
