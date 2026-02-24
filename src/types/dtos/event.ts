import { EventStatus } from '../../types/IEvent.js'
import { ITask } from '../../types/ITask.js'
import { IUser } from '../../types/IUser.js'

export interface IEventTaskMetadataDto {
  status: EventStatus
  start: Date
  end: Date
}

export interface IEventDto extends IEventTaskMetadataDto {
  id: string
  title: string
  notes: string
  taskId: string
  task?: ITask
  createdBy: string
  creator?: IUser
}

export interface ICreateEventDto extends IEventTaskMetadataDto {
  title: string
  notes: string
  taskId: string
}

export interface IUpdateEventDto {
  id: string
  status: EventStatus
  taskId: string
  title: string
  start: string
  end: string
  notes: string
  createdBy: string
}

export interface IEventResponseDto extends IEventTaskMetadataDto {
  id: string
  title: string
  notes: string
  taskId: string
  createdBy: string
}
