import 'dotenv/config'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import compression from 'compression'
import Razorpay from 'razorpay'
import { rooms, brand } from '../src/data/resortData.js'
import { indianStates } from '../src/data/indianStates.js'
import { sendBookingEmails, verifyMail } from './mailer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET } = process.env
const PORT = process.env.PORT || 5000
const MAX_NIGHTS = 30
const MAX_ITEMS = 8 // rooms per booking (Razorpay allows 15 notes: 7 guest/payment notes + 1 per room)
const MAX_GUESTS_PER_ROOM = 2 // 2 guests per room

// Prices are read here on the server, so the browser can never change the amount.
const priceOf = (room) => Number(String(room.price).replace(/[^\d]/g, ''))
const roomById = Object.fromEntries(rooms.map((r) => [r.id, r]))

const razorpay = RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
  : null

const app = express()
app.use('/api', (_req, res, next) => { res.set('X-Robots-Tag', 'noindex'); next() }) // API responses are never for search engines
app.use('/api/webhook', express.raw({ type: '*/*' })) // raw body is needed to check the webhook signature
app.use(express.json({ limit: '10kb' }))

const BOOKINGS_FILE = path.join(__dirname, 'bookings.jsonl')
const saveBooking = (record) => {
  fs.appendFile(BOOKINGS_FILE, JSON.stringify(record) + '\n', () => {})
  sendBookingEmails(record) // hotel alert + guest confirmation (skipped if email is not configured)
}

const nightsBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000)
const safeEqual = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y) }

const dateOk = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d || '') && !Number.isNaN(Date.parse(d))

// Checks the guest details and every room in the cart, and works out the real amount.
function validate(b = {}) {
  const g = b.guest || b // guest details can be nested or sent at the top level
  const name = String(g.name || '').trim()
  const email = String(g.email || '').trim()
  const phone = String(g.phone || '').trim()
  if (name.length < 2 || name.length > 80) return { error: 'Please enter your full name.' }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) return { error: 'Please enter a valid email address.' }
  if (!/^\d{10}$/.test(phone)) return { error: 'Phone number must be exactly 10 digits.' }

  const street = String(g.address || '').trim().replace(/\s+/g, ' ')
  const city = String(g.city || '').trim().replace(/\s+/g, ' ')
  const state = String(g.state || '').trim()
  const pincode = String(g.pincode || '').trim()
  if (street.length < 5 || street.length > 120) return { error: 'Please enter your full address.' }
  if (city.length < 2 || city.length > 50) return { error: 'Please enter your city.' }
  if (!indianStates.includes(state)) return { error: 'Please select your state.' }
  if (!/^[1-9]\d{5}$/.test(pincode)) return { error: 'Postal code must be 6 digits.' }
  const address = `${street}, ${city}, ${state} - ${pincode}`

  const idType = String(g.idType || '')
  const idNumber = String(g.idNumber || '').replace(/[\s-]/g, '')
  const idRules = { aadhaar: /^\d{12}$/, passport: /^[A-Za-z0-9]{6,9}$/, license: /^[A-Za-z0-9]{8,18}$/ }
  if (!idRules[idType]) return { error: 'Please select an ID proof (Aadhaar, Passport or Driving License).' }
  if (!idRules[idType].test(idNumber)) return { error: 'Please enter a valid ID number.' }
  const idLabel = { aadhaar: 'Aadhaar Card', passport: 'Passport', license: 'Driving License' }[idType]
  const idFull = idNumber.toUpperCase() // full ID number goes to the hotel (Razorpay notes + hotel email)

  const items = Array.isArray(b.items) ? b.items : []
  if (!items.length) return { error: 'Your cart is empty.' }
  if (items.length > MAX_ITEMS) return { error: `You can book up to ${MAX_ITEMS} rooms online. Please call us for larger groups.` }

  const today = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10) // today in India
  const lines = []
  for (const [i, it] of items.entries()) {
    const label = `Room ${i + 1}: `
    const room = roomById[it?.roomId]
    const guests = MAX_GUESTS_PER_ROOM // always 2 guests per room, whatever the browser sends
    if (!room) return { error: label + 'this room is not available.' }
    if (!dateOk(it.checkIn) || !dateOk(it.checkOut)) return { error: label + 'please select valid dates.' }
    if (it.checkIn < today) return { error: label + 'check-in cannot be in the past. Please remove it and add the room again.' }
    const nights = nightsBetween(it.checkIn, it.checkOut)
    if (nights < 1) return { error: label + 'check-out must be after check-in.' }
    if (nights > MAX_NIGHTS) return { error: label + `online booking supports up to ${MAX_NIGHTS} nights. Please call us for longer stays.` }
    if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS_PER_ROOM) return { error: label + `please select 1 to ${MAX_GUESTS_PER_ROOM} guests.` }
    lines.push({ room, checkIn: it.checkIn, checkOut: it.checkOut, nights, guests, amount: priceOf(room) * nights })
  }
  const total = lines.reduce((sum, l) => sum + l.amount, 0)
  const payNow = total // full payment, no advance
  return { name, email, phone, address, idLabel, idFull, lines, total, payNow }
}

