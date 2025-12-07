import { BaseControllerImpl } from '../../controllers/base/BaseControllerImpl.js'
import { ITaskService } from '../../services/task/ITaskService.js'

import { IPaginationOptions } from '../../config/types/pagination.js'

import { ITask } from '../../types/ITask.js'
import { ITaskCreateDto, ITaskUpdateDto } from '../../types/dtos/task.js'

export class TaskController extends BaseControllerImpl<ITask, ITaskService> {
  /**
   * Get all tasks by user with pagination.
   * @param userId - User identifier
   * @param query - Query params (pagination)
   * @returns Object with items and total count
   */
  async getAllByUser(
    userId: string,
    query: IPaginationOptions
  ): Promise<{ items: ITask[]; total: number }> {
    const { page = 1, perPage = 20 } = query
    return this.service.getAllByUser(userId, Number(page), Number(perPage))
  }

  async getTaskById(id: string): Promise<ITask> {
    return this.service.getOnePopulated(id)
  }

  async createTaskWithEvents(userId: string, payload: ITaskCreateDto): Promise<ITask> {
    return this.service.createWithEvents(payload, userId)
  }

  async updateTaskWithEvents(id: string, payload: ITaskUpdateDto, userId: string): Promise<ITask> {
    return this.service.updateWithEvents(id, payload, userId)
  }

  async deleteWithEvents(id: string): Promise<void> {
    return this.service.deleteWithEvents(id)
  }
}
