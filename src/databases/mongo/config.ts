import mongoose from 'mongoose'
import leanVirtuals from 'mongoose-lean-virtuals'
import leanId from 'mongoose-lean-id'

import { cleanOutput } from '../../databases/mongo/models/cleanOutput.js'

import { env } from '../../config/env.js'

export const mongoDbConnection = async (): Promise<void> => {
  const uri = env.DB_CONNECTION_STRING

  if (!uri) {
    console.error('❌ No DB_CONNECTION_STRING found in environment variables')
    process.exit(1) // Stop the app if there is no connection
  }

  try {
    await mongoose.connect(uri)
    console.info('✅ MongoDB connected successfully')
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error)
    process.exit(1)
  }
}

mongoose.plugin(leanVirtuals)
mongoose.plugin(leanId)
mongoose.plugin(cleanOutput)
