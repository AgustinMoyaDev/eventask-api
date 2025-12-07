import { RequestHandler } from 'express'

import { check, ValidationChain } from 'express-validator'

import { validationFieldsResult } from './validationFieldsResult.js'

export const googleLoginValidations = (): (ValidationChain | RequestHandler)[] => {
  return [
    check('idToken')
      .trim()
      .notEmpty()
      .withMessage('Google ID token is required.')
      .isJWT()
      .withMessage('Invalid token format.')
      .bail(),
    validationFieldsResult,
  ]
}
