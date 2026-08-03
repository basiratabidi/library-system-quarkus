import { useState, useEffect } from 'react'
import Header from './components/Header'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import BooksPage from './pages/BooksPage'
import MembersPage from './pages/MembersPage'
import LendingPage from './pages/LendingPage'
import './index.css'

const routes = { welcome: LandingPage, home: HomePage, books: BooksPage, members: MembersPage, lending: LendingPage }

function getRoute() {
  const hash = window.location.hash.replace('#/', '')
  return routes[hash] ? hash : 'home'
}

export default function App() {
  const [route, setRoute] = useState(getRoute())
  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const Page = routes[route]
  const isLanding = route === 'welcome'

  return (
    <>
      <Cursor />
      <Header />
      <Nav route={route} />
      <main className={isLanding ? 'main-flush' : ''}>
        <Page />
      </main>
      {!isLanding && <Footer />}
    </>
  )
}