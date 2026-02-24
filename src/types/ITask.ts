import { IBase } from '../types/IBase.js'
import { ICategory } from './ICategory.js'
import { IEvent } from './IEvent.js'
import { IUser } from './IUser.js'

export const TASK_STATUS = {
  PENDING: 'pending',
  PROGRESS: 'in-progress',
  COMPLETED: 'completed',
} as const

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS]

export interface TaskMetadata {
  beginningDate?: Date
  completionDate?: Date
  duration: number
  progress: number
  status: TaskStatus
}

export interface ITask extends IBase, TaskMetadata {
  title: string
  categoryId: string
  createdBy: string
  eventsIds?: string[]
  participantsIds?: string[]
}

export interface ITaskPopulated extends ITask {
  category: ICategory
  creator: IUser
  participants: IUser[]
  events: IEvent[]
}
