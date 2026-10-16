import PageHeader from './PageHeader'
import Section from './Section'

export default function NotFound() {
  return (
    <>
      <PageHeader eyebrow="Cosmo Hill Resort" title="Page not found" text="The page you are looking for does not exist or has moved." />
      <Section tone="ivory" label="Page not found">
        <p className="max-w-xl text-lg">Try one of these instead:</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/" className="btn btn-dark">Home</a>
          <a href="/rooms" className="btn btn-dark">Rooms &amp; Suites</a>
          <a href="/places" className="btn btn-dark">Places to Visit</a>
          <a href="/contact" className="btn btn-dark">Contact</a>
        </div>
      </Section>
    </>
  )
}
