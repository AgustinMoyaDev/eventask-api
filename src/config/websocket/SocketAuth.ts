import jwt from 'jsonwebtoken'

import { AuthenticatedSocket } from './SocketTypes.js'

import { JWTPayload } from '../../config/types/jwtPayload.js'

import { env } from '../../config/env.js'

/**
 * Authenticates WebSocket connections using JWT tokens
 * @param socket - Socket.IO socket instance
 * @param next - Next middleware function
 */
export const authenticateSocket = async (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
): Promise<void> => {
  try {
    const token = socket.handshake.auth?.token

    if (!token || typeof token !== 'string') {
      return next(new Error('Authentication token required'))
    }

    const decoded = jwt.verify(token, env.SECRET_JWT_SEED) as JWTPayload

    if (!decoded?.uid) {
      return next(new Error('Invalid authentication token'))
    }

    socket.data = {
      userId: decoded.uid,
      authenticated: true,
    }

    next()
  } catch (error) {
    console.error('Socket authentication error:', error)
    next(new Error('Authentication failed'))
  }
}
