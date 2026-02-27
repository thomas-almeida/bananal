import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserById, updateUser, getUserByUsername } from '@/lib/models/User'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await getUserById(session.user.id)
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, image, username, location, headline, description, whatsapp, ctaLabel, ctaUrl, jobTitle, jobCompany, studyCourse, studyInstitution } = body

  if (username) {
    const existing = await getUserByUsername(username)
    if (existing && existing._id.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Username already in use' }, { status: 400 })
    }
  }

  const updated = await updateUser(session.user.id, {
    name,
    image,
    username,
    location,
    headline,
    description,
    whatsapp,
    ctaLabel,
    ctaUrl,
    jobTitle,
    jobCompany,
    studyCourse,
    studyInstitution,
  })

  return NextResponse.json(updated)
}
