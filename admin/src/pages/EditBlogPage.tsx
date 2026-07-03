import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BlogCoverImageSelector from '../components/blogs/BlogCoverImageSelector'
import BlogCreatePreviewPanel from '../components/blogs/BlogCreatePreviewPanel'
import {
  useGenerateCoverImageMutation,
  useGetBlogQuery,
  useUpdateBlogMutation,
} from '../redux/api/blogsApi'
import { getApiErrorMessage } from '../utils/apiError'
import { extractTitleFromHtml, prepareBlogHtmlForSave, buildCoverImageTopic } from '../utils/blogContent'
import { MAX_BLOG_AI_COVER_GENERATIONS } from '../constants/blogCoverGeneration'

const MAX_IMAGE_REGEN = MAX_BLOG_AI_COVER_GENERATIONS

export default function EditBlogPage() {
  const { blogId = '' } = useParams<{ blogId: string }>()
  const navigate = useNavigate()

  const { data: blog, isLoading, isError, error: loadError } = useGetBlogQuery(blogId, {
    skip: !blogId,
  })

  const [updateBlog, { isLoading: isSaving }] = useUpdateBlogMutation()
  const [generateImage, { isLoading: isGeneratingImage }] = useGenerateCoverImageMutation()

  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [regenCount, setRegenCount] = useState(0)
  const [maxRegen, setMaxRegen] = useState(MAX_IMAGE_REGEN)
  const [actionError, setActionError] = useState<string | null>(null)
  const [hydratedId, setHydratedId] = useState<string | null>(null)

  useEffect(() => {
    if (!blog || hydratedId === blog.id) return
    setHydratedId(blog.id)
    setContent(blog.content)
    setCoverImage(blog.coverImage || '')
    setRegenCount(blog.aiCoverGenerationCount)
  }, [blog, hydratedId])

  const handleImageGenerate = async () => {
    if (!blog) return
    const imagePrompt = buildCoverImageTopic({
      title: blog.title,
      content,
    })
    if (!imagePrompt) {
      setActionError('Add blog content with a title before generating a cover image.')
      return
    }
    if (isGeneratingImage || regenCount >= MAX_IMAGE_REGEN) return

    setActionError(null)
    try {
      const result = await generateImage({ prompt: imagePrompt, blogId: blog.id }).unwrap()
      setCoverImage(result.url)
      if (result.aiCoverGenerationCount !== undefined) {
        setRegenCount(result.aiCoverGenerationCount)
      } else {
        setRegenCount((count) => count + 1)
      }
      if (result.maxAiCoverGenerations !== undefined) {
        setMaxRegen(result.maxAiCoverGenerations)
      }
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to generate cover image.')
      setActionError(message)
      if (message.toLowerCase().includes('limit reached')) {
        setRegenCount(maxRegen)
      }
    }
  }

  const handleSave = async () => {
    if (!blog) return
    const html = prepareBlogHtmlForSave(content)
    if (!html) return

    setActionError(null)
    try {
      await updateBlog({
        id: blog.id,
        title: extractTitleFromHtml(html, blog.title),
        content: html,
        coverImage: coverImage || undefined,
      }).unwrap()
      navigate('/admin/blogs', { replace: true })
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Failed to save blog.'))
    }
  }

  if (isLoading && !blog) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-sm text-tsai-muted">
        Loading blog…
      </div>
    )
  }

  if (isError || !blog) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <p className="text-sm text-red-300">{getApiErrorMessage(loadError, 'Blog not found.')}</p>
        <Link to="/admin/blogs" className="text-sm font-medium text-tsai-accent-cyan hover:underline">
          ← Back to all blogs
        </Link>
      </div>
    )
  }

  if (blog.status === 'archived') {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <p className="text-sm text-tsai-muted">Archived blogs cannot be edited.</p>
        <Link to="/admin/blogs" className="text-sm font-medium text-tsai-accent-cyan hover:underline">
          ← Back to all blogs
        </Link>
      </div>
    )
  }

  return (
    <div className="blog-edit-layout mx-auto flex max-w-7xl flex-col gap-6">
      <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-tsai-accent-cyan">
            Edit
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-tsai-text sm:text-3xl">{blog.title}</h1>
          <p className="mt-2 text-sm text-tsai-muted">/{blog.slug}</p>
        </div>
        <Link
          to="/admin/blogs"
          className="text-sm font-medium text-tsai-accent-cyan hover:underline"
        >
          ← Back to all blogs
        </Link>
      </div>

      {actionError && (
        <div className="shrink-0 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {actionError}
        </div>
      )}

      <div className="blog-edit-grid grid min-h-0 flex-1 gap-6 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:items-stretch">
        <div className="space-y-5 xl:sticky xl:top-6 xl:max-h-full xl:overflow-y-auto xl:overscroll-contain blog-preview-scroll">
          <BlogCoverImageSelector
            coverImage={coverImage}
            onImageChange={setCoverImage}
            onImageGenerate={() => void handleImageGenerate()}
            isGeneratingImage={isGeneratingImage}
            disabled={isSaving}
            regenCount={regenCount}
            maxRegen={maxRegen}
          />
          <div className="rounded-2xl border border-white/10 bg-tsai-card/40 p-5">
            <label
              htmlFor="blog-content-html"
              className="mb-2 block text-xs font-medium uppercase tracking-wider text-tsai-subtle"
            >
              HTML content
            </label>
            <textarea
              id="blog-content-html"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={12}
              className="min-h-[240px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-xs text-tsai-text focus:border-tsai-accent-cyan/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col">
          <BlogCreatePreviewPanel
          content={content}
          isLoading={false}
          isSaving={isSaving}
          onRegenerate={() => undefined}
          onSaveDraft={() => void handleSave()}
          onPublish={() => void handleSave()}
          saveDraftLabel="Save changes"
          showPublish={false}
          showRegenerate={false}
        />
        </div>
      </div>
    </div>
  )
}
