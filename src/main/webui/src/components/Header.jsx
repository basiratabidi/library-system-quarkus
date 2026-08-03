export default function Header() {
  return (
    <header className="top-bar">
      <div className="top-bar-brand">
        <span className="brand-mark">§</span>
        <span className="brand-name">Stacks</span>
      </div>
      <div className="top-bar-search">
        <input type="search" placeholder="Search the catalog…" className="top-bar-search-input" />
      </div>
      <a href="#/lending" className="btn btn-primary top-bar-cta">Lend a Book</a>
    </header>
  )
}