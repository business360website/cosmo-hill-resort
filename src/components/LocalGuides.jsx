import { ArrowRight } from 'lucide-react'
import Section, { Heading } from './Section'
import { guides } from '../data/guides'
import { routes } from '../data/seo'

// Internal links from the home, places and contact pages to the visitor guides.
export default function LocalGuides({ tone = 'cream' }) {
  return (
    <Section id="guides" tone={tone} label="Visitor guides">
      <Heading eyebrow="Visitor Guides" title="Plan Your Stay in Bandla, Bilaspur" text="Short guides to the lake, hilltop and temples around the resort." />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {Object.keys(guides).map((p) => (
          <li key={p}><a href={p} className="group flex h-full flex-col rounded-2xl border border-ink/15 bg-white p-5 hover:border-cocoa">
            <span className="text-xl font-semibold">{routes[p].crumb}</span>
            <span className="mt-2 text-sm text-ink/75">{guides[p].intro.split('. ')[0]}.</span>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cocoa">Read the guide <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span>
          </a></li>
        ))}
      </ul>
    </Section>
  )
}
