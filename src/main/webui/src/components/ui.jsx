import { useEffect, useRef, useState } from 'react'

export function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p className="subtitle">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function BrassRule() {
  return <hr className="brass-rule" />
}

export function Panel({ children, className = '', style }) {
  return (
    <div className={`panel ${className}`} style={style}>
      {children}
    </div>
  )
}

export function StampBadge({ children, tone = 'green' }) {
  return <span className={`stamp-badge tone-${tone}`}>{children}</span>
}

export function StateNotice({ variant = 'muted', title, detail }) {
  return (
    <div className={`state-notice ${variant}`}>
      <p className="state-title">{title}</p>
      {detail ? <p className="state-detail">{detail}</p> : null}
    </div>
  )
}

export function Field({ label, htmlFor, children, error }) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  )
}

export function ConfirmDeleteButton({ onConfirm, pending, label }) {
  const [armed, setArmed] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])

  function handleClick() {
    if (!armed) {
      setArmed(true)
      timeoutRef.current = setTimeout(() => setArmed(false), 3000)
      return
    }
    clearTimeout(timeoutRef.current)
    setArmed(false)
    onConfirm()
  }

  return (
    <button
      type="button"
      className={armed ? 'btn btn-confirm' : 'btn btn-icon btn-danger'}
      onClick={handleClick}
      disabled={pending}
      aria-label={label}
    >
      {armed ? (pending ? 'Removing…' : 'Confirm?') : '🗑'}
    </button>
  )
}

export function SkeletonRows({ columns, rows = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="skeleton-row">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c}>
              <div className="skeleton-bar" style={{ width: `${55 + ((r * 13 + c * 22) % 35)}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export function CountUp({ value, active }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!active) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced || value === 0) { setDisplay(value); return }
    let frame
    const start = performance.now()
    const duration = 500
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - progress) * (1 - progress)
      setDisplay(Math.round(eased * value))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, active])
  return <>{display}</>
}

export function SearchField({ value, onChange, placeholder }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className="input search-field"
    />
  )
}

export function SortSelect({ value, onChange, options }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="input sort-select" aria-label="Sort by">
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

export function StarRating({ value, count }) {
  return (
    <div className="star-rating">
      <div className="stars" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < Math.round(value) ? 'star filled' : 'star'}>★</span>
        ))}
      </div>
      {count > 0 ? (
        <span className="rating-count">{value.toFixed(1)} · {count} review{count === 1 ? '' : 's'}</span>
      ) : (
        <span className="rating-count muted">No reviews yet</span>
      )}
    </div>
  )
}

export function FeedbackBanner({ feedback, onClose }) {
  const isError = feedback.kind === 'error'
  return (
    <div className={`feedback-banner ${isError ? 'error' : 'success'}`} role="status">
      <p>{feedback.message}</p>
      <button type="button" onClick={onClose} aria-label="Dismiss">✕</button>
    </div>
  )
}

export function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('in')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('in')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

export function useFeedback() {
  const [feedback, setFeedback] = useState(null)
  const notify = (kind, message) => setFeedback({ kind, message })
  const clear = () => setFeedback(null)
  return { feedback, notify, clear }
}