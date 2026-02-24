import { ClientSession } from 'mongoose'

import { IBaseRepository } from '../../repositories/IBaseRepository.js'

import { ITaskCreateDto, ITaskUpdateDto } from '../../types/dtos/task.js'
import { ITask } from '../../types/ITask.js'
import { IPaginationOptions, IPaginationResult } from '../../helpers/pagination.js'

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
  findAllByUser(userId: string, params: IPaginationOptions): Promise<IPaginationResult<ITask>>
  /**
   * Gets a task by its ID with its references populated.
   * @param id Task ID
   * @returns The sanitized task entity or null
   */
  findByIdPopulated(id: string): Promise<ITask | null>
  /**
   * Creates a session-based task and returns the populated sanitized task.
   * @param payload - Data for the new task
   * @param userId - ID of the user creating the task
   * @returns The sanitized populated task entity or null
   */
  createTask(payload: ITaskCreateDto, userId: string): Promise<ITask | null>
  /**
   * Updates a task and returns the populated sanitized task.
   * @param id - Task ID
   * @param payload - Update data
   * @param userId - ID of the user creating the task
   * @returns The sanitized updated populated task entity or null
   */
  updateTask(id: string, dto: ITaskUpdateDto, session?: ClientSession): Promise<ITask | null>
  /**
   * Adds a participant to task's participantsIds array (idempotent).
   * Does NOT check permissions or validate existence.
   *
   * @param taskId - Task ID
   * @param participantId - User ID to add
   * @returns Updated task with populated references, or null if task not found
   */
  addParticipantToTask(taskId: string, participantId: string): Promise<ITask | null>
  /**
   * Removes a participant from task's participantsIds array (idempotent).
   * Does NOT check permissions or validate existence.
   *
   * @param taskId - Task ID
   * @param participantId - User ID to remove
   * @returns Updated task with populated references, or null if task not found
   */
  removeParticipantFromTask(taskId: string, participantId: string): Promise<ITask | null>
}
