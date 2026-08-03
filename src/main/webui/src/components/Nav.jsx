import { useState } from 'react'

const tabs = [
  { href: '#/welcome', label: 'Welcome' },
  { href: '#/home', label: 'Front Desk' },
  { href: '#/books', label: 'Books' },
  { href: '#/members', label: 'Members' },
  { href: '#/lending', label: 'Lending' },
]

export default function Nav({ route }) {
  const [open, setOpen] = useState(false)

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
    </nav>
  )
}