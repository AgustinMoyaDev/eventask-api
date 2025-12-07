import { ClientSession } from 'mongoose'

/**
 * Generic interface for CRUD operations.
 *
 * E: Type of the managed entity (with fields like 'id').
 * C: DTO for creation (without 'id').
 * U: DTO for update (partial, without 'id').
 */
export interface IBaseRepository<E, ID = string, C = Omit<E, 'id'>, U = Partial<Omit<E, 'id'>>> {
  startSession(): Promise<ClientSession>
  findAll(): Promise<E[]>
  findById(id: ID): Promise<E | null>
  create(dto: C): Promise<E>
  update(id: ID, dto: U): Promise<E | null>
  delete(id: ID): Promise<boolean>
}