// Public settings the booking form needs.
app.get('/api/config', (_req, res) => {
  res.json({ enabled: Boolean(razorpay), keyId: RAZORPAY_KEY_ID || null, maxNights: MAX_NIGHTS, maxItems: MAX_ITEMS, maxGuestsPerRoom: MAX_GUESTS_PER_ROOM })
})

// Step 1: create a Razorpay order for the full stay amount.
app.post('/api/create-order', async (req, res) => {
  if (!razorpay) return res.status(503).json({ error: 'Online payment is not available right now. Please call us to book.' })
  const v = validate(req.body)
  if (v.error) return res.status(400).json({ error: v.error })
  try {
    const notes = { guest: v.name, phone: v.phone, email: v.email, address: v.address, id_proof: `${v.idLabel}: ${v.idFull}`, stay_total: `INR ${v.total}`, paid_now: `INR ${v.payNow}` }
    v.lines.forEach((l, i) => { notes[`room_${i + 1}`] = `${l.room.name} | ${l.checkIn} to ${l.checkOut} | ${l.nights} night(s) | ${l.guests} guest(s) | INR ${l.amount}` })
    const order = await razorpay.orders.create({ amount: v.payNow * 100, currency: 'INR', receipt: `CH-${Date.now()}`, notes }) // amount in paise
    res.json({
      keyId: RAZORPAY_KEY_ID, orderId: order.id, amount: order.amount, currency: order.currency,
      summary: { rooms: v.lines.length, total: v.total, payNow: v.payNow },
    })
  } catch (err) {
    console.error('Razorpay order error:', err?.error?.description || err.message)
    res.status(502).json({ error: 'Could not start the payment. Please try again or call us.' })
  }
})

// Step 2: after the guest pays, check Razorpay's signature so the payment cannot be faked.
app.post('/api/verify-payment', async (req, res) => {
  if (!razorpay) return res.status(503).json({ error: 'Online payment is not available.' })
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body || {}
  if (!orderId || !paymentId || !signature) return res.status(400).json({ error: 'Missing payment details.' })
  const expected = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex')
  if (!safeEqual(expected, signature)) return res.status(400).json({ error: 'Payment could not be verified.' })
  let notes = {}
  try { notes = (await razorpay.orders.fetch(orderId)).notes || {} } catch { /* booking details are also in the Razorpay dashboard */ }
  saveBooking({ at: new Date().toISOString(), source: 'verify', orderId, paymentId, ...notes })
  res.json({ ok: true, paymentId, orderId })
})

