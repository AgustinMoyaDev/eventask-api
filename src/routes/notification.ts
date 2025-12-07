/*
      Notification routes:
      host + /api/notifications
*/

import { Router } from 'express'

import { toHandler } from '../config/middlewares/expressAdapter.js'
import { AuthenticatedRequest } from '../config/types/request.js'
import { validateAccessJWT } from '../config/middlewares/JWT/validateAccessJWT.js'

import { getNotificationController } from '../config/dependencies.js'

const controller = getNotificationController()

const router = Router()

// All notification endpoints require authentication
router.use(validateAccessJWT)

router.get(
  '/',
  toHandler<AuthenticatedRequest>(req => controller.getUserNotifications(req))
)

router.get(
  '/unread-count',
  toHandler<AuthenticatedRequest>(req => controller.getUnreadCount(req))
)

router.put(
  '/:id/read',
  toHandler<AuthenticatedRequest>(req => controller.markAsRead(req))
)

router.put(
  '/mark-all-read',
  toHandler<AuthenticatedRequest>(req => controller.markAllAsRead(req))
)

export const createNotificationRouter = () => router
