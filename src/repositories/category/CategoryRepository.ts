import { MongooseRepository } from '../../repositories/MongooseRepository.js'
import { ICategoryRepository } from './ICategoryRepository.js'
import { CategoryModel } from '../../databases/mongo/models/schemas/category.js'
import { ICategory, ICategoryWithTaskCount } from '../../types/ICategory.js'
import {
  buildPaginationResult,
  calculateSkip,
  IPaginationParams,
  IPaginationResult,
  normalizePaginationParams,
} from '../../helpers/pagination.js'
import { buildSortCriteria, createSortValidator } from '../../helpers/sortValidations.js'
import { Types } from 'mongoose'

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

  async findAllByUserWithTaskCount(userId: string): Promise<ICategoryWithTaskCount[]> {
    const result = await this.model.aggregate([
      // Filter categories by user
      {
        $match: { createdBy: new Types.ObjectId(userId) },
      },
      // Lookup tasks collection
      {
        $lookup: {
          from: 'tasks', // Collection name in MongoDB
          localField: '_id', // Category _id
          foreignField: 'categoryId', // Task's categoryId field
          pipeline: [
            {
              $match: { status: { $ne: 'completed' } }, // Filter out completed tasks
            },
          ],
          as: 'tasks', // Output array name
        },
      },
      // Add taskCount field
      {
        $addFields: {
          taskCount: { $size: '$tasks' }, // Count array length
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          createdBy: 1,
          createdAt: 1,
          updatedAt: 1,
          taskCount: 1,
        },
      },
      {
        $sort: { name: 1 },
      },
    ])

    return result.map(doc => ({
      id: doc._id,
      name: doc.name,
      createdBy: doc.createdBy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      taskCount: doc.taskCount,
    }))
  }
}
