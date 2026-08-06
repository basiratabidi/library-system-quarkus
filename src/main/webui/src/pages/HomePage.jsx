import { useEffect, useState } from 'react'
import { booksApi, membersApi } from '../api'
import { CountUp, Reveal } from '../components/ui'
import {getAuth} from '../api'
import { Link } from 'react-router'


export default function AdminHomePage() {
  const [stats, setStats] = useState({ books: 0, available: 0, members: 0 })
  const [onLoan, setOnLoan] = useState([])
  const [recentMembers, setRecentMembers] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
  if (getAuth()?.role !== 'ADMIN') return
  Promise.all([booksApi.getAll(), membersApi.getAll()])
    .then(([books, members]) => {
      setStats({
        books: books.length,
        available: books.filter((b) => b.isAvailable).length,
        members: members.length,
      })
      setOnLoan(books.filter((b) => !b.isAvailable).slice(0, 3))
      setRecentMembers(members.slice(-2))
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
        <p className="hero-eyebrow">Operations Console</p>
        <h2 className="hero-title">The desk is open.</h2>
        <p className="hero-sub">
          Overview of the day's circulation, member registrations, and catalog health — managed from a single station.
        </p>
      </div>

      <Reveal>
        <div className="stat-row">
          {cards.map((c) => (
            <div key={c.label} className="stat-card">
              <span className="stat-number"><CountUp value={c.value} active={loaded} /></span>
              <span className="stat-label">{c.label}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="quick-links mb-8">
          <Link to="/books" className="quick-link">
            <span className="quick-link-label">Browse & Edit</span>
            <span className="quick-link-title">The Catalog →</span>
          </Link>
          <Link to="/members" className="quick-link">
            <span className="quick-link-label">View Records</span>
            <span className="quick-link-title">Membership →</span>
          </Link>
          <Link to="/lending" className="quick-link">
            <span className="quick-link-label">Process Returns</span>
            <span className="quick-link-title">Lending Desk →</span>
          </Link>
        </div>
      </Reveal>

      <Reveal>
        <div className="section-heading">
          <h2>Recent Activity</h2>
        </div>
        <div className="table-panel">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Book / Member</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {onLoan.map((b) => (
                <tr key={b.id}>
                  <td><span className="activity-type-tag loan">Loan</span></td>
                  <td>{b.title}</td>
                  <td>Out</td>
                </tr>
              ))}
              {recentMembers.map((m) => (
                <tr key={m.id}>
                  <td><span className="activity-type-tag register">Register</span></td>
                  <td>{m.name}</td>
                  <td>Active</td>
                </tr>
              ))}
              {onLoan.length === 0 && recentMembers.length === 0 ? (
                <tr><td colSpan={3}>No recent activity to show.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  )
} 