const tabs = [
  { href: '#/welcome', label: 'Welcome' },
  { href: '#/home', label: 'Front Desk' },
  { href: '#/books', label: 'Books' },
  { href: '#/members', label: 'Members' },
  { href: '#/lending', label: 'Lending' },
]

export default function Nav({ route }) {
  return (
    <nav className="site-nav">
      {tabs.map((tab) => (
        <a key={tab.href} href={tab.href} className={route === tab.href.replace('#/', '') ? 'active' : ''}>
          {tab.label}
        </a>
      ))}
    </nav>
  )
}