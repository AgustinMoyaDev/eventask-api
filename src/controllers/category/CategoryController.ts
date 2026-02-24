import { ICategoryService } from '../../services/category/ICategoryService.js'
import { BaseControllerImpl } from '../base/BaseControllerImpl.js'
import { ICategory, ICategoryWithTaskCount } from '../../types/ICategory.js'

import { IPaginationOptions, IPaginationResult } from '../../helpers/pagination.js'

import { ICategoryCreateDto } from '../../types/dtos/category.js'
import { AuthenticatedRequest } from '../../config/types/request.js'

export class CategoryController extends BaseControllerImpl<ICategory, ICategoryService> {
  async getAllByUser(req: AuthenticatedRequest): Promise<IPaginationResult<ICategory>> {
    const { uid, query } = req
    const { page, perPage, sortBy, sortOrder } = query as IPaginationOptions

    const params: IPaginationOptions = {
      page: page ? parseInt(String(page)) : undefined,
      perPage: perPage ? parseInt(String(perPage)) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    }
    return this.service.getAllByUser(uid!, params)
  }

  async createCategory(userId: string, data: ICategoryCreateDto): Promise<ICategory> {
    return this.service.create({ ...data, createdBy: userId, createdAt: new Date() })
  }

  async getAllByUserWithTaskCount(req: AuthenticatedRequest): Promise<ICategoryWithTaskCount[]> {
    const { uid } = req
    return this.service.getAllByUserWithTaskCount(uid!)
  }
}
