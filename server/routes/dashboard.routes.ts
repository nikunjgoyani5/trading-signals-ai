import { Router } from 'express'
import { getAnalytics } from '../controllers/dashboard.controller.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/analytics', authenticate, asyncHandler(getAnalytics))

export default router
