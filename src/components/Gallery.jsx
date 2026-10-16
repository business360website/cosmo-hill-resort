import { useCallback, useEffect, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, X } from 'lucide-react'
import Section, { Heading } from './Section'
import SmartImage from './SmartImage'
import ViewMore from './ViewMore'
import { gallery, galleryCategories } from '../data/resortData'

const LIMIT = 9 // photos shown first
const TOTAL = 24 // total photos in the gallery
const STEP = 6 // photos added per "View more" click

export default function Gallery({ preview = false }) {
  const [cat, setCat] = useState('All')
  const [active, setActive] = useState(null)
  const [count, setCount] = useState(LIMIT)
  const pool = gallery.filter((g) => g.category !== 'Party Hall').slice(0, TOTAL) // 'All' shows the first 24 photos
  const all = cat === 'All' ? pool : gallery.filter((g) => g.category === cat)
  const items = all.slice(0, preview ? 6 : count) // photos currently shown (lightbox follows these)

  // Collapse back and stay in this section (page gets shorter, so scroll to the section top)
  const showLess = () => {
    setCount(LIMIT)
    requestAnimationFrame(() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const pick = (c) => { setCat(c); setCount(LIMIT) }
  const step = useCallback((d) => setActive((a) => (a === null ? a : (a + d + items.length) % items.length)), [items.length])

  useEffect(() => {
    if (active === null) return
    const onKey = (e) => { if (e.key === 'Escape') setActive(null); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [active, step])

  return (
    <Section id="gallery" tone="sand" label="Gallery">
      <Heading eyebrow="Gallery" title="A Glimpse of Life on the Hill" />
      {!preview && <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Gallery categories">
        {galleryCategories.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} onClick={() => pick(c)}
            className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${cat === c ? 'border-ink bg-ink text-cream' : 'border-ink/40 text-ink hover:border-ink hover:bg-ink/10'}`}>{c}</button>
        ))}
      </div>}

      <div key={cat} className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {items.map((g, i) => (
          <button key={g.id} onClick={() => setActive(i)} style={{ animationDelay: `${i * 50}ms` }} aria-label={`Open image: ${g.alt}`}
            className="group relative block aspect-[4/5] w-full animate-fadeIn overflow-hidden rounded-xl sm:aspect-[4/3]">
            <SmartImage src={g.src} alt={g.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 to-transparent p-4 text-left text-sm font-semibold text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100">{g.category}</span>
          </button>
        ))}
      </div>

      {preview && <ViewMore href="/gallery" label="View Full Gallery" ghost />}
      {!preview && all.length > LIMIT && (
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {count < all.length && (
            <button onClick={() => setCount((c) => Math.min(c + STEP, all.length))} className="btn btn-dark">
              View more ({all.length - count}) <ChevronDown size={18} />
            </button>
          )}
          {count > LIMIT && (
            <button onClick={showLess} className="btn btn-ghost !border-ink/60 text-ink hover:!bg-ink/10">
              View less <ChevronUp size={18} />
            </button>
          )}
        </div>
      )}

      {active !== null && items[active] && (
        <div role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-[60] grid animate-fadeIn place-items-center bg-ink/95 p-4" onClick={() => setActive(null)}>
          <button onClick={() => setActive(null)} aria-label="Close" className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-paper/10 text-paper hover:bg-paper/25"><X /></button>
          <button onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label="Previous" className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-paper/10 text-paper hover:bg-paper/25"><ChevronLeft /></button>
          <figure key={items[active].id} className="animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <SmartImage src={items[active].src} alt={items[active].alt} className="max-h-[80vh] max-w-[90vw] rounded-lg object-contain" />
            <figcaption className="mt-3 text-center text-sm text-paper/80">{items[active].category} · {active + 1} / {items.length}</figcaption>
          </figure>
          <button onClick={(e) => { e.stopPropagation(); step(1) }} aria-label="Next" className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-paper/10 text-paper hover:bg-paper/25"><ChevronRight /></button>
        </div>
      )}
    </Section>
  )
}
