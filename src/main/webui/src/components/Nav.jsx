import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { getAuth, logout } from '../api'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const auth = getAuth()

  const tabs = [
    { to: '/welcome', label: 'Welcome' },
    ...(auth?.role === 'ADMIN' ? [{ to: '/home', label: 'Front Desk' }] : []),
    { to: '/books', label: 'Books' },
    ...(auth?.role === 'ADMIN' ? [{ to: '/members', label: 'Members' }] : []),
    ...(auth?.role === 'ADMIN' ? [{ to: '/lending', label: 'Lending' }] : []),
    ...(!auth ? [{ to: '/login', label: 'Log In' }, { to: '/signup', label: 'Sign Up' }] : []),
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
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            {tab.label}
          </NavLink>
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