/*
      Rutas de Category
      host + /api/categories
*/
import { Router } from 'express'

import { validateAccessJWT } from '../config/middlewares/JWT/validateAccessJWT.js'
import { categoryValidations } from '../middlewares/validators/categoryValidator.js'
import { toHandler } from '../config/middlewares/expressAdapter.js'

import { getCategoryController } from '../config/dependencies.js'
import { AuthenticatedRequest } from '../config/types/request.js'

const controller = getCategoryController()

const router = Router()

router.use(validateAccessJWT)

router.get(
  '/',
  toHandler<AuthenticatedRequest>(req => controller.getAllByUser(req))
)
router.get(
  '/:id',
  toHandler(req => controller.getById(req.params.id), 200)
)
router.post(
  '/',
  categoryValidations(),
  toHandler<AuthenticatedRequest>(
    req => controller.create({ ...req.body, createdBy: req.uid!, createdAt: new Date() }),
    201
  )
)
router.put(
  '/:id',
  toHandler(req => controller.update(req.params.id, req.body), 200)
)
router.delete(
  '/:id',
  toHandler(req => controller.delete(req.params.id), 204)
)

export const createCategoryRouter = () => router
