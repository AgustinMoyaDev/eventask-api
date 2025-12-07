import { RequestHandler } from 'express'
import { check, ValidationChain } from 'express-validator'
import { validationFieldsResult } from './validationFieldsResult.js'

export const inviteContactValidations = (): (ValidationChain | RequestHandler)[] => {
  return [
    check('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required.')
      .bail()
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    validationFieldsResult,
  ]
}
