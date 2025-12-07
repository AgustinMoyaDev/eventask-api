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
    check('participantsIds')
      .optional()
      .isArray()
      .withMessage('Participants must be an array of IDs.')
      .bail(),
    check('participantsIds.*')
      .optional()
      .isMongoId()
      .withMessage('Each participant must be a valid Mongo ID.'),
    check('eventsIds').optional().isArray().withMessage('Events must be an array.'),
    // Global validation fields result
    validationFieldsResult,
  ]
}
