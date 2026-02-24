import { IPaginationOptions } from '../helpers/pagination.js'
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
  type: NotificationType
  title: string
  message: string
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
  invitationStatus?: InvitationStatus
  invitationId?: string
  taskTitle?: string
  taskId?: string
  eventId?: string
  fromUserId?: string
  fromUserName?: string
  actionUrl?: string // URL for notification action
  eventTitle?: string
  eventStart?: Date
  minutesUntilStart?: number
  createdBy?: string
  deallocatedBy?: string
}

/**
 * Query options for notification filtering.
 */
export interface INotificationQueryOptions extends IPaginationOptions {
  read?: boolean
  type?: string
}
