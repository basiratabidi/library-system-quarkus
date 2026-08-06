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
      </div>
      {auth ? (
        <div className="nav-user">
          <div className="nav-user-info">
            <span className="nav-user-name">{auth.username}</span>
            <span className="nav-user-role">{auth.role}</span>
          </div>
          <div className="nav-user-avatar">{auth.username.slice(0, 2).toUpperCase()}</div>
          <button className="nav-logout" onClick={logout}>Log Out</button>
        </div>
      ) : null}
    </nav>
  )
}