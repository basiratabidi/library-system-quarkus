import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import MembersPage from './pages/MembersPage';
import LendingPage from './pages/LendingPage';
import './index.css';

const routes = { home: HomePage, books: BooksPage, members: MembersPage, lending: LendingPage };

function getRoute() {
  const hash = window.location.hash.replace('#/', '');
  return routes[hash] ? hash : 'home'; // default to home now, not books
}

export default function App() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const Page = routes[route];

  return (
    <>
      <header>
        <h1>Stacks</h1>
        <div className="stamp">Library Desk</div>
      </header>
      <nav>
        <a href="#/home" className={route === 'home' ? 'active' : ''}>Home</a>
        <a href="#/books" className={route === 'books' ? 'active' : ''}>Books</a>
        <a href="#/members" className={route === 'members' ? 'active' : ''}>Members</a>
        <a href="#/lending" className={route === 'lending' ? 'active' : ''}>Lending</a>
      </nav>
      <main><Page /></main>
    </>
  );
}