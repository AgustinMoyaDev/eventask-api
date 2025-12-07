import { INVITATION_STATUS } from '../../types/IInvitation.js'

/**
 * Base interface for invitation events with common properties.
 * Includes timestamp for complete audit trail.
 */
interface IBasicInvitation {
  invitationId: string
  from: string
  to?: string
  timestamp: Date
}

/**
 * Event fired when an invitation is accepted.
 * Contains specific state and user context.
 */
export interface InvitationAcceptedEvent extends IBasicInvitation {
  invitationStatus: typeof INVITATION_STATUS.ACCEPTED
  acceptedBy: {
    id: string
    firstName: string
    lastName: string
  }
}

/**
 * Event fired when an invitation is rejected.
 * Contains specific state and user context.
 */
export interface InvitationRejectedEvent extends IBasicInvitation {
  invitationStatus: typeof INVITATION_STATUS.REJECTED
  rejectedBy: {
    id: string
    firstName: string
    lastName: string
  }
}

/**
 * Event fired when an invitation is sent.
 * Contains specific state and sender context.
 */
export interface InvitationSentEvent extends IBasicInvitation {
  invitationStatus: typeof INVITATION_STATUS.PENDING
  email: string
  sentBy: {
    id: string
    firstName: string
    lastName: string
  }
}

/**
 * Event fired when a task is assigned to a user.
 * Contains task context and assignment details.
 */
export interface TaskAssignedEvent {
  taskId: string
  assignedTo: string
  assignedBy: string
  taskTitle: string
  timestamp: Date
}

export interface TaskDeallocatedEvent {
  taskId: string
  taskTitle: string
  deallocatedBy: string
  deallocatedFrom: string
  timestamp: Date
}

/**
 * Event fired when a task is marked as completed.
 * Contains completion context and user details.
 */
export interface TaskCompletedEvent {
  taskId: string
  completedBy: string
  taskTitle: string
  completedAt: Date
  timestamp: Date
}

/**
 * Event fired when a task is approaching its due date.
 * Used for reminder notifications.
 */
export interface TaskDueSoonEvent {
  taskId: string
  assignedTo: string
  taskTitle: string
  dueDate: Date
  timestamp: Date
}

/**
 * Event fired when a collaborator is assigned to an event.
 * Contains assignment context and collaborator details.
 */
export interface EventAssignmentEvent {
  eventId: string
  collaboratorId: string
  eventTitle: string
  createdBy: string
  timestamp: Date
  assignedBy: {
    id: string
    firstName: string
    lastName: string
  }
}

export interface EventDeassignmentEvent {
  eventId: string
  collaboratorId: string
  eventTitle: string
  createdBy: string
  timestamp: Date
  deallocatedBy: {
    id: string
    firstName: string
    lastName: string
  }
}

/**
 * Event fired for calendar event reminders.
 * Contains reminder context and timing.
 */
export interface EventReminderEvent {
  eventId: string
  userId: string
  eventTitle: string
  reminderTime: Date
  timestamp: Date
}

/**
 * Event fired when a new calendar event is created.
 * Contains event details and attendee information.
 */
export interface EventCreatedEvent {
  eventId: string
  createdBy: string
  eventTitle: string
  eventDate: Date
  attendeeIds: string[]
  timestamp: Date
}

/**
 * Event fired when a calendar event is updated.
 * Contains change tracking and modifier information.
 */
export interface EventUpdatedEvent {
  eventId: string
  updatedBy: string
  eventTitle: string
  changes: Record<string, unknown>
  timestamp: Date
}

/**
 * Event fired when a new user registers in the system.
 * Contains user registration details for audit and onboarding.
 */
export interface UserRegisteredEvent {
  userId: string
  email: string
  firstName: string
  lastName: string
  registeredAt: Date
  timestamp: Date
}

/**
 * Event fired when a user's profile is updated.
 * Contains change tracking and modifier information.
 */
export interface UserProfileUpdatedEvent {
  userId: string
  updatedBy: string
  changes: Record<string, unknown>
  updatedAt: Date
  timestamp: Date
}

/**
 * Event fired when system maintenance is scheduled.
 * Contains maintenance details and affected services.
 */
export interface SystemMaintenanceEvent {
  maintenanceId: string
  scheduledAt: Date
  estimatedDuration: number
  affectedServices: string[]
  timestamp: Date
}

/**
 * Event fired when a system update is deployed.
 * Contains version information and feature list.
 */
export interface SystemUpdateEvent {
  updateId: string
  version: string
  features: string[]
  deployedAt: Date
  timestamp: Date
}

export const EVENT_NAMES = {
  // Invitation domain events
  INVITATION_ACCEPTED: 'invitation:accepted',
  INVITATION_REJECTED: 'invitation:rejected',
  INVITATION_SENT: 'invitation:sent',
  INVITATION_ACCEPT: 'invitation:accept',
  INVITATION_REJECT: 'invitation:reject',
  INVITATION_SEND: 'invitation:send',

  // Task domain events
  TASK_ASSIGNED: 'task:assigned',
  TASK_DEALLOCATED: 'task:deallocated',
  TASK_COMPLETED: 'task:completed',
  TASK_DUE_SOON: 'task:due_soon',

  // Event domain events (calendar events)
  EVENT_ASSIGNED: 'event:assigned',
  EVENT_DEALLOCATED: 'event:deallocated',
  EVENT_REMINDER: 'event:reminder',
  EVENT_CREATED: 'event:created',
  EVENT_UPDATED: 'event:updated',

  // User domain events
  USER_REGISTERED: 'user:registered',
  USER_PROFILE_UPDATED: 'user:profile_updated',

  // System domain events
  SYSTEM_MAINTENANCE: 'system:maintenance',
  SYSTEM_UPDATE: 'system:update',
} as const

export type EventName = (typeof EVENT_NAMES)[keyof typeof EVENT_NAMES]
