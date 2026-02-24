import { ITaskService } from './ITaskService.js'

import { BaseServiceImpl } from '../../services/BaseServiceImpl.js'
import { ITaskRepository } from '../../repositories/task/ITaskRepository.js'
import { IEventRepository } from '../../repositories/event/IEventRepository.js'
import { IUserRepository } from '../../repositories/user/IUserRepository.js'

import { ApiError } from '../../config/middlewares/ApiError.js'

import { ITask } from '../../types/ITask.js'
import { ITaskCreateDto, ITaskUpdateDto } from 'types/dtos/task.js'

import { IPaginationOptions, IPaginationResult } from '../../helpers/pagination.js'
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
    private readonly userRepository: IUserRepository,
    private readonly eventEmitter: IApplicationEventEmitter
  ) {
    super(repository)
  }

  async getAllByUser(
    userId: string,
    params: IPaginationOptions
  ): Promise<IPaginationResult<ITask>> {
    return await this.repository.findAllByUser(userId, params)
  }

  async getOnePopulated(id: string): Promise<ITask> {
    const task = await this.repository.findByIdPopulated(id)
    if (!task) {
      throw new ApiError(404, 'Task not found after population.')
    }
    return task
  }

  async createTask(dto: ITaskCreateDto, userId: string): Promise<ITask> {
    const task = await this.repository.createTask(dto, userId)

    if (!task) {
      throw new ApiError(500, 'Failed to create task.')
    }

    return task
  }

  async updateTask(id: string, dto: ITaskUpdateDto): Promise<ITask> {
    const updated = await this.repository.update(id, dto)
    if (!updated) {
      throw new ApiError(404, 'Task not found.')
    }
    return updated
  }

  private notifyAssignedTaskParticipant(task: ITask, participantId: string) {
    this.eventEmitter.emit<TaskAssignedEvent>(EVENT_NAMES.TASK_ASSIGNED, {
      taskId: task.id,
      assignedTo: participantId,
      taskTitle: task.title,
      assignedBy: task.createdBy,
      timestamp: new Date(),
    })
  }

  private notifyDeallocatedTaskParticipant(task: ITask, participantId: string) {
    this.eventEmitter.emit<TaskDeallocatedEvent>(EVENT_NAMES.TASK_DEALLOCATED, {
      taskId: task.id,
      deallocatedFrom: participantId,
      taskTitle: task.title,
      deallocatedBy: task.createdBy,
      timestamp: new Date(),
    })
  }

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

  async assignParticipant(taskId: string, participantId: string, userId: string): Promise<ITask> {
    // Validate task exists
    const task = await this.repository.findById(taskId)
    if (!task) {
      throw new ApiError(404, 'Task not found.')
    }

    // Validate participant exists
    const userExists = await this.userRepository.exists(participantId)
    if (!userExists) {
      throw new ApiError(404, 'User not found.')
    }

    const isCreator = task.createdBy === userId
    const isParticipant = task.participantsIds?.includes(userId)

    if (!isCreator && !isParticipant) {
      throw new ApiError(403, 'You do not have permission to assign participants to this task.')
    }

    // Check if already assigned (for event emission logic)
    const alreadyAssigned = task.participantsIds?.includes(participantId)

    // Add participant (idempotent operation)
    const updatedTask = await this.repository.addParticipantToTask(taskId, participantId)

    if (!updatedTask) {
      throw new ApiError(500, 'Failed to assign participant.')
    }

    // Emit event only if participant was newly assigned
    if (!alreadyAssigned) {
      this.notifyAssignedTaskParticipant(updatedTask, participantId)
    }

    return updatedTask
  }

  async removeParticipant(taskId: string, participantId: string, userId: string): Promise<ITask> {
    // Validate task exists
    const task = await this.repository.findById(taskId)
    if (!task) {
      throw new ApiError(404, 'Task not found.')
    }

    // Validate participant (user) exists
    const userExists = await this.userRepository.exists(participantId)
    if (!userExists) {
      throw new ApiError(404, 'User not found.')
    }

    const isCreator = task.createdBy === userId
    const isParticipant = task.participantsIds?.includes(userId)

    if (!isCreator && !isParticipant) {
      throw new ApiError(403, 'You do not have permission to remove participants from this task.')
    }

    // Check if participant is currently assigned (for event emission)
    const isCurrentlyAssigned = task.participantsIds?.includes(participantId)

    // Remove participant (idempotent operation)
    const updatedTask = await this.repository.removeParticipantFromTask(taskId, participantId)

    if (!updatedTask) {
      throw new ApiError(500, 'Failed to remove participant.')
    }

    // Emit event only if participant was actually removed
    if (isCurrentlyAssigned) {
      this.notifyDeallocatedTaskParticipant(updatedTask, participantId)
    }

    return updatedTask
  }
}
