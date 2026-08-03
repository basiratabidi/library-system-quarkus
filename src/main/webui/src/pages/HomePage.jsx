import { useEffect, useState } from 'react'
import { booksApi, membersApi } from '../api'
import { CountUp } from '../components/ui'
import { Reveal } from '../components/ui'
import PageBanner from '../components/PageBanner'

export default function HomePage() {
  const [stats, setStats] = useState({ books: 0, available: 0, members: 0 })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([booksApi.getAll(), membersApi.getAll()])
      .then(([books, members]) => {
        setStats({
          books: books.length,
          available: books.filter((b) => b.isAvailable).length,
          members: members.length,
        })
        setLoaded(true)
      })
      .catch(console.error)
  }, [])

  const cards = [
    { label: 'Books Catalogued', value: stats.books },
    { label: 'On the Shelf', value: stats.available },
    { label: 'Out on Loan', value: stats.books - stats.available },
    { label: 'Members Registered', value: stats.members },
  ]

  return (
    <div>
      <div className="hero">
        <p className="hero-eyebrow">Est. in code, kept by hand</p>
        <h2 className="hero-title">The desk is open.</h2>
        <p className="hero-sub">
          Every book, every member, every loan — tracked the way a good circulation desk always has: plainly, and in order.
        </p>
      </div>
      
      <Reveal>
          <div className="stat-row">
            {cards.map((c, i) => (
              <div key={c.label} className="stat-card" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="stat-number"><CountUp value={c.value} active={loaded} /></span>
                <span className="stat-label">{c.label}</span>
              </div>
            ))}
          </div>
      </Reveal>

      <Reveal>
        <div className="quick-links">
          <a href="#/books" className="quick-link">
            <span className="quick-link-label">Browse</span>
            <span className="quick-link-title">The Catalogue →</span>
          </a>
          <a href="#/members" className="quick-link">
            <span className="quick-link-label">Manage</span>
            <span className="quick-link-title">Members →</span>
          </a>
          <a href="#/lending" className="quick-link">
            <span className="quick-link-label">Track</span>
            <span className="quick-link-title">What's On Loan →</span>
          </a>
        </div>
      </Reveal>
    </div>
    
  )
}