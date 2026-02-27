import mongoose, { Schema, Document } from 'mongoose'
import { connectDB } from '../mongodb'

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  description: string
  url: string
  imageUrl: string
  order: number
  createdAt: Date
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    url: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Portfolio = mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema)

export async function getPortfolios(userId: string | mongoose.Types.ObjectId) {
  await connectDB()
  return Portfolio.find({ userId }).sort({ order: 1, createdAt: -1 })
}

export async function createPortfolio(data: Partial<IPortfolio>) {
  await connectDB()
  return Portfolio.create(data)
}

export async function deletePortfolio(id: string) {
  await connectDB()
  return Portfolio.findByIdAndDelete(id)
}
