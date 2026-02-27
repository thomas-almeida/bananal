import mongoose from 'mongoose'

const MONGODB_URI = process.env.DB_URI!

if (!MONGODB_URI) {
  throw new Error('DB_URI não definida no .env.local')
}

let cached = (global as any).mongoose || { conn: null, promise: null }

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
  }

  cached.conn = await cached.promise
  return cached.conn
}
