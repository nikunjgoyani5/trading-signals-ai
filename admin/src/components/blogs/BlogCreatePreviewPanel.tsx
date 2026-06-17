import { useMemo, useState } from 'react'
import { Copy, RefreshCw, Sparkles } from 'lucide-react'
import { normalizeGeneratedHtml } from '../../utils/blogContent'

type BlogCreatePreviewPanelProps = {
  content: string
  isLoading: boolean
  isSaving: boolean
  onRegenerate: () => void
  onSaveDraft: () => void
  onPublish: () => void
  saveDraftLabel?: string
  publishLabel?: string
  showPublish?: boolean
  showRegenerate?: boolean
  showCopy?: boolean
}

export default function BlogCreatePreviewPanel({
  content,
  isLoading,
  isSaving,
  onRegenerate,
  onSaveDraft,
  onPublish,
  saveDraftLabel = 'Save as draft',
  publishLabel = 'Publish',
  showPublish = true,
  showRegenerate = true,
  showCopy = true,
}: BlogCreatePreviewPanelProps) {
  const [copied, setCopied] = useState(false)

  const hasContent = Boolean(content.trim())
  const controlsDisabled = isLoading || !hasContent || isSaving

  const renderedHtml = useMemo(() => normalizeGeneratedHtml(content), [content])

  const handleCopy = async () => {
    if (controlsDisabled || !renderedHtml) return

    try {
      await navigator.clipboard.writeText(renderedHtml)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-tsai-card/40 backdrop-blur-sm lg:min-h-[calc(100vh-12rem)]">
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="flex h-full min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <Sparkles className="mb-5 h-12 w-12 animate-pulse text-tsai-accent-cyan" strokeWidth={1.75} />
            <h3 className="text-lg font-semibold text-tsai-text">Generating your blog…</h3>
            <p className="mt-2 max-w-sm text-sm text-tsai-muted">
              This usually takes a few seconds. You can regenerate or edit after it finishes.
            </p>
          </div>
        ) : hasContent ? (
          <div className="blog-preview-scroll h-full overflow-y-auto">
            <article className="p-6">
              <div
                className="generated-blog-content text-tsai-text leading-relaxed [&_a]:text-tsai-accent-cyan [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-tsai-accent-cyan/30 [&_blockquote]:pl-4 [&_h1]:mb-4 [&_h1]:mt-1 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:my-4 [&_img]:w-full [&_img]:rounded-2xl [&_img]:border [&_img]:border-white/10 [&_li]:mb-2 [&_ol]:my-4 [&_ol]:ml-6 [&_p]:my-4 [&_strong]:text-white [&_ul]:my-4 [&_ul]:ml-6"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </article>
          </div>
        ) : (
          <div className="flex h-full min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <Sparkles className="mb-5 h-12 w-12 text-tsai-accent-cyan/80" strokeWidth={1.75} />
            <h3 className="text-lg font-semibold text-tsai-text">Preview will appear here</h3>
            <p className="mt-2 max-w-sm text-sm text-tsai-muted">
              Enter a topic in the prompt box and click Generate blog.
            </p>
          </div>
        )}
      </div>

      {hasContent && (
        <div className="flex flex-col gap-3 border-t border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className={`flex items-center gap-4 ${controlsDisabled ? 'opacity-50' : ''}`}>
            {showCopy && (
              <button
                type="button"
                onClick={() => void handleCopy()}
                disabled={controlsDisabled}
                className="rounded-lg border border-white/10 p-2 text-tsai-muted transition hover:border-white/20 hover:text-tsai-text disabled:cursor-not-allowed"
                aria-label="Copy HTML"
                title="Copy HTML"
              >
                <Copy className="h-5 w-5" strokeWidth={2} />
              </button>
            )}
            {showRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                disabled={controlsDisabled}
                className="rounded-lg border border-white/10 p-2 text-tsai-muted transition hover:border-white/20 hover:text-tsai-text disabled:cursor-not-allowed"
                aria-label="Regenerate"
                title="Regenerate"
              >
                <RefreshCw className="h-5 w-5" strokeWidth={2} />
              </button>
            )}
            {copied && <span className="text-xs text-tsai-subtle">Copied</span>}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={controlsDisabled}
              className="rounded-xl border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-tsai-text transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Saving…' : saveDraftLabel}
            </button>
            {showPublish && (
              <button
                type="button"
                onClick={onPublish}
                disabled={controlsDisabled}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-tsai-surface transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? 'Publishing…' : publishLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
