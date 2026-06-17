import { Router } from 'express'
import {
  archiveBlog,
  createBlog,
  deleteBlog,
  getBlog,
  getPublicBlog,
  listBlogs,
  listPublicBlogs,
  publishBlog,
  updateBlog,
} from '../controllers/blog.controller.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { parseBlogBodyWithMulter } from '../middlewares/blogUpload.middleware.js'

const router = Router()

router.get('/public', asyncHandler(listPublicBlogs))
router.get('/public/:slug', asyncHandler(getPublicBlog))

router.get('/', authenticate, asyncHandler(listBlogs))
router.post('/', authenticate, parseBlogBodyWithMulter, asyncHandler(createBlog))

router.patch('/:slug/publish', authenticate, asyncHandler(publishBlog))
router.patch('/:slug/archive', authenticate, asyncHandler(archiveBlog))

router.get('/:slug', authenticate, asyncHandler(getBlog))
router.put('/:slug', authenticate, parseBlogBodyWithMulter, asyncHandler(updateBlog))
router.delete('/:slug', authenticate, asyncHandler(deleteBlog))

export default router
