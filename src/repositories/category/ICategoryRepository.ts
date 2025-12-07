import { IBaseRepository } from '../../repositories/IBaseRepository.js'
import { ICategory } from '../../types/ICategory.js'

export interface ICategoryRepository
  extends IBaseRepository<
    ICategory,
    string,
    Omit<ICategory, 'id'>,
    Partial<Omit<ICategory, 'id'>>
  > {
  findAllByUser(
    userId: string,
    page?: number,
    perPage?: number
  ): Promise<{ items: ICategory[]; total: number }>
}
