import express, { json } from 'express'
import logger from 'morgan'

import { createServer } from 'http'
import cookieParser from 'cookie-parser'
import lusca from 'lusca'
import { expressSession } from './config/middlewares/session.js'

import './databases/mongo/config.js'
import { mongoDbConnection } from './databases/mongo/config.js'

import { ensureUploadsFolders, uploadsStaticMiddleware } from './config/uploads.js'
import { validateAvatarMiddleware } from './middlewares/validators/validateAvatarMiddleware.js'
import { corsMiddleware } from './config/middlewares/cors.js'
import { errorRequestHandler } from './config/middlewares/errorRequestHandler.js'
import { notFoundRouteHandler } from './config/middlewares/notFoundRouteHandler.js'
import { apiRateLimiter } from './middlewares/rateLimits.js'

import { initializeNotificationSystem } from './config/dependencies.js'
import { initializeSocketServer } from './config/websocket/SocketServer.js'

import { createSecurityRouter } from './routes/security.js'
import { createAuthRouter } from './routes/auth.js'
import { createTaskRouter } from './routes/tasks.js'
import { createEventRouter } from './routes/events.js'
import { createCategoryRouter } from './routes/category.js'
import { createUserRouter } from './routes/user.js'
import { createInvitationRouter } from './routes/invitation.js'
import { createNotificationRouter } from './routes/notification.js'

//* Load .env file
import { env } from './config/env.js'

//* Create Express server
const app = express()

//* Trust proxy for secure cookies in production (Render/Heroku/etc.)
app.set('trust proxy', 1)

//* Apply rate limiter globally to all /api routes
app.use('/api', apiRateLimiter)

app.use(logger('dev'))
const httpServer = createServer(app)

//* CORS y body parsers
app.use(corsMiddleware())
app.use(json())

// ✅ PING / WARM-UP
// This route is ultra-lightweight: it doesn't check cookies, session data, databases, or CSRF.
// It responds instantly to wake up Render.com.
app.get('/api/health', (_req, res) => {
  res.status(200).send('OK')
})

app.use(cookieParser())
//* Session middleware for CSRF protection
app.use(expressSession())

//* CSRF protection - skip validation for public endpoints, but still inject csrfToken()
app.use((req, res, next) => {
  if (req.path === '/api/security/csrf-token' || req.path === '/api/health') {
    // Apply lusca (Inject csrfToken()) but skip validation
    return lusca.csrf({ angular: true })(req, res, next)
  }
  // Full CSRF validation for other routes
  lusca.csrf()(req, res, next)
})

app.disable('x-powered-by')

//* Ensure uploads/avatars folder exists
ensureUploadsFolders()

//* Serve static files from /uploads with CORS for cross-origin access
app.use('/api/uploads', corsMiddleware(), validateAvatarMiddleware, uploadsStaticMiddleware())

//* Mongo DB connection
await mongoDbConnection()

//* Initialize notification system
initializeNotificationSystem()

//* Initialize WebSocket server
initializeSocketServer(httpServer)

//* API routes
app.use('/api/security', createSecurityRouter())
app.use('/api/auth', createAuthRouter())
app.use('/api/categories', createCategoryRouter())
app.use('/api/users', createUserRouter())
app.use('/api/events', createEventRouter())
app.use('/api/tasks', createTaskRouter())
app.use('/api/notifications', createNotificationRouter())
app.use('/api/invitations', createInvitationRouter())

//* Missing routes
app.use(notFoundRouteHandler)

//* Centralized Error Handling
app.use(errorRequestHandler)

//* Port to listen:
const PORT = env.PORT ?? 1234
httpServer.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`)
})
