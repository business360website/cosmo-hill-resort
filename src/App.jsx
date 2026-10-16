import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import PageHeader from './components/PageHeader'
import Hero from './components/Hero'
import About from './components/About'
import Rooms from './components/Rooms'
import Experiences from './components/Experiences'
import Places from './components/Places'
import Dining from './components/Dining'
import WhyChooseUs from './components/WhyChooseUs'
import MenuSection from './components/MenuSection'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Location from './components/Location'
import CTA from './components/CTA'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import BookingPage from './components/BookingPage'
import { CartProvider } from './lib/cart'
import ExperiencesExtra from './components/ExperiencesExtra'
import PartyHall from './components/PartyHall'
import FloatingContact from './components/FloatingContact'
import LegalPage from './components/LegalPage'
import GuidePage from './components/GuidePage'
import LocalGuides from './components/LocalGuides'
import NotFound from './components/NotFound'
import { legalPages } from './data/legalPages'
import { AboutStory, AboutOfferings, AboutPromise, AboutEnd } from './components/AboutExtra'
import { guides } from './data/guides'
import { routes, isRoute, headTags } from './data/seo'
import { NAV_EVENT, interceptLinks, scrollToHash } from './lib/router'

const header = (path) => <PageHeader eyebrow="Cosmo Hill Resort" title={routes[path].h1} text={routes[path].lead} />

// Every page has a real URL (/rooms, /places ...). seo.js holds each page's title, description and schema.
const pages = {
  '/': () => <><Hero /><About preview /><Rooms preview /><Experiences preview /><PartyHall tone="ivory" /><Dining preview /><MenuSection /><Places preview /><WhyChooseUs /><Gallery preview /><Testimonials /><Location /><CTA /></>,
  '/about': () => <>{header('/about')}<About /><AboutStory /><AboutOfferings /><AboutPromise /><WhyChooseUs /><AboutEnd /></>,
  '/book': () => <>{header('/book')}<BookingPage /></>,
  '/rooms': () => <>{header('/rooms')}<Rooms /></>,
  '/experiences': () => <>{header('/experiences')}<Experiences /><PartyHall tone="ivory" /><ExperiencesExtra /></>,
  '/places': () => <>{header('/places')}<Places /><LocalGuides tone="ivory" /></>,
  '/dining': () => <>{header('/dining')}<Dining /><MenuSection /></>,
  '/gallery': () => <>{header('/gallery')}<Gallery /></>,
  '/contact': () => <>{header('/contact')}<CTA /><Location /><LocalGuides /></>,
}
Object.keys(guides).forEach((r) => { pages[r] = () => <>{header(r)}<GuidePage path={r} /></> })
Object.entries(legalPages).forEach(([route, page]) => {
  pages[route] = () => <><PageHeader eyebrow="Cosmo Hill Resort" title={page.title} /><LegalPage page={page} /></>
})

// Cleans a URL path: no trailing slash, /menu lives on /dining.
export const normalizePath = (p) => {
  let x = (p || '/').replace(/\/+$/, '') || '/'
  if (x === '/menu') x = '/dining'
  return x
}
const currentPath = () => normalizePath(window.location.pathname)

function applyHead(path, is404) {
  const tpl = document.createElement('template')
  tpl.innerHTML = headTags(path, { is404 })
  document.head.querySelectorAll('[data-seo]').forEach((n) => n.remove())
  document.head.append(tpl.content)
}

export default function App({ initialPath }) {
  const [path, setPath] = useState(() => initialPath ?? currentPath())
  const known = isRoute(path)

  useEffect(() => {
    const onNav = () => {
      const next = currentPath()
      setPath(next)
      const hash = window.location.hash
      if (!hash || !scrollToHash(hash)) window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener(NAV_EVENT, onNav)
    window.addEventListener('popstate', onNav)
    document.addEventListener('click', interceptLinks)
    return () => { window.removeEventListener(NAV_EVENT, onNav); window.removeEventListener('popstate', onNav); document.removeEventListener('click', interceptLinks) }
  }, [])

  // Keep <title>, description, canonical, Open Graph and schema right when the guest moves between pages.
  useEffect(() => { applyHead(path, !known) }, [path, known])

  const Page = pages[path]
  return (
    <CartProvider>
      <div className="overflow-x-clip">
        <Navbar path={path} />
        <main key={path}>{known ? <Page /> : <NotFound />}</main>
        <Footer />
      </div>
      <CartDrawer />
      <FloatingContact />
    </CartProvider>
  )
}
