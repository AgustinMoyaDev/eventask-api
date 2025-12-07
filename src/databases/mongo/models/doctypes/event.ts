import { Document, Types } from 'mongoose'
import { EventStatus } from '../../../../types/IEvent.js'

export interface EventDoc extends Document {
  title: string
  status: EventStatus
  notes: string
  start: Date
  end: Date
  lastNotificationSent: Date
  taskId: Types.ObjectId
  createdBy: Types.ObjectId
  collaboratorsIds: Types.ObjectId[]
}
