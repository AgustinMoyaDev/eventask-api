import { IBaseService } from '../../services/IBaseService.js'
import { ITaskCreateDto, ITaskUpdateDto } from '../../types/dtos/task.js'

import { ITask } from '../../types/ITask.js'

export interface ITaskService extends IBaseService<
  ITask,
  string,
  Omit<ITask, 'id'>,
  Partial<Omit<ITask, 'id'>>
> {
  getAllByUser(
    userId: string,
    page?: number,
    perPage?: number
  ): Promise<{ items: ITask[]; total: number }>
  getOnePopulated(id: string): Promise<ITask>
  createWithEvents(payload: ITaskCreateDto, userId: string): Promise<ITask>
  updateWithEvents(id: string, payload: ITaskUpdateDto, userId: string): Promise<ITask>
  deleteWithEvents(id: string): Promise<void>
}
