import { IBaseRepository } from '../../repositories/IBaseRepository.js'

import { IUserDto } from '../../types/dtos/user.js'
import { IUser } from '../../types/IUser.js'

export interface IUserRepository
  extends IBaseRepository<IUser, string, Omit<IUser, 'id'>, Partial<Omit<IUser, 'id'>>> {
  /**
   * Finds a user by email using explicit $eq operator for security.
   * @param email - Validated and sanitized email string (must be checked by express-validator before calling)
   * @returns The user document or null if not found
   */
  findByEmail(email: string): Promise<IUser | null>
  /**
   * Finds a user by ID and populates their contacts.
   * @param userId - The user's ID.
   * @returns The user with populated contacts or null.
   */
  findByIdWithContacts(userId: string): Promise<IUserDto | null>
}
