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

/** Copy text to the clipboard with a legacy fallback for restricted contexts. */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  const value = text.trim()
  if (!value) return false

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    /* fall through to execCommand */
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const copied = document.execCommand('copy')
    document.body.removeChild(textarea)
    return copied
  } catch {
    return false
  }
}

/** Strip tags and collapse whitespace for short text excerpts. */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** First paragraph after the title — used only as cover-image context, not the full article. */
function extractLeadExcerpt(html: string, maxLength = 220): string {
  const normalized = normalizeGeneratedHtml(html)
  const withoutTitle = normalized.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '')
  const paragraphMatch = withoutTitle.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  const source = paragraphMatch?.[1] ?? withoutTitle
  const text = htmlToPlainText(source)

  if (!text) return ''
  if (text.length <= maxLength) return text

  const clipped = text.slice(0, maxLength).trim().replace(/\s+\S*$/, '')
  return clipped ? `${clipped}…` : ''
}

/**
 * Build the blog-specific line fed into the cover-image style prompt.
 * Keeps the server-side photography template unchanged — only enriches the subject.
 */
export function buildCoverImageTopic(options: {
  title?: string
  content?: string
  topic?: string
  fallback?: string
}): string {
  const topicHint = options.topic?.trim() ?? ''
  const fallback = options.fallback?.trim() || topicHint
  const title =
    options.title?.trim() ||
    (options.content ? extractTitleFromHtml(options.content, '') : '') ||
    topicHint ||
    fallback

  if (!title) return ''

  const excerpt = options.content ? extractLeadExcerpt(options.content) : ''

  if (excerpt && !excerpt.toLowerCase().startsWith(title.toLowerCase())) {
    return `${title}. ${excerpt}`
  }

  if (topicHint && topicHint.toLowerCase() !== title.toLowerCase()) {
    return `${title}. ${topicHint}`
  }

  return title
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
