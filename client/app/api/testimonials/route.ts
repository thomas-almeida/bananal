import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllTestimonials, getApprovedTestimonials, createTestimonial, approveTestimonial, deleteTestimonial } from '@/lib/models/Testimonial'
import mongoose from 'mongoose'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')

  if (username) {
    const { getUserByUsername } = await import('@/lib/models/User')
    const user = await getUserByUsername(username)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const testimonials = await getApprovedTestimonials(user._id)
    return NextResponse.json(testimonials)
  }

  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const testimonials = await getAllTestimonials(session.user.id)
  return NextResponse.json(testimonials)
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const isPublic = searchParams.get('public') === 'true'

  if (isPublic) {
    const body = await req.json()
    const { authorName, authorImage, text, userId } = body

    const testimonial = await createTestimonial({
      userId: new mongoose.Types.ObjectId(userId),
      authorName,
      authorImage: authorImage || '',
      text,
      approved: false,
    })

    return NextResponse.json(testimonial)
  }

  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, url, imageUrl } = body

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  const body = await req.json()
  const { approved } = body

  const testimonial = await approveTestimonial(id, approved)
  return NextResponse.json(testimonial)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  await deleteTestimonial(id)
  return NextResponse.json({ success: true })
}
