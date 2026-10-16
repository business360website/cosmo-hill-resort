import { MapPin, Navigation } from 'lucide-react'
import Section from './Section'
import Reveal from './Reveal'
import { brand, location } from '../data/resortData'

// Live Google Map (no API key needed for the basic embed)
function ResortMap() {
  return (
    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-sand shadow-2xl">
      <iframe title="The Cosmo Hill Resort on Google Maps" src={brand.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="h-full w-full border-0" />
    </div>
  )
}

export default function Location() {
  return (
    <Section id="location" tone="ivory" label="Location">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="text-sm font-semibold text-ink/70">Location</p>
          <h2 className="h2 mt-3">{location.title}</h2>
          <p className="mt-5 max-w-lg text-lg text-ink/85">{location.text}</p>
          <p className="mt-6 flex items-start gap-2 font-medium"><MapPin size={20} className="mt-0.5 shrink-0 text-cocoa" />{brand.address}</p>
          <ul className="mt-6 divide-y divide-ink/20 border-y border-ink/20">
            {location.nearby.map((p) => (
              <li key={p.name} className="flex items-baseline justify-between py-3.5"><span className="text-lg">{p.name}</span>{p.distance && <span className="font-display text-2xl font-semibold text-cocoa">{p.distance}</span>}</li>
            ))}
          </ul>
          <a href={brand.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-dark mt-8">Get Directions <Navigation size={18} /></a>
        </Reveal>
        <Reveal delay={150}><ResortMap /></Reveal>
      </div>
    </Section>
  )
}
