/**
 * Generic interface for CRUD services.
 *
 * E: Type of the resulting entity (POJO), with fields such as `id`.
 * C: DTO for creation (without `id`).
 * U: DTO for update (partial, without `id`).
 */
export interface IBaseService<E, ID = string, C = Omit<E, 'id'>, U = Partial<Omit<E, 'id'>>> {
  findAll(): Promise<E[]>
  findById(id: ID): Promise<E>
  create(dto: C): Promise<E>
  update(id: ID, dto: U): Promise<E>
  delete(id: ID): Promise<void>
}
