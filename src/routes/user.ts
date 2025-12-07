/*
      User routes:
      host + /api/users
*/

import { Router } from 'express'

import { toHandler } from '../config/middlewares/expressAdapter.js'

import { AuthenticatedRequest } from '../config/types/request.js'

import { validateAccessJWT } from '../config/middlewares/JWT/validateAccessJWT.js'
import { uploadAvatar } from '../config/middlewares/upload/uploadAvatarMiddleware.js'

import { getUserController } from '../config/dependencies.js'

const controller = getUserController()

const router = Router()

router.use(validateAccessJWT)

router.post(
  '/me/avatar',
  uploadAvatar,
  toHandler<AuthenticatedRequest>(req => controller.uploadAvatar(req))
)

router.get(
  '/me',
  toHandler<AuthenticatedRequest>(req => controller.getProfileWithContacts(req.uid!))
)

router.get(
  '/',
  toHandler(() => controller.getAll())
)

router.get(
  '/:id',
  toHandler(req => controller.getById(req.params.id))
)

router.post(
  '/',
  toHandler(req => controller.create(req.body), 201)
)

router.put(
  '/me',
  toHandler<AuthenticatedRequest>(req => controller.update(req.uid!, req.body))
)

router.put(
  '/:id',
  toHandler(req => controller.update(req.params.id, req.body))
)

router.delete(
  '/:id',
  toHandler(req => controller.delete(req.params.id), 204)
)

export const createUserRouter = () => router
