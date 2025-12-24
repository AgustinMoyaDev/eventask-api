import { IUser } from './IUser.js'
import { ITask } from './ITask.js'
import { IBase } from './IBase.js'

export const EVENT_STATUS = {
  PENDING: 'pending',
  PROGRESS: 'in_progress',
  COMPLETED: 'done',
} as const

export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS]

export interface IEvent extends IBase {
  title: string
  status: EventStatus
  notes: string
  start: string
  end: string
  lastNotificationSent: Date
  taskId: string
  createdBy: string
  collaboratorsIds: string[]
  // optional virtual fields after populated()
  task?: ITask
  creator?: IUser
  collaborators: IUser[]
}

/**
 * Query parameters for calendar view (strings from URL)
 */
export interface IEventCalendarQueryParams {
  year?: string
  month?: string
}

/**
 * Calendar view result with events grouped by month
 */
export interface IEventCalendarResult {
  events: IEvent[]
  year: number
  month: number
  total: number
}
