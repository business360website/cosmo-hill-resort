import { Phone, ShoppingCart } from 'lucide-react'
import Section from './Section'
import Reveal from './Reveal'
import { brand } from '../data/resortData'
import { fmtDate, inr, useCart } from '../lib/cart'

export default function CTA() {
  const { lines, total, payNow, count, openCart } = useCart()
  return (
    <Section id="contact" tone="sand" label="Book your stay">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="mb-3 text-sm font-semibold text-ink/70">{brand.tagline}</p>
          <h2 className="h2 max-w-xl">Your Escape to the Hills Starts Here.</h2>
          <p className="mt-6 max-w-lg text-lg text-ink/85">Leave the ordinary behind and discover a stay designed around nature, comfort and unforgettable experiences.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="/book" className="btn btn-dark">Book Your Room</a>
            <button type="button" onClick={() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-ghost !border-ink/60 text-ink hover:!bg-ink/10">Contact Us</button>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div id="booking-form" className="rounded-2xl bg-ivory p-6 text-ink shadow-2xl sm:p-8">
            <h3 className="flex items-center gap-2 text-3xl font-semibold"><ShoppingCart size={26} /> Your booking</h3>
            {count === 0 ? (
              <>
                <p className="mt-3 text-ink/75">Pick a room, choose your check-in and check-out dates and pay securely online.</p>
                <a href="/book" className="btn btn-dark mt-6 w-full">Book Now</a>
              </>
            ) : (
              <>
                <ul className="mt-4 space-y-2 text-sm">
                  {lines.map((l) => (
                    <li key={l.id} className="flex justify-between gap-3 rounded-xl bg-cream/60 p-3">
                      <span><strong>{l.room.name}</strong><br />{fmtDate(l.checkIn)} → {fmtDate(l.checkOut)} · {l.nights} night{l.nights > 1 ? 's' : ''}</span>
                      <strong className="shrink-0">{inr(l.amount)}</strong>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 flex justify-between text-lg"><span className="font-semibold">Pay now (full payment)</span><strong>{inr(payNow)}</strong></p>
                <p className="text-sm text-ink/60">Stay total {inr(total)}</p>
                <button type="button" onClick={openCart} className="btn btn-dark mt-5 w-full">View booking &amp; pay</button>
              </>
            )}
            <div className="mt-6 border-t border-ink/15 pt-5">
              <p className="text-center text-sm font-semibold text-ink/70">Prefer to talk? Call us directly</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[brand.phone, brand.phone2].map((n) => (
                  <a key={n} href={`tel:${n}`} className="btn border border-ink/30 !px-4 hover:bg-ink hover:text-cream"><Phone size={16} />{n}</a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
