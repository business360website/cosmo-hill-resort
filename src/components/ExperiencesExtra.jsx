import { Check } from 'lucide-react'
import Section, { Heading } from './Section'
import Reveal from './Reveal'
import Icon from './icons'
import { dayAtResort, experienceDetails } from '../data/resortData'

// Extra content shown only on the Experiences page.
export default function ExperiencesExtra() {
  return (
    <>
      <Section id="day" tone="cream" label="A day at the resort">
        <Heading eyebrow="A day at Cosmo Hill" title="From Misty Mornings to Starry Nights" text="There is no schedule to follow. Here is how most guests like to spend their day." />
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dayAtResort.map((d, i) => (
            <Reveal as="li" key={d.time} delay={i * 100} className="relative rounded-2xl bg-ivory p-7 shadow-[0_18px_40px_-26px_rgba(43,29,24,.5)]">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-cream"><Icon name={d.icon} size={22} /></span>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-cocoa">{d.time}</p>
              <h3 className="mt-1 text-2xl font-semibold leading-snug">{d.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{d.text}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section id="experience-details" tone="ivory" label="Experiences in detail">
        <Heading eyebrow="In detail" title="What You Can Look Forward To" text="A closer look at the experiences that make a stay at Cosmo Hill special." />
        <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {experienceDetails.map((e, i) => (
            <Reveal as="article" key={e.title} delay={(i % 3) * 100} className="rounded-2xl bg-white p-7 shadow-[0_18px_40px_-26px_rgba(43,29,24,.5)]">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-cream text-ink"><Icon name={e.icon} size={22} /></span>
              <h3 className="mt-5 text-3xl font-semibold">{e.title}</h3>
              <p className="mt-3 text-ink/80">{e.text}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {e.points.map((p) => <li key={p} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-forest" />{p}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      <PlanBand text="Ready to experience it yourself? Book a room and we will take care of the rest." />
    </>
  )
}

export function PlanBand({ text }) {
  return (
    <section className="bg-ink px-5 py-16 text-center text-paper sm:px-8 sm:py-20" aria-label="Plan your stay">
      <div className="wrap">
        <h2 className="mx-auto max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">Plan Your Stay at Cosmo Hill</h2>
        <p className="mx-auto mt-4 max-w-xl text-paper/80">{text}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/book" className="btn btn-solid">Book Your Stay</a>
          <a href="/contact" className="btn btn-ghost">Contact Us</a>
        </div>
      </div>
    </section>
  )
}
