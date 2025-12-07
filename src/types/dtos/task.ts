import { TaskStatus } from '../../types/ITask.js'
import { IEventDto } from './event.js'

interface ITaskBaseDto {
  title: string
  categoryId: string
  participantsIds?: string[]
  events?: IEventDto[]
}

export interface ITaskCreateDto extends ITaskBaseDto {
  createdBy: string
}

export interface ITaskUpdateDto extends ITaskBaseDto {
  beginningDate: string
  completionDate: string
  status: TaskStatus
  duration: number
  progress: number
  eventsIds?: string[]
}

export interface ITaskListDto {
  id: string
  title: string
  status: TaskStatus
  categoryName: string
  participants?: { id: string; firstName: string }[]
  events?: { id: string; title: string; collaborators?: { id: string }[] }[]
}
