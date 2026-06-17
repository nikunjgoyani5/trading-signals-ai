import type { NextFunction, Request, Response } from 'express'
import { HttpStatus } from '../constants/httpStatus.js'
import { AppError } from '../utils/AppError.js'
import { verifyAccessToken } from '../utils/token.js'

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined

  if (!token) {
    next(new AppError('Authentication required', HttpStatus.UNAUTHORIZED))
    return
  }

  try {
    const payload = verifyAccessToken(token)
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    }
    next()
  } catch {
    next(new AppError('Invalid or expired token', HttpStatus.UNAUTHORIZED))
  }
}
