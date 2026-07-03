import { z } from 'zod'

export const submitInquirySchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().email('A valid email address is required'),
  phone: z.string().trim().optional().default(''),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
})

export const inquiryStatusSchema = z.enum(['open', 'responded', 'resolved'])

export const updateInquiryStatusSchema = z.object({
  status: inquiryStatusSchema,
})
