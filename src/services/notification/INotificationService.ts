import { IBaseService } from '../../services/IBaseService.js'
import { INotification, INotificationQueryOptions } from '../../types/INotification.js'

/**
 * Contract for notification service operations.
 * Handles notification creation and delivery through multiple channels.
 */
export interface INotificationService extends IBaseService<
  INotification,
  string,
  Omit<INotification, 'id'>,
  Partial<Omit<INotification, 'id'>>
> {
  /**
   * Get user notifications with pagination and filtering.
   * @param userId - User ID to get notifications for
   * @param options - Query options for filtering and pagination
   * @returns Array of user notifications
   */
  getUserNotifications(
    userId: string,
    options?: INotificationQueryOptions
  ): Promise<INotification[]>

  /**
   * Get count of unread notifications for user.
   * @param userId - User ID to count unread notifications
   * @returns Number of unread notifications
   */
  getUnreadCount(userId: string): Promise<number>

  /**
   * Mark notification as read.
   * @param notificationId - Notification ID to mark as read
   * @param userId - User ID for authorization
   * @returns Updated notification or null if not found
   */
  markAsRead(notificationId: string, userId: string): Promise<INotification | null>

  /**
   * Mark all user notifications as read.
   * @param userId - User ID to mark all notifications as read
   * @returns Number of notifications updated
   */
  markAllAsRead(userId: string): Promise<number>

  /**
   * Update invitation notifications by invitation ID.
   * @param invitationId - Invitation ID to find related notifications
   * @param status - New invitation status
   */
  updateByInvitationId(invitationId: string, status: 'accepted' | 'rejected'): Promise<void>
}
