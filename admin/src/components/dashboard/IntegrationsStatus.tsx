import type { DashboardAnalytics } from '../../types/dashboard'

type IntegrationsStatusProps = {
  integrations: DashboardAnalytics['integrations']
}

const items = [
  { key: 'dbConnected', label: 'MongoDB', description: 'Blog & user data' },
  { key: 'cloudinaryConfigured', label: 'Cloudinary', description: 'Cover image storage' },
  { key: 'openAiConfigured', label: 'OpenAI', description: 'AI blog & image generation' },
  { key: 'brevoConfigured', label: 'Brevo Email', description: 'Password reset emails' },
] as const

export default function IntegrationsStatus({ integrations }: IntegrationsStatusProps) {
  const activeCount = items.filter((item) => integrations[item.key]).length

  return (
    <div className="rounded-2xl border border-white/10 bg-[#00000033] p-4 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-tsai-text">Integrations</h3>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
            activeCount === items.length
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
          }`}
        >
          {activeCount}/{items.length}
        </span>
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-2">
        {items.map((item) => {
          const active = integrations[item.key]

          return (
            <li
              key={item.key}
              className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-medium text-tsai-text">{item.label}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-white/5 text-tsai-subtle'
                  }`}
                >
                  {active ? 'On' : 'Off'}
                </span>
              </div>
              <p className="mt-0.5 truncate text-[10px] text-tsai-subtle">{item.description}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
