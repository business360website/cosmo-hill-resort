import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { rooms } from '../data/resortData'

export const MAX_GUESTS_PER_ROOM = 2 // guests in one room (the server enforces this too)
export const MAX_ITEMS = 8 // rooms in one cart (the server enforces this too)
const KEY = 'cosmo-hill-cart-v1'

export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN')
export const priceOf = (r) => Number(String(r.price).replace(/[^\d]/g, ''))
export const isoToday = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)
export const addDay = (d, n = 1) => { const t = new Date(d + 'T00:00:00Z'); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10) }
export const nightsBetween = (a, b) => (a && b ? Math.round((Date.parse(b) - Date.parse(a)) / 86400000) : 0)
export const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const CartCtx = createContext(null)
export const useCart = () => useContext(CartCtx)

// Restore the cart after a refresh; drop anything no longer valid (unknown room, past date).
function load() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]')
    return list.filter((i) => i.id && rooms.some((r) => r.id === i.roomId) && i.checkIn >= isoToday() && nightsBetween(i.checkIn, i.checkOut) > 0)
  } catch { return [] }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]) // restored after mount so the pre-rendered HTML matches
  const [ready, setReady] = useState(false)
  useEffect(() => { setItems(load()); setReady(true) }, [])
  const [cartOpen, setCartOpen] = useState(false)
  const [cfg, setCfg] = useState(null) // { enabled } from the payment server

  useEffect(() => { fetch('/api/config').then((r) => r.json()).then(setCfg).catch(() => setCfg({ enabled: false })) }, [])
  useEffect(() => { if (!ready) return; try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* storage unavailable */ } }, [items, ready])

  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])
  // Returns false when the cart is full.
  const addItem = useCallback((item) => {
    if (items.length >= MAX_ITEMS) return false
    setItems((list) => [...list, { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }])
    return true
  }, [items.length])
  const removeItem = useCallback((id) => setItems((list) => list.filter((i) => i.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(() => {
    const lines = items.map((it) => {
      const room = rooms.find((r) => r.id === it.roomId)
      const nights = nightsBetween(it.checkIn, it.checkOut)
      const perNight = priceOf(room)
      return { ...it, room, nights, days: nights + 1, perNight, amount: perNight * nights }
    })
    const total = lines.reduce((s, l) => s + l.amount, 0)
    // Full payment is collected online, so there is no advance or balance.
    return { items, lines, total, payNow: total, count: items.length, cfg, cartOpen, openCart, closeCart, addItem, removeItem, clear }
  }, [items, cfg, cartOpen, openCart, closeCart, addItem, removeItem, clear])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}
