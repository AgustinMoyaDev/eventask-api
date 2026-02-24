/*
      Rutas de Task
      host + /api/tasks
*/
import { Router } from 'express'

import { toHandler } from '../config/middlewares/expressAdapter.js'
import { validateAccessJWT } from '../config/middlewares/JWT/validateAccessJWT.js'
import { taskValidations, taskUpdateValidations } from '../middlewares/validators/taskValidator.js'
import { assignParticipantValidations } from '../middlewares/validators/assignParticipantValidator.js'

import { AuthenticatedRequest } from '../config/types/request.js'

import { getTaskController } from '../config/dependencies.js'

const controller = getTaskController()

const router = Router()

router.use(validateAccessJWT)

router.get(
  '/',
  toHandler<AuthenticatedRequest>(req => controller.getAllByUser(req))
)

router.post(
  '/:id/participants/:userId',
  assignParticipantValidations(),
  toHandler<AuthenticatedRequest>(req =>
    controller.assignParticipant(req.params.id, req.params.userId, req.uid!)
  )
)

router.post(
  '/',
  taskValidations(),
  toHandler<AuthenticatedRequest>(req => controller.createTask(req.uid!, req.body))
)

router.patch(
  '/:id',
  taskUpdateValidations(),
  toHandler(req => controller.updateTask(req.params.id, req.body))
)

router.get(
  '/:id',
  toHandler(req => controller.getTaskById(req.params.id))
)
router.delete(
  '/:id/participants/:userId',
  assignParticipantValidations(),
  toHandler<AuthenticatedRequest>(req =>
    controller.removeParticipant(req.params.id, req.params.userId, req.uid!)
  )
)
router.delete(
  '/:id',
  toHandler(req => controller.deleteWithEvents(req.params.id))
)

export const createTaskRouter = () => router
