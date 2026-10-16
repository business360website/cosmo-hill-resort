import Section from './Section'
import Reveal from './Reveal'
import SmartImage from './SmartImage'
import { dining } from '../data/resortData'

export default function Dining() {
  return (
    <Section id="dining" tone="cream" label="Dining">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="relative lg:col-span-5">
          <Reveal>
            <SmartImage src={dining.imageMain} alt="Terrace restaurant at Cosmo Hill Resort, Bandla, Bilaspur" className="aspect-[3/4] w-full rounded-2xl object-cover shadow-2xl" />
            <SmartImage src={dining.imageSmall} alt="Freshly plated dish from the Cosmo Hill Resort kitchen" className="absolute -bottom-8 -right-4 aspect-square w-2/5 rounded-2xl border-8 border-cream object-cover shadow-xl lg:-right-10" />
          </Reveal>
        </div>
        <div className="lg:col-span-7 lg:pl-6">
          <Reveal>
            <p className="text-sm font-semibold text-ink/70">Dining</p>
            <h2 className="h2 mt-3 max-w-xl">{dining.title}</h2>
            <p className="mt-5 max-w-xl text-lg text-ink/85">{dining.text}</p>
            <button type="button" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="btn btn-dark mt-7">View Our Menu</button>
          </Reveal>
          <ul className="mt-10 grid border-t border-ink/25 sm:grid-cols-2 sm:gap-x-10">
            {dining.items.map((d, i) => (
              <Reveal as="li" key={d.title} delay={i * 70} className="group border-b border-ink/25 py-5">
                <h3 className="text-2xl font-semibold transition-transform duration-300 group-hover:translate-x-1.5">{d.title}</h3>
                <p className="mt-1 text-sm text-ink/75">{d.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
