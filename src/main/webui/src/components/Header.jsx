import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getAuth } from '../api'

export default function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const auth = getAuth()
  const isAdmin = auth?.role === 'ADMIN'

  function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/books?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="top-bar">
      <div className="top-bar-brand">
        <span className="brand-mark">§</span>
        <span className="brand-name">Stacks</span>
      </div>
      <form className="top-bar-search" onSubmit={handleSearch}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search catalog by title, author, or keyword..."
          className="top-bar-search-input"
        />
      </form>
      {isAdmin ? (
        <Link to="/lending" className="btn btn-primary top-bar-cta">Lend a Book</Link>
      ) : (
        <Link to="/user-lending" className="btn btn-primary top-bar-cta">My Lended Books</Link>
      )}
    </header>
  )
}