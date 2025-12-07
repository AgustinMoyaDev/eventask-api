/**
 * Generic interface for CRUD controllers (not coupled to Express).
 *
 * E: Resulting entity type (POJO), with an `id` field.
 * ID: Entity identifier type (default is string).
 * C: DTO for creation (without `id`).
 * U: DTO for update (partial, without `id`).
 */
export interface IBaseController<E, ID = string, C = Omit<E, 'id'>, U = Partial<Omit<E, 'id'>>> {
  getAll(): Promise<E[]>
  getById(id: ID): Promise<E>
  create(dto: C): Promise<E>
  update(id: ID, dto: U): Promise<E>
  delete(id: ID): Promise<void>
}
