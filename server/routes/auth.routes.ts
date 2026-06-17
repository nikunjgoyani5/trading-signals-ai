import { Router } from 'express'
import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  resetPassword,
} from '../controllers/auth.controller.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from '../validations/auth.validation.js'

const router = Router()

router.post('/login', validate(loginSchema), asyncHandler(login))
router.post('/refresh', asyncHandler(refresh))
router.post('/logout', asyncHandler(logout))
router.get('/me', authenticate, asyncHandler(me))
router.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(forgotPassword))
router.post('/reset-password', validate(resetPasswordSchema), asyncHandler(resetPassword))

export default router
