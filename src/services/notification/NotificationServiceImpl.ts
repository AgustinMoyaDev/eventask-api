import { INotificationService } from './INotificationService.js'
import { INotificationRepository } from '../../repositories/notification/INotificationRepository.js'

import { INotification, INotificationQueryOptions } from '../../types/INotification.js'
import { ICreateNotificationDto } from '../../types/dtos/notification.js'

import { ApiError } from '../../config/middlewares/ApiError.js'
import { BaseServiceImpl } from '../../services/BaseServiceImpl.js'

export class NotificationServiceImpl
  extends BaseServiceImpl<
    INotification,
    string,
    Omit<INotification, 'id'>,
    Partial<Omit<INotification, 'id'>>
  >
  implements INotificationService
{
  protected resourceName: string = 'Notification'

  constructor(private readonly notificationRepository: INotificationRepository) {
    super(notificationRepository)
  }

  async create(notificationData: ICreateNotificationDto): Promise<INotification> {
    const notification = await this.notificationRepository.create({
      ...notificationData,
      read: false,
      createdAt: new Date(),
    })

    if (!notification) {
      throw new ApiError(500, 'Failed to create notification in database')
    }

    return notification
  }

  async getUserNotifications(
    userId: string,
    options: INotificationQueryOptions = {}
  ): Promise<INotification[]> {
    return this.notificationRepository.findByUserId(userId, options)
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.countUnreadByUserId(userId)
  }

  async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
    return this.notificationRepository.markAsRead(notificationId, userId)
  }

  async markAllAsRead(userId: string): Promise<number> {
    return this.notificationRepository.markAllAsReadByUserId(userId)
  }

  async updateByInvitationId(invitationId: string, status: 'accepted' | 'rejected'): Promise<void> {
    await this.notificationRepository.updateMany(
      { type: 'invitation', 'data.invitationId': invitationId },
      { $set: { 'data.invitationStatus': status, updatedAt: new Date() } }
    )
  }
}
