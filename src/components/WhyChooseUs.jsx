import { useEffect, useState } from 'react'
import Section, { Heading } from './Section'
import useInView from '../hooks/useInView'
import { stats } from '../data/resortData'

function Counter({ value, suffix }) {
  const [ref, inView] = useInView({ threshold: 0.5 })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setN(value); return }
    let raf, start
    const tick = (t) => {
      start ??= t
      const p = Math.min((t - start) / 1800, 1)
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])
  return <span ref={ref} className="font-display text-6xl font-semibold tabular-nums sm:text-7xl lg:text-8xl">{n}<span className="text-cocoa">{suffix}</span></span>
}

export default function WhyChooseUs() {
  return (
    <Section id="why" tone="cream" label="Why choose Cosmo Hill Resort">
      <Heading center eyebrow="Why Cosmo Hill" title="Why Choose Cosmo Hill Resort" text="A small resort run with big attention to detail." />
      <dl className="mt-16 grid grid-cols-2 gap-y-12 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`px-4 text-center ${i > 0 ? 'lg:border-l lg:border-ink/20' : ''} ${i % 2 === 1 ? 'border-l border-ink/20' : ''}`}>
            <dd className="order-1"><Counter value={s.value} suffix={s.suffix} /></dd>
            <dt className="mt-3 text-base font-semibold text-ink/80 sm:text-lg">{s.label}</dt>
          </div>
        ))}
      </dl>
    </Section>
  )
}
