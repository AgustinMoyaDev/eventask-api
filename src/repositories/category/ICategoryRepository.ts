import { IPaginationOptions, IPaginationResult } from '../../helpers/pagination.js'
import { IBaseRepository } from '../../repositories/IBaseRepository.js'
import { ICategory, ICategoryWithTaskCount } from '../../types/ICategory.js'

export interface ICategoryRepository extends IBaseRepository<
  ICategory,
  string,
  Omit<ICategory, 'id'>,
  Partial<Omit<ICategory, 'id'>>
> {
  /**
   * Finds all categories created by a user with pagination.
   * @param userId - User ID
   * @param params - Pagination parameters
   * @returns Paginated result of categories
   */
  findAllByUser(userId: string, params: IPaginationOptions): Promise<IPaginationResult<ICategory>>
  /**
   * Finds all categories created by a user with task count.
   * Uses MongoDB aggregation to count tasks associated with each category.
   * @param userId - User ID
   * @returns Array of categories with taskCount property
   */
  findAllByUserWithTaskCount(userId: string): Promise<ICategoryWithTaskCount[]>
}
