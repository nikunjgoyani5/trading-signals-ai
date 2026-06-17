import type { Response } from 'express'
import { HttpStatus } from '../constants/httpStatus.js'

type SuccessBody<T> = {
  success: true
  message: string
  data: T
}

type ErrorBody = {
  success: false
  message: string
  errors?: Record<string, string[] | undefined>
}

/** Send a standard success JSON response */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode: number = HttpStatus.OK,
): void {
  const body: SuccessBody<T> = { success: true, message, data }
  res.status(statusCode).json(body)
}

/** Send a standard error JSON response (also used by the global error handler) */
export function sendError(
  res: Response,
  message: string,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  errors?: Record<string, string[] | undefined>,
): void {
  const body: ErrorBody = { success: false, message }
  if (errors) {
    body.errors = errors
  }
  res.status(statusCode).json(body)
}
