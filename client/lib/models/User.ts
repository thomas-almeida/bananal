import mongoose, { Schema, Document } from 'mongoose'
import { connectDB } from '../mongodb'

export interface IUser extends Document {
  email: string
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
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    username: { type: String, required: true, unique: true },
    location: { type: String, default: '' },
    headline: { type: String, default: '' },
    description: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    ctaLabel: { type: String, default: '' },
    ctaUrl: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    jobCompany: { type: String, default: '' },
    studyCourse: { type: String, default: '' },
    studyInstitution: { type: String, default: '' },
  },
  { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export async function getUserByEmail(email: string) {
  await connectDB()
  return User.findOne({ email })
}

export async function getUserById(id: string) {
  await connectDB()
  return User.findById(id)
}

export async function getUserByUsername(username: string) {
  await connectDB()
  return User.findOne({ username })
}

export async function createUser(data: Partial<IUser>) {
  await connectDB()
  return User.create(data)
}

export async function updateUser(id: string, data: Partial<IUser>) {
  await connectDB()
  return User.findByIdAndUpdate(id, data, { new: true })
}

export async function generateUniqueUsername(name: string) {
  await connectDB()
  const baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  let username = baseUsername
  let counter = 1

  while (await User.findOne({ username })) {
    username = `${baseUsername}-${counter}`
    counter++
  }

  return username
}
