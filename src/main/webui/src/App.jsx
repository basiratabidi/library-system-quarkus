import { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
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
import UserLendingPage from './pages/UserLendingPage'
import Collections from './pages/Collections'
import ArchiveLogs from './pages/ArchiveLogs'
import Contact from './pages/Contact'
import Help from './pages/Help'
import { getAuth } from './api'
import './index.css'

function RouteGuard() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const auth = getAuth()
    const path = location.pathname.replace('/', '') || 'welcome'
    const adminOnly = ['home', 'members', 'lending']
    const authRequired = ['books', 'user-lending', ...adminOnly]
    
    if (authRequired.includes(path) && !auth) {
      navigate('/login')
    } else if (adminOnly.includes(path) && auth?.role !== 'ADMIN') {
      navigate('/books')
    }
  }, [location.pathname])

  return null
}

export default function App() {
  const location = useLocation()
  const route = location.pathname.replace('/', '') || 'welcome'
  const isLanding = route === 'welcome' || route === ''
  
  return (
    <div className="app-shell">
      <Cursor />
      <RouteGuard />
      {!isLanding && <Header />}
      {!isLanding && <Nav />}
      <main className={`main-content ${isLanding ? 'main-content--landing' : ''}`}>
        <Routes>
          <Route path="/welcome" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/lending" element={<LendingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<LandingPage />} />
          <Route path="/user-lending" element={<UserLendingPage />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/archive" element={<ArchiveLogs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />       
        </Routes>
      </main>
      {!isLanding && <Footer />}
    </div>
  )
}