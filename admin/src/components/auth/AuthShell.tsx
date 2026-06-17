import type { ReactNode } from 'react'

type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 pt-24 pb-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#00000033] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_80px_rgba(0,18,184,0.15)] backdrop-blur-md">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium tracking-wide text-tsai-subtle uppercase">
            Trading Signals AI
          </p>
          <h1 className="mt-2 text-3xl font-bold text-tsai-text">{title}</h1>
          <p className="mt-2 text-sm text-tsai-muted">{subtitle}</p>
        </div>

        {children}

        {footer ?? (
          <p className="mt-6 text-center text-xs text-tsai-subtle">
            <a
              href="https://www.tradingsignals.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tsai-accent-cyan hover:underline"
            >
              Back to tradingsignals.ai
            </a>
          </p>
        )}
      </div>
    </div>
  )
}

export const authInputClass =
  'w-full rounded-lg border border-tsai-border bg-tsai-surface/80 px-4 py-3 text-tsai-text outline-none transition placeholder:text-tsai-subtle focus:border-tsai-accent-cyan/60'

export const authButtonClass =
  'w-full cursor-pointer rounded-lg bg-linear-to-r from-tsai-accent to-tsai-accent-cyan py-3 font-medium text-white shadow-[0_8px_32px_rgba(18,61,255,0.35)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'

export const authLinkClass =
  'cursor-pointer text-sm font-medium text-tsai-accent-cyan hover:underline'
