import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthShell, { authButtonClass, authInputClass, authLinkClass } from '../components/auth/AuthShell'
import { getApiErrorMessage } from '../utils/apiError'
import { useResetPasswordMutation } from '../redux/api/authApi'
import { validatePassword } from '../validation/auth'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [resetPassword, { isLoading: isSubmitting }] = useResetPasswordMutation()
  const [searchParams] = useSearchParams()
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams])

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const passwordCheck = validatePassword(password)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!token) {
      setError('Reset link is invalid or expired. Request a new one.')
      return
    }

    if (!passwordCheck.valid) {
      setError('Password does not meet requirements')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      await resetPassword({ token, password }).unwrap()
      setIsSuccess(true)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to reset password'))
    }
  }

  if (!token) {
    return (
      <AuthShell
        title="Invalid Reset Link"
        subtitle="This password reset link is missing or expired."
        footer={
          <p className="mt-6 text-center text-sm text-tsai-muted">
            <Link to="/forgot-password" className={authLinkClass}>
              Request a new link
            </Link>
            {' · '}
            <Link to="/" className={authLinkClass}>
              Sign In
            </Link>
          </p>
        }
      >
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Open the reset link from your email, or request a new one from the forgot password page.
        </div>
      </AuthShell>
    )
  }

  if (isSuccess) {
    return (
      <AuthShell
        title="Password Updated"
        subtitle="Your password has been reset. You can sign in with your new password."
        footer={
          <p className="mt-6 text-center text-sm text-tsai-muted">
            <Link to="/" className={authLinkClass}>
              Go to Sign In
            </Link>
          </p>
        }
      >
        <button type="button" className={authButtonClass} onClick={() => navigate('/')}>
          Continue to Sign In
        </button>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Choose a strong new password for your admin account."
      footer={
        <p className="mt-6 text-center text-sm text-tsai-muted">
          <Link to="/" className={authLinkClass}>
            Back to Sign In
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-tsai-muted">
            New Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter new password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={authInputClass}
          />
          {password ? (
            <ul className="mt-2 space-y-1 text-xs text-tsai-subtle">
              {['At least 8 characters', 'One uppercase letter', 'One lowercase letter', 'One number'].map(
                (rule) => {
                  const met =
                    (rule.startsWith('At least') && password.length >= 8) ||
                    (rule.includes('uppercase') && /[A-Z]/.test(password)) ||
                    (rule.includes('lowercase') && /[a-z]/.test(password)) ||
                    (rule.includes('number') && /[0-9]/.test(password))

                  return (
                    <li key={rule} className={met ? 'text-emerald-400' : ''}>
                      {met ? '✓' : '○'} {rule}
                    </li>
                  )
                },
              )}
            </ul>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-tsai-muted"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={authInputClass}
          />
        </div>

        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={isSubmitting} className={authButtonClass}>
          {isSubmitting ? 'Updating...' : 'Reset Password'}
        </button>
      </form>
    </AuthShell>
  )
}
