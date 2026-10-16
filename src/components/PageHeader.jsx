import { brand } from '../data/resortData'

// Banner shown at the top of every inner page (sits under the floating navbar).
export default function PageHeader({ eyebrow, title, text }) {
  return (
    <header className="relative overflow-hidden bg-ink px-5 pb-24 pt-36 text-paper sm:px-8 sm:pb-32 sm:pt-44">
      <img src={brand.logo} alt="" aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full object-cover opacity-[.07]" />
      <div className="wrap relative">
        <p className="text-sm font-semibold text-cream">{eyebrow} <span className="text-cream/60">·</span> <span className="text-cream/85">{brand.tagline}</span></p>
        <h1 className="mt-3 max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[1.05]">{title}</h1>
        {text && <p className="mt-4 max-w-2xl text-base text-paper/85 sm:text-lg">{text}</p>}
      </div>
    </header>
  )
}
