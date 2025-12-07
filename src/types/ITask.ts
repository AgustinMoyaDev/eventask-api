import { IBase } from '../types/IBase.js'
import { ICategory } from './ICategory.js'
import { IEvent } from './IEvent.js'
import { IUser } from './IUser.js'

export const TASK_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  PROGRESS: 'in-progress',
  COMPLETED: 'completed',
} as const

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS]

export interface TaskMetadata {
  beginningDate: string
  completionDate: string
  duration: number
  progress: number
  status: TaskStatus
}

export interface ITask extends IBase, TaskMetadata {
  id: string
  title: string
  // physical fields
  categoryId: string
  participantsIds: string[]
  eventsIds: string[]
  createdBy: string
  // optional virtual fields after populated()
  category?: ICategory
  creator?: IUser
  participants?: IUser[]
  events?: IEvent[]
}
