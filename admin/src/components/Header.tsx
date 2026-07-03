import { Menu, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/dashboard': 'Dashboard',
  '/admin/blogs': 'All Blogs',
  '/admin/enquiries': 'Enquiries',
  '/admin/blogs/create': 'Generate Blog',
  '/admin/users': 'Users',
  '/admin/settings': 'Settings',
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

type HeaderProps = {
  mobileNavOpen: boolean
  onMenuToggle: () => void
}

export default function Header({ mobileNavOpen, onMenuToggle }: HeaderProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const pageTitle = pageTitles[pathname] ?? 'Admin'

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'AD'

  return (
    <header className="relative z-30 flex h-[4.25rem] shrink-0 items-center justify-between gap-3 border-b border-white/8 bg-tsai-surface/60 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-tsai-text transition hover:border-tsai-accent-cyan/30 hover:bg-white/5 lg:hidden"
          aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileNavOpen}
          aria-controls="admin-mobile-nav"
          onClick={onMenuToggle}
        >
          {mobileNavOpen ? (
            <X className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={2} />
          )}
        </button>
        <div className="min-w-0">
          <p className="truncate text-xs text-tsai-subtle">{getGreeting()}</p>
          <h1 className="truncate text-base font-semibold tracking-tight text-tsai-text sm:text-lg">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {user ? (
          <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1.5 pr-4 pl-1.5 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-tsai-accent to-tsai-accent-cyan text-xs font-bold text-white">
              {initials}
            </span>
            <div className="text-left">
              <p className="text-sm font-medium leading-none text-tsai-text">{user.name}</p>
              <p className="mt-0.5 max-w-[140px] truncate text-[11px] text-tsai-subtle">{user.email}</p>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleLogout}
          className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-tsai-muted transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-200 sm:px-4"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
