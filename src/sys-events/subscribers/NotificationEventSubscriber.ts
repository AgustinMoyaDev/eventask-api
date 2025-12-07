import { INotificationService } from '../../services/notification/INotificationService.js'
import { IUserService } from '../../services/user/IUserService.js'
import { WebSocketService } from '../../services/websocket/WebSocketService.js'

import { getNotificationTypeFromEvent } from '../../sys-events/utils/eventNotificationMapping.js'
import { IApplicationEventEmitter } from '../../sys-events/IApplicationEventEmitter.js'

import {
  EVENT_NAMES,
  EventAssignmentEvent,
  EventDeassignmentEvent,
  InvitationAcceptedEvent,
  InvitationRejectedEvent,
  InvitationSentEvent,
  TaskAssignedEvent,
  TaskDeallocatedEvent,
} from '../../sys-events/types/sys-events.js'
import { ICreateNotificationDto } from '../../types/dtos/notification.js'
import { INVITATION_STATUS } from '../../types/IInvitation.js'

/**
 * Event subscribers for notification system.
 * Connects InvitationService events to notification delivery.
 */
export class NotificationEventSubscriber {
  constructor(
    private eventEmitter: IApplicationEventEmitter,
    private notificationService: INotificationService,
    private userService: IUserService,
    private webSocketService: WebSocketService
  ) {
    this.subscribeToEvents()
  }

  /**
   * Subscribe to all relevant application events.
   */
  private subscribeToEvents(): void {
    this.eventEmitter.on<InvitationSentEvent>(
      EVENT_NAMES.INVITATION_SENT,
      this.handleSentInvitation.bind(this)
    )

    this.eventEmitter.on<InvitationAcceptedEvent>(
      EVENT_NAMES.INVITATION_ACCEPTED,
      this.handleAcceptedInvitation.bind(this)
    )

    this.eventEmitter.on<InvitationRejectedEvent>(
      EVENT_NAMES.INVITATION_REJECTED,
      this.handleRejectedInvitation.bind(this)
    )

    this.eventEmitter.on<EventAssignmentEvent>(
      EVENT_NAMES.EVENT_ASSIGNED,
      this.handleAssignedEvent.bind(this)
    )

    this.eventEmitter.on<EventDeassignmentEvent>(
      EVENT_NAMES.EVENT_DEALLOCATED,
      this.handleDeallocatedEvent.bind(this)
    )

    this.eventEmitter.on<TaskAssignedEvent>(
      EVENT_NAMES.TASK_ASSIGNED,
      this.handleAssignedParticipant.bind(this)
    )

    this.eventEmitter.on<TaskDeallocatedEvent>(
      EVENT_NAMES.TASK_DEALLOCATED,
      this.handleDeallocatedParticipant.bind(this)
    )
  }

