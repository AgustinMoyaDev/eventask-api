import jwt from 'jsonwebtoken'

import { env } from '../../../config/env.js'
import { GenerateJWTOptions, JWTPayload } from '../../../config/types/jwtPayload.js'

/**
 * Function that, given a uid, generates a JWT signed with the environment's secret.
 * Returns a Promise<string> that resolves with the token or rejects if it fails.
 */
export const generateJWT = ({ uid, expiresIn = '2h' }: GenerateJWTOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!uid) {
      return reject(new Error('Invalid payload for JWT'))
    }

    const payload: JWTPayload = { uid }

    jwt.sign(payload, env.SECRET_JWT_SEED, { expiresIn }, (error, token) => {
      if (error || !token) {
        return reject(new Error('Could not generate JWT'))
      }
      resolve(token)
    })
  })
}
