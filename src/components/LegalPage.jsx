import { ArrowLeft } from 'lucide-react'
import { navigate } from '../lib/router'
import Section from './Section'
import { brand } from '../data/resortData'

// Goes to the previous page; falls back to Home if the guest opened this page directly.
const goBack = () => { if (window.history.length > 1) window.history.back(); else navigate('/') }

const BackButton = () => (
  <button type="button" onClick={goBack} className="btn border border-ink/30 hover:bg-ink hover:text-cream"><ArrowLeft size={16} /> Back</button>
)

// One layout shared by all legal pages (refund, disclaimer, terms, privacy).
export default function LegalPage({ page }) {
  return (
    <Section tone="cream" label={page.title}>
      <article className="mx-auto max-w-3xl">
        <BackButton />
        <p className="mt-6 text-sm text-ink/60">Last updated: {page.updated}</p>
        <p className="mt-4 text-lg text-ink/85">{page.intro}</p>
        {page.sections.map((s, i) => (
          <section key={s.h} className="mt-10">
            <h2 className="text-2xl font-semibold text-ink">{i + 1}. {s.h}</h2>
            {s.p.map((t) => <p key={t} className="mt-3 text-ink/80">{t}</p>)}
          </section>
        ))}
        <section className="mt-12 rounded-2xl border border-ink/15 bg-paper/60 p-6">
          <h2 className="text-2xl font-semibold text-ink">Questions?</h2>
          <p className="mt-2 text-ink/80">Call <a className="underline" href={`tel:${brand.phone}`}>{brand.phone}</a> or email <a className="underline" href={`mailto:${brand.email}`}>{brand.email}</a>.</p>
        </section>
        <div className="mt-10"><BackButton /></div>
      </article>
    </Section>
  )
}
