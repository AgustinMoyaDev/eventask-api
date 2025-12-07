import multer from 'multer'

import { ErrorRequestHandler } from 'express'

import { ApiError, ApiErrorResponse } from './ApiError.js'

/**
 * Captures all errors sent with next(err) or thrown in handlers.
 * If the error is an instance of ApiError, respond with its code and message.
 * Otherwise, fallback to a generic 500.
 */
export const errorRequestHandler: ErrorRequestHandler = (err, _req, res, next) => {
  // If there was already a previous res.send/res.json, we delegate
  if (res.headersSent) return next(err)

  console.error('#### ERROR-REQUEST-HANDLER #### ', err)

  // Specific handling for Multer errors (file upload)
  if (err instanceof multer.MulterError) {
    const responseBody: ApiErrorResponse = {
      ok: false,
      message: err.message,
    }
    res.status(400).json(responseBody)
    return
  }

  if (err instanceof ApiError) {
    const { message, errors } = err
    const responseBody: ApiErrorResponse = {
      ok: false,
      message,
      errors, // validation errors
    }
    res.status(err.statusCode).json(responseBody)
    return
  }
  // 🔒 Specific handling for CSRF
  if (err instanceof Error && err.message.toLowerCase().includes('csrf')) {
    const responseBody: ApiErrorResponse = {
      ok: false,
      message: 'CSRF token mismatch',
    }
    res.status(403).json(responseBody)
    return
  }

  const genericBody: ApiErrorResponse = {
    ok: false,
    message: 'Internal server error.',
  }
  res.status(500).json(genericBody)
}
