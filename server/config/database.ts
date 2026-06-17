import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState >= 1) {
    return
  }

  await mongoose.connect(env.DB_URI)
  console.log('[db] Connected to MongoDB')
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState >= 1
}
