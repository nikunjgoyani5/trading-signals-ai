import { useRef } from 'react'
import { ImageIcon, RefreshCw, Upload } from 'lucide-react'

type BlogCoverImageSelectorProps = {
  coverImage: string
  onImageChange: (url: string) => void
  onImageGenerate: () => void
  isGeneratingImage: boolean
  disabled?: boolean
  regenCount: number
  maxRegen: number
}

export default function BlogCoverImageSelector({
  coverImage,
  onImageChange,
  onImageGenerate,
  isGeneratingImage,
  disabled = false,
  regenCount,
  maxRegen,
}: BlogCoverImageSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      onImageChange(reader.result as string)
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const busy = isGeneratingImage || disabled

  return (
    <div className="rounded-2xl border border-white/10 bg-tsai-card/40 p-5 backdrop-blur-sm">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="mb-4 flex items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-tsai-text">
          <ImageIcon className="h-4 w-4 text-tsai-accent-cyan" strokeWidth={2.25} />
          Cover image
        </h4>
        <span className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-1 text-[11px] text-tsai-subtle">
          AI tries: {regenCount}/{maxRegen}
        </span>
      </div>

      <div className="group relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-tsai-accent-cyan/30">
        {coverImage ? (
          <>
            <img src={coverImage} alt="Cover preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={busy}
                className="rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-md transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                title="Upload new image"
              >
                <Upload className="h-5 w-5 text-white" strokeWidth={2.25} />
              </button>
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05]">
              <ImageIcon className="h-6 w-6 text-tsai-subtle" strokeWidth={2} />
            </div>
            <p className="text-sm text-tsai-muted">No cover image yet</p>
            <p className="mt-1 text-xs text-tsai-subtle">Upload or generate with AI</p>
          </div>
        )}

        {isGeneratingImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-tsai-surface/85 p-4 text-center backdrop-blur-sm">
            <RefreshCw className="mb-3 h-8 w-8 animate-spin text-tsai-accent-cyan" strokeWidth={2.25} />
            <p className="text-sm text-tsai-text">Generating cover image…</p>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={busy}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-tsai-text transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload className="h-4 w-4 text-tsai-subtle" strokeWidth={2.25} />
          Upload
        </button>
        <button
          type="button"
          onClick={onImageGenerate}
          disabled={busy || regenCount >= maxRegen}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-tsai-accent-cyan/25 bg-tsai-accent-cyan/10 px-4 py-2.5 text-sm font-semibold text-tsai-accent-cyan transition hover:bg-tsai-accent-cyan/15 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RefreshCw
            className={`h-4 w-4 ${isGeneratingImage ? 'animate-spin' : ''}`}
            strokeWidth={2.25}
          />
          {regenCount > 0 ? 'Regenerate AI' : 'Generate AI'}
        </button>
      </div>
    </div>
  )
}
