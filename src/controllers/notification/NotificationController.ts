import { AuthenticatedRequest } from '../../config/types/request.js'
import { BaseControllerImpl } from '../../controllers/base/BaseControllerImpl.js'
import { INotificationService } from '../../services/notification/INotificationService.js'
import { INotification, INotificationQueryOptions } from '../../types/INotification.js'

/**
 * Controller for notification management endpoints.
 * Handles user notification operations with proper authentication.
 */
export class NotificationController extends BaseControllerImpl<
  INotification,
  INotificationService
> {
  async getUserNotifications(req: AuthenticatedRequest): Promise<INotification[]> {
    const { uid, query } = req
    const { limit, offset, read, type } = query

    const options: INotificationQueryOptions = {
      limit: limit ? parseInt(limit as string) : 20,
      offset: offset ? parseInt(offset as string) : 0,
      read: read ? read === 'true' : undefined,
      type: type as string,
    }

    return this.service.getUserNotifications(uid!, options)
  }

  async getUnreadCount(req: AuthenticatedRequest) {
    const count = await this.service.getUnreadCount(req.uid!)
    return { unreadCount: count }
  }

  async markAsRead(req: AuthenticatedRequest) {
    const { id: notificationId } = req.params

    return this.service.markAsRead(notificationId, req.uid!)
  }

  async markAllAsRead(req: AuthenticatedRequest) {
    const updatedCount = await this.service.markAllAsRead(req.uid!)
    return { updatedCount }
  }
}
