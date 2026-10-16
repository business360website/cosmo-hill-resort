import { useState } from 'react'
import { CheckCircle2, Lock, Plus, Trash2 } from 'lucide-react'
import { brand } from '../data/resortData'
import { indianStates } from '../data/indianStates'
import { fmtDate, inr, useCart } from '../lib/cart'
import { loadRazorpay, postJson } from '../lib/razorpay'

// Razorpay mark in its original colours (navy + blue), on a small white tile so it shows on the dark button.
const RazorpayMark = () => (
  <span aria-hidden="true" className="mx-0.5 inline-grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white">
    <svg viewBox="0 0 24 24" width="15" height="15"><path fill="#072654" d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L11.65 24h4.391l6.395-24z" /><path fill="#3395FF" d="M14.26 10.098L3.389 17.166 1.564 24h9.008l3.688-13.902Z" /></svg>
  </span>
)

export const ID_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card', hint: '12-digit Aadhaar number', ok: (v) => /^\d{12}$/.test(v.replace(/\s/g, '')) },
  { value: 'passport', label: 'Passport', hint: 'Passport number', ok: (v) => /^[A-Za-z0-9]{6,9}$/.test(v.trim()) },
  { value: 'license', label: 'Driving License', hint: 'Driving license number', ok: (v) => /^[A-Za-z0-9][A-Za-z0-9\s-]{7,19}$/.test(v.trim()) },
]

export const field = 'w-full rounded-xl border border-ink/20 bg-paper px-4 py-3 text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-cream'

