import { RequestHandler } from 'express'

import { check, ValidationChain } from 'express-validator'

import { validationFieldsResult } from './validationFieldsResult.js'

export const resetPasswordValidations = (): (ValidationChain | RequestHandler)[] => [
  check('token').trim().notEmpty().withMessage('Reset token is required.'),
  check('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required.')
    // .isLength({ min: 8, max: 64 })
    // .withMessage('Password must be between 8 and 64 characters.')
    .escape(),
  validationFieldsResult,
]
