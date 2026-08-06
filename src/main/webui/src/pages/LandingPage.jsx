import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import { Panel, Field, useFeedback, FeedbackBanner } from '../components/ui'

const HERO_TEXT = "A Library, Kept in Order"

export default function LandingPage() {
  const canvasRef = useRef(null)
  const ringRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    // ---- custom cursor (dot follows instantly, ring lags via lerp) ----
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0
    const dot = dotRef.current
    const ring = ringRef.current

    function onMouseMove(e) {
      mouseX = e.clientX; mouseY = e.clientY
      if (dot) { dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px' }
    }
    window.addEventListener('mousemove', onMouseMove)

    let ringFrame
    function lerpRing() {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      if (ring) { ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px' }
      ringFrame = requestAnimationFrame(lerpRing)
    }
    lerpRing()

    const hoverEls = document.querySelectorAll('.landing a, .landing button, .feature-card')
    const addHover = () => ring?.classList.add('hover')
    const removeHover = () => ring?.classList.remove('hover')
    hoverEls.forEach((el) => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    // ---- particle canvas ----
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let particles = []
    let particleFrame

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        vy: Math.random() * 0.3 + 0.1,
        alpha: Math.random() * 0.3 + 0.1,
      })
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#A6822F'
      particles.forEach((p) => {
        ctx.globalAlpha = p.alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        p.y -= p.vy
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
      })
      ctx.globalAlpha = 1
      particleFrame = requestAnimationFrame(drawParticles)
    }
    drawParticles()

    // ---- scroll reveal ----
    const revealEls = document.querySelectorAll('.landing .reveal')
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    revealEls.forEach((el) => revealObserver.observe(el))

    // ---- stat counters ----
    const statNums = document.querySelectorAll('.landing .stat-num')
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target
            const target = parseInt(el.dataset.target, 10)
            const duration = 1400
            const start = performance.now()
            function tick(now) {
              const progress = Math.min(1, (now - start) / duration)
              const eased = 1 - Math.pow(1 - progress, 3)
              el.textContent = Math.round(eased * target).toLocaleString()
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
            statObserver.unobserve(el)
          }
        })
      },
      { threshold: 0.5 }
    )
    statNums.forEach((el) => statObserver.observe(el))

    // cleanup on unmount - prevents leaks when navigating away
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(ringFrame)
      cancelAnimationFrame(particleFrame)
      revealObserver.disconnect()
      statObserver.disconnect()
      hoverEls.forEach((el) => {
        el.removeEventListener('mouseenter', addHover)
        el.removeEventListener('mouseleave', removeHover)
      })
    }
  }, [])

  // letter-split hero title - each char gets staggered animation-delay
  const chars = HERO_TEXT.split('').map((ch, i) => {
    if (ch === ' ') return ' '
    return (
      <span key={i} className="split-char" style={{ animationDelay: `${i * 0.025}s` }}>
        {ch}
      </span>
    )
  })

  return (
    <div className="landing">
      <section className="hero">
        <canvas id="particles" ref={canvasRef}></canvas>
        <p className="hero-eyebrow">Circulation, without the chaos</p>
        <h1 className="hero-title">{chars}</h1>
        <p className="hero-sub">
          Every book, every member, every loan, tracked plainly, kept in order, the way a good desk always has.
        </p>
        <div className="hero-cta">
          <Link to="/home" className="btn btn-primary">Open the Desk</Link>
          <a href="#features" className="btn btn-ghost">See How It Works</a>
        </div>
      </section>

      <section>
        <div className="reveal">
          <p className="label">By the numbers</p>
          <h2 className="section-title">A collection <em>worth</em> tracking.</h2>
        </div>
        <div className="stats reveal">
          <div className="stat"><div className="stat-num" data-target="1200">0</div><div className="stat-label">Titles Held</div></div>
          <div className="stat"><div className="stat-num" data-target="340">0</div><div className="stat-label">Active Members</div></div>
          <div className="stat"><div className="stat-num" data-target="58">0</div><div className="stat-label">On Loan Today</div></div>
          <div className="stat"><div className="stat-num" data-target="99">0</div><div className="stat-label">% Uptime</div></div>
        </div>
        <div className="spines reveal">
          <div className="spine">Fiction</div>
          <div className="spine">History</div>
          <div className="spine">Poetry</div>
          <div className="spine">Science</div>
          <div className="spine">Memoir</div>
          <div className="spine">Myth</div>
        </div>
      </section>

      <section id="features">
        <div className="reveal">
          <p className="label">What it does</p>
          <h2 className="section-title">Built for the <em>desk</em>, not the boardroom.</h2>
          <p className="section-body">No bloat, no modules you'll never touch. Just the three things a circulation desk actually needs — done well.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card reveal">
            <div className="feature-icon">📚</div>
            <div className="feature-title">The Catalog</div>
            <div className="feature-desc">Add, edit, and retire titles in seconds. Every book's availability, always current.</div>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon">🪪</div>
            <div className="feature-title">Membership Roll</div>
            <div className="feature-desc">Register borrowers, keep contact details straight, know who's active at a glance.</div>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon">📖</div>
            <div className="feature-title">Lending Desk</div>
            <div className="feature-desc">Lend, return, track — with the same plain logic a paper ledger always had.</div>
          </div>
        </div>
      </section>

      <div className="quote-section">
        <p className="quote-text reveal">"A library is not a luxury but one of the necessities of life."</p>
        <p className="quote-by reveal">— Henry Ward Beecher</p>
      </div>

      <section id="cta" className="cta-section">
        <p className="label reveal" style={{ justifyContent: 'center', display: 'flex' }}>Ready when you are</p>
        <h2 className="reveal">The desk is open.</h2>
        <Link to="/home" className="btn btn-primary reveal">Start Circulating →</Link>
      </section>

      <footer className="landing-footer">
        § Stacks — A Library Management System · Kept plainly, in order
      </footer>
    </div>
  )
}