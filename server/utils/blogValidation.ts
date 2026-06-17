function describeContentField(body: Record<string, unknown>): string {
  if (body.content === undefined) {
    const keys = Object.keys(body).filter((key) => body[key] !== undefined && body[key] !== '')
    return keys.length
      ? `The "content" field was not sent. Received fields: ${keys.join(', ')}. In Postman use Type "Text", check the row checkbox, and add HTML in the Value column.`
      : 'The "content" field was not sent. In Postman add key "content", Type "Text", check the row, and enter your HTML in Value.'
  }

  if (typeof body.content !== 'string') {
    return 'The "content" field must be text, not a file upload.'
  }

  if (body.content.trim() === '') {
    return 'The "content" field was sent but the value is empty.'
  }

  return 'Content is required and must be a non-empty string.'
}

/**
 * Ported from Next.js lib/validation_middleware/validate.ts
 */
export function validateBlogData(
  body: Record<string, unknown>,
  isUpdate = false,
  options?: {
    hasCoverFile?: boolean
    hasCoverInRequest?: boolean
  },
): string[] | null {
  const errors: string[] = []
  const requestedStatus = typeof body.status === 'string' ? body.status.toLowerCase() : 'draft'
  const requiresContent = !isUpdate && requestedStatus === 'published'

  if (
    requiresContent &&
    (!body.content || typeof body.content !== 'string' || body.content.trim() === '')
  ) {
    errors.push(describeContentField(body))
  }

  if (body.status !== undefined) {
    if (typeof body.status !== 'string' || !['draft', 'published'].includes(body.status.toLowerCase())) {
      errors.push('Status on create must be draft or published.')
    }
  }

  if (body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim() === '') {
      errors.push('Title must be a non-empty string if provided.')
    }
  }

  if (isUpdate) {
    const hasTitle = body.title !== undefined
    const hasContent = body.content !== undefined
    const hasCoverText =
      body.coverImage !== undefined &&
      typeof body.coverImage === 'string' &&
      body.coverImage.trim() !== ''
    const hasCover = Boolean(options?.hasCoverFile || options?.hasCoverInRequest || hasCoverText)

    if (!hasTitle && !hasContent && !hasCover) {
      errors.push('At least one field (title, content, or coverImage) must be provided for an update.')
    }
  }

  return errors.length > 0 ? errors : null
}
