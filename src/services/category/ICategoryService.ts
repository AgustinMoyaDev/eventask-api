import { IPaginationParams, IPaginationResult } from '../../helpers/pagination.js'
import { IBaseService } from '../../services/IBaseService.js'
import { ICategory } from '../../types/ICategory.js'

export interface ICategoryService extends IBaseService<
  ICategory,
  string,
  Omit<ICategory, 'id'>,
  Partial<Omit<ICategory, 'id'>>
> {
  getAllByUser(userId: string, params: IPaginationParams): Promise<IPaginationResult<ICategory>>
}
