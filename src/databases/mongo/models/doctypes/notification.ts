import { Document, Types } from 'mongoose'
import { InvitationStatus } from '../../../../types/IInvitation.js'
import { NotificationType } from '../../../../types/INotification.js'

/**
 * MongoDB document interface for notifications.
 * Extends Mongoose Document with notification-specific fields.
 */
export interface NotificationDoc extends Document {
  userId: Types.ObjectId
  type: NotificationType
  title: string
  message: string
  data?: {
    invitationId?: Types.ObjectId
    invitationStatus?: InvitationStatus
    taskId?: Types.ObjectId
    eventId?: Types.ObjectId
    fromUserId?: Types.ObjectId
    fromUserName?: string
    actionUrl?: string
  }
  read: boolean
  createdAt: Date
  updatedAt?: Date
}
