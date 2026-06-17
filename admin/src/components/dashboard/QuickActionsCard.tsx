import { Link } from 'react-router-dom'

const actions = [
  { label: 'All blogs', to: '/admin/blogs', external: false },
  { label: 'Generate (AI)', to: '/admin/blogs/create', external: false },
  { label: 'Live site', href: 'https://www.tradingsignals.ai/', external: true },
] as const

export default function QuickActionsCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#00000033] p-4 backdrop-blur-md">
      <h3 className="text-sm font-semibold text-tsai-text">Quick Actions</h3>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {actions.map((action) =>
          action.external ? (
            <a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-tsai-muted transition hover:border-tsai-accent-cyan/30 hover:text-tsai-text"
            >
              {action.label}
            </a>
          ) : (
            <Link
              key={action.label}
              to={action.to}
              className="flex items-center justify-center rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-tsai-muted transition hover:border-tsai-accent-cyan/30 hover:text-tsai-text"
            >
              {action.label}
            </Link>
          ),
        )}
      </div>
    </div>
  )
}
