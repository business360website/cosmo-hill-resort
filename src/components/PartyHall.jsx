import Section, { Heading } from './Section'
import Reveal from './Reveal'
import Icon from './icons'
import SmartImage from './SmartImage'
import { partyHall, brand } from '../data/resortData'

// Party hall: occasions it suits, and the facilities that come with it.
export default function PartyHall({ tone = "ivory" }) {
  const h = partyHall
  return (
    <Section id="party-hall" tone={tone} label="Party hall">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal className="overflow-hidden rounded-2xl shadow-[0_18px_40px_-26px_rgba(43,29,24,.5)]">
          <SmartImage src={h.image} alt="Party hall for celebrations at Cosmo Hill Resort, Bandla, Bilaspur" className="aspect-[4/3] w-full object-cover" />
        </Reveal>
        <div>
          <Heading eyebrow={h.eyebrow} title={h.title} text={h.text} />

          <h3 className="mt-8 text-2xl font-semibold">Hall for</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {h.events.map((e) => (
              <li key={e.title} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium shadow-[0_10px_24px_-18px_rgba(43,29,24,.5)]">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-cream"><Icon name={e.icon} size={18} /></span>
                {e.title}
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-2xl font-semibold">Available with the hall</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {h.facilities.map((f) => (
              <li key={f.title} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium shadow-[0_10px_24px_-18px_rgba(43,29,24,.5)]">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream text-ink"><Icon name={f.icon} size={18} /></span>
                {f.title}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {[brand.phone, brand.phone2].map((n) => (
              <a key={n} href={`tel:${n.replace(/[^+\d]/g, '')}`} className="btn btn-solid inline-flex justify-center">Enquire: {n}</a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
