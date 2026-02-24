import { IPaginationOptions, IPaginationResult } from '../../helpers/pagination.js'
import { IBaseService } from '../../services/IBaseService.js'
import { ICategory, ICategoryWithTaskCount } from '../../types/ICategory.js'

export interface ICategoryService extends IBaseService<
  ICategory,
  string,
  Omit<ICategory, 'id'>,
  Partial<Omit<ICategory, 'id'>>
> {
  getAllByUser(userId: string, params: IPaginationOptions): Promise<IPaginationResult<ICategory>>
  getAllByUserWithTaskCount(userId: string): Promise<ICategoryWithTaskCount[]>
}
