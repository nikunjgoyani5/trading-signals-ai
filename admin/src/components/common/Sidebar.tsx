import { useEffect } from 'react'
import {
  LayoutDashboard,
  FileText,
  WandSparkles,
  X,
  type LucideIcon,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const SITE_URL = 'https://www.tradingsignals.ai'

type SidebarItemProps = {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  onNavigate?: () => void
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? 'border border-tsai-accent-cyan/25 bg-linear-to-r from-tsai-accent/25 to-tsai-accent-cyan/10 text-tsai-text shadow-[0_0_24px_rgba(18,215,245,0.08)]'
      : 'border border-transparent text-tsai-muted hover:border-white/8 hover:bg-white/5 hover:text-tsai-text'
  }`

function NavIcon({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition ${
        active
          ? 'border-tsai-accent-cyan/35 bg-tsai-accent-cyan/15 text-white shadow-[0_0_18px_rgba(18,215,245,0.16)]'
          : 'border-white/8 bg-white/5 text-tsai-accent-cyan group-hover:border-tsai-accent-cyan/30 group-hover:bg-white/10'
      }`}
    >
      {children}
    </span>
  )
}

function SidebarItem({ to, label, icon: Icon, end = false, onNavigate }: SidebarItemProps) {
  return (
    <NavLink to={to} end={end} className={linkClass} onClick={onNavigate}>
      {({ isActive }) => (
        <>
          <NavIcon active={isActive}>
            <Icon className="h-4 w-4" strokeWidth={2.25} />
          </NavIcon>
          {label}
        </>
      )}
    </NavLink>
  )
}

type SidebarContentProps = {
  onNavigate?: () => void
  showClose?: boolean
  onClose?: () => void
}

function SidebarContent({ onNavigate, showClose, onClose }: SidebarContentProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-3 border-b border-white/8 px-5 py-6">
        <div className="min-w-0">
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
            onClick={onNavigate}
          >
            <img
              src="/logofi.svg"
              alt="Trading Signals AI"
              width={140}
              height={32}
              className="h-8 w-auto"
            />
          </a>
          <p className="mt-3 text-[10px] font-medium tracking-[0.18em] text-tsai-accent-cyan uppercase">
            Admin Panel
          </p>
        </div>
        {showClose && onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-tsai-muted transition hover:border-white/20 hover:bg-white/5 hover:text-tsai-text"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <SidebarItem to="/admin/dashboard" label="Dashboard" icon={LayoutDashboard} onNavigate={onNavigate} />
        <SidebarItem to="/admin/blogs" label="All Blogs" icon={FileText} end onNavigate={onNavigate} />
        <SidebarItem
          to="/admin/blogs/create"
          label="Generate Blog"
          icon={WandSparkles}
          onNavigate={onNavigate}
        />
      </nav>

      <div className="border-t border-white/8 p-4">
        <div className="rounded-xl border border-white/8 bg-linear-to-br from-tsai-card/50 to-transparent p-4">
          <p className="text-xs font-medium text-tsai-text">Need help?</p>
          <p className="mt-1 text-[11px] leading-relaxed text-tsai-subtle">
            Visit the main platform for docs and support.
          </p>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block cursor-pointer text-xs font-medium text-tsai-accent-cyan hover:underline"
            onClick={onNavigate}
          >
            tradingsignals.ai →
          </a>
        </div>
      </div>
    </>
  )
}

const sidebarPanelClass =
  'relative z-50 flex w-[min(16rem,85vw)] max-w-64 shrink-0 flex-col border-r border-white/8 bg-tsai-surface/95 backdrop-blur-xl'

type SidebarProps = {
  mobileOpen: boolean
  onMobileClose: () => void
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onMobileClose()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen, onMobileClose])

  return (
    <>
      {/* Desktop */}
      <aside className={cn(sidebarPanelClass, 'hidden lg:flex')}>
        <SidebarContent />
      </aside>

      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        className={cn(
          'fixed inset-0 z-40 cursor-pointer bg-[#010B24]/75 backdrop-blur-sm transition-opacity lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onMobileClose}
        tabIndex={mobileOpen ? 0 : -1}
      />

      {/* Mobile drawer */}
      <aside
        id="admin-mobile-nav"
        aria-hidden={!mobileOpen}
        className={cn(
          sidebarPanelClass,
          'fixed inset-y-0 left-0 transition-transform duration-300 ease-out lg:hidden',
          mobileOpen ? 'translate-x-0' : 'pointer-events-none -translate-x-full',
        )}
      >
        <SidebarContent showClose onClose={onMobileClose} onNavigate={onMobileClose} />
      </aside>
    </>
  )
}
