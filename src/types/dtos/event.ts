import { EventStatus } from '../../types/IEvent.js'
import { ITask } from '../../types/ITask.js'
import { IUser } from '../../types/IUser.js'

export interface IEventDto {
  id: string
  title: string
  status: EventStatus
  notes: string
  start: string
  end: string
  taskId: string
  task?: ITask
  createdBy: string
  creator?: IUser
}

export interface ICreateEventDto {
  title: string
  status: string
  notes: string
  start: string // ISO date
  end: string // ISO date
  taskId: string
}

export type UpdateEventDto = Partial<ICreateEventDto>

export interface IEventResponseDto {
  id: string
  title: string
  status: EventStatus
  notes: string
  start: string
  end: string
  taskId: string
  createdBy: string
}
