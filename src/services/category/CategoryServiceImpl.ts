import { BaseServiceImpl } from '../../services/BaseServiceImpl.js'

import { ICategoryService } from './ICategoryService.js'
import { ICategoryRepository } from '../../repositories/category/ICategoryRepository.js'
import { ICategory } from '../../types/ICategory.js'
import { IPaginationParams, IPaginationResult } from '../../helpers/pagination.js'

export class CategoryServiceImpl
  extends BaseServiceImpl<ICategory, string, Omit<ICategory, 'id'>, Partial<Omit<ICategory, 'id'>>>
  implements ICategoryService
{
  protected resourceName = 'Category'

  constructor(protected readonly repository: ICategoryRepository) {
    super(repository)
  }

  async getAllByUser(
    userId: string,
    params: IPaginationParams
  ): Promise<IPaginationResult<ICategory>> {
    return await this.repository.findAllByUser(userId, params)
  }
}
