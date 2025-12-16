import { ITokenDoc } from '../../databases/mongo/models/doctypes/token.js'

import { IToken } from '../../types/IToken.js'

export interface ITokenRepository {
  findByToken(token: string): Promise<ITokenDoc | null>
  save(tokenDoc: IToken): Promise<void>
  find(token: string): Promise<IToken | null>
  delete(token: string): Promise<void>
  /**
   * Invalidate all refresh tokens for this user (logout from other devices)
   * @param userId
   */
  deleteByUserId(userId: string): Promise<void>
}
