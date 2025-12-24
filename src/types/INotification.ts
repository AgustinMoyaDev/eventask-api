import { IPaginationParams } from '../helpers/pagination.js'
import { InvitationStatus } from './IInvitation.js'

export const NOTIFICATION_TYPE = {
  TASK: 'task',
  EVENT: 'event',
  INVITATION: 'invitation',
  SYSTEM: 'system',
} as const

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE]

/**
 * Notification entity interface.
 * Represents a single notification in the system.
 */
export interface INotification {
  id?: string
  userId: string // User receiving the notification
  type: NotificationType // Type of notification
  title: string // Notification title
  message: string // Notification content
  data?: INotificationData // Additional context data
  read: boolean // Whether user has read it
  createdAt: Date
  updatedAt?: Date
}

/**
 * Additional data that can be attached to notifications.
 * Provides context for specific notification types.
 */
export interface INotificationData {
  // Invitation-related data
  invitationId?: string
  invitationStatus?: InvitationStatus
  actionUrl?: string // URL for notification action
  // Task-related data
  taskId?: string
  taskTitle?: string
  // Event-related data
  eventId?: string
  eventTitle?: string
  eventStart?: string
  minutesUntilStart?: number
  // General Data
  createdBy?: string
  deallocatedBy?: string
  fromUserId?: string // User who triggered the notification
  fromUserName?: string // Name of user who triggered it
}

/**
 * Query options for notification filtering.
 */
export interface INotificationPaginationParams extends IPaginationParams {
  read?: boolean
  type?: string
}
