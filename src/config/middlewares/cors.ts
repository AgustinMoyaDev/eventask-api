import cors from 'cors'
import { env } from '../env.js'

export const corsMiddleware = (options: { acceptedOrigins?: string[] } = {}) =>
  cors({
    origin: (origin, callback) => {
      const acceptedOrigins = options.acceptedOrigins ?? env.ACCEPTED_ORIGINS

      if (!origin || acceptedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'), false)
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
