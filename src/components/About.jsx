import Section from './Section'
import ViewMore from './ViewMore'
import Reveal from './Reveal'
import Icon from './icons'
import SmartImage from './SmartImage'
import useParallax from '../hooks/useParallax'
import { about } from '../data/resortData'

export default function About({ preview = false }) {
  const par = useParallax(0.06)
  return (
    <Section id="about" tone="cream" label="About the resort">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div ref={par} className="will-change-transform">
            <SmartImage src={about.image} alt="The Cosmo Hill Resort building lit up at dusk in Bandla, Bilaspur" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl" />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-sm font-semibold text-ink/70">{about.eyebrow}</p>
            <h2 className="h2 mt-3">{about.title}</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/85">{about.text}</p>
          </Reveal>
          <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {about.highlights.map((h, i) => (
              <Reveal as="li" key={h.title} delay={i * 90} className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-cream"><Icon name={h.icon} size={20} /></span>
                <span><strong className="block font-display text-xl">{h.title}</strong><span className="text-sm text-ink/75">{h.text}</span></span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
      {preview && <ViewMore href="/about" />}
    </Section>
  )
}
