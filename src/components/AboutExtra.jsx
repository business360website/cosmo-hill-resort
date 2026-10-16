import Section, { Heading } from './Section'
import Reveal from './Reveal'
import Icon from './icons'
import { PlanBand } from './ExperiencesExtra'
import { aboutStory, aboutOfferings, aboutPromise } from '../data/resortData'

// Extra content shown only on the About page.
export function AboutStory() {
  return (
    <Section id="story" tone="ivory" label="Our story">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="text-sm font-semibold text-ink/70">{aboutStory.eyebrow}</p>
          <h2 className="h2 mt-3">{aboutStory.title}</h2>
        </Reveal>
        <Reveal delay={120} className="space-y-5 text-lg leading-relaxed text-ink/85 lg:col-span-7">
          {aboutStory.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </Reveal>
      </div>
    </Section>
  )
}

export function AboutOfferings() {
  return (
    <Section id="offerings" tone="sand" label="What we offer">
      <Heading eyebrow="What we offer" title="Everything You Need for a Good Stay" text="Simple comforts, good food and plenty of fresh air, all in one place." />
      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {aboutOfferings.map((o, i) => (
          <Reveal as="li" key={o.title} delay={(i % 3) * 100} className="rounded-2xl bg-ivory p-7 shadow-[0_18px_40px_-26px_rgba(43,29,24,.5)]">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-cream"><Icon name={o.icon} size={22} /></span>
            <h3 className="mt-5 text-2xl font-semibold">{o.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">{o.text}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}

export function AboutPromise() {
  return (
    <Section id="promise" tone="cream" label="Our promise">
      <Heading center eyebrow="Our promise" title="What Guests Can Expect From Us" />
      <ul className="mt-14 grid gap-10 md:grid-cols-3">
        {aboutPromise.map((p, i) => (
          <Reveal as="li" key={p.title} delay={i * 120} className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink text-cream"><Icon name={p.icon} size={26} /></span>
            <h3 className="mt-5 text-3xl font-semibold">{p.title}</h3>
            <p className="mx-auto mt-2 max-w-xs text-ink/80">{p.text}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}

export function AboutEnd() {
  return <PlanBand text="Come for the view, stay for the hospitality. We would love to host you." />
}
