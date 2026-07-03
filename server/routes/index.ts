import { Router } from 'express'
import authRoutes from './auth.routes.js'
import blogsRoutes from './blogs.routes.js'
import dashboardRoutes from './dashboard.routes.js'
import generateBlogRoutes from './generateBlog.routes.js'
import generateImageRoutes from './generateImage.routes.js'
import healthRoutes from './health.routes.js'
import inquiryRoutes from './inquiry.routes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/inquiries', inquiryRoutes)
router.use('/auth', authRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/blogs', blogsRoutes)
router.use('/generate-blog', generateBlogRoutes)
router.use('/generate-image', generateImageRoutes)

export default router
