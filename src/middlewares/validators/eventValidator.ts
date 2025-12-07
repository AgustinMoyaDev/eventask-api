import { check, ValidationChain } from 'express-validator'

import { validationFieldsResult } from './validationFieldsResult.js'
import { endDate } from './customValidator.js'

export const eventValidations = (): (ValidationChain | typeof validationFieldsResult)[] => {
  return [
    check('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required.')
      .bail()
      .isLength({ max: 100 })
      .withMessage('Title must be at most 100 characters.')
      .escape(),
    check('start')
      .notEmpty()
      .withMessage('Start date is required.')
      .bail()
      .isISO8601()
      .withMessage('Start date must be a valid ISO date.')
      .toDate(),
    check('end')
      .notEmpty()
      .withMessage('End date is required.')
      .bail()
      .isISO8601()
      .withMessage('End date must be a valid ISO date.')
      .toDate()
      .custom(endDate),
    validationFieldsResult,
  ]
}
