// Header.jsx — Integrated Glass Topbar Structure
import { useState } from 'react'

export default function Header() {
  const [query, setQuery] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    window.location.hash = `#/books?q=${encodeURIComponent(query.trim())}`
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
      <a href="#/lending" className="btn btn-primary top-bar-cta">Lend a Book</a>
    </header>
  )
}