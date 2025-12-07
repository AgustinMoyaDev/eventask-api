import { ClientSession, Model } from 'mongoose'

import { IBaseRepository } from './IBaseRepository.js'

/**
 * Generic repository for Mongoose, without relying on Mongoose's internal types.
 *
 * E: Type of the resulting entity (POJO), with fields like 'id'.
 * C: DTO for creation (default: Omit<E, 'id'>).
 * U: DTO for update (default: Partial<Omit<E, 'id'>).
 */
export class MongooseRepository<E, ID, C = Omit<E, 'id'>, U = Partial<Omit<E, 'id'>>>
  implements IBaseRepository<E, ID, C, U>
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(protected readonly model: Model<any>) {}
  /**
   * Starts a MongoDB session for transactions.
   */
  async startSession(): Promise<ClientSession> {
    return this.model.db.startSession()
  }

  /**
   * Finds all documents and returns them as plain objects with sanitization plugins applied.
   * @returns Array of sanitized entities
   */
  async findAll(): Promise<E[]> {
    const docs = await this.model.find().exec()
    return docs.map(doc => doc.toJSON())
  }

  /**
   * Finds a document by ID and returns the sanitized entity (plugins applied).
   * @param id - The document ID
   * @returns The sanitized entity or null
   */
  async findById(id: ID): Promise<E | null> {
    const doc = await this.model.findById(id).exec()
    return doc ? (doc.toJSON() as E) : null
  }

  /**
   * Creates a new document and returns the sanitized entity (plugins applied).
   * @param dto - Data for creation
   * @returns The sanitized new entity
   */
  async create(dto: C): Promise<E> {
    const doc = await this.model.create(dto)
    return doc.toJSON() as E
  }

  /**
   * Updates a document by ID and returns the sanitized entity (plugins applied).
   * @param id - The document ID
   * @param dto - The data to update
   * @returns The sanitized updated entity or null
   */
  async update(id: ID, dto: U): Promise<E | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = await this.model.findByIdAndUpdate(id, dto as any, { new: true }).exec()
    return doc ? (doc.toJSON() as E) : null
  }

  async delete(id: ID): Promise<boolean> {
    const doc = await this.model.findByIdAndDelete(id).exec()
    return !!doc
  }
}
