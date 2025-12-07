import { Schema, model } from 'mongoose'

import { EventDoc } from '../doctypes/event.js'

const EventSchema = new Schema<EventDoc>(
  {
    title: { type: String, required: [true, 'Title is required schema'] },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'done'],
      default: 'pending',
      required: true,
    },
    notes: { type: String, required: [true, 'Notes is required schema'] },
    start: {
      type: Date,
      required: [true, 'Start date is required schema'],
    },
    end: {
      type: Date,
      required: [true, 'End date is required schema'],
    },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    collaboratorsIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastNotificationSent: { type: Date },
  },
  { timestamps: true }
)

EventSchema.virtual('task', {
  ref: 'Task',
  localField: 'taskId',
  foreignField: '_id',
  justOne: true,
})
EventSchema.virtual('creator', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true,
})
EventSchema.virtual('collaborators', {
  ref: 'User',
  localField: 'collaboratorsIds',
  foreignField: '_id',
  justOne: false,
})

EventSchema.index({ taskId: 1 })

export const EventModel = model<EventDoc>('Event', EventSchema)
