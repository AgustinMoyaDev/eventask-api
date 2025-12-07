/**
 * Business error with HTTP code.
 */
import { ValidationError } from 'express-validator'

export interface ApiErrorResponse {
  ok: false
  message: string
  errors?: Record<string, ValidationError>
}

export class ApiError extends Error {
  public readonly statusCode: number
  public readonly errors?: Record<string, ValidationError>

  constructor(statusCode: number, message: string, errors?: Record<string, ValidationError>) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}
