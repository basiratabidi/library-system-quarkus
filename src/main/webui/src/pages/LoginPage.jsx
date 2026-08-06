import { useState } from 'react'
import { authApi } from '../api'
import PageBanner from '../components/PageBanner'
import { Panel, Field, useFeedback, FeedbackBanner } from '../components/ui'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState({})
  const { feedback, notify, clear } = useFeedback()

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
        window.location.hash = auth.role === 'ADMIN' ? 'home' : 'books'
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
      <Panel className="mb-8">
        {feedback ? <FeedbackBanner feedback={feedback} onClose={clear} /> : null}
        <form onSubmit={handleSubmit} className="book-form">
          <Field label="Username" htmlFor="login-username" error={formError.username}>
            <input id="login-username" className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="jane.doe" />
          </Field>
          <Field label="Password" htmlFor="login-password" error={formError.password}>
            <input id="login-password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </Field>
          <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Logging in…' : 'Log In'}</button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          Don't have an account? <a href="#/signup">Sign up</a>
        </p>
      </Panel>
    </div>
  )
}