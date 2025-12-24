import { ClientSession } from 'mongoose'

import { TaskModel } from '../../databases/mongo/models/schemas/task.js'
import { MongooseRepository } from '../../repositories/MongooseRepository.js'
import { ITaskRepository } from './ITaskRepository.js'

import { ITask } from '../../types/ITask.js'
import { ITaskCreateDto, ITaskUpdateDto } from '../../types/dtos/task.js'
import { buildSortCriteria, createSortValidator } from '../../helpers/sortValidations.js'
import {
  calculateSkip,
  buildPaginationResult,
  IPaginationResult,
  normalizePaginationParams,
  IPaginationParams,
} from '../../helpers/pagination.js'

const ALLOWED_SORT_FIELDS = [
  'title',
  'status',
  'progress',
  'beginningDate',
  'completionDate',
  'createdAt',
  'duration',
] as const

const { isAllowedField } = createSortValidator(ALLOWED_SORT_FIELDS)
export class TaskRepository
  extends MongooseRepository<ITask, string, Omit<ITask, 'id'>, Partial<Omit<ITask, 'id'>>>
  implements ITaskRepository
{
  constructor() {
    super(TaskModel)
  }

  async findAllByUser(
    userId: string,
    params: IPaginationParams = {}
  ): Promise<IPaginationResult<ITask>> {
    const { page, perPage, sortBy, sortOrder } = normalizePaginationParams(params)
    const skip = calculateSkip(page, perPage)
    const sortCriteria = buildSortCriteria(sortBy, sortOrder, isAllowedField, 'beginningDate')

    const filter = {
      $or: [{ createdBy: userId }, { participantsIds: userId }],
      status: { $ne: 'completed' },
    }

    const [total, items] = await Promise.all([
      this.model.countDocuments(filter).exec(),
      this.model
        .find(filter)
        .sort(sortCriteria)
        .select(
          'title status progress duration createdBy categoryId participantsIds createdAt beginningDate completionDate'
        )
        .populate('category', 'name -_id')
        .populate('participants', 'firstName lastName profileImageURL')
        .lean<ITask[]>({ virtuals: true })
        .skip(skip)
        .limit(perPage)
        .exec(),
    ])

    return buildPaginationResult(items, total, page, perPage)
  }

  /**
   * Gets a task by its ID with its references populated.
   * @param id Task ID
   * @returns The sanitized task entity or null
   */
  async findByIdPopulated(id: string): Promise<ITask | null> {
    const doc = await this.model
      .findById(id)
      .populate(['category', 'participants'])
      .populate({
        path: 'events',
        select: '_id title start end status notes collaboratorsIds',
        populate: {
          path: 'collaborators',
          select: '_id firstName lastName profileImageURL email',
          model: 'User',
        },
      })
      .exec()

    return doc ? doc.toJSON() : null
  }

  /**
   * Creates a session-based task and returns the populated sanitized task.
   * @param payload - Data for the new task
   * @param session - Mongoose session
   * @returns The sanitized populated task entity or null
   */
  async createTask(payload: ITaskCreateDto, session: ClientSession): Promise<ITask | null> {
    const { title, categoryId, participantsIds, createdBy } = payload
    const doc = new this.model({
      title,
      categoryId,
      participantsIds,
      createdBy,
    })
    await doc.save({ session })

    const task = await this.model
      .findById(doc._id)
      .populate(['category', 'participants', 'events'])
      .session(session)
      .exec()

    return task ? task.toJSON() : null
  }

  /**
   * Updates a task and returns the populated sanitized task.
   * @param id - Task ID
   * @param payload - Update data
   * @param session - Mongoose session
   * @returns The sanitized updated populated task entity or null
   */
  async updateTask(
    id: string,
    payload: ITaskUpdateDto,
    session: ClientSession
  ): Promise<ITask | null> {
    const task = await this.model
      .findByIdAndUpdate(id, { ...payload }, { new: true, session })
      .populate(['category', 'participants', 'events'])
      .exec()

    return task ? task.toJSON() : null
  }
}
