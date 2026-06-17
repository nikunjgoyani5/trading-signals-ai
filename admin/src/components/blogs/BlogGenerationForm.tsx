import { Sparkles } from 'lucide-react'

const EXAMPLE_PROMPTS = [
  'Top 5 Wyckoff Trading Strategies for 2026',
  'How Institutional Traders Use Volume Analysis',
  'Understanding Market Structure Using PTA Indicators',
]

export type BlogGenerationFormProps = {
  prompt: string
  onPromptChange: (value: string) => void
  isGenerating: boolean
  onGenerate: () => void
}

export default function BlogGenerationForm({
  prompt,
  onPromptChange,
  isGenerating,
  onGenerate,
}: BlogGenerationFormProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-tsai-card/40 p-5 backdrop-blur-sm">
        <label
          htmlFor="blog-prompt"
          className="mb-2 block text-xs font-medium uppercase tracking-wider text-tsai-subtle"
        >
          Blog topic / prompt
        </label>
        <textarea
          id="blog-prompt"
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          rows={5}
          placeholder="Describe the blog you want to generate..."
          className="min-h-[140px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-tsai-text placeholder:text-tsai-subtle/70 focus:border-tsai-accent-cyan/40 focus:outline-none"
        />
        <button
          type="button"
          disabled={!prompt.trim() || isGenerating}
          onClick={onGenerate}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-tsai-accent to-tsai-accent-cyan py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(18,61,255,0.25)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" strokeWidth={2.25} />
          {isGenerating ? 'Generating…' : 'Generate blog'}
        </button>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-tsai-subtle">
          Example prompts
        </p>
        <ul className="space-y-2">
          {EXAMPLE_PROMPTS.map((example) => (
            <li key={example}>
              <button
                type="button"
                onClick={() => onPromptChange(example)}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-tsai-muted transition hover:bg-white/[0.04] hover:text-tsai-text"
              >
                {example}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
