import { ArrowUpRight } from 'lucide-react'
import Section, { Heading } from './Section'
import Reveal from './Reveal'
import Icon from './icons'
import SmartImage from './SmartImage'
import ViewMore from './ViewMore'
import { experiences } from '../data/resortData'

export default function Experiences({ preview = false }) {
  return (
    <Section id="experiences" tone="sand" label="Resort experiences">
      <Heading eyebrow="Experiences" title="Days Made for the Outdoors" text="From the pool to the terrace to the clouds below, this is what a day at Cosmo Hill looks like." />
      <div className="mt-14 grid auto-rows-[260px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {(preview ? experiences.slice(0, 4) : experiences).map((e, i) => (
          <Reveal key={e.title} delay={i * 80} className={`group relative overflow-hidden rounded-2xl ${preview ? '' : e.span}`}>
            <div className="absolute inset-0">
              <SmartImage src={e.image} alt={`${e.title} at Cosmo Hill Resort, Bandla`} className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent transition-all duration-500 group-hover:from-ink/90 group-hover:via-ink/50" />
              <span className="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-paper/20 text-paper backdrop-blur"><Icon name={e.icon} size={20} /></span>
              <span className="absolute right-5 top-5 grid h-11 w-11 -translate-x-3 translate-y-3 place-items-center rounded-full bg-cream text-ink opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight size={20} /></span>
              <div className="absolute inset-x-0 bottom-0 p-6 text-paper transition-transform duration-500 group-hover:-translate-y-1">
                <h3 className="text-3xl font-semibold lg:text-4xl">{e.title}</h3>
                <p className="mt-1 max-h-0 overflow-hidden text-sm opacity-0 transition-all duration-500 group-hover:max-h-12 group-hover:opacity-100">{e.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      {preview && <ViewMore href="/experiences" />}
    </Section>
  )
}
