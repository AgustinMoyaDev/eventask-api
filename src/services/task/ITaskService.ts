import { IBaseService } from '../../services/IBaseService.js'

import { IPaginationParams, IPaginationResult } from '../../helpers/pagination.js'

import { ITask } from '../../types/ITask.js'
import { ITaskCreateDto, ITaskMetadataUpdateDto } from 'types/dtos/task.js'

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
  createTask(dto: ITaskCreateDto, userId: string): Promise<ITask>
  /**
   * Updates a task and returns the populated sanitized task.
   * Accepts both user updates (title/category) and internal metadata updates.
   * @param id - Task ID
   * @param payload - Update data
   * @param session - Transaction session (optional)
   */
  updateTask(id: string, dto: ITaskMetadataUpdateDto): Promise<ITask>
  /**
   * Deletes a task and all its associated events in a transaction.
   */
  deleteWithEvents(id: string): Promise<void>
  /**
   Assigns a participant to a task, ensuring the user has permission to modify the task.
  */
  assignParticipant(taskId: string, participantId: string, userId: string): Promise<ITask>
  /**
   Removes a participant from a task, ensuring the user has permission to modify the task.
  */
  removeParticipant(taskId: string, participantId: string, userId: string): Promise<ITask>
}
