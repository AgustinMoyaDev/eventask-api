import { check, ValidationChain } from 'express-validator'

import { validationFieldsResult } from './validationFieldsResult.js'

export const loginValidations = (): (ValidationChain | typeof validationFieldsResult)[] => {
  return [
    check('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required.')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .isLength({ max: 100 })
      .withMessage('Email must be at most 100 characters.')
      .bail()
      .normalizeEmail(),
    check('password')
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
      .bail()
      .escape(),
    validationFieldsResult,
  ]
}
