import mongoose, { Schema, Document } from 'mongoose'
import { connectDB } from '../mongodb'

export interface ITestimonial extends Document {
  userId: mongoose.Types.ObjectId
  authorName: string
  authorImage: string
  text: string
  approved: boolean
  createdAt: Date
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    authorImage: { type: String, default: '' },
    text: { type: String, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Testimonial = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema)

export async function getApprovedTestimonials(userId: string | mongoose.Types.ObjectId) {
  await connectDB()
  return Testimonial.find({ userId, approved: true }).sort({ createdAt: -1 })
}

export async function getAllTestimonials(userId: string | mongoose.Types.ObjectId) {
  await connectDB()
  return Testimonial.find({ userId }).sort({ approved: -1, createdAt: -1 })
}

export async function createTestimonial(data: Partial<ITestimonial>) {
  await connectDB()
  return Testimonial.create(data)
}

export async function approveTestimonial(id: string, approved: boolean) {
  await connectDB()
  return Testimonial.findByIdAndUpdate(id, { approved }, { new: true })
}

export async function deleteTestimonial(id: string) {
  await connectDB()
  return Testimonial.findByIdAndDelete(id)
}
