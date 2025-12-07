import { RequestHandler } from 'express'

import { check, ValidationChain } from 'express-validator'

import { validationFieldsResult } from './validationFieldsResult.js'

export const passwordResetValidations = (): (ValidationChain | RequestHandler)[] => [
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Invalid email format.')
    .isLength({ max: 100 })
    .withMessage('Email must be at most 100 characters.')
    .normalizeEmail(),
  validationFieldsResult,
]
