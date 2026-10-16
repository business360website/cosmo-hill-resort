import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import { brand, footer } from '../data/resortData'

const Col = ({ title, links, external = false }) => (
  <nav aria-label={title}>
    <h3 className="text-2xl font-semibold text-cream">{title}</h3>
    <ul className="mt-4 space-y-2.5 text-paper/80">
      {links.map((l) => <li key={l.label}><a href={l.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="transition-colors hover:text-cream">{l.label}</a></li>)}
    </ul>
  </nav>
)

export default function Footer() {
  const socials = [{ Icon: Instagram, label: 'Instagram' }, { Icon: Facebook, label: 'Facebook' }, { Icon: Youtube, label: 'YouTube' }]
  return (
    <footer id="footer" className="relative bg-ink px-5 pb-8 pt-20 text-paper sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_.8fr_1.1fr_1fr_1.4fr]">
        <div>
          <img src={brand.logo} alt="The Cosmo Hill Resort logo" width="96" height="96" loading="lazy" className="h-24 w-24 rounded-full bg-paper" />
          <h2 className="mt-5 text-3xl font-semibold text-cream">{brand.name}</h2>
          <p className="mt-2 text-paper/80">Where Nature Meets Luxury.</p>
          <p className="mt-1 font-semibold text-cream">{brand.tagline}</p>
          <div className="mt-6 flex gap-3">
            {socials.map(({ Icon, label }) => (
              <a key={label} href="#" aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-paper/30 transition hover:-translate-y-0.5 hover:bg-cream hover:text-ink"><Icon size={18} /></a>
            ))}
          </div>
        </div>
        <Col title="Explore" links={footer.explore} />
        <Col title="Services" links={footer.services} />
        <Col title="Legal" links={footer.legal} />
        <div>
          <h3 className="text-2xl font-semibold text-cream">Contact</h3>
          <ul className="mt-4 space-y-3 text-paper/80">
            <li className="flex gap-3"><Phone size={18} className="mt-1 shrink-0 text-sand" /><span className="flex flex-col"><a href={`tel:${brand.phone}`} className="hover:text-cream">{brand.phone}</a><a href={`tel:${brand.phone2}`} className="hover:text-cream">{brand.phone2}</a></span></li>
            <li className="flex gap-3"><Mail size={18} className="mt-1 shrink-0 text-sand" /><a href={`mailto:${brand.email}`} className="break-all hover:text-cream">{brand.email}</a></li>
            <li className="flex gap-3"><MapPin size={18} className="mt-1 shrink-0 text-sand" />{brand.address}</li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-16 max-w-7xl border-t border-paper/15 pt-6 text-sm text-paper/60">© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
    </footer>
  )
}
