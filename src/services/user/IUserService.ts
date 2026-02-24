import { IBaseService } from '../IBaseService.js'

import { IUser } from '../../types/IUser.js'
import { IUserDto } from '../../types/dtos/user.js'
import { IPaginationOptions, IPaginationResult } from '../../helpers/pagination.js'

export interface IUserService extends IBaseService<
  IUser,
  string,
  Omit<IUser, 'id'>,
  Partial<Omit<IUser, 'id'>>
> {
  getContacts(userId: string, params: IPaginationOptions): Promise<IPaginationResult<IUserDto>>
  getProfileWithContacts(userId: string): Promise<IUserDto>

  /**
   * Updates only the profile image of the user.
   * @param userId - User ID
   * @param imageUrl - New profile image URL
   * @returns A promise that resolves with the updated user
   */
  updateProfileImage(userId: string, imageUrl: string): Promise<IUser>
}
