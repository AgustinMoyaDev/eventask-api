import { IPaginationParams, IPaginationResult } from '../../helpers/pagination.js'
import { IBaseRepository } from '../../repositories/IBaseRepository.js'
import { ICategory } from '../../types/ICategory.js'

export interface ICategoryRepository extends IBaseRepository<
  ICategory,
  string,
  Omit<ICategory, 'id'>,
  Partial<Omit<ICategory, 'id'>>
> {
  findAllByUser(userId: string, params: IPaginationParams): Promise<IPaginationResult<ICategory>>
}
