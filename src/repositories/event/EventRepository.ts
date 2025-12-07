import { ClientSession, Types } from 'mongoose'

import { EventModel } from '../../databases/mongo/models/schemas/event.js'

import { MongooseRepository } from '../../repositories/MongooseRepository.js'
import { IEventRepository } from './IEventRepository.js'

import { IEvent } from '../../types/IEvent.js'
import { ICreateEventDto, UpdateEventDto } from '../../types/dtos/event.js'

export class EventRepository
  extends MongooseRepository<IEvent, string, Omit<IEvent, 'id'>, Partial<Omit<IEvent, 'id'>>>
  implements IEventRepository
{
  constructor() {
    super(EventModel)
  }

  async markAsNotified(eventId: string, notifiedAt: Date): Promise<void> {
    await this.model.findByIdAndUpdate(eventId, {
      lastNotificationSent: notifiedAt,
    })
  }

  async findEventsInTimeRange(
    startTime: Date,
    endTime: Date,
    additionalFilter: Record<string, unknown> = {}
  ): Promise<IEvent[]> {
    const filter = {
      ...additionalFilter,
      start: {
        $gte: startTime,
        $lt: endTime,
      },
    }
    const docs = await this.model
      .find(filter)
      .populate('task', 'title createdBy')
      .populate('collaborators', 'firstName lastName')
      .lean<IEvent[]>({ virtuals: true })
      .exec()

    return docs
  }

  async findByUser(
    userId: string,
    page = 1,
    perPage = 20
  ): Promise<{ items: IEvent[]; total: number }> {
    const skip = Math.max(0, page - 1) * perPage

    const filter = {
      $or: [{ createdBy: userId }, { collaboratorsIds: userId }],
    }

    const [total, docs] = await Promise.all([
      this.model.countDocuments(filter).exec(),
      this.model
        .find(filter)
        .sort({ start: 1, end: 1 })
        .populate(['task', 'creator', 'collaborators'])
        .skip(skip)
        .limit(perPage)
        .exec(),
    ])

    return { items: docs, total }
  }

  async findByTaskId(taskId: string, session?: ClientSession): Promise<IEvent[]> {
    const docs = await this.model
      .find({ taskId })
      .session(session ?? null)
      .sort({ start: 1, end: 1 })
      .populate(['task', 'creator'])
      .exec()

    return docs.map(doc => doc.toJSON())
  }

  async createEventWithSession(
    payload: ICreateEventDto,
    userId: string,
    taskId: string,
    session: ClientSession
  ): Promise<IEvent | null> {
    const doc = new EventModel({ ...payload, createdBy: userId, taskId, status: payload.status })
    await doc.save({ session })
    const event = await EventModel.findById(doc._id).session(session).exec()
    return event ? (event.toJSON() as unknown as IEvent) : null
  }

  async updateEventWithSession(
    id: string,
    payload: UpdateEventDto,
    session: ClientSession
  ): Promise<IEvent | null> {
    const event = await this.model.findByIdAndUpdate(id, payload, { new: true, session }).exec()
    return event ? event.toJSON() : null
  }

  async deleteManyByIds(ids: string[], session: ClientSession): Promise<void> {
    await EventModel.deleteMany({ _id: { $in: ids.map(id => new Types.ObjectId(id)) } })
      .session(session)
      .exec()
  }
}
