import { useEffect, useState } from 'react'
import { Phone, X } from 'lucide-react'
import Section, { Heading } from './Section'
import Reveal from './Reveal'
import Icon from './icons'
import SmartImage from './SmartImage'
import ViewMore from './ViewMore'
import BookRoomModal from './BookRoomModal'
import { brand, rooms } from '../data/resortData'

function RoomModal({ room, onClose, onBook }) {
  const [shot, setShot] = useState(0)
  const photos = room.gallery?.length ? room.gallery : [room.image]
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [onClose])
  return (
    <div role="dialog" aria-modal="true" aria-label={room.name} onClick={onClose} className="fixed inset-0 z-[60] grid animate-fadeIn place-items-center bg-ink/80 p-4 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="relative grid max-h-[92dvh] w-full max-w-5xl grid-cols-[minmax(0,1fr)] overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl bg-ivory text-ink shadow-2xl md:grid-cols-2">
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-ink/70 text-cream hover:bg-ink"><X size={20} /></button>
        <div className="flex min-w-0 flex-col bg-ink/5">
          <SmartImage src={photos[shot]} alt={`${room.name} at Cosmo Hill Resort, Bandla: photo ${shot + 1}`} className="h-72 w-full object-cover md:h-[30rem]" />
          {photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto overscroll-x-contain p-2">
              {photos.map((p, i) => (
                <button key={p} type="button" onClick={() => setShot(i)} aria-label={`Show photo ${i + 1}`} className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${i === shot ? 'border-ink' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <img src={p} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="min-w-0 p-6 sm:p-8">
          <h3 className="text-4xl font-semibold">{room.name}</h3>
          <p className="mt-1 font-semibold text-cocoa">{room.price} / night · up to 2 guests</p>
          {(room.size || room.bed) && <p className="mt-1 text-sm text-ink/70">{[room.size && `Room size ${room.size}`, room.bed].filter(Boolean).join(' · ')}</p>}
          {room.details.map((d) => <p key={d} className="mt-4 text-ink/80">{d}</p>)}
          <ul className="mt-5 grid grid-cols-2 gap-3 text-sm">
            {room.amenities.map((a) => <li key={a.label} className="flex items-center gap-2"><Icon name={a.icon} size={16} className="text-cocoa" />{a.label}</li>)}
          </ul>
          {room.bathroom && <><h4 className="mt-6 text-xl font-semibold">In your private bathroom</h4><p className="mt-1 text-sm text-ink/80">{room.bathroom.join(' · ')}</p></>}
          {room.facilities && <><h4 className="mt-5 text-xl font-semibold">Room facilities</h4><ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-ink/80 sm:grid-cols-2">{room.facilities.map((f) => <li key={f} className="flex items-start gap-1.5"><span className="text-forest">✓</span>{f}</li>)}</ul></>}
          <button type="button" onClick={() => onBook(room)} className="btn btn-dark mt-7 w-full">Book Now</button>
          <a href={`tel:${brand.phone}`} className="btn mt-3 w-full border border-ink/40 hover:bg-ink hover:text-cream"><Phone size={16} /> Call {brand.phone}</a>
        </div>
      </div>
    </div>
  )
}

export default function Rooms({ preview = false }) {
  const [open, setOpen] = useState(null)
  const [booking, setBooking] = useState(null)
  // After Add to Cart, go straight to the Your Booking page.
  const goToBooking = () => { setBooking(null); navigate('/book') }
  return (
    <Section id="rooms" tone="ivory" label="Rooms and suites">
      <Heading eyebrow="Rooms & Suites" title="Stay in Comfort. Wake Up to the Hills." text="Five room categories, from pool-facing Deluxe Double Rooms to hill-facing Luxury rooms with a private mini bar." />
      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-6">
        {(preview ? rooms.filter((r) => r.image).slice(0, 3) : rooms).map((r, i) => (
          <Reveal as="article" key={r.id} delay={(i % 3) * 120}
            className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-24px_rgba(43,29,24,.5)] !transition-[transform,box-shadow,opacity] duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-24px_rgba(43,29,24,.6)] ${r.span} ${i === 4 ? 'md:col-span-2 md:mx-auto md:max-w-xl lg:col-span-3 lg:max-w-none' : ''}`}>
            <div className="relative overflow-hidden">
              <SmartImage src={r.image} alt={`${r.name} at Cosmo Hill Resort, Bandla`} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-4 py-1.5 text-sm font-semibold text-cream backdrop-blur">{r.price} / night</span>
              {r.gallery?.length > 1 && <span className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-3 py-1.5 text-xs font-semibold text-cream backdrop-blur">{r.gallery.length} photos</span>}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-3xl font-semibold">{r.name}</h3>
              <p className="mt-2 text-ink/75">{r.text}</p>
              <ul className="mt-5 grid grid-cols-2 gap-3 text-sm">
                {r.amenities.map((a) => <li key={a.label} className="flex items-center gap-2"><Icon name={a.icon} size={16} className="text-cocoa" />{a.label}</li>)}
              </ul>
              <div className="mt-auto flex gap-3 pt-7">
                <button onClick={() => setOpen(r)} className="btn flex-1 border border-ink/30 !px-4 hover:bg-ink hover:text-cream">View Details</button>
                <button onClick={() => setBooking(r)} className="btn btn-dark flex-1 !px-4">Book Now</button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      {preview && <ViewMore href="/rooms" label="View All Rooms" />}
      {open && <RoomModal room={open} onClose={() => setOpen(null)} onBook={(room) => { setOpen(null); setBooking(room) }} />}
      {booking && <BookRoomModal room={booking} onClose={() => setBooking(null)} onAdded={goToBooking} />}
    </Section>
  )
}