// Optional safety net: Razorpay calls this even if the guest closes the tab right after paying.
app.post('/api/webhook', (req, res) => {
  if (!RAZORPAY_WEBHOOK_SECRET) return res.status(204).end()
  const sig = req.get('x-razorpay-signature') || ''
  const expected = crypto.createHmac('sha256', RAZORPAY_WEBHOOK_SECRET).update(req.body).digest('hex')
  if (!safeEqual(expected, sig)) { console.error('❌ Webhook signature FAILED (check RAZORPAY_WEBHOOK_SECRET)'); return res.status(400).end() }
  try {
    const event = JSON.parse(req.body.toString('utf8'))
    console.log(`✅ Webhook verified (${event.event})`)
    if (event.event === 'payment.captured') {
      const p = event.payload.payment.entity
      saveBooking({ at: new Date().toISOString(), source: 'webhook', orderId: p.order_id, paymentId: p.id, amount: p.amount / 100, ...(p.notes || {}) })
    }
  } catch (e) { console.error('Webhook parse error', e.message) }
  res.json({ received: true })
})

// In production the same server also serves the built website.
// Every page is pre-rendered to dist/<page>.html by `npm run build`, so /rooms is served from dist/rooms.html.
const dist = path.join(__dirname, '..', 'dist')
if (fs.existsSync(dist)) {
  const SITE = new URL(process.env.SITE_URL || 'https://thecosmohillresort.com')
  app.set('trust proxy', true)
  app.use(compression()) // gzip HTML, JS, CSS and JSON (images/video are already compressed and are skipped)

  // One address per page: https + the non-www host, no trailing slash, no /index.html. (Only touches the real domain, never a preview URL.)
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    const host = (req.hostname || '').toLowerCase()
    const onSite = host === SITE.hostname || host === 'www.' + SITE.hostname
    const insecure = process.env.NODE_ENV === 'production' && SITE.protocol === 'https:' && req.protocol !== 'https'
    let p = req.path
    if (p === '/index.html' || p === '/index') p = '/'
    else if (p === '/menu') p = '/dining'
    else if (p.length > 1 && p.endsWith('/')) p = p.replace(/\/+$/, '')
    const q = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
    if (onSite && (host !== SITE.hostname || insecure)) return res.redirect(301, SITE.origin + p + q)
    if (p !== req.path) return res.redirect(301, p + q)
    next()
  })

  // Long cache for images/menu pages and hashed build files so they are not downloaded again on every visit.
  app.use(express.static(dist, {
    extensions: ['html'], redirect: false,
    setHeaders: (res, file) => {
      if (/[\\/]assets[\\/](images|menu)[\\/]|\.(webp|jpg|jpeg|png|webm|woff2?|ico|svg)$/i.test(file)) res.setHeader('Cache-Control', 'public, max-age=2592000')
      else if (/[\\/]assets[\\/].*-[\w-]{8,}\.(js|css)$/.test(file)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      else if (/\.html$/.test(file)) res.setHeader('Cache-Control', 'no-cache')
    },
  }))

  // Anything else is a real 404 (not the home page), so Google does not index junk URLs as duplicates of the homepage.
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    if (req.path.startsWith('/api')) return next()
    res.status(404)
    if (path.extname(req.path)) return res.type('text/plain').send('Not found')
    res.set('X-Robots-Tag', 'noindex').sendFile(path.join(dist, '404.html'))
  })
}

// Startup check: asks Razorpay for 1 order, which only succeeds when the key ID + secret are valid.
async function verifyRazorpay() {
  if (!razorpay) return console.warn('❌ Razorpay NOT configured (add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env)')
  try {
    await razorpay.orders.all({ count: 1 })
    console.log('✅ Razorpay verified')
  } catch (e) { console.error('❌ Razorpay verification FAILED:', e?.error?.description || e.message) }
}

export { app, validate }
// Passenger (cPanel "Setup Node.js App") starts the file through its own loader, so also listen when PASSENGER_APP_ENV is set.
if (process.argv[1] === fileURLToPath(import.meta.url) || process.env.PASSENGER_APP_ENV) {
  app.listen(PORT, () => console.log(`${brand.name} server on http://localhost:${PORT} | Razorpay ${razorpay ? 'ready' : 'NOT configured (add keys to .env)'}`))
  verifyRazorpay()
  verifyMail()
  console.log(RAZORPAY_WEBHOOK_SECRET ? '✅ Webhook secret set (waiting for Razorpay to call /api/webhook)' : '⚠️ Webhook secret NOT set (RAZORPAY_WEBHOOK_SECRET in .env), webhook disabled')
}
