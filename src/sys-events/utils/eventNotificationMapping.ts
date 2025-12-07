import { EVENT_NAMES, EventName } from '../types/sys-events.js'
import { NOTIFICATION_TYPE, NotificationType } from '../../types/INotification.js'

/**
 * Maps event types to their corresponding notification types.
 * Provides type-safe mapping between domain events and notification categories.
 */
export const EVENT_TO_NOTIFICATION_TYPE_MAP: Record<EventName, NotificationType> = {
  // Invitation domain events → invitation notifications
  [EVENT_NAMES.INVITATION_SEND]: NOTIFICATION_TYPE.INVITATION,
  [EVENT_NAMES.INVITATION_ACCEPT]: NOTIFICATION_TYPE.INVITATION,
  [EVENT_NAMES.INVITATION_ACCEPTED]: NOTIFICATION_TYPE.INVITATION,
  [EVENT_NAMES.INVITATION_REJECTED]: NOTIFICATION_TYPE.INVITATION,
  [EVENT_NAMES.INVITATION_SENT]: NOTIFICATION_TYPE.INVITATION,
  [EVENT_NAMES.INVITATION_REJECT]: NOTIFICATION_TYPE.INVITATION,

  // Task domain events → task notifications
  [EVENT_NAMES.TASK_ASSIGNED]: NOTIFICATION_TYPE.TASK,
  [EVENT_NAMES.TASK_DEALLOCATED]: NOTIFICATION_TYPE.TASK,
  [EVENT_NAMES.TASK_COMPLETED]: NOTIFICATION_TYPE.TASK,
  [EVENT_NAMES.TASK_DUE_SOON]: NOTIFICATION_TYPE.TASK,

  // Event domain events → event notifications
  [EVENT_NAMES.EVENT_ASSIGNED]: NOTIFICATION_TYPE.EVENT,
  [EVENT_NAMES.EVENT_DEALLOCATED]: NOTIFICATION_TYPE.EVENT,
  [EVENT_NAMES.EVENT_REMINDER]: NOTIFICATION_TYPE.EVENT,
  [EVENT_NAMES.EVENT_CREATED]: NOTIFICATION_TYPE.EVENT,
  [EVENT_NAMES.EVENT_UPDATED]: NOTIFICATION_TYPE.EVENT,

  // User domain events → system notifications (admin level)
  [EVENT_NAMES.USER_REGISTERED]: NOTIFICATION_TYPE.SYSTEM,
  [EVENT_NAMES.USER_PROFILE_UPDATED]: NOTIFICATION_TYPE.SYSTEM,

  // System domain events → system notifications
  [EVENT_NAMES.SYSTEM_MAINTENANCE]: NOTIFICATION_TYPE.SYSTEM,
  [EVENT_NAMES.SYSTEM_UPDATE]: NOTIFICATION_TYPE.SYSTEM,
} as const

/**
 * Helper function to get notification type from event name.
 * Provides type-safe conversion with compile-time validation.
 *
 * @param eventName - The event name to map
 * @returns The corresponding notification type
 */
export function getNotificationTypeFromEvent(eventName: EventName): NotificationType {
  return EVENT_TO_NOTIFICATION_TYPE_MAP[eventName]
}

/**
 * Helper function to check if an event should generate notifications.
 * All events in our system currently generate notifications, but this
 * provides a centralized place to control notification generation.
 *
 * @param eventName - The event name to check
 * @returns Whether the event should generate notifications
 */
export function shouldGenerateNotification(eventName: EventName): boolean {
  return eventName in EVENT_TO_NOTIFICATION_TYPE_MAP
}
