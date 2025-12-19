import { ITokenRepository } from './ITokenRepository.js'

import { IToken } from '../../types/IToken.js'

import { TokenModel } from '../../databases/mongo/models/schemas/token.js'
import { ITokenDoc } from '../../databases/mongo/models/doctypes/token.js'

export class TokenRepository implements ITokenRepository {
  /**
   * Sanitizes input to prevent NoSQL injection.
   * Ensures input is a string primitive, not an object.
   */
  private sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      throw new Error('Invalid input: expected string')
    }
    return String(input)
  }

  async findByToken(token: string): Promise<ITokenDoc | null> {
    const sanitizedToken = this.sanitizeInput(token)
    return TokenModel.findOne({ token: { $eq: sanitizedToken } })
      .lean<ITokenDoc>()
      .exec()
  }

  async save({ token, userId, expiresAt, type }: IToken): Promise<void> {
    await TokenModel.create({ token, userId, expiresAt, type })
  }

  async find(token: string): Promise<IToken | null> {
    const sanitizedToken = this.sanitizeInput(token)
    const doc = await TokenModel.findOne({ token: { $eq: sanitizedToken } })
      .lean<IToken>()
      .exec()
    if (!doc) return null
    return { token: doc.token, userId: doc.userId, expiresAt: doc.expiresAt, type: doc.type }
  }

  async delete(token: string): Promise<void> {
    const sanitizedToken = this.sanitizeInput(token)
    await TokenModel.deleteOne({ token: { $eq: sanitizedToken } }).exec()
  }

  async deleteByUserId(userId: string): Promise<void> {
    const sanitizedUserId = this.sanitizeInput(userId)
    await TokenModel.deleteMany({ userId: { $eq: sanitizedUserId } }).exec()
  }
}
