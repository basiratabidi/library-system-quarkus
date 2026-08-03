import { useState, useEffect } from 'react'
import Header from './components/Header'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Cursor from './components/Cursor'

import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import BooksPage from './pages/BooksPage'
import MembersPage from './pages/MembersPage'
import LendingPage from './pages/LendingPage'

export default function App() {
  const [route, setRoute] = useState(() => {
    return window.location.hash.replace('#/', '') || 'welcome'
  })

  useEffect(() => {
    const handleHashChange = () => {
      const currentRoute = window.location.hash.replace('#/', '').split('?')[0]
      setRoute(currentRoute || 'welcome')
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const renderPage = () => {
    switch (route) {
      case 'home':
        return <HomePage />
      case 'books':
        return <BooksPage />
      case 'members':
        return <MembersPage />
      case 'lending':
        return <LendingPage />
      case 'welcome':
      default:
        return <LandingPage />
    }
  }

  const isLanding = route === 'welcome' || route === ''

  return (
    <div className="app-shell">
      <Cursor />
      {!isLanding && <Header />}
      {!isLanding && <Nav route={route} />}
      <main className="main-content">
        {renderPage()}
      </main>
      {!isLanding && <Footer />}
    </div>
  )
}