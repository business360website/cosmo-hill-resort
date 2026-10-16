// Brand sequence: sand -> cream -> ivory (repeating). `tone` picks the background.
const tones = {
  sand: { bg: 'bg-sand text-ink', hex: '#D3A376' },
  cream: { bg: 'bg-cream text-ink', hex: '#FFE0B2' },
  ivory: { bg: 'bg-ivory text-ink', hex: '#FFF2DF' },
}

export default function Section({ id, tone, hills = true, className = '', children, label }) {
  const t = tones[tone]
  return (
    <section id={id} aria-label={label} className={`section ${t.bg} ${className}`}>
      {hills && (
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-10 w-full -translate-y-[calc(100%-1px)] sm:h-20">
          <path fill={t.hex} d="M0 120V72C150 30 260 92 430 58 600 22 720 88 900 52 1080 18 1260 76 1440 36V120Z" />
        </svg>
      )}
      <div className="wrap">{children}</div>
    </section>
  )
}

export function Heading({ eyebrow, title, text, center = false, className = '' }) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {eyebrow && <p className="mb-4 text-sm font-semibold opacity-80">{eyebrow}</p>}
      <h2 className="h2">{title}</h2>
      {text && <p className="mt-5 text-base leading-relaxed opacity-90 sm:text-lg">{text}</p>}
    </div>
  )
}
