import { IBaseService } from '../../services/IBaseService.js'

import { IPaginationParams, IPaginationResult } from '../../helpers/pagination.js'

import { ITaskCreateDto, ITaskUpdateDto } from '../../types/dtos/task.js'
import { ITask } from '../../types/ITask.js'

export interface ITaskService extends IBaseService<
  ITask,
  string,
  Omit<ITask, 'id'>,
  Partial<Omit<ITask, 'id'>>
> {
  /**
   * Gets all tasks for a user, populated and sorted
   */
  getAllByUser(userId: string, params: IPaginationParams): Promise<IPaginationResult<ITask>>
  /**
   * Get a task by ID, throw 404 if it doesn't exist
   */
  getOnePopulated(id: string): Promise<ITask>
  /**
   * Create a task along with its events in a transaction,
   * calculate and apply metadata (dates, duration, progress, status)
   */
  createWithEvents(payload: ITaskCreateDto, userId: string): Promise<ITask>
  /**
   * Updates a task and synchronizes events in a transaction,
   * as well as recalculates and applies metadata.
   */
  updateWithEvents(id: string, payload: ITaskUpdateDto, userId: string): Promise<ITask>
  /**
   * Deletes a task and all its associated events in a transaction.
   */
  deleteWithEvents(id: string): Promise<void>
}
