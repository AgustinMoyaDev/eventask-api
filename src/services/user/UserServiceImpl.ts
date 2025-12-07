import { IUserDto } from '../../types/dtos/user.js'
import { IUser } from '../../types/IUser.js'

import { ApiError } from '../../config/middlewares/ApiError.js'

import { BaseServiceImpl } from '../BaseServiceImpl.js'
import { IUserService } from './IUserService.js'
import { IUserRepository } from '../../repositories/user/IUserRepository.js'

export class UserServiceImpl
  extends BaseServiceImpl<IUser, string, Omit<IUser, 'id'>, Partial<Omit<IUser, 'id'>>>
  implements IUserService
{
  protected resourceName: string = 'User'

  constructor(private readonly userRepository: IUserRepository) {
    super(userRepository)
  }

  async getProfileWithContacts(userId: string): Promise<IUserDto> {
    const user = await this.userRepository.findByIdWithContacts(userId)
    if (!user) {
      throw new ApiError(404, 'User not found.')
    }
    return user
  }

  async updateProfileImage(userId: string, imageUrl: string): Promise<IUser> {
    const updated = await this.repository.update(userId, { profileImageURL: imageUrl })
    if (!updated) {
      throw new ApiError(404, 'User not found.')
    }
    return updated
  }
}