  /**
   * Handle invitation accepted event.
   * Creates a NEW notification for the inviter when someone accepts their invitation.
   * @param eventData - Invitation accepted event payload
   */
  private async handleAcceptedInvitation(eventData: InvitationAcceptedEvent): Promise<void> {
    try {
      // Get the inviter user (who will receive the notification)
      const inviter = await this.userService.findById(eventData.from)
      if (!inviter) {
        console.error(`### Inviter user not found: ${eventData.from}`)
        return
      }

      const notificationDto: ICreateNotificationDto = {
        userId: inviter.id,
        title: 'Invitation Accepted',
        type: getNotificationTypeFromEvent(EVENT_NAMES.INVITATION_ACCEPTED),
        message: `${eventData.acceptedBy.firstName} ${eventData.acceptedBy.lastName} accepted your contact invitation`,
        data: {
          invitationId: eventData.invitationId,
          invitationStatus: eventData.invitationStatus,
          fromUserId: eventData.to,
          fromUserName: `${eventData.acceptedBy.firstName} ${eventData.acceptedBy.lastName}`,
          actionUrl: `/contacts/${eventData.to}`,
        },
        read: false,
        createdAt: new Date(),
      }

      // Update original invitation notification status
      await this.notificationService.updateByInvitationId(
        eventData.invitationId,
        INVITATION_STATUS.ACCEPTED
      )

      // Create new notification for the inviter (who sent the invitation).
      const createdNotification = await this.notificationService.create(notificationDto)
      // Emit real-time notification via WebSocket
      this.webSocketService.emitNotificationToUser(inviter.id, createdNotification)
    } catch (error) {
      console.error('### Failed to handle invitation accepted event:', error)
      // Don't throw - this is a "nice to have" operation
    }
  }
  /**
   * Handle invitation rejected event.
   * Creates a NEW notification for the inviter when someone rejects their invitation.
   * @param eventData - Invitation rejected event payload
   */
  private async handleRejectedInvitation(eventData: InvitationRejectedEvent): Promise<void> {
    try {
      // Get the inviter user (who will receive the notification)
      const inviter = await this.userService.findById(eventData.from)
      if (!inviter) {
        console.error(`### Inviter user not found: ${eventData.from}`)
        return
      }

      const notificationDto: ICreateNotificationDto = {
        userId: inviter.id,
        title: 'Invitation Declined',
        type: getNotificationTypeFromEvent(EVENT_NAMES.INVITATION_REJECTED),
        message: `${eventData.rejectedBy.firstName} ${eventData.rejectedBy.lastName} declined your contact invitation`,
        data: {
          invitationId: eventData.invitationId,
          invitationStatus: eventData.invitationStatus,
          fromUserId: eventData.to,
          fromUserName: `${eventData.rejectedBy.firstName} ${eventData.rejectedBy.lastName}`,
        },
        read: false,
        createdAt: new Date(),
      }

      // Update original invitation notification status
      await this.notificationService.updateByInvitationId(eventData.invitationId, 'rejected')

      // Create new notification for the inviter (who sent the invitation).
      const createdNotification = await this.notificationService.create(notificationDto)
      // Emit real-time notification via WebSocket
      this.webSocketService.emitNotificationToUser(inviter.id, createdNotification)
    } catch (error) {
      console.error('### Failed to handle invitation rejected event:', error)
      // Don't throw - this is a "nice to have" operation
    }
  }
  /**
   * Handle invitation sent event.
   * Creates notification for the invited user if they exist in the system.
   * Only creates in-app notification, email is handled by InvitationService.
   * @param eventData - Invitation sent event payload
   */
  private async handleSentInvitation(eventData: InvitationSentEvent): Promise<void> {
    try {
      if (!eventData.to) {
        console.log(`### Invitation sent to non-registered user: ${eventData.email}`)
        return
      }

      const invitedUser = await this.userService.findById(eventData.to)
      if (!invitedUser) {
        console.error(`### Invited user not found: ${eventData.to}`)
        return
      }

      const notificationDto = {
        userId: invitedUser.id,
        title: 'New Contact Invitation',
        type: getNotificationTypeFromEvent(EVENT_NAMES.INVITATION_SENT),
        message: `${eventData.sentBy.firstName} ${eventData.sentBy.lastName} sent you a contact invitation`,
        data: {
          invitationId: eventData.invitationId,
          invitationStatus: eventData.invitationStatus,
          fromUserId: eventData.from,
          fromUserName: `${eventData.sentBy.firstName} ${eventData.sentBy.lastName}`,
          actionUrl: `/invitations/${eventData.invitationId}`,
        },
        read: false,
        createdAt: new Date(),
      }

      const createdNotification = await this.notificationService.create(notificationDto)
      this.webSocketService.emitNotificationToUser(invitedUser.id, createdNotification)
    } catch (error) {
      console.error('### Failed to handle invitation sent event:', error)
    }
  }

