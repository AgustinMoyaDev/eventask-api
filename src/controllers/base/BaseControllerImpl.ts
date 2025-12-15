import { IBaseController } from '../base/IBaseController.js'

import { IBaseService } from '../../services/IBaseService.js'

/**
 * Generic CRUD controller implementation that delegates to a generic service.
 * Uses asyncRequestHandler to avoid try/catch in each method.
 *
 * - E: Entity type.
 * - S: Service that implements BaseService<E, C, U>.
 * - ID: Identifier type (default is string).
 * - C: Creation DTO.
 * - U: Update DTO.
 */
export abstract class BaseControllerImpl<
  E,
  S extends IBaseService<E, ID, C, U>,
  ID = string,
  C = Omit<E, 'id'>,
  U = Partial<Omit<E, 'id'>>,
> implements IBaseController<E, ID, C, U> {
  constructor(protected service: S) {
    this.service = service
  }

  async getAll(): Promise<E[]> {
    return this.service.findAll()
  }

  async getById(id: ID): Promise<E> {
    return this.service.findById(id)
  }

  async create(dto: C): Promise<E> {
    return this.service.create(dto)
  }

  async update(id: ID, dto: U): Promise<E> {
    return this.service.update(id, dto)
  }

  async delete(id: ID): Promise<void> {
    return this.service.delete(id)
  }
}
