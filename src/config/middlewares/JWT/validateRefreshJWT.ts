import { Response, NextFunction } from 'express'

import jwt from 'jsonwebtoken'

import { env } from '../../../config/env.js'

import { JWTPayload } from '../../../config/types/jwtPayload.js'
import { AuthenticatedRequest } from '../../../config/types/request.js'

import { ApiError } from '../ApiError.js'

/**
 * Same flow as validateJWT, but takes the cookie token called refreshToken.
 * Used in the /auth/refresh route to issue a new access token.
 */
export const validateRefreshToken = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.refreshToken
  if (!token) {
    throw new ApiError(401, 'Refresh token missing.')
  }

  try {
    const { uid } = jwt.verify(token, env.SECRET_JWT_SEED) as JWTPayload
    req.uid = uid
    next()
  } catch {
    throw new ApiError(401, 'Invalid refresh token.')
  }
}
