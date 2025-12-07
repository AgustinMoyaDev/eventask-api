import { IBaseService } from '../../services/IBaseService.js'
import { ICategory } from '../../types/ICategory.js'

export interface ICategoryService
  extends IBaseService<ICategory, string, Omit<ICategory, 'id'>, Partial<Omit<ICategory, 'id'>>> {
  getAllByUser(
    userId: string,
    page?: number,
    perPage?: number
  ): Promise<{ items: ICategory[]; total: number }>
}
