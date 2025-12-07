import { ICategoryService } from '../../services/category/ICategoryService.js'
import { BaseControllerImpl } from '../base/BaseControllerImpl.js'
import { ICategory } from '../../types/ICategory.js'
import { IPaginationOptions } from '../../config/types/pagination.js'
import { ICategoryCreateDto } from '../../types/dtos/category.js'

export class CategoryController extends BaseControllerImpl<ICategory, ICategoryService> {
  async getAllByUser(
    userId: string,
    query: IPaginationOptions
  ): Promise<{ items: ICategory[]; total: number }> {
    const { page = 1, perPage = 20 } = query
    return this.service.getAllByUser(userId, Number(page), Number(perPage))
  }

  async createCategory(userId: string, data: ICategoryCreateDto): Promise<ICategory> {
    return this.service.create({ ...data, createdBy: userId, createdAt: new Date() })
  }
}
