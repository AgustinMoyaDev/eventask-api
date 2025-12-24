import { MongooseRepository } from '../../repositories/MongooseRepository.js'

import { IUserRepository } from './IUserRepository.js'

import { UserModel } from '../../databases/mongo/models/schemas/user.js'

import { IUser } from '../../types/IUser.js'
import { IUserDto } from '../../types/dtos/user.js'
import { buildSortCriteria, createSortValidator } from '../../helpers/sortValidations.js'
import {
  buildPaginationResult,
  calculateSkip,
  IPaginationParams,
  IPaginationResult,
  normalizePaginationParams,
} from '../../helpers/pagination.js'

const ALLOWED_SORT_FIELDS = ['firstName', 'lastName', 'email'] as const

const { isAllowedField } = createSortValidator(ALLOWED_SORT_FIELDS)

export class UserRepository
  extends MongooseRepository<IUser, string, Omit<IUser, 'id'>, Partial<Omit<IUser, 'id'>>>
  implements IUserRepository
{
  constructor() {
    super(UserModel)
  }

  async findContacts(
    userId: string,
    params: IPaginationParams
  ): Promise<IPaginationResult<IUserDto>> {
    const { page, perPage, sortBy, sortOrder } = normalizePaginationParams(params)
    const skip = calculateSkip(page, perPage)
    const sortCriteria = buildSortCriteria(sortBy, sortOrder, isAllowedField, 'firstName')

    const filter = {
      _id: { $ne: userId },
    }
    const [total, items] = await Promise.all([
      this.model.countDocuments(filter).exec(),
      this.model
        .find(filter)
        .sort(sortCriteria)
        .select('firstName lastName email profileImageURL')
        .lean<IUserDto[]>({ virtuals: true })
        .skip(skip)
        .limit(perPage)
        .exec(),
    ])

    return buildPaginationResult(items, total, page, perPage)
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email: { $eq: email } }).exec()
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return this.model
      .findOne({ email: { $eq: email } })
      .select('+password')
      .exec()
  }

  async findByIdWithPassword(userId: string): Promise<IUser | null> {
    return this.model.findById(userId).select('+password').exec()
  }

  async findByIdWithContacts(userId: string): Promise<IUserDto | null> {
    const user = await this.model
      .findById(userId)
      .populate({
        path: 'contacts',
        select: '_id firstName lastName email profileImageURL',
      })
      .exec()

    return user ? user.toJSON() : null
  }
}
