import { Server as HttpServer } from 'http'

import { ServerOptions, Server as SocketServer } from 'socket.io'

import { authenticateSocket } from './SocketAuth.js'
import { AuthenticatedSocket, AuthenticatedServer, ConnectionData } from './SocketTypes.js'

import { env } from '../../config/env.js'

let io: AuthenticatedServer | null = null

export const initializeSocketServer = (httpServer: HttpServer): AuthenticatedServer => {
  const socketServerOptions: Partial<ServerOptions> = {
    cors: {
      origin: env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
  }

  io = new SocketServer(httpServer, socketServerOptions)

  io.use(authenticateSocket)

  io.on('connection', (socket: AuthenticatedSocket) => {
    const { userId } = socket.data

    console.info(`✅ User ${userId} connected via WebSocket`)
    socket.join(`user:${userId}`)

    const connectionData = {
      userId,
      timestamp: new Date().toISOString(),
    } as ConnectionData
    socket.emit('connected', connectionData)

    socket.on('disconnect', reason => {
      console.info(`❌ User ${userId} disconnected: ${reason}`)
    })
  })

  console.info('🔌 Socket.IO server initialized successfully')
  return io
}

export const getSocketServer = (): AuthenticatedServer | null => {
  return io
}
