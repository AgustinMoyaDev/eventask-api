import { Schema, model } from 'mongoose'
import { TaskDoc } from '../doctypes/task.js'
import { TASK_STATUS } from '../../../../types/ITask.js'

const TaskSchema = new Schema<TaskDoc>(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.PENDING,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required schema'],
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    participantsIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    eventsIds: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    beginningDate: { type: Date },
    completionDate: { type: Date },
    progress: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true }
)

TaskSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
})

TaskSchema.virtual('creator', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true,
})

TaskSchema.virtual('participants', {
  ref: 'User',
  localField: 'participantsIds',
  foreignField: '_id',
  justOne: false,
})

TaskSchema.virtual('events', {
  ref: 'Event',
  localField: 'eventsIds',
  foreignField: '_id',
  justOne: false,
})

TaskSchema.index({ createdBy: 1 })
TaskSchema.index({ categoryId: 1 })

export const TaskModel = model<TaskDoc>('Task', TaskSchema)
