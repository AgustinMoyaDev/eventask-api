import { INotificationData, NotificationType } from '../../types/INotification.js'

/**
 * DTO for creating new notifications.
 * Excludes auto-generated fields like id and timestamps.
 */
export interface ICreateNotificationDto {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: INotificationData
  read: boolean
  createdAt: Date
}

/**
 * DTO for updating existing notifications.
 * All fields are optional for partial updates.
 */
export interface IUpdateNotificationDto {
  read?: boolean
  updatedAt?: Date
}

export interface INotificationResponseDto {
  strategy: string
  success: boolean
  error?: unknown
}
