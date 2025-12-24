import { MongooseRepository } from '../../repositories/MongooseRepository.js'
import { ICategoryRepository } from './ICategoryRepository.js'
import { CategoryModel } from '../../databases/mongo/models/schemas/category.js'
import { ICategory } from '../../types/ICategory.js'
import {
  buildPaginationResult,
  calculateSkip,
  IPaginationParams,
  IPaginationResult,
  normalizePaginationParams,
} from '../../helpers/pagination.js'
import { buildSortCriteria, createSortValidator } from '../../helpers/sortValidations.js'

const ALLOWED_SORT_FIELDS = ['name'] as const
const { isAllowedField } = createSortValidator(ALLOWED_SORT_FIELDS)
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
    params: IPaginationParams
  ): Promise<IPaginationResult<ICategory>> {
    const { page, perPage, sortBy, sortOrder } = normalizePaginationParams(params)
    const skip = calculateSkip(page, perPage)
    const sortCriteria = buildSortCriteria(sortBy, sortOrder, isAllowedField, 'beginningDate')
    const filter = { createdBy: userId }

    const [total, items] = await Promise.all([
      this.model.countDocuments(filter).exec(),
      this.model
        .find(filter)
        .sort(sortCriteria)
        .select('name createdBy')
        .lean<ICategory[]>({ virtuals: true })
        .skip(skip)
        .limit(perPage)
        .exec(),
    ])

    return buildPaginationResult(items, total, page, perPage)
  }
}
