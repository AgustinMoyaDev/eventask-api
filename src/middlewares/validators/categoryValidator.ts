import { check, ValidationChain } from 'express-validator'

import { validationFieldsResult } from './validationFieldsResult.js'

export const categoryValidations = (): (ValidationChain | typeof validationFieldsResult)[] => {
  return [
    check('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required.')
      .bail()
      .isLength({ min: 2, max: 15 })
      .withMessage('Name must be between 2 and 15 characters.')
      .escape(),
    validationFieldsResult,
  ]
}
