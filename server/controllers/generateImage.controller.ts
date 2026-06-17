import type { Request, Response } from 'express'
import * as generateImageService from '../services/generateImage.service.js'
import { sendSuccess } from '../utils/sendResponse.js'

export async function generateImage(req: Request, res: Response): Promise<void> {
  const { prompt } = req.body as { prompt?: string }
  const result = await generateImageService.generateCoverImage(prompt ?? '')
  sendSuccess(res, result, 'Image generated')
}
