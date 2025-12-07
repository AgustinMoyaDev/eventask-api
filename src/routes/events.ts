/*
      Event routes
      host + /api/events
*/
import { Router } from 'express'

import { AuthenticatedRequest } from '../config/types/request.js'

import { toHandler } from '../config/middlewares/expressAdapter.js'

import { validateAccessJWT } from '../config/middlewares/JWT/validateAccessJWT.js'
import { eventValidations } from '../middlewares/validators/eventValidator.js'

import { getEventController } from '../config/dependencies.js'

const controller = getEventController()

const router = Router()

router.use(validateAccessJWT)

router.get(
  '/',
  toHandler<AuthenticatedRequest>(req => controller.getAllByUser(req.uid!, req.query))
)
router.get(
  '/all',
  toHandler(() => controller.getAll())
)
router.get(
  '/:id',
  toHandler(req => controller.getById(req.params.id))
)
router.post(
  '/',
  eventValidations(),
  toHandler<AuthenticatedRequest>(req => controller.create(req.body))
)
router.put(
  '/:id/collaborators/:collaboratorId',
  toHandler<AuthenticatedRequest>(req =>
    controller.assignCollaborator(req.uid!, req.params.id, req.params.collaboratorId)
  )
)
router.put(
  '/:id',
  eventValidations(),
  toHandler(req => controller.update(req.params.id, req.body))
)
router.patch(
  '/:id/status',
  toHandler<AuthenticatedRequest>(req => controller.updateStatus(req.params.id, req.body))
)
router.delete(
  '/:id/collaborators/:collaboratorId',
  toHandler<AuthenticatedRequest>(req =>
    controller.removeCollaborator(req.uid!, req.params.id, req.params.collaboratorId)
  )
)
router.delete(
  '/:id',
  toHandler(req => controller.delete(req.params.id))
)

export const createEventRouter = () => router
