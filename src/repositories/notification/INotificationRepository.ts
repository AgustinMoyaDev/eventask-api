import { IBaseRepository } from '../../repositories/IBaseRepository.js'
import { INotification, INotificationQueryOptions } from '../../types/INotification.js'

/**
 * Contract for notification repository operations.
 * Extends base repository with notification-specific methods.
 */
export interface INotificationRepository
  extends IBaseRepository<
    INotification,
    string,
    Omit<INotification, 'id'>,
    Partial<Omit<INotification, 'id'>>
  > {
  /**
   * Find notifications by user ID with optional filtering.
   * @param userId - User ID to find notifications for
   * @param options - Optional filtering parameters
   * @returns Array of user notifications ordered by creation date
   */
  findByUserId(userId: string, options?: INotificationQueryOptions): Promise<INotification[]>

  /**
   * Count unread notifications for a specific user.
   * @param userId - User ID to count unread notifications
   * @returns Number of unread notifications
   */
  countUnreadByUserId(userId: string): Promise<number>

  /**
   * Mark notification as read by ID and user validation.
   * @param notificationId - Notification ID to mark as read
   * @param userId - User ID for authorization check
   * @returns Updated notification or null if not found/authorized
   */
  markAsRead(notificationId: string, userId: string): Promise<INotification | null>

  /**
   * Mark all notifications as read for a specific user.
   * @param userId - User ID to mark all notifications as read
   * @returns Number of notifications updated
   */
  markAllAsReadByUserId(userId: string): Promise<number>

  /**
   * Update multiple notifications that match the filter criteria.
   * @param filter - MongoDB filter object
   * @param update - MongoDB update object
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateMany(filter: any, update: any): Promise<void>
}
