import { Schema, model } from 'mongoose'

import { NotificationDoc } from '../doctypes/notification.js'

import { NOTIFICATION_TYPE } from '../../../../types/INotification.js'
import { INVITATION_STATUS } from '../../../../types/IInvitation.js'

const NotificationSchema = new Schema<NotificationDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for notification'],
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPE,
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    data: {
      invitationId: { type: Schema.Types.ObjectId, ref: 'Invitation' },
      invitationStatus: { type: String, enum: Object.values(INVITATION_STATUS), required: false },
      taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
      eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
      fromUserId: { type: Schema.Types.ObjectId, ref: 'User' },
      fromUserName: String,
      actionUrl: String,
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
)

NotificationSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
})

NotificationSchema.virtual('fromUser', {
  ref: 'User',
  localField: 'data.fromUserId',
  foreignField: '_id',
  justOne: true,
})

NotificationSchema.index({ userId: 1, createdAt: -1 })
NotificationSchema.index({ userId: 1, read: 1 })

export const NotificationModel = model<NotificationDoc>('Notification', NotificationSchema)
