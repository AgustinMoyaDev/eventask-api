import { IEventRepository } from '../../repositories/event/IEventRepository.js'
import { ITaskRepository } from '../../repositories/task/ITaskRepository.js'
import { IUserRepository } from '../../repositories/user/IUserRepository.js'

import { BaseServiceImpl } from '../BaseServiceImpl.js'
import { IEventService } from './IEventService.js'

import { TASK_STATUS } from '../../types/ITask.js'
import { EventStatus, IEvent, IEventCalendarResult } from '../../types/IEvent.js'

import { IApplicationEventEmitter } from '../../sys-events/IApplicationEventEmitter.js'
import {
  EVENT_NAMES,
  EventAssignmentEvent,
  EventDeassignmentEvent,
} from '../../sys-events/types/sys-events.js'

import { computeTaskMetadata } from '../../helpers/computeTaskMetadata.js'
import { IPaginationParams, IPaginationResult } from '../../helpers/pagination.js'

import { ApiError } from '../../config/middlewares/ApiError.js'

export class EventServiceImpl
  extends BaseServiceImpl<IEvent, string, Omit<IEvent, 'id'>, Partial<Omit<IEvent, 'id'>>>
  implements IEventService
{
  protected resourceName: string = 'Event'

  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly taskRepository: ITaskRepository,
    private readonly userRepository: IUserRepository,
    private readonly eventEmitter: IApplicationEventEmitter
  ) {
    super(eventRepository)
  }

  async getAllByUser(
    userId: string,
    params: IPaginationParams
  ): Promise<IPaginationResult<IEvent>> {
    return await this.eventRepository.findAllByUser(userId, params)
  }

  async getAllByUserAndMonth(
    userId: string,
    year: number,
    month: number
  ): Promise<IEventCalendarResult> {
    if (month < 1 || month > 12) {
      throw new ApiError(400, 'Month must be between 1 and 12')
    }
    if (year < 1900 || year > 2100) {
      throw new ApiError(400, 'Year must be between 1900 and 2100')
    }

    return await this.eventRepository.findAllByUserAndMonth(userId, year, month)
  }

  async updateStatus(id: string, dto: { status: EventStatus }): Promise<IEvent> {
    const session = await this.eventRepository.startSession()
    session.startTransaction()
    try {
      const updatedEvent = await this.eventRepository.update(id, dto)
      if (!updatedEvent) throw new ApiError(404, 'Event not found on status update')

      const events = await this.eventRepository.findByTaskId(updatedEvent.taskId)
      const eventsToCompute = events.map(e => ({
        ...e,
        start: e.start,
        end: e.end,
        status: e.status,
      }))

      const { beginningDate, completionDate, duration, progress } =
        computeTaskMetadata(eventsToCompute)

      const taskProgressStatus =
        progress === 100
          ? TASK_STATUS.COMPLETED
          : progress === 0
            ? TASK_STATUS.PENDING
            : TASK_STATUS.PROGRESS

      await this.taskRepository.update(updatedEvent.taskId, {
        status: taskProgressStatus,
        beginningDate,
        completionDate,
        duration,
        progress,
      })

      return updatedEvent
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }

  async delete(id: string): Promise<void> {
    const session = await this.eventRepository.startSession()
    session.startTransaction()
    try {
      // Locate the event (to get taskId)
      const event = await this.eventRepository.findById(id)
      if (!event) throw new ApiError(404, 'Event not found.')

      // Delete the event
      const ok = await this.eventRepository.delete(id)
      if (!ok) throw new ApiError(404, 'The event could not be deleted.')
      // Get the remaining events of the task
      const remainingEvents = await this.eventRepository.findByTaskId(event.taskId)

      // Recalculate metadata
      const eventsToCompute = remainingEvents.map(e => ({
        ...e,
        start: e.start,
        end: e.end,
        status: e.status,
      }))
      const { beginningDate, completionDate, duration, progress } =
        computeTaskMetadata(eventsToCompute)

      // Determine new task status
      const taskProgressStatus =
        progress === 100
          ? TASK_STATUS.COMPLETED
          : progress === 0
            ? TASK_STATUS.PENDING
            : TASK_STATUS.PROGRESS

      // Update task with its metadata
      await this.taskRepository.update(event.taskId, {
        eventsIds: remainingEvents.map(e => e.id),
        status: taskProgressStatus,
        beginningDate,
        completionDate,
        duration,
        progress,
      })
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }

  async assignCollaborator(
    userId: string,
    eventId: string,
    collaboratorId: string
  ): Promise<IEvent> {
    const event = await this.eventRepository.findById(eventId)
    if (!event) throw new ApiError(404, 'Event not found.')

    const user = await this.userRepository.findById(userId)
    if (!user) throw new ApiError(404, 'User not found')

    if (!collaboratorId) {
      throw new ApiError(400, 'At least one collaborator ID must be provided.')
    }

    const updatedEvent = await this.eventRepository.update(eventId, {
      collaboratorsIds: [...new Set([...event.collaboratorsIds, collaboratorId])],
    })

    if (!updatedEvent) throw new ApiError(404, 'Failed to update event with collaborators.')

    this.eventEmitter.emit<EventAssignmentEvent>(EVENT_NAMES.EVENT_ASSIGNED, {
      eventId: updatedEvent.id,
      collaboratorId,
      eventTitle: updatedEvent.title,
      createdBy: updatedEvent.createdBy,
      timestamp: new Date(),
      assignedBy: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })

    return updatedEvent
  }

  async removeCollaborator(
    userId: string,
    eventId: string,
    collaboratorId: string
  ): Promise<IEvent> {
    const event = await this.eventRepository.findById(eventId)
    if (!event) throw new ApiError(404, 'Event not found.')

    const user = await this.userRepository.findById(userId)
    if (!user) throw new ApiError(404, 'User not found')

    if (!collaboratorId) {
      throw new ApiError(400, 'A collaborator ID must be provided.')
    }

    if (!event.collaboratorsIds.includes(collaboratorId)) {
      throw new ApiError(400, 'The specified collaborator is not assigned to this event.')
    }

    // Update event removing the collaborator
    const updatedEvent = await this.eventRepository.update(eventId, {
      collaboratorsIds: event.collaboratorsIds.filter(cId => cId !== collaboratorId),
    })

    if (!updatedEvent) throw new ApiError(404, 'Failed to update event removing collaborator.')

    this.eventEmitter.emit<EventDeassignmentEvent>(EVENT_NAMES.EVENT_DEALLOCATED, {
      eventId: updatedEvent.id,
      collaboratorId,
      eventTitle: updatedEvent.title,
      createdBy: updatedEvent.createdBy,
      timestamp: new Date(),
      deallocatedBy: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })

    return updatedEvent
  }
}
