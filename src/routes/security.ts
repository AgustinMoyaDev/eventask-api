/*
      Security routes:
      host + /api/security
*/
import { toHandler } from '../config/middlewares/expressAdapter.js'
import { AuthenticatedRequest } from '../config/types/request.js'
import { Router } from 'express'

export const createSecurityRouter = () => {
  const router = Router()

  router.get(
    '/csrf-token',
    toHandler<AuthenticatedRequest>(async req => ({ csrfToken: req.csrfToken!() }), 200)
  )

  return router
}
