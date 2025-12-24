import { ClientSession, Types } from 'mongoose'

import { EventModel } from '../../databases/mongo/models/schemas/event.js'

import { MongooseRepository } from '../../repositories/MongooseRepository.js'
import { IEventRepository } from './IEventRepository.js'

import { IEvent, IEventCalendarResult } from '../../types/IEvent.js'
import { ICreateEventDto, UpdateEventDto } from '../../types/dtos/event.js'
import {
  buildPaginationResult,
  calculateSkip,
  IPaginationParams,
  IPaginationResult,
  normalizePaginationParams,
} from '../../helpers/pagination.js'
import { buildSortCriteria, createSortValidator } from 'helpers/sortValidations.js'

const ALLOWED_SORT_FIELDS = ['title', 'start', 'end'] as const

const { isAllowedField } = createSortValidator(ALLOWED_SORT_FIELDS)

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

  async findAllByUser(
    userId: string,
    params: IPaginationParams
  ): Promise<IPaginationResult<IEvent>> {
    const { page, perPage, sortBy, sortOrder } = normalizePaginationParams(params)
    const skip = calculateSkip(page, perPage)
    const sortCriteria = buildSortCriteria(sortBy, sortOrder, isAllowedField, 'start')

    const filter = {
      $or: [{ createdBy: userId }, { collaboratorsIds: userId }],
    }

    const [total, items] = await Promise.all([
      this.model.countDocuments(filter).exec(),
      this.model
        .find(filter)
        .sort(sortCriteria)
        .populate(['task', 'creator', 'collaborators'])
        .skip(skip)
        .limit(perPage)
        .exec(),
    ])

    return buildPaginationResult(items, total, page, perPage)
  }

  async findAllByUserAndMonth(
    userId: string,
    year: number,
    month: number
  ): Promise<IEventCalendarResult> {
    // Calculate first and last day of month
    const startOfMonth = new Date(year, month - 1, 1) // month-1 porque Date usa 0-11
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999) // Último día del mes

    const filter = {
      $and: [
        // User filter: events created by OR assigned to user
        { $or: [{ createdBy: userId }, { collaboratorsIds: userId }] },
        // Date filter: events that overlap with the month
        {
          $or: [
            { start: { $gte: startOfMonth, $lte: endOfMonth } },
            { end: { $gte: startOfMonth, $lte: endOfMonth } },
            { start: { $lte: startOfMonth }, end: { $gte: endOfMonth } },
          ],
        },
      ],
    }

    const events = await this.model
      .find(filter)
      .sort({ start: 1, end: 1 }) // Fixed chronological order
      .populate(['task', 'creator', 'collaborators'])
      .lean<IEvent[]>({ virtuals: true })
      .exec()

    return { events, year, month, total: events.length }
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
