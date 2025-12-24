import { IPaginationParams, IPaginationResult } from '../../helpers/pagination.js'
import { IBaseRepository } from '../../repositories/IBaseRepository.js'

import { IUserDto } from '../../types/dtos/user.js'
import { IUser } from '../../types/IUser.js'

export interface IUserRepository extends IBaseRepository<
  IUser,
  string,
  Omit<IUser, 'id'>,
  Partial<Omit<IUser, 'id'>>
> {
  /**
   * Finds contacts of a user with pagination.
   * @param userId - The ID of the user whose contacts are to be found.
   * @param params - Pagination parameters.
   * @returns A promise that resolves to a paginated result of user DTOs.
   */
  findContacts(userId: string, params: IPaginationParams): Promise<IPaginationResult<IUserDto>>
  /**
   * Finds a user by email using explicit $eq operator for security.
   * @param email - Validated and sanitized email string (must be checked by express-validator before calling)
   * @returns The user document or null if not found
   */
  findByEmail(email: string): Promise<IUser | null>
  /**
   * Finds a user by email including password field (for authentication).
   * @param email - Validated and sanitized email string
   * @returns The user document with password or null if not found
   */
  findByEmailWithPassword(email: string): Promise<IUser | null>
  /**
   * Finds a user by ID including password field (for password change validation).
   * @param userId - The user's ID
   * @returns The user document with password or null if not found
   */
  findByIdWithPassword(userId: string): Promise<IUser | null>
  /**
   * Finds a user by ID and populates their contacts.
   * @param userId - The user's ID.
   * @returns The user with populated contacts or null.
   */
  findByIdWithContacts(userId: string): Promise<IUserDto | null>
}
