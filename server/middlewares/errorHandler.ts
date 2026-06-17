import type { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { ZodError } from 'zod'
import { corsOptions } from '../config/cors.js'
import { env } from '../config/env.js'
import { HttpStatus } from '../constants/httpStatus.js'
import { AppError } from '../utils/AppError.js'
import { logger } from '../utils/logger.js'
import { sendError } from '../utils/sendResponse.js'

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  cors(corsOptions)(req, res, () => {
    handleError(err, res)
  })
}

function handleError(err: unknown, res: Response): void {
  if (err instanceof ZodError) {
    sendError(res, 'Validation failed', HttpStatus.BAD_REQUEST, err.flatten().fieldErrors)
    return
  }

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode)
    return
  }

  logger.error('Unhandled error', err)

  sendError(
    res,
    env.NODE_ENV === 'production' ? 'Internal server error' : String(err),
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
}
