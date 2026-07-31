import { useState, useEffect } from 'react';
import { api } from '../api';

export default function HomePage() {
  const [stats, setStats] = useState({ books: 0, available: 0, members: 0 });

  useEffect(() => {
    Promise.all([api('/books'), api('/members')])
      .then(([books, members]) => {
        setStats({
          books: books.length,
          available: books.filter(b => b.isAvailable).length,
          members: members.length,
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="hero">
        <p className="hero-eyebrow">Est. in code, kept by hand</p>
        <h2 className="hero-title">The desk is open.</h2>
        <p className="hero-sub">
          Every book, every member, every loan — tracked the way a good
          circulation desk always has: plainly, and in order.
        </p>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <span className="stat-number">{stats.books}</span>
          <span className="stat-label">Books catalogued</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.available}</span>
          <span className="stat-label">On the shelf</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.books - stats.available}</span>
          <span className="stat-label">Out on loan</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.members}</span>
          <span className="stat-label">Members registered</span>
        </div>
      </div>

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
    </div>
  );
}