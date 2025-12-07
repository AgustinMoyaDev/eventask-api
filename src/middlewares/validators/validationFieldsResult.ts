import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'

import { ApiError } from '../../config/middlewares/ApiError.js'

export const validationFieldsResult: RequestHandler = (req, _res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed.', errors.mapped()))
  }
  next()
}
