import { Router } from 'express'
import { generateBlog } from '../controllers/generateBlog.controller.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/', authenticate, asyncHandler(generateBlog))

export default router
