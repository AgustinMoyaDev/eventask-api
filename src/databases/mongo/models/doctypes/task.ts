import { Document, Types } from 'mongoose'
import { TaskStatus } from '../../../../types/ITask.js'

export interface TaskDoc extends Document {
  title: string
  status: TaskStatus
  categoryId: Types.ObjectId
  createdBy: Types.ObjectId
  participantsIds: Types.ObjectId[]
  eventsIds: Types.ObjectId[]
  beginningDate?: Date
  completionDate?: Date
  progress: number
  duration: number // in hours
}
