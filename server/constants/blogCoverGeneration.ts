import { env } from '../config/env.js'
import { AppError } from '../utils/AppError.js'
import { HttpStatus } from '../constants/httpStatus.js'

/** Total AI cover generations allowed per blog (lifetime). Configurable via env, clamped 3–5. */
export function getMaxBlogAiCoverGenerations(): number {
  const raw = env.MAX_BLOG_AI_COVER_GENERATIONS
  if (raw === undefined || raw === null) return 3
  return Math.min(5, Math.max(3, raw))
}

export function isValidAiCoverGenerationCount(count: number, max = getMaxBlogAiCoverGenerations()): boolean {
  return Number.isInteger(count) && count >= 0 && count <= max
}

export function validateAiCoverGenerationCountForCreate(count: number | undefined): number {
  const maxGenerations = getMaxBlogAiCoverGenerations()
  if (count === undefined || count === null) return 0
  if (!isValidAiCoverGenerationCount(count, maxGenerations)) {
    throw new AppError(
      `Invalid AI cover generation count. Must be between 0 and ${maxGenerations}.`,
      HttpStatus.BAD_REQUEST,
    )
  }
  return count
}
