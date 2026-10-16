import { MapPin } from 'lucide-react'
import Section, { Heading } from './Section'
import Reveal from './Reveal'
import Icon from './icons'
import SmartImage from './SmartImage'
import ViewMore from './ViewMore'
import { places } from '../data/resortData'

// Each place links to the visitor guide that covers it.
const guideFor = { 'gobind-sagar-lake': '/gobind-sagar-lake', 'gobind-sagar-activities': '/gobind-sagar-lake', 'bandla-hill-top': '/bandla-hill-top-paragliding', 'paragliding-bandla': '/bandla-hill-top-paragliding', 'naina-devi-temple': '/naina-devi-temple', 'laxmi-narayan-temple': '/temples-near-bilaspur', 'markandeya-rishi-temple': '/temples-near-bilaspur', 'baba-nahar-singh-temple': '/temples-near-bilaspur' }

export default function Places({ preview = false }) {
  return (
    <Section id="places" tone="ivory" label="Places and activities near the resort">
      <Heading eyebrow="Places & Activities" title="Explore Around Bandla" text="Lakes, hilltops, temples and adventure, all within easy reach of the resort." />
      <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {(preview ? places.slice(0, 4) : places).map((p, i) => (
          <Reveal as="article" key={p.slug} delay={(i % 4) * 100}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-24px_rgba(43,29,24,.5)] !transition-[transform,box-shadow,opacity] duration-500 hover:-translate-y-2">
            <div className="relative overflow-hidden">
              <SmartImage src={p.image} alt={`${p.name}, Bilaspur district, Himachal Pradesh`} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-cream backdrop-blur"><Icon name={p.icon} size={14} />{p.tag}</span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-2xl font-semibold leading-snug">{p.name}</h3>
              <p className="mt-2 text-sm text-ink/75">{p.text}</p>
              <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5 text-sm font-semibold text-cocoa">
                <a href={p.map} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:underline"><MapPin size={16} /> View on Map</a>
                {guideFor[p.slug] && <a href={guideFor[p.slug]} className="hover:underline">Read the guide</a>}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      {preview && <ViewMore href="/places" />}
    </Section>
  )
}
