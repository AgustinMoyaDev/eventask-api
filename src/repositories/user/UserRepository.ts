import { MongooseRepository } from '../../repositories/MongooseRepository.js'

import { IUserRepository } from './IUserRepository.js'

import { UserModel } from '../../databases/mongo/models/schemas/user.js'

import { IUser } from '../../types/IUser.js'
import { IUserDto } from '../../types/dtos/user.js'

export class UserRepository
  extends MongooseRepository<IUser, string, Omit<IUser, 'id'>, Partial<Omit<IUser, 'id'>>>
  implements IUserRepository
{
  constructor() {
    super(UserModel)
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email: { $eq: email } }).exec()
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
