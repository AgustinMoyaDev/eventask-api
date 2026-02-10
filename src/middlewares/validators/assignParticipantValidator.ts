import { RequestHandler } from 'express'
import { param, ValidationChain } from 'express-validator'
import { validationFieldsResult } from './validationFieldsResult.js'

/**
 * Validates params for POST /tasks/:id/participants/:userId
 */
export const assignParticipantValidations = (): (ValidationChain | RequestHandler)[] => {
  return [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('Task ID is required.')
      .bail()
      .isMongoId()
      .withMessage('Invalid task ID format.'),
    param('userId')
      .trim()
      .notEmpty()
      .withMessage('User ID is required.')
      .bail()
      .isMongoId()
      .withMessage('Invalid user ID format.'),
    validationFieldsResult,
  ]
}
