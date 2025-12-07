/*
      Rutas de Task
      host + /api/tasks
*/
import { Router } from 'express'

import { toHandler } from '../config/middlewares/expressAdapter.js'
import { validateAccessJWT } from '../config/middlewares/JWT/validateAccessJWT.js'
import { taskValidations } from '../middlewares/validators/taskValidator.js'

import { AuthenticatedRequest } from '../config/types/request.js'

import { getTaskController } from '../config/dependencies.js'

const controller = getTaskController()

const router = Router()

router.use(validateAccessJWT)

router.get(
  '/',
  toHandler<AuthenticatedRequest>(req => controller.getAllByUser(req.uid!, req.query))
)
router.post(
  '/',
  taskValidations(),
  toHandler<AuthenticatedRequest>(req => controller.createTaskWithEvents(req.uid!, req.body))
)
router.get(
  '/:id',
  toHandler(req => controller.getTaskById(req.params.id))
)
router.put(
  '/:id',
  taskValidations(),
  toHandler<AuthenticatedRequest>(req =>
    controller.updateTaskWithEvents(req.params.id, req.body, req.uid!)
  )
)
router.delete(
  '/:id',
  toHandler(req => controller.deleteWithEvents(req.params.id))
)

export const createTaskRouter = () => router
