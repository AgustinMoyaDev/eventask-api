/*
      Invitation routes:
      host + /api/invitations
*/
import { Router } from 'express'

import { toHandler } from '../config/middlewares/expressAdapter.js'
import { AuthenticatedRequest } from '../config/types/request.js'
import { validateAccessJWT } from '../config/middlewares/JWT/validateAccessJWT.js'
import { inviteContactValidations } from '../middlewares/validators/invitationValidator.js'

import { getInvitationController } from '../config/dependencies.js'

const controller = getInvitationController()

const router = Router()

router.use(validateAccessJWT)

router.post(
  '/invite',
  inviteContactValidations(),
  toHandler<AuthenticatedRequest>(req => controller.inviteContact(req), 201)
)

router.put(
  '/:id/accept',
  toHandler<AuthenticatedRequest>(req => controller.acceptInvitation(req))
)

router.put(
  '/:id/reject',
  toHandler<AuthenticatedRequest>(req => controller.rejectInvitation(req))
)

export const createInvitationRouter = () => router
