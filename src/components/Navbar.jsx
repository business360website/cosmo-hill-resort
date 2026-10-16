import { useEffect, useState } from 'react'
import { Menu, ShoppingCart, X } from 'lucide-react'
import { useCart } from '../lib/cart'
import { brand, navLinks } from '../data/resortData'

export default function Navbar({ path = '/' }) {
  const isActive = (href) => href === path
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { count, openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      {/* Floating glass pill */}
      <nav aria-label="Main"
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border py-2.5 pl-3 pr-3 backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 sm:py-3 sm:pl-4 sm:pr-4 ${scrolled || open ? 'border-white/25 bg-ink/55 shadow-[0_10px_40px_-10px_rgba(0,0,0,.5)]' : 'border-white/35 bg-white/10 shadow-[0_8px_30px_-12px_rgba(0,0,0,.4)]'}`}>
        <a href="/" className="flex items-center gap-3 text-paper" aria-label={`${brand.name} home`}>
          <img src={brand.logo} alt="" width="56" height="56" className="h-12 w-12 rounded-full sm:h-14 sm:w-14 rounded-full bg-paper object-cover" />
          <span className="hidden font-display text-xl font-semibold leading-none sm:block">The Cosmo Hill<br />Resort</span>
        </a>

        {/* Mobile only: Relax -> Refresh -> Rejuvenate, one at a time (2s each), fade in/out, loops forever */}
        <div aria-hidden="true" className="relative mx-2 grid min-w-0 flex-1 place-items-center sm:hidden">
          {['Relax', 'Refresh', 'Rejuvenate'].map((w, i) => (
            <span key={w} style={{ animationDelay: `${i * 2}s` }}
              className="nav-word col-start-1 row-start-1 font-display text-[1.05rem] font-semibold tracking-wide text-cream opacity-0">{w}</span>
          ))}
        </div>

        <ul className="hidden items-center gap-0.5 xl:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} aria-current={isActive(l.href) ? 'page' : undefined} className={`rounded-full px-3.5 py-2.5 text-base font-medium transition-all duration-300 hover:bg-white/20 hover:text-cream ${isActive(l.href) ? 'bg-white/25 text-cream' : 'text-paper/95'}`}>{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button onClick={openCart} aria-label={`Open cart, ${count} room${count === 1 ? '' : 's'}`} className="relative grid h-12 w-12 place-items-center rounded-full border border-white/35 bg-white/10 text-paper transition hover:bg-white/20">
            <ShoppingCart size={21} />
            {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-cream px-1 text-xs font-bold text-ink">{count}</span>}
          </button>
          <a href="/book" className="btn btn-solid hidden !px-7 !py-3 !text-base sm:inline-flex">Your Bookings</a>
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-12 w-12 place-items-center rounded-full border border-white/35 bg-white/10 text-paper xl:hidden">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu: sized to the visible screen (dvh), links scroll if the screen is very short, Book Now always stays visible */}
      <div id="mobile-menu"
        className={`fixed inset-x-3 top-[88px] z-40 flex h-[calc(100dvh-100px)] flex-col rounded-3xl border border-white/25 bg-ink/80 px-6 pb-5 pt-3 backdrop-blur-2xl transition-all duration-500 sm:px-7 xl:hidden ${open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'}`}>
        <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navLinks.map((l, i) => (
            <li key={l.href} style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
              className={`transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <a href={l.href} onClick={() => setOpen(false)} className={`block border-b border-paper/10 py-[clamp(.25rem,1.5vh,.8rem)] font-display text-[clamp(1.35rem,3.9vh,1.95rem)] leading-tight hover:text-cream ${isActive(l.href) ? 'text-cream' : 'text-paper'}`}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a href="/book" onClick={() => setOpen(false)} className="btn btn-solid mt-4 w-full shrink-0 !py-3.5 !text-base">Your Bookings</a>
      </div>
    </header>
  )
}
