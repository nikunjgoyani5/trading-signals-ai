import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'

type RequestTarget = 'body' | 'query' | 'params'

export const validate =
  (schema: ZodSchema, target: RequestTarget = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target])
    if (!result.success) {
      next(result.error)
      return
    }
    req[target] = result.data
    next()
  }
