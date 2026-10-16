import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { brand } from '../data/resortData'

export default function Hero() {
  const videoRef = useRef(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true // some browsers need the property set for autoplay
    v.play().catch(() => {})
  }, [])

  return (
    <section id="home" aria-label="Welcome" className="relative flex h-[100svh] min-h-[560px] items-end overflow-hidden bg-ink text-paper">
      {/* Phones/tablets: show the middle of the video. Wide desktop screens: anchored bottom-right so the logo baked into the video is not cropped. */}
      <video ref={videoRef} autoPlay muted loop playsInline preload="auto" poster="/assets/hero-poster.jpg" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center lg:object-[100%_100%]">
        <source src={brand.heroVideo} type="video/webm" />
      </video>

      {/* Light overlay: only enough shade behind the text and navbar */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-ink/30" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/10 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-28 pt-28 sm:px-8 sm:pb-28">
        <p className="animate-rise text-sm font-semibold text-cream [animation-delay:.2s]">{brand.tagline}</p>
        <h1 className="mt-3 max-w-3xl animate-rise text-[clamp(2.1rem,min(6vw,9vh),4.75rem)] font-semibold leading-[1.02] [animation-delay:.45s]">
          Escape to the Hills.<br /><span className="italic text-cream">Stay Above Ordinary.</span>
        </h1>
        <p className="mt-4 max-w-xl animate-rise text-base leading-relaxed text-paper/95 [animation-delay:.75s] sm:text-lg">
          A resort in Bandla, Bilaspur, Himachal Pradesh. Experience luxury, serenity and unforgettable moments surrounded by the beauty of the hills.
        </p>
        <div className="mt-6 flex animate-rise flex-col gap-3 [animation-delay:1s] sm:flex-row">
          <a href="/rooms" className="btn btn-solid">Explore Rooms</a>
          <a href="/book" className="btn btn-ghost text-paper">Book Your Stay</a>
        </div>
      </div>

      {/* Not clickable: just a gentle hint that the page continues */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-16 left-1/2 sm:bottom-24 lg:bottom-[6.5rem] z-10 flex -translate-x-1/2 select-none flex-col items-center gap-1 text-paper/90">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] drop-shadow">Discover more</span>
        <ChevronDown className="animate-drift drop-shadow" size={20} />
      </div>
    </section>
  )
}
