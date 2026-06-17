import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell, { authButtonClass, authInputClass, authLinkClass } from '../components/auth/AuthShell'
import { useAuth } from '../hooks/useAuth'
import { getApiErrorMessage } from '../utils/apiError'
import {
  clearRememberedCredentials,
  getRememberedCredentials,
  setRememberedCredentials,
} from '../lib/authStorage'

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    void (async () => {
      const { email: rememberedEmail, password: rememberedPassword } =
        await getRememberedCredentials()

      if (rememberedEmail) {
        setEmail(rememberedEmail)
        setRememberMe(true)
      }

      if (rememberedPassword) {
        setPassword(rememberedPassword)
        setRememberMe(true)
      }
    })()
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Email and password are required')
      return
    }

    setIsSubmitting(true)

    try {
      await login(email.trim(), password, rememberMe)

      if (rememberMe) {
        await setRememberedCredentials(email.trim(), password)
      } else {
        clearRememberedCredentials()
      }

      navigate('/admin')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Sign in failed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to your admin account">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-tsai-muted">Email</label>
          <input
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={authInputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-tsai-muted">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={authInputClass}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-tsai-muted">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="accent-tsai-accent"
            />
            Remember Me
          </label>

          <Link to="/forgot-password" className={authLinkClass}>
            Forgot Password?
          </Link>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={isSubmitting} className={authButtonClass}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </AuthShell>
  )
}
