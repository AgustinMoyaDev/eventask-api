import { MongooseRepository } from '../../repositories/MongooseRepository.js'
import { ICategoryRepository } from './ICategoryRepository.js'
import { CategoryModel } from '../../databases/mongo/models/schemas/category.js'
import { ICategory } from '../../types/ICategory.js'

export class CategoryRepository
  extends MongooseRepository<
    ICategory,
    string,
    Omit<ICategory, 'id'>,
    Partial<Omit<ICategory, 'id'>>
  >
  implements ICategoryRepository
{
  constructor() {
    super(CategoryModel)
  }
  async findAllByUser(
    userId: string,
    page = 1,
    perPage = 20
  ): Promise<{ items: ICategory[]; total: number }> {
    const skip = Math.max(0, page - 1) * perPage

    const filter = { createdBy: userId }

    const [total, docs] = await Promise.all([
      this.model.countDocuments(filter).exec(),
      this.model
        .find(filter)
        .select('name createdBy')
        .lean<ICategory[]>({ virtuals: true })
        .skip(skip)
        .limit(perPage)
        .exec(),
    ])
    return { items: docs, total }
  }
}