  private async handleAssignedEvent(eventData: EventAssignmentEvent) {
    try {
      const assignedUser = await this.userService.findById(eventData.collaboratorId)
      if (!assignedUser) {
        console.error(`### Assigned user not found: ${eventData.collaboratorId}`)
        return
      }

      const notificationDto: ICreateNotificationDto = {
        userId: assignedUser.id,
        title: 'New Event Assigned',
        type: getNotificationTypeFromEvent(EVENT_NAMES.EVENT_ASSIGNED),
        message: `You have been assigned to the event: ${eventData.eventTitle}`,
        data: {
          eventId: eventData.eventId,
          eventTitle: eventData.eventTitle,
          createdBy: eventData.createdBy,
        },
        read: false,
        createdAt: new Date(),
      }

      const createdNotification = await this.notificationService.create(notificationDto)
      this.webSocketService.emitNotificationToUser(assignedUser.id, createdNotification)
    } catch (error) {
      console.error('### Failed to handle event collaborator assigned event:', error)
    }
  }

  private async handleDeallocatedEvent(eventData: EventDeassignmentEvent) {
    try {
      const deallocatedUser = await this.userService.findById(eventData.collaboratorId)
      if (!deallocatedUser) {
        console.error(`### Deallocated user not found: ${eventData.collaboratorId}`)
        return
      }

      const notificationDto: ICreateNotificationDto = {
        userId: deallocatedUser.id,
        title: 'Event Deallocated',
        type: getNotificationTypeFromEvent(EVENT_NAMES.EVENT_DEALLOCATED),
        message: `You have been deallocated from the event: ${eventData.eventTitle}`,
        data: {
          eventId: eventData.eventId,
          eventTitle: eventData.eventTitle,
          deallocatedBy: eventData.createdBy,
        },
        read: false,
        createdAt: new Date(),
      }

      const createdNotification = await this.notificationService.create(notificationDto)
      this.webSocketService.emitNotificationToUser(deallocatedUser.id, createdNotification)
    } catch (error) {
      console.error('### Failed to handle event collaborator deallocated event:', error)
    }
  }

  private async handleAssignedParticipant(eventData: TaskAssignedEvent): Promise<void> {
    try {
      const assignedUser = await this.userService.findById(eventData.assignedTo)
      if (!assignedUser) {
        console.error(`### Assigned user not found: ${eventData.assignedTo}`)
        return
      }

      const notificationDto: ICreateNotificationDto = {
        userId: assignedUser.id,
        title: 'New Task Assigned',
        type: getNotificationTypeFromEvent(EVENT_NAMES.TASK_ASSIGNED),
        message: `You have been assigned to the task: ${eventData.taskTitle}`,
        data: {
          taskId: eventData.taskId,
          taskTitle: eventData.taskTitle,
          createdBy: eventData.assignedBy,
        },
        read: false,
        createdAt: new Date(),
      }

      const createdNotification = await this.notificationService.create(notificationDto)
      this.webSocketService.emitNotificationToUser(assignedUser.id, createdNotification)
    } catch (error) {
      console.error('### Failed to handle task assigned event:', error)
    }
  }

  private async handleDeallocatedParticipant(eventData: TaskDeallocatedEvent): Promise<void> {
    try {
      const deallocatedUser = await this.userService.findById(eventData.deallocatedFrom)
      if (!deallocatedUser) {
        console.error(`### Deallocated user not found: ${eventData.deallocatedFrom}`)
        return
      }

      const notificationDto: ICreateNotificationDto = {
        userId: deallocatedUser.id,
        title: 'Task Deallocated',
        type: getNotificationTypeFromEvent(EVENT_NAMES.TASK_DEALLOCATED),
        message: `You have been deallocated from the task: ${eventData.taskTitle}`,
        data: {
          taskId: eventData.taskId,
          taskTitle: eventData.taskTitle,
          deallocatedBy: eventData.deallocatedBy,
        },
        read: false,
        createdAt: new Date(),
      }

      const createdNotification = await this.notificationService.create(notificationDto)
      this.webSocketService.emitNotificationToUser(deallocatedUser.id, createdNotification)
    } catch (error) {
      console.error('### Failed to handle task deallocated event:', error)
    }
  }
}
