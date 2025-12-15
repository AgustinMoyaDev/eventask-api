/*
      Auth routes:
      host + /api/auth
*/
import { Router } from 'express'

import { AuthenticatedRequest } from '../config/types/request.js'
import { getAuthController } from '../config/dependencies.js'
import { toHandler } from '../config/middlewares/expressAdapter.js'
import { validateRefreshToken } from '../config/middlewares/JWT/validateRefreshJWT.js'
import { validateAccessJWT } from '../config/middlewares/JWT/validateAccessJWT.js'

import { registerValidations } from '../middlewares/validators/registerValidator.js'
import { loginValidations } from '../middlewares/validators/loginValidator.js'
import { googleLoginValidations } from '../middlewares/validators/googleLoginValidator.js'
import { passwordResetValidations } from '../middlewares/validators/requestPasswordResetValidator.js'
import { resetPasswordValidations } from '../middlewares/validators/resetPasswordValidator.js'
import { setPasswordValidations } from '../middlewares/validators/setPasswordValidator.js'

const controller = getAuthController()

const router = Router()

router.post(
  '/request-password-reset',
  passwordResetValidations(),
  toHandler(req => controller.requestPasswordReset(req.body), 200)
)

router.post(
  '/reset-password',
  resetPasswordValidations(),
  toHandler(req => controller.resetPassword(req.body), 200)
)
router.post(
  '/register',
  registerValidations(),
  toHandler((req, res) => controller.register(req.body, res), 201)
)
router.post(
  '/google-login',
  googleLoginValidations(),
  toHandler((req, res) => controller.googleLogin(req.body, res), 200)
)
router.post(
  '/login',
  loginValidations(),
  toHandler((req, res) => controller.login(req.body, res))
)
router.post(
  '/refresh',
  validateRefreshToken,
  toHandler(req => controller.refresh(req.cookies.refreshToken))
)
router.post(
  '/logout',
  validateAccessJWT,
  toHandler((req, res) => controller.logout(req.cookies.refreshToken, res), 204)
)
router.post(
  '/set-password',
  validateAccessJWT,
  setPasswordValidations(),
  toHandler<AuthenticatedRequest>(req => controller.setPassword(req.uid!, req.body), 200)
)

export const createAuthRouter = () => router
