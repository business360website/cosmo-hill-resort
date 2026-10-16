import { useEffect, useRef, useState } from 'react'
import { BedDouble, CalendarDays, Check, ShoppingCart, Users } from 'lucide-react'
import Section from './Section'
import Icon from './icons'
import SmartImage from './SmartImage'
import CheckoutPanel from './CheckoutPanel'
import BookRoomModal from './BookRoomModal'
import { rooms } from '../data/resortData'
import { MAX_GUESTS_PER_ROOM, inr, priceOf, useCart } from '../lib/cart'

const preselected = () => (typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('room'))

// The room booking page: pick a room -> choose dates for it -> total -> add to cart -> guest details -> full payment.
export default function BookingPage() {
  const { items, count } = useCart()
  const focusId = preselected()
  const [openId, setOpenId] = useState(null) // room whose date panel is open (a ?room= link opens it after the page loads, so it matches the pre-rendered HTML)
  const [justAdded, setJustAdded] = useState(null)
  const summaryRef = useRef(null)
  const openRoom = rooms.find((r) => r.id === openId)

  useEffect(() => {
    if (!focusId) return
    setOpenId(focusId)
    const t = setTimeout(() => document.getElementById(`book-${focusId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250)
    return () => clearTimeout(t)
  }, [focusId])

  const added = (room) => {
    setJustAdded(room.id)
    setOpenId(null)
    setTimeout(() => setJustAdded((id) => (id === room.id ? null : id)), 2500)
    if (window.innerWidth < 1024) setTimeout(() => summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
  }

  const empty = (
    <div className="flex flex-col items-center px-8 py-14 text-center">
      <CalendarDays size={40} className="text-cocoa" />
      <p className="mt-4 text-2xl font-semibold">No room selected yet</p>
      <p className="mt-2 text-ink/70">Press <strong>Book This Room</strong> on the room you like, then choose your check-in and check-out dates.</p>
    </div>
  )

  return (
    <Section id="book" tone="ivory" hills={false} label="Room booking" className="!pt-12 sm:!pt-16">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_26rem]">
        <div>
          {/* Rooms (dates are asked inside the room you pick) */}
          <h2 className="mb-4 flex items-center gap-2.5 text-3xl font-semibold"><BedDouble size={28} className="shrink-0 text-cocoa" aria-hidden="true" /> Pick your room</h2>
          <ul className="space-y-5">
            {rooms.map((r) => {
              const inCart = items.filter((i) => i.roomId === r.id).length
              const perNight = priceOf(r)
              return (
                <li key={r.id} id={`book-${r.id}`} className={`overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-28px_rgba(43,29,24,.5)] transition ${focusId === r.id ? 'ring-2 ring-ink' : ''}`}>
                  <div className="grid sm:grid-cols-[14rem_1fr]">
                    <SmartImage src={r.image} alt={`${r.name} at Cosmo Hill Resort, Bandla`} className="h-52 w-full object-cover sm:h-full" />
                    <div className="flex flex-col p-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <h3 className="text-3xl font-semibold leading-tight">{r.name}</h3>
                        <p className="font-semibold text-cocoa">{inr(perNight)} / night</p>
                      </div>
                      <p className="mt-1 text-sm text-ink/75">{r.text}</p>
                      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                        {r.amenities.map((a) => <li key={a.label} className="flex items-center gap-1.5"><Icon name={a.icon} size={15} className="text-cocoa" />{a.label}</li>)}
                      </ul>

                      {(
                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                          <p className="flex items-center gap-1.5 text-sm font-semibold"><Users size={15} /> {MAX_GUESTS_PER_ROOM} guests</p>
                          <button type="button" onClick={() => { setOpenId(r.id) }} className="btn btn-dark !px-6">
                            {justAdded === r.id ? <><Check size={16} /> Added to cart</> : 'Book This Room'}
                          </button>
                        </div>
                      )}
                      {inCart > 0 && <p className="mt-3 text-xs text-forest">{inCart} × {r.name} in your booking. Press Book This Room again to add another.</p>}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Summary, details and payment */}
        <aside ref={summaryRef} aria-label="Booking summary" className="order-first scroll-mt-24 lg:sticky lg:top-28 lg:order-none">
          <div className="flex max-h-none flex-col overflow-hidden rounded-2xl bg-ivory shadow-[0_24px_50px_-26px_rgba(43,29,24,.6)] ring-1 ring-ink/10 lg:max-h-[calc(100vh-8rem)]">
            <h2 className="flex items-center gap-2.5 border-b border-ink/15 px-6 py-4 text-3xl font-semibold"><ShoppingCart size={28} className="shrink-0 text-cocoa" aria-hidden="true" /> Your booking{count > 0 ? ` (${count})` : ''}</h2>
            <CheckoutPanel empty={empty} />
          </div>
        </aside>
      </div>

      {openRoom && <BookRoomModal room={openRoom} onClose={() => setOpenId(null)} onAdded={added} />}
    </Section>
  )
}
