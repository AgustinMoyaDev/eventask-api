import { RequestHandler } from 'express'

import { check, ValidationChain } from 'express-validator'

import { validationFieldsResult } from './validationFieldsResult.js'

export const changePasswordValidations = (): (ValidationChain | RequestHandler)[] => {
  return [
    check('currentPassword')
      .trim()
      .notEmpty()
      .withMessage('Current password is required.')
      .isLength({ min: 8, max: 64 })
      .withMessage('Current password must be between 8 and 64 characters.')
      .bail(),
    check('newPassword')
      .trim()
      .notEmpty()
      .withMessage('Password is required.')
      .isLength({ min: 8, max: 64 })
      .withMessage('Password must be between 8 and 64 characters.')
      // TODO: Uncomment for stronger password requirements after debugging
      // .matches(/[A-Z]/)
      // .withMessage('Password must contain at least one uppercase letter.')
      // .matches(/[a-z]/)
      // .withMessage('Password must contain at least one lowercase letter.')
      // .matches(/[0-9]/)
      // .withMessage('Password must contain at least one number.')
      // .matches(/[!@#$%^&*(),.?":{}|<>]/)
      // .withMessage('Password must contain at least one special character.')
      .custom((value, { req }) => {
        if (value === req.body.currentPassword) {
          throw new Error('New password must be different from current password.')
        }
        return true
      })
      .bail()
      .escape(),
    validationFieldsResult,
  ]
}
