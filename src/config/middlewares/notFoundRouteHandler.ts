import { Request, Response, NextFunction } from 'express'
import { ApiError } from './ApiError.js'

/**
 * Middleware that reacts when no route matches (must come after all routes).
 * Throws an ApiError(404, 'Route not found') to be handled as a 404 JSON error.
 */
export function notFoundRouteHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, 'Route not found'))
}
