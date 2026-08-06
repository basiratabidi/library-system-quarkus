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
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import { getAuth } from './api'
import './index.css'

export default function App() {
  const [route, setRoute] = useState(() => {
    return window.location.hash.replace('#/', '').split('?')[0] || 'welcome'
  })

  useEffect(() => {
    const auth = getAuth()
    const adminOnly = ['home', 'members', 'lending']
    const authRequired = ['books', ...adminOnly]
      if (authRequired.includes(route) && !auth) {
        window.location.hash = 'login'
      } else if (adminOnly.includes(route) && auth?.role !== 'ADMIN') {
        window.location.hash = 'books'
      }
  }, [route])

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
      case 'login':
        return <LoginPage />
      case 'signup':
        return <SignUpPage />
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
      <main className={`main-content ${isLanding ? 'main-content--landing' : ''}`}>
        {renderPage()}
      </main>
      {!isLanding && <Footer />}
    </div>
  )
}