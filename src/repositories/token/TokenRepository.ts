import { ITokenRepository } from './ITokenRepository.js'

import { IToken } from '../../types/IToken.js'

import { TokenModel } from '../../databases/mongo/models/schemas/token.js'
import { ITokenDoc } from '../../databases/mongo/models/doctypes/token.js'

export class TokenRepository implements ITokenRepository {
  async findByToken(token: string): Promise<ITokenDoc | null> {
    return TokenModel.findOne({ token }).lean<ITokenDoc>().exec()
  }

  async save({ token, userId, expiresAt, type }: IToken): Promise<void> {
    await TokenModel.create({ token, userId, expiresAt, type })
  }

  async find(token: string): Promise<IToken | null> {
    const doc = await TokenModel.findOne({ token }).lean<IToken>().exec()
    if (!doc) return null
    return { token: doc.token, userId: doc.userId, expiresAt: doc.expiresAt, type: doc.type }
  }

  async delete(token: string): Promise<void> {
    await TokenModel.deleteOne({ token }).exec()
  }
}
