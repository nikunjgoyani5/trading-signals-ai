import type { Request, Response } from 'express'
import { HttpStatus } from '../constants/httpStatus.js'
import * as inquiryService from '../services/inquiry.service.js'
import { AppError } from '../utils/AppError.js'
import { sendSuccess } from '../utils/sendResponse.js'

export async function submitInquiry(req: Request, res: Response): Promise<void> {
  const result = await inquiryService.createInquiry(req.body)

  sendSuccess(
    res,
    {
      ticketNumber: result.inquiry.ticketNumber,
      emailSent: result.emailSent,
      inquiry: {
        id: result.inquiry.id,
        ticketNumber: result.inquiry.ticketNumber,
        firstName: result.inquiry.firstName,
        lastName: result.inquiry.lastName,
        email: result.inquiry.email,
        status: result.inquiry.status,
        createdAt: result.inquiry.createdAt,
      },
    },
    result.emailSent
      ? 'Your email was successfully received and a ticket has been generated.'
      : 'Your inquiry was saved, but we could not send a confirmation email. Our team will still review your message.',
    HttpStatus.CREATED,
  )
}

export async function listInquiries(_req: Request, res: Response): Promise<void> {
  const inquiries = await inquiryService.listInquiries()

  sendSuccess(res, {
    count: inquiries.length,
    inquiries,
  })
}

export async function updateInquiryStatus(req: Request, res: Response): Promise<void> {
  const updated = await inquiryService.updateInquiryStatus(
    String(req.params.identifier),
    req.body.status,
  )

  if (!updated) {
    throw new AppError('Inquiry not found', HttpStatus.NOT_FOUND)
  }

  sendSuccess(res, updated, 'Inquiry status updated')
}
