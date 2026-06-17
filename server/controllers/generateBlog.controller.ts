import type { Request, Response } from 'express'
import * as generateBlogService from '../services/generateBlog.service.js'
import { sendSuccess } from '../utils/sendResponse.js'

export async function generateBlog(req: Request, res: Response): Promise<void> {
  const { prompt } = req.body as { prompt?: string }
  const result = await generateBlogService.generateBlogContent(prompt ?? '')
  sendSuccess(res, result, 'Blog content generated')
}
