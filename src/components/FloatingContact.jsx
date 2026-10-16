import { Phone } from 'lucide-react'
import { brand } from '../data/resortData'

const digits = (s) => s.replace(/\D/g, '')

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M16.04 3C9.4 3 4 8.38 4 15.02c0 2.12.56 4.19 1.62 6.01L4 29l8.17-1.58a12.03 12.03 0 0 0 3.87.64C22.68 28.06 28 22.66 28 16.02 28 9.38 22.68 3 16.04 3Zm0 22.03c-1.2 0-2.38-.25-3.47-.74l-.5-.22-4.85.94.99-4.72-.27-.52a9.9 9.9 0 0 1-1.5-5.25c0-5.5 4.5-9.97 10.03-9.97 5.53 0 10.03 4.47 10.03 9.97 0 5.5-4.5 10.51-9.46 10.51Zm5.5-7.4c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.52-.07-.15-.68-1.63-.93-2.24-.25-.58-.5-.5-.68-.5h-.58c-.2 0-.52.07-.8.38-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.1 3.2 5.08 4.5.7.3 1.26.48 1.7.62.72.23 1.37.2 1.88.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35Z" />
  </svg>
)

// Always-visible call + WhatsApp buttons (bottom right).
export default function FloatingContact() {
  const msg = encodeURIComponent(`Hello ${brand.name}, I would like to know more about booking.`)
  return (
    <div className="fixed bottom-5 right-4 z-[45] flex flex-col gap-3 sm:bottom-6 sm:right-6" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <a href={`https://wa.me/${digits(brand.phone)}?text=${msg}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_-8px_rgba(0,0,0,.55)] transition hover:scale-105 active:scale-95">
        <WhatsAppIcon />
      </a>
      <a href={`tel:${brand.phone}`} aria-label={`Call ${brand.phone}`}
        className="grid h-14 w-14 place-items-center rounded-full bg-ink text-cream shadow-[0_10px_25px_-8px_rgba(0,0,0,.55)] ring-1 ring-cream/30 transition hover:scale-105 active:scale-95">
        <Phone size={24} />
      </a>
    </div>
  )
}
