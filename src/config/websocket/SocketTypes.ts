import { Socket, Server } from 'socket.io'
import {
  EVENT_NAMES,
  InvitationAcceptedEvent,
  InvitationSentEvent,
} from '../../sys-events/types/sys-events.js'
import { INotification } from '../../types/INotification.js'

/**
 * WebSocket event types for real-time notifications
 */
export interface ServerToClientEvents {
  /**
   * Notification event sent to client
   * @param notification - The notification data
   */
  notification: (notification: INotification) => void

  /**
   * User connection confirmation
   * @param data - Connection status and user info
   */
  connected: (data: ConnectionData) => void

  /**
   * Error event for debugging
   * @param error - Error message
   */
  error: (error: string) => void
  /**
   * Notification type event sent to client
   * @param notification - The notification data
   */
  [EVENT_NAMES.INVITATION_SENT]: (data: InvitationSentEvent) => void
  [EVENT_NAMES.INVITATION_ACCEPTED]: (data: InvitationAcceptedEvent) => void
}

/**
 * Client to server events (for future use)
 */
export interface ClientToServerEvents {
  [EVENT_NAMES.INVITATION_SEND]: (data: { email: string }) => void
  [EVENT_NAMES.INVITATION_ACCEPT]: (data: { invitationId: string }) => void
}

/**
 * Socket data attached to each connection
 */
export interface SocketData {
  userId: string
  authenticated: boolean
}

export interface ConnectionData {
  userId: string
  timestamp: string
}

/**
 * Authenticated socket with user data
 */
export type AuthenticatedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  never,
  SocketData
>

/**
 * Authenticated socket with user data
 */
export type AuthenticatedServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  never,
  SocketData
>
