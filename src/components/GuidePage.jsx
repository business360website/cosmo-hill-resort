import { ArrowRight, MapPin } from 'lucide-react'
import Section from './Section'
import SmartImage from './SmartImage'
import { brand } from '../data/resortData'
import { guides, guideNote } from '../data/guides'
import { routes } from '../data/seo'

// A local visitor guide (Gobind Sagar Lake, Bandla Hill Top, temples ...). Content lives in data/guides.js.
export default function GuidePage({ path }) {
  const g = guides[path]
  return (
    <>
      <Section tone="ivory" label={g.breadcrumb}>
        <div className="grid items-start gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SmartImage src={g.image} alt={g.imageAlt} className="mb-8 w-full rounded-2xl object-cover shadow-2xl lg:hidden" />
            <p className="max-w-2xl text-lg text-ink/85">{g.intro}</p>
            {g.sections.map((s) => (
              <div key={s.h} className="mt-10">
                <h2 className="h2">{s.h}</h2>
                {s.p.map((t, i) => <p key={i} className="mt-4 max-w-2xl text-base leading-relaxed text-ink/85">{t}</p>)}
              </div>
            ))}
            <div className="mt-12">
              <h2 className="h2">Frequently asked questions</h2>
              <dl className="mt-5 divide-y divide-ink/15 border-y border-ink/15">
                {g.faqs.map((f) => (
                  <div key={f.q} className="py-5">
                    <dt className="text-lg font-semibold">{f.q}</dt>
                    <dd className="mt-2 max-w-2xl text-ink/80">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-8 max-w-2xl text-sm text-ink/65">{guideNote}</p>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-28">
            <SmartImage src={g.image} alt={g.imageAlt} className="hidden w-full rounded-2xl object-cover shadow-2xl lg:block" />
            <div className="rounded-2xl bg-white p-6 shadow-[0_18px_40px_-24px_rgba(43,29,24,.5)]">
              <h2 className="text-2xl font-semibold">Quick facts</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {g.facts.map(([k, v]) => <div key={k}><dt className="font-semibold">{k}</dt><dd className="text-ink/75">{v}</dd></div>)}
              </dl>
            </div>
            <div className="rounded-2xl bg-ink p-6 text-paper">
              <h2 className="text-2xl font-semibold">Stay at Cosmo Hill Resort</h2>
              <p className="mt-2 text-sm text-paper/85">{brand.address}</p>
              <div className="mt-5 flex flex-col gap-3">
                <a href="/rooms" className="btn btn-solid">See rooms <ArrowRight size={16} /></a>
                <a href="/book" className="btn btn-ghost text-paper">Book your stay</a>
                <a href={brand.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-cream hover:underline"><MapPin size={16} /> Get directions</a>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="cream" label="More guides">
        <h2 className="h2">More to explore around Bandla</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {g.related.map((r) => (
            <li key={r}><a href={r} className="flex items-center justify-between rounded-2xl border border-ink/15 bg-white px-5 py-4 font-semibold hover:border-cocoa">{routes[r].crumb}<ArrowRight size={16} /></a></li>
          ))}
          <li><a href="/places" className="flex items-center justify-between rounded-2xl border border-ink/15 bg-white px-5 py-4 font-semibold hover:border-cocoa">All places near the resort<ArrowRight size={16} /></a></li>
        </ul>
      </Section>
    </>
  )
}
