import { cloudinary, ensureCloudinaryConfigured } from '../config/cloudinary.js'
import { env } from '../config/env.js'
import type { UploadedFile } from './upload.js'

const BLOG_COVER_FOLDER = 'trading-signals/blogs'

function isCloudinaryUrl(value: string): boolean {
  return /res\.cloudinary\.com/i.test(value)
}

function resolvePublicUrl(value: string): string {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  if (value.startsWith('/')) {
    const base = (env.API_PUBLIC_URL ?? `http://localhost:${env.PORT}`).replace(/\/$/, '')
    return `${base}${value}`
  }

  return value
}

async function uploadRemoteOrDataUrl(source: string): Promise<string> {
  ensureCloudinaryConfigured()

  const result = await cloudinary.uploader.upload(source, {
    folder: BLOG_COVER_FOLDER,
    resource_type: 'image',
  })

  return result.secure_url
}

export async function uploadCoverBuffer(file: UploadedFile): Promise<string> {
  ensureCloudinaryConfigured()

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: BLOG_COVER_FOLDER,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error('Cloudinary upload failed'))
          return
        }
        resolve(result.secure_url)
      },
    )

    upload.end(file.buffer)
  })
}

/**
 * On blog save — upload cover to Cloudinary and return the secure URL for MongoDB.
 */
export async function uploadCoverImage(coverImage: string): Promise<string> {
  const value = coverImage.trim()
  if (!value) {
    throw new Error('Cover image is empty')
  }

  if (isCloudinaryUrl(value)) {
    return value
  }

  if (/^data:image\/[a-z0-9.+-]+;base64,/i.test(value)) {
    return uploadRemoteOrDataUrl(value)
  }

  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
    return uploadRemoteOrDataUrl(resolvePublicUrl(value))
  }

  throw new Error('Unsupported cover image format')
}
