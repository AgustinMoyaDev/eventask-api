import { RequestHandler } from 'express'

import { check, ValidationChain } from 'express-validator'

import { ITaskUpdateDto } from '../../types/dtos/task.js'
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

export const taskUpdateValidations = (): (ValidationChain | RequestHandler)[] => {
  return [
    check('title')
      .optional()
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Title must be between 5 and 100 characters.')
      .escape(),
    check('categoryId').optional().isMongoId().withMessage('Invalid category ID.'),
    check().custom((_, { req }) => {
      const { title, categoryId } = req.body as ITaskUpdateDto
      if (!title && !categoryId) {
        throw new Error('At least one field (title or categoryId) must be provided.')
      }
      return true
    }),
    validationFieldsResult,
  ]
}
