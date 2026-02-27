import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPortfolios, createPortfolio, deletePortfolio } from '@/lib/models/Portfolio'
import mongoose from 'mongoose'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const portfolios = await getPortfolios(session.user.id)
  return NextResponse.json(portfolios)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, url, imageUrl } = body

  const portfolio = await createPortfolio({
    userId: new mongoose.Types.ObjectId(session.user.id),
    title,
    description,
    url,
    imageUrl,
  })

  return NextResponse.json(portfolio)
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

  await deletePortfolio(id)
  return NextResponse.json({ success: true })
}
