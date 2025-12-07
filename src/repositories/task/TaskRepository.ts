import { ClientSession } from 'mongoose'

import { TaskModel } from '../../databases/mongo/models/schemas/task.js'
import { MongooseRepository } from '../../repositories/MongooseRepository.js'
import { ITaskRepository } from './ITaskRepository.js'

import { ITask } from '../../types/ITask.js'
import { ITaskCreateDto, ITaskUpdateDto } from '../../types/dtos/task.js'

export class TaskRepository
  extends MongooseRepository<ITask, string, Omit<ITask, 'id'>, Partial<Omit<ITask, 'id'>>>
  implements ITaskRepository
{
  constructor() {
    super(TaskModel)
  }

  /**
   * Gets all of a user's tasks, sorted and populated.
   * @param userId ID of the owning user
   */
  async findAllByUser(
    userId: string,
    page = 1,
    perPage = 20
  ): Promise<{ items: ITask[]; total: number }> {
    const skip = Math.max(0, page - 1) * perPage

    const filter = {
      $or: [{ createdBy: userId }, { participantsIds: userId }],
      status: { $ne: 'completed' },
    }

    const [total, docs] = await Promise.all([
      this.model.countDocuments(filter).exec(),
      this.model
        .find(filter)
        .sort({ beginningDate: 1 })
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
    return { items: docs, total }
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
