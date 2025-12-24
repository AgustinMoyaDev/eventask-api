import { IUserService } from '../../services/user/IUserService.js'
import { BaseControllerImpl } from '../../controllers/base/BaseControllerImpl.js'

import { ApiError } from '../../config/middlewares/ApiError.js'
import { AuthenticatedRequest } from '../../config/types/request.js'

import { IPaginationParams, IPaginationResult } from '../../helpers/pagination.js'

import { IUser } from '../../types/IUser.js'
import { IUserDto } from '../../types/dtos/user.js'

export class UserController extends BaseControllerImpl<IUser, IUserService> {
  async getProfileWithContacts(userId: string): Promise<IUserDto> {
    return this.service.getProfileWithContacts(userId)
  }

  async getContacts(req: AuthenticatedRequest): Promise<IPaginationResult<IUserDto>> {
    const { uid, query } = req
    const { page, perPage, sortBy, sortOrder } = query as IPaginationParams

    const params: IPaginationParams = {
      page: page ? parseInt(String(page)) : undefined,
      perPage: perPage ? parseInt(String(perPage)) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    }

    return this.service.getContacts(uid!, params)
  }

  /**
   * Uploads a new avatar for the authenticated user.
   * @param req - AuthenticatedRequest containing the uploaded file in req.file
   * @returns An object with the updated profileImage URL
   * @throws ApiError(400) if no file was provided
   * @throws ApiError(404) if the user is not found
   */
  async uploadAvatar(req: AuthenticatedRequest): Promise<{ profileImageURL: string }> {
    if (!req.file) throw new ApiError(400, 'No file uploaded')

    const filename = req.file.filename
    const imageUrl = `/uploads/avatars/${filename}`
    const updatedUser = await this.service.updateProfileImage(req.uid!, imageUrl)
    return { profileImageURL: updatedUser.profileImageURL }
  }
}
