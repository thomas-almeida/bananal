import mongoose, { Schema, Document } from 'mongoose'
import { connectDB } from '../mongodb'

export interface ICompany extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  url: string
  faviconUrl: string
  order: number
  createdAt: Date
}

const CompanySchema = new Schema<ICompany>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    faviconUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Company = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema)

export async function getCompanies(userId: string | mongoose.Types.ObjectId) {
  await connectDB()
  return Company.find({ userId }).sort({ order: 1, createdAt: -1 })
}

export async function createCompany(data: Partial<ICompany>) {
  await connectDB()
  return Company.create(data)
}

export async function deleteCompany(id: string) {
  await connectDB()
  return Company.findByIdAndDelete(id)
}

export async function updateCompany(id: string, data: Partial<ICompany>) {
  await connectDB()
  return Company.findByIdAndUpdate(id, data, { new: true })
}
