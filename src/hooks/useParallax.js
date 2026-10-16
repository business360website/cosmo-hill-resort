import { useEffect, useRef } from 'react'

// Moves an element vertically at a fraction of scroll speed (cheap, rAF-throttled).
export default function useParallax(speed = 0.15) {
  const ref = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const rect = el.parentElement.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      el.style.transform = `translate3d(0, ${(rect.top + rect.height / 2 - window.innerHeight / 2) * -speed}px, 0)`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [speed])
  return ref
}
