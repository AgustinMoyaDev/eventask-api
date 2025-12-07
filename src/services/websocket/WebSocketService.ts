import { getSocketServer } from '../../config/websocket/SocketServer.js'
import { INotification } from '../../types/INotification.js'

export class WebSocketService {
  emitNotificationToUser(userId: string, notification: INotification): void {
    const io = getSocketServer()

    if (!io) {
      console.warn('⚠️ Socket.IO server not initialized, skipping real-time notification')
      return
    }

    try {
      io.to(`user:${userId}`).emit('notification', notification)

      console.info(`📨 Real-time notification sent to user ${userId}: ${notification.title}`)
    } catch (error) {
      console.error('❌ Failed to emit WebSocket notification:', error)
    }
  }

  getConnectedUsersCount(): number {
    const io = getSocketServer()
    return io?.engine.clientsCount || 0
  }
}
