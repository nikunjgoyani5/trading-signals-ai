import { Router } from 'express'
import {
  listInquiries,
  submitInquiry,
  updateInquiryStatus,
} from '../controllers/inquiry.controller.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  submitInquirySchema,
  updateInquiryStatusSchema,
} from '../validations/inquiry.validation.js'

const router = Router()

router.post('/', validate(submitInquirySchema), asyncHandler(submitInquiry))
router.get('/', authenticate, asyncHandler(listInquiries))
router.patch(
  '/:identifier/status',
  authenticate,
  validate(updateInquiryStatusSchema),
  asyncHandler(updateInquiryStatus),
)

export default router
