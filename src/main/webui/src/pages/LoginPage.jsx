import { useState } from 'react'
import { authApi } from '../api'
import PageBanner from '../components/PageBanner'
import { useNavigate, Link } from 'react-router-dom'
import { Field, useFeedback, FeedbackBanner } from '../components/ui'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState({})
  const { feedback, notify, clear } = useFeedback()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!username.trim()) errs.username = 'Username is required.'
    if (!password) errs.password = 'Password is required.'
    setFormError(errs)
    if (Object.keys(errs).length) return

    setSubmitting(true)
    clear()
    try {
      const auth = await authApi.login({ username: username.trim(), password })
      localStorage.setItem('auth', JSON.stringify(auth))
      notify('success', `Welcome back, ${auth.username}.`)
      
      setTimeout(() => {
        navigate(auth.role === 'ADMIN' ? '/home' : '/books') 
      }, 500)
    } catch (err) {
      notify('error', err.message || 'Invalid username or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageBanner crumb="Log In" title="Welcome Back" />
      
      <div className="auth-split-container">
        <div className="auth-panel">
          {feedback ? <FeedbackBanner feedback={feedback} onClose={clear} /> : null}
          <h3 className="form-heading">Account Access</h3>
          <form onSubmit={handleSubmit}>
            <Field label="Username" htmlFor="login-username" error={formError.username}>
              <input id="login-username" className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="jane.doe" />
            </Field>
            <Field label="Password" htmlFor="login-password" error={formError.password}>
              <input id="login-password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </Field>
            <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
              {submitting ? 'Logging in…' : 'Log In'}
            </button>
          </form>
          <p className="auth-footer-text">
            Don't have an account? <Link to="/signup" className="auth-footer-link">Sign up</Link>
          </p>
        </div>

        <div className="auth-text-panel text-right">
          <span className="hero-eyebrow">Member Portal</span>
          <h2 className="auth-text-title">Your Next Great Read Awaits</h2>
          <p className="auth-text-desc">
            Log in to access your dashboard, review due dates, browse available titles, and manage active loans.
          </p>
        </div>
      </div>
    </div>
  )
}