import { IPaginationResult } from '../../helpers/pagination.js'
import { AuthenticatedRequest } from '../../config/types/request.js'
import { BaseControllerImpl } from '../../controllers/base/BaseControllerImpl.js'
import { INotificationService } from '../../services/notification/INotificationService.js'
import { INotification, INotificationPaginationParams } from '../../types/INotification.js'

/**
 * Controller for notification management endpoints.
 * Handles user notification operations with proper authentication.
 */
export class NotificationController extends BaseControllerImpl<
  INotification,
  INotificationService
> {
  async getUserNotifications(req: AuthenticatedRequest): Promise<IPaginationResult<INotification>> {
    const { uid, query } = req
    const { page, perPage, sortBy, sortOrder, read, type } = query as INotificationPaginationParams

    const params: INotificationPaginationParams = {
      page: page ? parseInt(String(page)) : undefined,
      perPage: perPage ? parseInt(String(perPage)) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
      read: read ?? undefined,
      type: type as string | undefined,
    }

    return this.service.getUserNotifications(uid!, params)
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
