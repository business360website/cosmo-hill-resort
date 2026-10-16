import { useEffect, useState } from 'react'
import { ShoppingCart, Users, X } from 'lucide-react'
import SmartImage from './SmartImage'
import { field } from './CheckoutPanel'
import { brand } from '../data/resortData'
import { MAX_GUESTS_PER_ROOM, MAX_ITEMS, addDay, fmtDate, inr, isoToday, nightsBetween, priceOf, useCart } from '../lib/cart'

// Popup used everywhere "Book Now" / "Book This Room" is pressed:
// asks check-in / check-out, shows the total, and adds the room to the cart.
export default function BookRoomModal({ room, onClose, onAdded }) {
  const { addItem } = useCart()
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' })
  const [note, setNote] = useState('')
  const today = isoToday()
  const perNight = priceOf(room)
  const nights = nightsBetween(dates.checkIn, dates.checkOut)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])

  const setDate = (k) => (e) => setDates((p) => {
    const next = { ...p, [k]: e.target.value }
    if (k === 'checkIn' && next.checkOut && next.checkOut <= next.checkIn) next.checkOut = ''
    return next
  })

  const add = () => {
    setNote('')
    if (nights < 1) return setNote('Please select your check-in and check-out dates.')
    const ok = addItem({ roomId: room.id, checkIn: dates.checkIn, checkOut: dates.checkOut, guests: MAX_GUESTS_PER_ROOM })
    if (!ok) return setNote(`You can book up to ${MAX_ITEMS} rooms online. Please call ${brand.phone} for larger groups.`)
    onAdded?.(room)
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={`Book ${room.name}`} className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white text-ink shadow-2xl">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow hover:bg-white"><X size={20} /></button>
        <SmartImage src={room.image} alt={room.name} className="h-40 w-full object-cover" />
        <div className="p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-3xl font-semibold leading-tight">{room.name}</h3>
            <p className="font-semibold text-cocoa">{inr(perNight)} / night</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold">Check-in<input type="date" min={today} value={dates.checkIn} onChange={setDate('checkIn')} className={`${field} mt-1.5 font-normal`} /></label>
            <label className="text-sm font-semibold">Check-out<input type="date" min={dates.checkIn ? addDay(dates.checkIn) : addDay(today)} value={dates.checkOut} onChange={setDate('checkOut')} className={`${field} mt-1.5 font-normal`} /></label>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-ink/75"><Users size={14} /> {MAX_GUESTS_PER_ROOM} guests</p>

          {nights > 0 ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
              <div className="text-sm leading-snug text-ink/75">
                {fmtDate(dates.checkIn)} → {fmtDate(dates.checkOut)}<br />
                {inr(perNight)} × {nights} night{nights > 1 ? 's' : ''} / {nights + 1} days
              </div>
              <p className="text-right text-sm text-ink/70">Total<br /><strong className="text-2xl text-ink">{inr(perNight * nights)}</strong></p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink/60">Select check-in and check-out to see the total for your stay.</p>
          )}

          {note && <p role="alert" className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-900">{note}</p>}
          <button type="button" onClick={add} className="btn btn-dark mt-5 w-full"><ShoppingCart size={17} /> Add to Cart</button>
          <p className="mt-2 text-center text-xs text-ink/55">Full payment is taken online to confirm your booking.</p>
        </div>
      </div>
    </div>
  )
}
