import { ClientSession } from 'mongoose'

import { IBaseRepository } from '../../repositories/IBaseRepository.js'
import { IEventDto } from '../../types/dtos/event.js'
import { IEvent, IEventCalendarResult } from '../../types/IEvent.js'
import { IPaginationParams, IPaginationResult } from '../../helpers/pagination.js'

export interface IEventRepository extends IBaseRepository<
  IEvent,
  string,
  Omit<IEvent, 'id'>,
  Partial<Omit<IEvent, 'id'>>
> {
  /**
   * Marks an event as notified.
   * @param eventId ID of the event.
   * @param notifiedAt Timestamp when the notification was sent.
   */
  markAsNotified(eventId: string, notifiedAt: Date): Promise<void>

  /**
   * Finds all events in a specific time range.
   * @param startTime Start of the time range.
   * @param endTime End of the time range.
   */
  findEventsInTimeRange(
    startTime: Date,
    endTime: Date,
    additionalFilter?: Record<string, unknown>
  ): Promise<IEvent[]>
  /**
   * Gets the events created by a user.
   * @param userId ID of the creator user.
   */
  findAllByUser(userId: string, params: IPaginationParams): Promise<IPaginationResult<IEvent>>

  /**
   * Find events by user and month for calendar view.
   * Returns all events within the specified month without pagination.
   * @param userId - User ID
   * @param year - Year (e.g., 2025)
   * @param month - Month (1-12)
   */
  findAllByUserAndMonth(userId: string, year: number, month: number): Promise<IEventCalendarResult>

  /**
   * Gets a task's events in plain IEvent format.
   * @param taskId Task ID.
   * @param session Session for transaction (optional).
   */
  findByTaskId(taskId: string, session?: ClientSession): Promise<IEvent[]>

  //* FOR INTERNAL USE ONLY
  /**
   * Creates an event and returns the resulting IEvent.
   * @param payload Event data (without ID).
   * @param userId Creator ID.
   * @param taskId ID of the associated task.
   * @param session Transaction session.
   */
  createEventWithSession(
    payload: IEventDto,
    userId: string,
    taskId: string,
    session: ClientSession
  ): Promise<IEvent | null>

  /**
   * Updates an event and returns the Event.
   * @param id Event ID.
   * @param payload Fields to update.
   * @param session Transaction session. */
  updateEventWithSession(
    id: string,
    payload: IEventDto,
    session: ClientSession
  ): Promise<IEvent | null>

  /**
   * Deletes multiple events and returns nothing.
   * @param ids IDs of the events to delete.
   * @param session Transaction session.
   */
  deleteManyByIds(ids: string[], session: ClientSession): Promise<void>
  //* FOR INTERNAL USE ONLY
}
