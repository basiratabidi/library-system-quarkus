import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0
    const dot = dotRef.current
    const ring = ringRef.current

    function onMouseMove(e) {
      mouseX = e.clientX; mouseY = e.clientY
      if (dot) { dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px' }
    }
    window.addEventListener('mousemove', onMouseMove)

    let frame
    function lerpRing() {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      if (ring) { ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px' }
      frame = requestAnimationFrame(lerpRing)
    }
    lerpRing()

    // re-scans on every render since pages swap in/out - light enough to not matter
    function attachHoverListeners() {
      const hoverEls = document.querySelectorAll('a, button, .feature-card, .book-card')
      hoverEls.forEach((el) => {
        el.addEventListener('mouseenter', addHover)
        el.addEventListener('mouseleave', removeHover)
      })
      return hoverEls
    }
    const addHover = () => ring?.classList.add('hover')
    const removeHover = () => ring?.classList.remove('hover')
    let hoverEls = attachHoverListeners()

    // re-attach on route changes (hash change), since new elements mount
    const onHashChange = () => {
      hoverEls.forEach((el) => {
        el.removeEventListener('mouseenter', addHover)
        el.removeEventListener('mouseleave', removeHover)
      })
      setTimeout(() => { hoverEls = attachHoverListeners() }, 50)
    }
    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('hashchange', onHashChange)
      cancelAnimationFrame(frame)
      hoverEls.forEach((el) => {
        el.removeEventListener('mouseenter', addHover)
        el.removeEventListener('mouseleave', removeHover)
      })
    }
  }, [])

  return (
    <>
      <div id="cursor-dot" ref={dotRef}></div>
      <div id="cursor-ring" ref={ringRef}></div>
    </>
  )
}