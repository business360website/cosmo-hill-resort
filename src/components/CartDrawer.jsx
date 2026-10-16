import { useEffect } from 'react'
import { ShoppingCart, X } from 'lucide-react'
import { useCart } from '../lib/cart'
import CheckoutPanel from './CheckoutPanel'

// Slide-in cart (opened from the navbar cart icon). Same checkout as the booking page.
export default function CartDrawer() {
  const { cartOpen, closeCart } = useCart()

  useEffect(() => {
    if (!cartOpen) return
    const onKey = (e) => e.key === 'Escape' && closeCart()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [cartOpen, closeCart])

  const empty = (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
      <ShoppingCart size={44} className="text-cocoa" />
      <p className="mt-4 text-2xl font-semibold">Your cart is empty</p>
      <p className="mt-2 text-ink/70">Choose your dates and pick a room to book.</p>
      <a href="/book" onClick={closeCart} className="btn btn-dark mt-6">Book a Room</a>
    </div>
  )

  return (
    <div className={`fixed inset-0 z-[65] ${cartOpen ? 'visible' : 'invisible'}`} aria-hidden={!cartOpen}>
      <div onClick={closeCart} className={`absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0'}`} />
      <aside role="dialog" aria-modal="true" aria-label="Your booking cart"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory text-ink shadow-2xl transition-transform duration-300 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <header className="flex items-center justify-between border-b border-ink/15 px-6 py-4">
          <h2 className="flex items-center gap-2 text-3xl font-semibold"><ShoppingCart size={24} /> Your Cart</h2>
          <button onClick={closeCart} aria-label="Close cart" className="grid h-10 w-10 place-items-center rounded-full bg-ink/10 hover:bg-ink/20"><X size={20} /></button>
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <CheckoutPanel empty={empty} onDone={closeCart} onAddMore={closeCart} />
        </div>
      </aside>
    </div>
  )
}
