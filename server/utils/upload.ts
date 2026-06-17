import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

export type UploadedFile = {
  buffer: Buffer
  /** Original filename (Next.js File.name equivalent) */
  name: string
}
export function getUploadsDir(): string {
  return join(process.cwd(), 'public', 'uploads')
}

/**
 * Saves a file to the public/uploads directory.
 * @returns The public URL of the saved file (e.g. /uploads/1234-cover.jpg)
 */
export async function saveUpload(file: UploadedFile): Promise<string> {
  const bytes = file.buffer
  const uploadDir = getUploadsDir()

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const filePath = join(uploadDir, uniqueName)

  await writeFile(filePath, bytes)

  return `/uploads/${uniqueName}`
}

