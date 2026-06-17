/**
 * Fetches an image from a remote URL and converts it to a Base64 data string.
 */
export async function urlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const contentType = response.headers.get('content-type') || 'image/png'
    const base64 = buffer.toString('base64')

    return `data:${contentType};base64,${base64}`
  } catch (error) {
    console.error('Error converting URL to Base64:', error)
    throw error
  }
}
