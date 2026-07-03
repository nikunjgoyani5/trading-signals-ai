import { useMemo, useState } from 'react'
import { Check, Copy, RefreshCw, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { normalizeGeneratedHtml, copyTextToClipboard } from '../../utils/blogContent'

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
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  const hasContent = Boolean(content.trim())
  const controlsDisabled = isLoading || !hasContent || isSaving

  const renderedHtml = useMemo(() => normalizeGeneratedHtml(content), [content])

  const handleCopy = async () => {
    if (controlsDisabled || !renderedHtml) return

    const copied = await copyTextToClipboard(renderedHtml)
    setCopyState(copied ? 'copied' : 'failed')
    window.setTimeout(() => setCopyState('idle'), 2000)
  }

  return (
    <div className="blog-preview-panel flex h-[min(70dvh,calc(100dvh-14rem))] min-h-[480px] max-h-[calc(100dvh-14rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-tsai-card/40 backdrop-blur-sm">
      <div className="min-h-0 flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <Sparkles className="mb-5 h-12 w-12 animate-pulse text-tsai-accent-cyan" strokeWidth={1.75} />
            <h3 className="text-lg font-semibold text-tsai-text">Generating your blog…</h3>
            <p className="mt-2 max-w-sm text-sm text-tsai-muted">
              This usually takes a few seconds. You can regenerate or edit after it finishes.
            </p>
          </div>
        ) : hasContent ? (
          <div className="blog-preview-scroll h-full overflow-y-auto overscroll-contain">
            <article className="p-6">
              <div
                className="generated-blog-content text-tsai-text leading-relaxed [&_a]:text-tsai-accent-cyan [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-tsai-accent-cyan/30 [&_blockquote]:pl-4 [&_h1]:mb-4 [&_h1]:mt-1 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:my-4 [&_img]:w-full [&_img]:rounded-2xl [&_img]:border [&_img]:border-white/10 [&_li]:mb-2 [&_ol]:my-4 [&_ol]:ml-6 [&_p]:my-4 [&_strong]:text-white [&_ul]:my-4 [&_ul]:ml-6"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </article>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <Sparkles className="mb-5 h-12 w-12 text-tsai-accent-cyan/80" strokeWidth={1.75} />
            <h3 className="text-lg font-semibold text-tsai-text">Preview will appear here</h3>
            <p className="mt-2 max-w-sm text-sm text-tsai-muted">
              Enter a topic in the prompt box and click Generate blog.
            </p>
          </div>
        )}
      </div>

      {hasContent && (
        <div className="flex shrink-0 flex-col gap-3 border-t border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className={`flex items-center gap-4 ${controlsDisabled ? 'opacity-50' : ''}`}>
            {showCopy && (
              <button
                type="button"
                onClick={() => void handleCopy()}
                disabled={controlsDisabled}
                className={cn(
                  'rounded-lg border p-2 transition disabled:cursor-not-allowed',
                  copyState === 'copied'
                    ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-400'
                    : copyState === 'failed'
                      ? 'border-red-400/30 bg-red-500/10 text-red-300'
                      : 'border-white/10 text-tsai-muted hover:border-white/20 hover:text-tsai-text',
                )}
                aria-label={copyState === 'copied' ? 'Copied' : 'Copy HTML'}
                title={copyState === 'copied' ? 'Copied' : 'Copy HTML'}
              >
                {copyState === 'copied' ? (
                  <Check className="h-5 w-5" strokeWidth={2} />
                ) : (
                  <Copy className="h-5 w-5" strokeWidth={2} />
                )}
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
            {copyState === 'copied' && (
              <span className="text-xs font-medium text-emerald-400">Copied</span>
            )}
            {copyState === 'failed' && (
              <span className="text-xs font-medium text-red-300">Copy failed</span>
            )}
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
