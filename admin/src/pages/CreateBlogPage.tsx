import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BlogCoverImageSelector from '../components/blogs/BlogCoverImageSelector'
import BlogCreatePreviewPanel from '../components/blogs/BlogCreatePreviewPanel'
import BlogGenerationForm from '../components/blogs/BlogGenerationForm'
import {
  useCreateBlogMutation,
  useGenerateBlogContentMutation,
  useGenerateCoverImageMutation,
} from '../redux/api/blogsApi'
import { getApiErrorMessage } from '../utils/apiError'
import { extractTitleFromHtml, prepareBlogHtmlForSave } from '../utils/blogContent'

const MAX_IMAGE_REGEN = 3

export default function CreateBlogPage() {
  const navigate = useNavigate()

  const [prompt, setPrompt] = useState('')
  const [blogContent, setBlogContent] = useState('')
  const [lastPrompt, setLastPrompt] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [regenCount, setRegenCount] = useState(0)
  const [actionError, setActionError] = useState<string | null>(null)

  const [generateContent, { isLoading: isGeneratingContent }] = useGenerateBlogContentMutation()
  const [generateImage, { isLoading: isGeneratingImage }] = useGenerateCoverImageMutation()
  const [createBlog, { isLoading: isSaving }] = useCreateBlogMutation()

  const handleCoverImageChange = (url: string) => {
    setCoverImage(url)
  }

  const handleImageGenerate = async () => {
    const topic = prompt.trim() || lastPrompt.trim()
    if (!topic) {
      setActionError('Enter a blog topic before generating a cover image.')
      return
    }
    if (isGeneratingImage || regenCount >= MAX_IMAGE_REGEN) return

    setActionError(null)
    try {
      const result = await generateImage({ prompt: topic }).unwrap()
      setCoverImage(result.url)
      setRegenCount((count) => count + 1)
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Failed to generate cover image.'))
    }
  }

  const handleGenerate = async (useLastPrompt = false) => {
    const selectedPrompt = useLastPrompt ? prompt.trim() || lastPrompt.trim() : prompt.trim()
    if (!selectedPrompt || isGeneratingContent) return

    setActionError(null)
    try {
      const result = await generateContent({ prompt: selectedPrompt }).unwrap()
      const generatedContent = result.content?.trim() ?? ''
      if (!generatedContent) {
        setActionError('Generation returned empty content. Please try again.')
        return
      }
      setBlogContent(generatedContent)
      setLastPrompt(selectedPrompt)
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Failed to generate blog. Please try again.'))
    }
  }

  const saveBlog = async (status: 'draft' | 'published') => {
    const html = prepareBlogHtmlForSave(blogContent)
    if (!html) return

    setActionError(null)
    try {
      const title = extractTitleFromHtml(html, lastPrompt.trim() || 'Untitled Blog')
      await createBlog({
        content: html,
        status,
        title,
        coverImage: coverImage || undefined,
      }).unwrap()

      navigate('/admin/blogs', { replace: true })
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Failed to save blog. Please try again.'))
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-tsai-accent-cyan">
            Content
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-tsai-text sm:text-3xl">Create Blog</h1>
          <p className="mt-2 max-w-2xl text-sm text-tsai-muted">
            Generate AI content, preview it, then save as a draft or publish to the public site.
          </p>
        </div>
        <Link
          to="/admin/blogs"
          className="text-sm font-medium text-tsai-accent-cyan hover:underline"
        >
          ← Back to all blogs
        </Link>
      </div>

      {actionError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {actionError}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:items-start">
        <div className="space-y-5 xl:sticky xl:top-6">
          <BlogGenerationForm
            prompt={prompt}
            onPromptChange={setPrompt}
            isGenerating={isGeneratingContent}
            onGenerate={() => void handleGenerate()}
          />
          <BlogCoverImageSelector
            coverImage={coverImage}
            onImageChange={handleCoverImageChange}
            onImageGenerate={() => void handleImageGenerate()}
            isGeneratingImage={isGeneratingImage}
            disabled={isGeneratingContent || isSaving}
            regenCount={regenCount}
            maxRegen={MAX_IMAGE_REGEN}
          />
        </div>

        <BlogCreatePreviewPanel
          content={blogContent}
          isLoading={isGeneratingContent}
          isSaving={isSaving}
          onRegenerate={() => void handleGenerate(true)}
          onSaveDraft={() => void saveBlog('draft')}
          onPublish={() => void saveBlog('published')}
        />
      </div>
    </div>
  )
}
