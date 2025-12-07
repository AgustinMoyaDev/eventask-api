import { ITokenDoc } from '../../databases/mongo/models/doctypes/token.js'

import { IToken } from '../../types/IToken.js'

export interface ITokenRepository {
  findByToken(token: string): Promise<ITokenDoc | null>
  save(tokenDoc: IToken): Promise<void>
  find(token: string): Promise<IToken | null>
  delete(token: string): Promise<void>
}
