/** Extract the first <h1> text from generated HTML, or fall back to a trimmed prompt. */
export function extractTitleFromHtml(html: string, fallback = 'Untitled Blog'): string {
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (!match?.[1]) return fallback

  const text = match[1]
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  return text || fallback
}

function stripHtmlWrappers(rawHtml: string): string {
  return rawHtml
    .replace(/<!doctype[\s\S]*?>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<\/?(html|body)[^>]*>/gi, '')
    .trim()
}

/** Clean HTML for preview and copy — keeps full article markup. */
export function normalizeGeneratedHtml(content: string): string {
  const fencedBlockMatch = content.match(/```(?:html)?\s*([\s\S]*?)```/i)
  const rawHtml = (fencedBlockMatch?.[1] || content).trim()
  return stripHtmlWrappers(rawHtml)
}

/** Strip oversized inline images before persisting (Multer / MongoDB limits). */
export function prepareBlogHtmlForSave(content: string): string {
  return normalizeGeneratedHtml(content)
    .replace(/<img\b[^>]*src=["']data:image[^"']*["'][^>]*>/gi, '')
    .replace(/IMAGE_\d+/g, '')
    .trim()
}

/** Convert a data URL preview into a file for multipart upload (VDT-style). */
export async function dataUrlToFile(dataUrl: string, filename = 'cover.png'): Promise<File | null> {
  const trimmed = dataUrl.trim()
  if (!/^data:image\/[a-z0-9.+-]+;base64,/i.test(trimmed)) {
    return null
  }

  const response = await fetch(trimmed)
  const blob = await response.blob()
  const type = blob.type || 'image/png'
  return new File([blob], filename, { type })
}
