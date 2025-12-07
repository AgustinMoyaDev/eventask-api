import { ClientSession } from 'mongoose'

import { IBaseRepository } from '../../repositories/IBaseRepository.js'

import { ITaskCreateDto, ITaskUpdateDto } from '../../types/dtos/task.js'
import { ITask } from '../../types/ITask.js'

export interface ITaskRepository
  extends IBaseRepository<ITask, string, Omit<ITask, 'id'>, Partial<Omit<ITask, 'id'>>> {
  findAllByUser(
    userId: string,
    page?: number,
    perPage?: number
  ): Promise<{ items: ITask[]; total: number }>
  findByIdPopulated(id: string): Promise<ITask | null>
  createTask(payload: ITaskCreateDto, session: ClientSession): Promise<ITask | null>
  updateTask(id: string, dto: ITaskUpdateDto, session: ClientSession): Promise<ITask | null>
}
