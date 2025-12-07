import dotenv from 'dotenv'

const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.development'
dotenv.config({ path: envFile })

const requiredVariables = [
  'DB_CONNECTION_STRING',
  'EMAIL_APP_PASSWORD',
  'EMAIL_FROM_NAME',
  'EMAIL_PROVIDER',
  'EMAIL_SERVICE',
  'EMAIL_USER',
  'FRONTEND_URL',
  'NODE_ENV',
  'PORT',
  'SECRET_JWT_SEED',
  'SESSION_SECRET',
  'ACCEPTED_ORIGINS',
  'GOOGLE_CLIENT_ID',
] as const

const missing = requiredVariables.filter(key => !process.env[key])
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`)
  process.exit(1)
}

const accepted_origins_values = process.env.ACCEPTED_ORIGINS
  ? process.env.ACCEPTED_ORIGINS.split(',').map(origin => origin.trim())
  : []

export const env = {
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
  EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_USER: process.env.EMAIL_USER,
  FRONTEND_URL: process.env.FRONTEND_URL,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SECRET_JWT_SEED: process.env.SECRET_JWT_SEED,
  SESSION_SECRET: process.env.SESSION_SECRET,
  ACCEPTED_ORIGINS: accepted_origins_values,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
}
