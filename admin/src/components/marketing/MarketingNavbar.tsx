import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const SITE_URL = 'https://www.tradingsignals.ai'

const navLinks = [
  { label: 'Features', href: `${SITE_URL}/#features` },
  { label: 'Strategies', href: `${SITE_URL}/#strategies` },
  { label: 'Testimonials', href: `${SITE_URL}/#testimonials` },
  { label: 'FAQ', href: `${SITE_URL}/#faq` },
  { label: 'Blog', href: `${SITE_URL}/blog` },
]

const authButtonClass =
  'group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 py-2 text-sm font-medium text-white sm:px-5'

export default function MarketingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const { isAuthenticated, isLoading } = useAuth()
  const isLoginPage = pathname === '/'
  const showLogin = !isAuthenticated && !isLoading && !isLoginPage

  return (
    <nav className="fixed top-0 left-0 z-50 isolate w-full border-b border-white/8 bg-[#010b24]/75 backdrop-blur-xl transition-all duration-500">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center" aria-label="Trading Signals AI home">
          <img
            src="/logofi.svg"
            alt="Trading Signals AI"
            width={173}
            height={40}
            className="h-8 w-auto sm:h-9"
            decoding="async"
          />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white/90 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {showLogin ? (
            <NavLink to="/" className={authButtonClass}>
              <span className="absolute inset-0 rounded-full bg-linear-to-r from-tsai-accent to-tsai-accent-cyan opacity-90 transition group-hover:opacity-100" />
              <span className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(18,215,245,0.45)]" />
              <span className="relative z-10">Login</span>
            </NavLink>
          ) : null}

          {isAuthenticated ? (
            <NavLink to="/admin" className={authButtonClass}>
              <span className="absolute inset-0 rounded-full bg-linear-to-r from-tsai-accent to-tsai-accent-cyan opacity-90 transition group-hover:opacity-100" />
              <span className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(18,215,245,0.45)]" />
              <span className="relative z-10">Dashboard</span>
            </NavLink>
          ) : null}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/8 bg-[#010b24]/95 px-4 py-4 lg:hidden">
          <ul className="space-y-1">
            {navLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#c7ccd2] transition hover:bg-white/5 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            {showLogin ? (
              <li>
                <NavLink
                  to="/"
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-tsai-accent-cyan transition hover:bg-white/5"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </NavLink>
              </li>
            ) : null}
            {isAuthenticated ? (
              <li>
                <NavLink
                  to="/admin"
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-tsai-accent-cyan transition hover:bg-white/5"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </NavLink>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </nav>
  )
}
