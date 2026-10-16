import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import Section, { Heading } from './Section'
import { testimonials } from '../data/resortData'

export default function Testimonials() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = testimonials.length
  const go = (d) => setI((v) => (v + d + n) % n)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setI((v) => (v + 1) % n), 6500)
    return () => clearInterval(t)
  }, [paused, n])

  return (
    <Section id="testimonials" tone="cream" label="Guest experiences">
      <Heading center eyebrow="Guest experiences" title="Words from Our Guests" />
      <div className="mx-auto mt-14 max-w-3xl" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel">
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)]" style={{ transform: `translateX(-${i * 100}%)` }}>
            {testimonials.map((t, k) => (
              <figure key={t.name} className="w-full shrink-0 px-2 text-center sm:px-8" aria-hidden={k !== i}>
                <Quote className="mx-auto text-cocoa" size={40} aria-hidden="true" />
                <blockquote className="mt-5 font-display text-2xl font-medium leading-snug sm:text-4xl">“{t.text}”</blockquote>
                <div className="mt-6 flex justify-center gap-1" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={18} className={s < t.rating ? 'fill-ink text-ink' : 'text-ink/30'} />)}
                </div>
                <figcaption className="mt-3"><strong className="block text-lg">{t.name}</strong><span className="text-sm text-ink/70">{t.location}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center gap-5">
          <button onClick={() => go(-1)} aria-label="Previous testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-ink/40 transition hover:bg-ink hover:text-cream"><ChevronLeft size={20} /></button>
          <div className="flex gap-2">
            {testimonials.map((t, k) => <button key={t.name} onClick={() => setI(k)} aria-label={`Show testimonial ${k + 1}`} className={`h-2.5 rounded-full transition-all duration-300 ${k === i ? 'w-8 bg-ink' : 'w-2.5 bg-ink/35'}`} />)}
          </div>
          <button onClick={() => go(1)} aria-label="Next testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-ink/40 transition hover:bg-ink hover:text-cream"><ChevronRight size={20} /></button>
        </div>
      </div>
    </Section>
  )
}
