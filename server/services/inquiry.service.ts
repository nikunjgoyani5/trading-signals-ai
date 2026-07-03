import mongoose from 'mongoose'
import { HttpStatus } from '../constants/httpStatus.js'
import { Inquiry, type InquiryDocument } from '../models/inquiry.model.js'
import { AppError } from '../utils/AppError.js'
import { generateTicketNumber } from '../utils/ticketNumber.js'
import { sendInquiryEmails } from './email.service.js'
import { logger } from '../utils/logger.js'

export type InquiryStatus = 'open' | 'responded' | 'resolved'

export type SerializedInquiry = {
  id: string
  ticketNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  status: InquiryStatus
  respondedAt: string | null
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
}

const INQUIRY_STATUSES = new Set<InquiryStatus>(['open', 'responded', 'resolved'])

function normalizeStatus(value: unknown): InquiryStatus {
  if (typeof value === 'string' && INQUIRY_STATUSES.has(value as InquiryStatus)) {
    return value as InquiryStatus
  }
  return 'open'
}

function serializeInquiry(doc: InquiryDocument): SerializedInquiry {
  const obj = doc.toObject()

  return {
    id: String(obj._id),
    ticketNumber: String(obj.ticketNumber),
    firstName: String(obj.firstName),
    lastName: String(obj.lastName),
    email: String(obj.email),
    phone: String(obj.phone ?? ''),
    message: String(obj.message),
    status: normalizeStatus(obj.status),
    respondedAt: obj.respondedAt ? new Date(obj.respondedAt as Date).toISOString() : null,
    resolvedAt: obj.resolvedAt ? new Date(obj.resolvedAt as Date).toISOString() : null,
    createdAt: new Date(obj.createdAt as Date).toISOString(),
    updatedAt: new Date(obj.updatedAt as Date).toISOString(),
  }
}

function buildIdentifierQuery(identifier: string) {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return { _id: identifier }
  }
  return { ticketNumber: identifier }
}

function buildStatusUpdates(nextStatus: InquiryStatus) {
  const now = new Date()
  const updates: Record<string, unknown> = { status: nextStatus }

  if (nextStatus === 'responded') {
    updates.respondedAt = now
  }

  if (nextStatus === 'resolved') {
    updates.resolvedAt = now
  }

  if (nextStatus === 'open') {
    updates.respondedAt = null
    updates.resolvedAt = null
  }

  return updates
}

export type CreateInquiryInput = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  message: string
}

export type CreateInquiryResult = {
  inquiry: SerializedInquiry
  emailSent: boolean
  emailError?: string
}

export async function createInquiry(input: CreateInquiryInput): Promise<CreateInquiryResult> {
  const ticketNumber = generateTicketNumber()

  const inquiry = await Inquiry.create({
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() ?? '',
    message: input.message.trim(),
    ticketNumber,
    status: 'open',
  })

  let emailSent = false
  let emailError: string | undefined

  try {
    await sendInquiryEmails(inquiry)
    emailSent = true
  } catch (error) {
    emailError = error instanceof Error ? error.message : String(error)
    logger.error('[inquiry] Saved to database but email delivery failed:', emailError)
  }

  return {
    inquiry: serializeInquiry(inquiry),
    emailSent,
    emailError,
  }
}

export async function listInquiries(): Promise<SerializedInquiry[]> {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 })
  return inquiries.map(serializeInquiry)
}

export async function updateInquiryStatus(
  identifier: string,
  nextStatus: InquiryStatus,
): Promise<SerializedInquiry | null> {
  const status = normalizeStatus(nextStatus)
  const query = buildIdentifierQuery(identifier)
  const existing = await Inquiry.findOne(query)

  if (!existing) {
    return null
  }

  const updated = await Inquiry.findOneAndUpdate(query, buildStatusUpdates(status), {
    returnDocument: 'after',
    runValidators: true,
  })

  return updated ? serializeInquiry(updated) : null
}

export async function getInquiryOrThrow(identifier: string): Promise<SerializedInquiry> {
  const query = buildIdentifierQuery(identifier)
  const inquiry = await Inquiry.findOne(query)

  if (!inquiry) {
    throw new AppError('Inquiry not found', HttpStatus.NOT_FOUND)
  }

  return serializeInquiry(inquiry)
}
