import session from 'express-session'

import { env } from '../../config/env.js'
import { RequestHandler } from 'express'
import MongoStore from 'connect-mongo'

/**
 * Express session middleware configuration.
 * Uses secure cookies and SameSite 'none' in production for cross-origin support.
 * @returns {RequestHandler} Configured session middleware
 */
export const expressSession = (): RequestHandler => {
  return session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    name: 'eventask.sid',
    store: MongoStore.create({
      mongoUrl: env.DB_CONNECTION_STRING,
      ttl: 60 * 60 * 24 * 7, // Time to live in seconds (approximately match maxAge)
      autoRemove: 'native', // Leave Mongo to clean up expired sessions
      touchAfter: 24 * 3600, // Reduce frequency of writes to DB if session hasn't changed
    }),
    cookie: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      // Ensures cookie is sent on all routes
      path: '/',
      domain: undefined, // Let browser handle domain automatically
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
}
