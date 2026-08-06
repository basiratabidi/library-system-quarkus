import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../api'
import PageBanner from '../components/PageBanner'
import { Panel, Field, useFeedback, FeedbackBanner } from '../components/ui'

export default function SignUpPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('USER')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState({})
  const { feedback, notify, clear } = useFeedback()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!username.trim()) errs.username = 'Username is required.'
    if (!password) errs.password = 'Password is required.'
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match.'
    setFormError(errs)
    if (Object.keys(errs).length) return

    setSubmitting(true)
    clear()
    try {
      const auth = await authApi.signup({ username: username.trim(), password, role })
      localStorage.setItem('auth', JSON.stringify(auth))
      notify('success', `Account created. Welcome, ${auth.username}.`)
      setTimeout(() => {
        navigate(auth.role === 'ADMIN' ? '/home' : '/books')
      }, 500)
    } catch (err) {
      notify('error', err.message || 'Could not create account.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageBanner crumb="Sign Up" title="Create an Account" />
      <Panel className="mb-8">
        {feedback ? <FeedbackBanner feedback={feedback} onClose={clear} /> : null}
        <form onSubmit={handleSubmit} className="book-form">
          <Field label="Username" htmlFor="signup-username" error={formError.username}>
            <input id="signup-username" className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="jane.doe" />
          </Field>
          <Field label="Password" htmlFor="signup-password" error={formError.password}>
            <input id="signup-password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </Field>
          <Field label="Confirm Password" htmlFor="signup-confirm" error={formError.confirmPassword}>
            <input id="signup-confirm" type="password" className="input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
          </Field>
          <Field label="Role">
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input type="radio" name="role" value="USER" checked={role === 'USER'} onChange={() => setRole('USER')} />
                User
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input type="radio" name="role" value="ADMIN" checked={role === 'ADMIN'} onChange={() => setRole('ADMIN')} />
                Admin
              </label>
            </div>
          </Field>
          <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating…' : 'Sign Up'}</button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </Panel>
    </div>
  )
}