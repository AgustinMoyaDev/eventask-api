import { BaseServiceImpl } from '../../services/BaseServiceImpl.js'
import { ITaskService } from './ITaskService.js'
import { ITaskRepository } from '../../repositories/task/ITaskRepository.js'
import { IEventRepository } from '../../repositories/event/IEventRepository.js'
import { ApiError } from '../../config/middlewares/ApiError.js'

import { ITask } from '../../types/ITask.js'
import { IEvent } from '../../types/IEvent.js'
import { ITaskCreateDto, ITaskUpdateDto } from '../../types/dtos/task.js'
import { computeTaskMetadata } from '../../helpers/computeTaskMetadata.js'
import {
  EVENT_NAMES,
  TaskAssignedEvent,
  TaskDeallocatedEvent,
} from '../../sys-events/types/sys-events.js'
import { IApplicationEventEmitter } from '../../sys-events/IApplicationEventEmitter.js'

export class TaskServiceImpl
  extends BaseServiceImpl<ITask, string, Omit<ITask, 'id'>, Partial<Omit<ITask, 'id'>>>
  implements ITaskService
{
  protected resourceName: string = 'Task'

  constructor(
    protected readonly repository: ITaskRepository,
    private readonly eventRepository: IEventRepository,
    private readonly eventEmitter: IApplicationEventEmitter
  ) {
    super(repository)
  }
  /**
   * Gets all tasks for a user, populated and sorted
   */
  async getAllByUser(
    userId: string,
    page?: number,
    perPage?: number
  ): Promise<{ items: ITask[]; total: number }> {
    return await this.repository.findAllByUser(userId, page, perPage)
  }

  /**
   * Get a task by ID, throw 404 if it doesn't exist
   */
  async getOnePopulated(id: string): Promise<ITask> {
    const task = await this.repository.findByIdPopulated(id)
    if (!task) {
      throw new ApiError(404, 'Task not found after population.')
    }
    return task
  }

  /**
   * Create a task along with its events in a transaction,
   * calculate and apply metadata (dates, duration, progress, status)
   */
  async createWithEvents(dto: ITaskCreateDto, userId: string): Promise<ITask> {
    const session = await this.repository.startSession()
    session.startTransaction()
    try {
      const { title, categoryId, participantsIds, events = [] } = dto

      const task = await this.repository.createTask(
        { title, categoryId, participantsIds, createdBy: userId },
        session
      )

      if (!task) throw new ApiError(404, 'Task not found.')

      const createdEvents = await Promise.all<IEvent>(
        events.map(async ev => {
          if (!ev) throw new ApiError(404, 'Event could not be found.')
          const created = await this.eventRepository.createEventWithSession(
            ev,
            userId,
            task.id,
            session
          )
          if (!created) throw new ApiError(404, 'Event could not be created.')
          return created
        })
      )
      const eventsIds = createdEvents.map(e => e.id)

      const { beginningDate, completionDate, duration, progress, status } =
        computeTaskMetadata(events)

      const updated = await this.repository.updateTask(
        task.id,
        {
          title: task.title,
          categoryId: task.categoryId,
          participantsIds: task.participantsIds,
          eventsIds,
          status,
          beginningDate,
          completionDate,
          duration,
          progress,
        },
        session
      )
      if (!updated) throw new ApiError(404, 'Task not found on update.')

      await session.commitTransaction()

      this.notifyAssignedTaskParticipants(updated)

      return updated
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }

  /**
   * Updates a task and synchronizes events in a transaction,
   * as well as recalculates and applies metadata.
   */
  async updateWithEvents(id: string, dto: ITaskUpdateDto, userId: string): Promise<ITask> {
    const session = await this.repository.startSession()
    session.startTransaction()
    try {
      // Validate existence
      const originalTask = await this.repository.findById(id)
      if (!originalTask) throw new ApiError(404, 'Task not found.')

      // Synchronize events: create/update/delete
      const currentEvents = await this.eventRepository.findByTaskId(id, session)
      const map = new Map(currentEvents.map(e => [e.id, e]))
      const newIds: string[] = []

      const { title, categoryId, participantsIds = [], events = [] } = dto
      for (const ev of events) {
        if (ev.id && map.has(ev.id)) {
          const updatedEv = await this.eventRepository.updateEventWithSession(ev.id, ev, session)
          if (!updatedEv) throw new ApiError(404, 'The event could not be updated.')
          newIds.push(updatedEv.id)
          map.delete(ev.id)
        } else {
          const createdEv = await this.eventRepository.createEventWithSession(
            ev,
            userId,
            id,
            session
          )
          if (!createdEv) throw new ApiError(404, 'The event could not be created.')
          newIds.push(createdEv.id)
        }
      }
      // eliminate leftovers
      if (map.size) {
        await this.eventRepository.deleteManyByIds(Array.from(map.keys()), session)
      }

      // Recalculate metadata
      const { beginningDate, completionDate, duration, progress, status } =
        computeTaskMetadata(events)

      const updated = await this.repository.updateTask(
        id,
        {
          title,
          status,
          categoryId,
          participantsIds,
          eventsIds: newIds,
          beginningDate,
          completionDate,
          duration,
          progress,
        },
        session
      )
      if (!updated) throw new ApiError(404, 'Task not found.')

      this.notifyAssignedTaskParticipants(updated)
      this.notifyDeallocatedTaskParticipants(updated, originalTask.participantsIds ?? [])
      await session.commitTransaction()

      return updated
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }

  private notifyAssignedTaskParticipants(task: ITask) {
    task.participantsIds.forEach(pId => {
      this.eventEmitter.emit<TaskAssignedEvent>(EVENT_NAMES.TASK_ASSIGNED, {
        taskId: task.id,
        assignedTo: pId,
        taskTitle: task.title,
        assignedBy: task.createdBy,
        timestamp: new Date(),
      })
    })
  }

  private notifyDeallocatedTaskParticipants(task: ITask, oldParticipants: string[]) {
    const deallocatedParticipants = oldParticipants?.filter(
      pId => !task.participantsIds.includes(pId)
    )

    deallocatedParticipants.forEach(dId => {
      this.eventEmitter.emit<TaskDeallocatedEvent>(EVENT_NAMES.TASK_DEALLOCATED, {
        taskId: task.id,
        deallocatedFrom: dId,
        taskTitle: task.title,
        deallocatedBy: task.createdBy,
        timestamp: new Date(),
      })
    })
  }

  /**
   * Deletes a task and all its associated events in a transaction.
   */
  async deleteWithEvents(id: string): Promise<void> {
    const session = await this.repository.startSession()
    session.startTransaction()
    try {
      // Validate existence
      await this.getOnePopulated(id)

      // Delete associated events
      const events = await this.eventRepository.findByTaskId(id, session)
      const eventIds = events.map(e => e.id)
      if (eventIds.length) {
        await this.eventRepository.deleteManyByIds(eventIds, session)
      }

      // Delete task
      await this.repository.delete(id)

      await session.commitTransaction()
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }
}
