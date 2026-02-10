import { RequestHandler } from 'express'

import { check, ValidationChain } from 'express-validator'

import { validationFieldsResult } from './validationFieldsResult.js'

export const taskValidations = (): (ValidationChain | RequestHandler)[] => {
  return [
    check('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required.')
      .bail()
      .isLength({ min: 5, max: 100 })
      .withMessage('Title must be between 5 and 100 characters.')
      .escape(),
    check('categoryId')
      .notEmpty()
      .withMessage('Category ID is required.')
      .bail()
      .isMongoId()
      .withMessage('Invalid category ID.'),
    validationFieldsResult,
  ]
}
