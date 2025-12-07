import { Document } from 'mongoose'

import { TokenType } from '../../../../types/IToken.js'

export interface ITokenDoc extends Document {
  token: string
  userId: string
  expiresAt: Date
  type: TokenType
}
