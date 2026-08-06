import { useState } from 'react'
import { getAuth, logout } from '../api'

export default function Nav({ route }) {
  const [open, setOpen] = useState(false)
  const auth = getAuth()

  const tabs = [
    { href: '#/welcome', label: 'Welcome' },
    ...(auth?.role === 'ADMIN' ? [{ href: '#/home', label: 'Front Desk' }] : []),
    { href: '#/books', label: 'Books' },
    ...(auth?.role === 'ADMIN' ? [{ href: '#/members', label: 'Members' }] : []),
    ...(auth?.role === 'ADMIN' ? [{ href: '#/lending', label: 'Lending' }] : []),
    ...(!auth ? [{ href: '#/login', label: 'Log In' }, { href: '#/signup', label: 'Sign Up' }] : []),
  ]

  return (
    <nav className="site-nav">
      <button
        className="nav-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        ☰
      </button>
      <div className={`nav-links ${open ? 'nav-links-open' : ''}`}>
        {tabs.map((tab) => (
          <a
            key={tab.href}
            href={tab.href}
            className={`nav-item ${route === tab.href.replace('#/', '') ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            {tab.label}
          </a>
        ))}
        {auth ? (
          <button className="nav-item" onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            Log Out ({auth.username})
          </button>
        ) : null}
      </div>
    </nav>
  )
}