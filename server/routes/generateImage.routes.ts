import { Router } from 'express'
import { generateImage } from '../controllers/generateImage.controller.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/', authenticate, asyncHandler(generateImage))

export default router