// Rooms in the cart + guest details + one Razorpay payment for the full amount.
// Used on the booking page and inside the cart drawer.
export default function CheckoutPanel({ empty, onDone, onAddMore }) {
  const { lines, total, payNow, removeItem, clear } = useCart()
  const [g, setG] = useState({ name: '', phone: '', email: '', address: '', city: '', state: '', pincode: '', idType: '', idNumber: '' })
  const [status, setStatus] = useState('idle') // idle | paying | done
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false) // true after a pay attempt, so empty fields turn red
  const [receipt, setReceipt] = useState(null)
  const set = (k) => (e) => setG((p) => ({ ...p, [k]: e.target.value }))
  const idType = ID_TYPES.find((t) => t.value === g.idType)
  // Payment stays disabled until every detail is filled in correctly.
  const complete =
    g.name.trim().length >= 2 &&
    /^\d{10}$/.test(g.phone) &&
    /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(g.email.trim()) &&
    g.address.trim().length >= 5 &&
    g.city.trim().length >= 2 &&
    indianStates.includes(g.state) &&
    /^[1-9]\d{5}$/.test(g.pincode) &&
    Boolean(idType && idType.ok(g.idNumber))

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(g.email.trim())
  // Per-field message: shown in red once the guest taps Pay (or after typing something invalid).
  const errs = {
    name: g.name.trim().length < 2 ? (g.name.trim() ? 'Please enter your full name.' : 'Please fill this field.') : '',
    phone: g.phone.length !== 10 ? (g.phone ? 'Phone number must be exactly 10 digits.' : 'Please fill this field.') : '',
    email: !emailOk ? (g.email.trim() ? 'Please enter a valid email address.' : 'Please fill this field.') : '',
    address: g.address.trim().length < 5 ? (g.address.trim() ? 'Please enter your full address.' : 'Please fill this field.') : '',
    city: g.city.trim().length < 2 ? 'Please fill this field.' : '',
    state: !g.state ? 'Please select your state.' : '',
    pincode: !/^[1-9]\d{5}$/.test(g.pincode) ? (g.pincode ? 'Postal code must be 6 digits.' : 'Please fill this field.') : '',
    idType: !g.idType ? 'Please select an ID type.' : '',
    idNumber: idType && !idType.ok(g.idNumber) ? (g.idNumber.trim() ? `Please enter a valid ${idType.label.toLowerCase()} number.` : 'Please fill this field.') : '',
  }
  const show = (k) => (submitted && errs[k]) || (g[k] && errs[k]) // red + message
  const bad = (k) => (show(k) ? 'border-red-600 bg-red-50 focus:border-red-600 focus:ring-red-200' : '')
  const msg = (k) => show(k) && <span role="alert" className="mt-1 block text-xs font-normal text-red-700">{errs[k]}</span>

  const pay = async (e) => {
    e.preventDefault()
    setError('')
    if (!lines.length) return
    if (!complete) {
      setSubmitted(true)
      const first = ['name', 'phone', 'email', 'address', 'city', 'state', 'pincode', 'idType', 'idNumber'].find((k) => errs[k])
      setTimeout(() => document.querySelector(`[data-field="${first}"]`)?.focus(), 0)
      return
    }
    setStatus('paying')
    try {
      await loadRazorpay()
      const order = await postJson('/api/create-order', { ...g, items: lines.map(({ roomId, checkIn, checkOut, guests }) => ({ roomId, checkIn, checkOut, guests })) })
      const snapshot = { lines, guest: g, ...order.summary }
      const rzp = new window.Razorpay({
        key: order.keyId, order_id: order.orderId, amount: order.amount, currency: order.currency,
        name: brand.name,
        description: `${order.summary.rooms} room${order.summary.rooms > 1 ? 's' : ''} (full payment)`,
        image: window.location.origin + brand.logo,
        prefill: { name: g.name, email: g.email.trim(), contact: g.phone },
        theme: { color: '#2B1D18' },
        modal: { ondismiss: () => setStatus((s) => (s === 'paying' ? 'idle' : s)) },
        handler: async (resp) => {
          try {
            const v = await postJson('/api/verify-payment', resp)
            setReceipt({ ...snapshot, paymentId: v.paymentId })
            clear()
            setStatus('done')
          } catch {
            setError(`Payment received (ID: ${resp.razorpay_payment_id}) but we could not confirm it automatically. Please call us and share this ID.`)
            setStatus('idle')
          }
        },
      })
      rzp.on('payment.failed', (r) => { setError(r.error?.description || 'Payment failed. Please try again.'); setStatus('idle') })
      rzp.open()
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  if (status === 'done' && receipt) {
    return (
      <div className="px-6 py-10 text-center" role="status">
        <CheckCircle2 className="mx-auto text-forest" size={52} />
        <h3 className="mt-4 text-3xl font-semibold">Booking confirmed</h3>
        <p className="mt-2 text-ink/75">Thank you, {receipt.guest.name.split(' ')[0]}! We received your full payment of <strong>{inr(receipt.payNow)}</strong>.</p>
        <p className="mt-2 font-semibold text-ink">{brand.tagline}</p>
        <ul className="mt-5 space-y-2 text-left text-sm">
          {receipt.lines.map((l) => <li key={l.id} className="rounded-xl bg-cream/60 p-3"><strong>{l.room.name}</strong><br />{fmtDate(l.checkIn)} → {fmtDate(l.checkOut)} · {l.nights} night{l.nights > 1 ? 's' : ''} · {l.guests} guest{l.guests > 1 ? 's' : ''}</li>)}
        </ul>
        <p className="mt-4 text-sm text-ink/70">Payment ID: <span className="font-mono">{receipt.paymentId}</span></p>
        <p className="mt-2 text-sm text-ink/70">Our team will contact you on {receipt.guest.phone} shortly.</p>
        <button onClick={() => { setReceipt(null); setStatus('idle'); onDone?.() }} className="btn btn-dark mt-6">Done</button>
      </div>
    )
  }

  if (!lines.length) return empty

  return (
    <form onSubmit={pay} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
        <ul className="space-y-3">
          {lines.map((l) => (
            <li key={l.id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xl font-semibold leading-tight">{l.room.name}</p>
                  <p className="mt-1 text-sm text-ink/75">{fmtDate(l.checkIn)} → {fmtDate(l.checkOut)}</p>
                  <p className="text-sm text-ink/75">{l.nights} night{l.nights > 1 ? 's' : ''} / {l.days} days · {l.guests} guest{l.guests > 1 ? 's' : ''}</p>
                </div>
                <button type="button" onClick={() => removeItem(l.id)} aria-label={`Remove ${l.room.name}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink/60 hover:bg-red-100 hover:text-red-700"><Trash2 size={18} /></button>
              </div>
              <p className="mt-2 flex justify-between border-t border-ink/10 pt-2 text-sm"><span>{inr(l.perNight)} × {l.nights} night{l.nights > 1 ? 's' : ''}</span><strong>{inr(l.amount)}</strong></p>
            </li>
          ))}
        </ul>
        {onAddMore && <a href="/book" onClick={onAddMore} className="btn w-full border border-ink/30 hover:bg-ink hover:text-cream"><Plus size={16} /> Add another room</a>}

        <div>
          <h3 className="text-2xl font-semibold">Guest details</h3>
          <div className="mt-3 grid gap-3">
            <label className="text-sm font-semibold">Full name<input data-field="name" aria-invalid={Boolean(show('name'))} type="text" value={g.name} onChange={set('name')} autoComplete="name" className={`${field} mt-1.5 font-normal ${bad('name')}`} />{msg('name')}</label>
            <label className="text-sm font-semibold">Phone
              <input data-field="phone" aria-invalid={Boolean(show('phone'))} type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" value={g.phone} onChange={(e) => setG((p) => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} autoComplete="tel-national" className={`${field} mt-1.5 font-normal ${bad('phone')}`} />
              {msg('phone')}
            </label>
            <label className="text-sm font-semibold">Email
              <input data-field="email" aria-invalid={Boolean(show('email'))} type="email" placeholder="name@example.com" value={g.email} onChange={set('email')} autoComplete="email" className={`${field} mt-1.5 font-normal ${bad('email')}`} />
              {msg('email')}
            </label>
            <label className="text-sm font-semibold">Address
              <input data-field="address" aria-invalid={Boolean(show('address'))} type="text" value={g.address} onChange={set('address')} autoComplete="street-address" maxLength={120} placeholder="House / street / area" className={`${field} mt-1.5 font-normal ${bad('address')}`} />
              {msg('address')}
            </label>
            <label className="text-sm font-semibold">City
              <input data-field="city" aria-invalid={Boolean(show('city'))} type="text" value={g.city} onChange={set('city')} autoComplete="address-level2" maxLength={50} className={`${field} mt-1.5 font-normal ${bad('city')}`} />
              {msg('city')}
            </label>
            <label className="text-sm font-semibold">State
              <select data-field="state" aria-invalid={Boolean(show('state'))} value={g.state} onChange={set('state')} autoComplete="address-level1" className={`${field} mt-1.5 font-normal ${bad('state')}`}>
                <option value="">Select state</option>
                {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {msg('state')}
            </label>
            <label className="text-sm font-semibold">Postal code
              <input data-field="pincode" aria-invalid={Boolean(show('pincode'))} type="text" inputMode="numeric" maxLength={6} placeholder="6-digit PIN code" value={g.pincode} onChange={(e) => setG((p) => ({ ...p, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))} autoComplete="postal-code" className={`${field} mt-1.5 font-normal ${bad('pincode')}`} />
              {msg('pincode')}
            </label>
            <label className="text-sm font-semibold">ID proof
              <select data-field="idType" aria-invalid={Boolean(show('idType'))} value={g.idType} onChange={(e) => setG((p) => ({ ...p, idType: e.target.value, idNumber: '' }))} className={`${field} mt-1.5 font-normal ${bad('idType')}`}>
                <option value="">Select ID type</option>
                {ID_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              {msg('idType')}
            </label>
            {idType && (
              <label className="text-sm font-semibold">{idType.label} number
                <input data-field="idNumber" aria-invalid={Boolean(show('idNumber'))} type="text" value={g.idNumber} onChange={set('idNumber')} placeholder={idType.hint} autoComplete="off" maxLength={20} className={`${field} mt-1.5 font-normal ${g.idType !== 'aadhaar' ? 'uppercase' : ''} ${bad('idNumber')}`} />
                {msg('idNumber')}
              </label>
            )}
          </div>
        </div>
        {error && <p role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-900">{error}</p>}
      </div>

      <footer className="border-t border-ink/15 bg-ivory px-6 py-4">
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between"><dt>Stay total ({lines.length} room{lines.length > 1 ? 's' : ''})</dt><dd className="font-semibold">{inr(total)}</dd></div>
          <div className="flex justify-between pt-1 text-lg"><dt className="font-semibold">Pay now (full payment)</dt><dd className="font-semibold">{inr(payNow)}</dd></div>
        </dl>
        <button type="submit" disabled={status === 'paying'} className="btn btn-dark mt-3 w-full disabled:cursor-not-allowed disabled:opacity-60">
          <Lock size={16} />{status === 'paying' ? 'Opening secure payment…' : <>Pay {inr(payNow)} with <RazorpayMark /> Razorpay</>}
        </button>
        {!complete && <p className={`mt-2 text-center text-xs ${submitted ? 'font-semibold text-red-700' : 'text-ink/60'}`}>{submitted ? 'Please fill in the fields marked in red.' : 'Fill in your name, phone, email, address and ID proof to pay.'}</p>}
        <p className="mt-2 text-center text-xs text-ink/60">Secure payment · UPI, cards, net banking &amp; wallets</p>
      </footer>
    </form>
  )
}
