import { ClientSession } from 'mongoose'

import { IBaseRepository } from '../../repositories/IBaseRepository.js'

import { ITaskCreateDto, ITaskUpdateDto } from '../../types/dtos/task.js'
import { ITask } from '../../types/ITask.js'
import { IPaginationParams, IPaginationResult } from '../../helpers/pagination.js'

export interface ITaskRepository extends IBaseRepository<
  ITask,
  string,
  Omit<ITask, 'id'>,
  Partial<Omit<ITask, 'id'>>
> {
  /**
   * Gets all of a user's tasks with pagination, sorting and metadata.
   * @param userId - ID of the owning user
   * @param params - Pagination and sorting parameters
   * @returns Paginated result with metadata
   */
  findAllByUser(userId: string, params: IPaginationParams): Promise<IPaginationResult<ITask>>
  findByIdPopulated(id: string): Promise<ITask | null>
  createTask(payload: ITaskCreateDto, session: ClientSession): Promise<ITask | null>
  updateTask(id: string, dto: ITaskUpdateDto, session: ClientSession): Promise<ITask | null>
}
