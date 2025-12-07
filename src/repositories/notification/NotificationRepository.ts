import { MongooseRepository } from '../../repositories/MongooseRepository.js'

import { INotificationRepository } from './INotificationRepository.js'

import { NotificationModel } from '../../databases/mongo/models/schemas/notification.js'

import { INotification, INotificationQueryOptions } from '../../types/INotification.js'

/**
 * MongoDB implementation of notification repository.
 * Handles all database operations for notifications.
 */
export class NotificationRepository
  extends MongooseRepository<
    INotification,
    string,
    Omit<INotification, 'id'>,
    Partial<Omit<INotification, 'id'>>
  >
  implements INotificationRepository
{
  constructor() {
    super(NotificationModel)
  }

  /**
   * Find notifications by user ID with optional filtering.
   * @param userId - User ID to find notifications for
   * @param options - Optional filtering parameters
   * @returns Array of user notifications ordered by creation date
   */
  async findByUserId(
    userId: string,
    options: INotificationQueryOptions = {}
  ): Promise<INotification[]> {
    const { limit = 20, offset = 0, read, type } = options

    const query: Record<string, unknown> = { userId }

    if (read !== undefined) query.read = read
    if (type) query.type = type

    const docs = await this.model
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .exec()

    return docs.map(doc => doc.toJSON())
  }

  /**
   * Count unread notifications for a specific user.
   * @param userId - User ID to count unread notifications
   * @returns Number of unread notifications
   */
  async countUnreadByUserId(userId: string): Promise<number> {
    return this.model.countDocuments({ userId, read: false }).exec()
  }

  /**
   * Mark notification as read by ID and user validation.
   * @param notificationId - Notification ID to mark as read
   * @param userId - User ID for authorization check
   * @returns Updated notification or null if not found/authorized
   */
  async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
    const doc = await this.model
      .findOneAndUpdate(
        { _id: notificationId, userId },
        { read: true, updatedAt: new Date() },
        { new: true }
      )
      .exec()

    return doc ? doc.toJSON() : null
  }

  /**
   * Mark all notifications as read for a specific user.
   * @param userId - User ID to mark all notifications as read
   * @returns Number of notifications updated
   */
  async markAllAsReadByUserId(userId: string): Promise<number> {
    const result = await this.model
      .updateMany({ userId, read: false }, { read: true, updatedAt: new Date() })
      .exec()

    return result.modifiedCount
  }

  /**
   * Update multiple notifications that match the filter criteria.
   * @param filter - MongoDB filter object
   * @param update - MongoDB update object
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateMany(filter: any, update: any): Promise<void> {
    await this.model.updateMany(filter, update)
  }
}
