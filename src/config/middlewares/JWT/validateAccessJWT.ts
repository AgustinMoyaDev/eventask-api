import { Response, NextFunction } from 'express'

import jwt from 'jsonwebtoken'

import { JWTPayload } from '../../../config/types/jwtPayload.js'
import { type AuthenticatedRequest } from '../../../config/types/request.js'

import { env } from '../../../config/env.js'

import { ApiError } from '../ApiError.js'

/**
 * Read the Authorization: Bearer <token> header.
 * Verify its validity with jsonwebtoken and the secret.
 * If valid, inject req.uid = <uid> and call next().
 * Otherwise, raise ApiError(401, 'Access token missing.' | 'Invalid access token.').
 */
export const validateAccessJWT = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

  if (!token) {
    throw new ApiError(401, 'Access token missing.')
  }

  try {
    const { uid } = jwt.verify(token, env.SECRET_JWT_SEED) as JWTPayload
    req.uid = uid
    next()
  } catch {
    throw new ApiError(401, 'Invalid access token.')
  }
}
