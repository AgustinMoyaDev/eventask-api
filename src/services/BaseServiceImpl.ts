import { ApiError } from '../config/middlewares/ApiError.js'
import { IBaseRepository } from '../repositories/IBaseRepository.js'
import { IBaseService } from './IBaseService.js'

export abstract class BaseServiceImpl<
  E,
  ID = string,
  C = Omit<E, 'id'>,
  U = Partial<Omit<E, 'id'>>,
> implements IBaseService<E, ID, C, U> {
  /** Friendly name of the entity, used in error messages */
  protected abstract resourceName: string

  constructor(protected readonly repository: IBaseRepository<E, ID, C, U>) {
    this.repository = repository
  }

  async findAll(): Promise<E[]> {
    return this.repository.findAll()
  }

  async findById(id: ID): Promise<E> {
    const resource = await this.repository.findById(id)
    if (!resource) throw new ApiError(404, `${this.resourceName} not found`)
    return resource
  }

  async create(dto: C): Promise<E> {
    return this.repository.create(dto)
  }

  async update(id: ID, dto: U): Promise<E> {
    const resource = await this.repository.update(id, dto)
    if (!resource) throw new ApiError(404, `${this.resourceName} not found`)
    return resource
  }

  async delete(id: ID): Promise<void> {
    const ok = await this.repository.delete(id)
    if (!ok) {
      throw new ApiError(404, `${this.resourceName} not found`)
    }
  }
}
