import { uploadCoverBuffer, uploadCoverImage } from './cloudinaryUpload.js'
import type { UploadedFile } from './upload.js'

export type BlogCoverInput = {
  /** Base64 data URL or existing URL from JSON / multipart text field */
  coverImage?: string
  /** Local file from multipart field `coverImage` */
  coverImageFile?: UploadedFile
}

function isBase64DataUrl(value: string): boolean {
  return /^data:image\/[a-z0-9.+-]+;base64,/i.test(value.trim())
}

function hasCoverInput(input: BlogCoverInput): boolean {
  if (input.coverImageFile?.buffer?.length) return true
  const text = input.coverImage?.trim()
  return Boolean(text)
}

/**
 * On blog save (create or update):
 * 1. Local file upload (multipart) → Cloudinary → secure URL
 * 2. Base64 data URL in body/form → Cloudinary → secure URL
 *
 * File takes precedence when both are sent.
 */
export async function persistBlogCoverOnSave(
  input: BlogCoverInput,
): Promise<string | undefined> {
  if (!hasCoverInput(input)) return undefined

  if (input.coverImageFile?.buffer?.length) {
    return uploadCoverBuffer(input.coverImageFile)
  }

  const value = input.coverImage?.trim()
  if (!value) return undefined

  if (!isBase64DataUrl(value) && !value.startsWith('http') && !value.startsWith('/')) {
    throw new Error(
      'Cover image must be a local file upload or a base64 data URL (data:image/...;base64,...)',
    )
  }

  return uploadCoverImage(value)
}

export function hasBlogCoverInRequest(
  body: { coverImage?: string },
  coverImageFile?: UploadedFile,
): boolean {
  return hasCoverInput({ coverImage: body.coverImage, coverImageFile })
}
