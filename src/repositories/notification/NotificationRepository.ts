import {
  buildPaginationResult,
  calculateSkip,
  normalizePaginationParams,
  IPaginationResult,
} from '../../helpers/pagination.js'
import { buildSortCriteria, createSortValidator } from '../../helpers/sortValidations.js'

import { MongooseRepository } from '../../repositories/MongooseRepository.js'

import { INotificationRepository } from './INotificationRepository.js'

import { NotificationModel } from '../../databases/mongo/models/schemas/notification.js'

import { INotification, INotificationPaginationParams } from '../../types/INotification.js'

const ALLOWED_SORT_FIELDS = ['createdAt', 'read', 'type'] as const
const { isAllowedField } = createSortValidator(ALLOWED_SORT_FIELDS)

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
   * Find notifications by user ID with pagination, filtering and metadata.
   * @param userId - User ID to find notifications for
   * @param params - Pagination and filtering parameters
   * @returns Paginated result with metadata
   */
  async findByUserId(
    userId: string,
    params: INotificationPaginationParams = {}
  ): Promise<IPaginationResult<INotification>> {
    // Normalize parameters
    const { page, perPage, sortBy, sortOrder, read, type } = {
      ...normalizePaginationParams(params),
      read: params.read,
      type: params.type,
    }

    // Build query components
    const skip = calculateSkip(page, perPage)
    const sortCriteria = buildSortCriteria(sortBy, sortOrder, isAllowedField, 'createdAt')

    // Build filter
    const query: Record<string, unknown> = { userId }
    if (read) query.read = read
    if (type) query.type = type

    // Execute query
    const [total, items] = await Promise.all([
      this.model.countDocuments(query).exec(),
      this.model
        .find(query)
        .sort(sortCriteria)
        .skip(skip)
        .limit(perPage)
        .lean<INotification[]>({ virtuals: true })
        .exec(),
    ])

    return buildPaginationResult(items, total, page, perPage)
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
