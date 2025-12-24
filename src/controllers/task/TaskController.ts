import { BaseControllerImpl } from '../../controllers/base/BaseControllerImpl.js'
import { ITaskService } from '../../services/task/ITaskService.js'

import { IPaginationParams, IPaginationResult } from '../../helpers/pagination.js'

import { AuthenticatedRequest } from '../../config/types/request.js'
import { ITask } from '../../types/ITask.js'
import { ITaskCreateDto, ITaskUpdateDto } from '../../types/dtos/task.js'

export class TaskController extends BaseControllerImpl<ITask, ITaskService> {
  async getAllByUser(req: AuthenticatedRequest): Promise<IPaginationResult<ITask>> {
    const { uid, query } = req
    const { page, perPage, sortBy, sortOrder } = query as IPaginationParams

    const params: IPaginationParams = {
      page: page ? parseInt(String(page)) : undefined,
      perPage: perPage ? parseInt(String(perPage)) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    }

    return this.service.getAllByUser(uid!, params)
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
