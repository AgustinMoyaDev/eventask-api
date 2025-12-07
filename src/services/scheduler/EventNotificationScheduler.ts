import cron from 'node-cron'

import { getEventRepository, getNotificationService } from '../../config/dependencies.js'
import { getWebSocketService } from '../../config/dependencies.js'

import { getNotificationTypeFromEvent } from '../../sys-events/utils/eventNotificationMapping.js'
import { EVENT_NAMES } from '../../sys-events/types/sys-events.js'

import { INotification } from '../../types/INotification.js'

/**
 * Service for scheduling notifications for upcoming events
 */
export class EventNotificationScheduler {
  private static instance: EventNotificationScheduler
  private isRunning = false

  private constructor() {}

  /**
   * Gets singleton instance
   */
  static getInstance(): EventNotificationScheduler {
    if (!EventNotificationScheduler.instance) {
      EventNotificationScheduler.instance = new EventNotificationScheduler()
    }
    return EventNotificationScheduler.instance
  }

  /**
   * Starts the notification scheduler
   */
  start(): void {
    if (this.isRunning) {
      console.log('📅 Event notification scheduler already running')
      return
    }

    // ✅ Check every minute for events starting in 10 minutes or less
    cron.schedule('* * * * *', async () => {
      try {
        await this.checkUpcomingEvents()
      } catch (error) {
        console.error('❌ Error in event notification scheduler:', error)
      }
    })

    this.isRunning = true
    console.log('📅 Event notification scheduler started')
  }

  /**
   * Stops the notification scheduler
   */
  stop(): void {
    if (!this.isRunning) {
      console.log('📅 Event notification scheduler already stopped')
      return
    }

    // Stop all cron jobs
    cron.getTasks().forEach(task => task.stop())
    this.isRunning = false
    console.log('📅 Event notification scheduler stopped')
  }

  /**
   * Checks for events starting within the specified minutes
   * @param minutesAhead - Minutes before event start to send notification (default: 10)
   */
  private async checkUpcomingEvents(minutesAhead = 10): Promise<void> {
    const eventRepository = getEventRepository()
    const webSocketService = getWebSocketService()

    // Calculate time window
    const now = new Date()
    const futureTimeMs = new Date(now.getTime() + minutesAhead * 60 * 1000)
    // Find events starting in the next X minutes
    const upcomingEvents = await eventRepository.findEventsInTimeRange(now, futureTimeMs, {
      lastNotificationSent: { $exists: false },
    })

    if (upcomingEvents.length === 0) return

    upcomingEvents.forEach(async event => {
      // Get all participants and creator
      const recipients = [...event.collaboratorsIds, event.task?.createdBy]

      for (const userId of recipients) {
        const notification: INotification = {
          userId: userId!,
          title: 'Upcoming Event',
          message: `Event "${event.title}" starts in ${minutesAhead} minutes`,
          type: getNotificationTypeFromEvent(EVENT_NAMES.EVENT_REMINDER),
          data: {
            eventId: event.id,
            taskId: event.task?.id,
            eventStart: event.start,
            minutesUntilStart: minutesAhead,
          },
          read: false,
          createdAt: new Date(),
        }

        // ✅ Send via WebSocket (instantáneo si conectado)
        webSocketService.emitNotificationToUser(userId!, notification)
        // ✅ Also persist in database for offline users
        await getNotificationService().create(notification)
        // Mark event as notified to avoid duplicate notifications
        await eventRepository.markAsNotified(event.id, now)
      }
    })

    if (upcomingEvents.length > 0) {
      console.log(`📅 Sent ${upcomingEvents.length} event reminders`)
    }
  }
}
