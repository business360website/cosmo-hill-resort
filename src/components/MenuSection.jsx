import MenuBook from './MenuBook'

// The flip-book menu lives on the Dining page.
export default function MenuSection() {
  return (
    <section id="menu" aria-label="Restaurant menu" className="relative overflow-x-clip bg-[radial-gradient(ellipse_at_50%_25%,#4a3326_0%,#2B1D18_55%,#170d09_100%)] px-3 pb-20 pt-20 text-paper sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-cream">Cosmo Hill Resort</p>
          <h2 className="mt-3 text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.05]">Our Menu</h2>
          <p className="mt-3 text-base text-paper/80 sm:text-lg">Open the book, turn the pages, and take your pick. Tap the cover to begin.</p>
        </div>
        <div className="mt-6"><MenuBook /></div>
      </div>
    </section>
  )
}
