import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import PDFDocument from 'pdfkit'
import { brand } from '../src/data/resortData.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOGO = path.join(__dirname, '..', 'public', 'assets', 'logo.png')

const INK = '#2B1D18', MUTED = '#6b5a52', LINE = '#d9cbbf', CREAM = '#FFF0DC', GOLD = '#C9974F'
const money = (n) => 'INR ' + Number(String(n ?? '').replace(/[^\d.]/g, '') || 0).toLocaleString('en-IN')
const fmtDate = (iso) => { const d = new Date(iso + 'T00:00:00Z'); return Number.isNaN(+d) ? iso : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) }

// "Deluxe Double Room | 2026-11-01 to 2026-11-03 | 2 night(s) | 2 guest(s) | INR 10000"
function parseRoom(s) {
  const [name, dates, nights, guests, amount] = String(s).split('|').map((x) => x.trim())
  const [checkIn, checkOut] = String(dates || '').split(' to ')
  return { name, checkIn, checkOut, nights: parseInt(nights) || '', guests: parseInt(guests) || '', amount }
}

/**
 * Builds the booking confirmation PDF and resolves with a Buffer.
 * rec = saved booking record (Razorpay notes + paymentId/orderId).
 */
export function buildBookingPdf(rec) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 48, info: { Title: `Booking Confirmation - ${brand.name}`, Author: brand.name } })
    const chunks = []
    doc.on('data', (c) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const L = doc.page.margins.left, W = doc.page.width - L - doc.page.margins.right
    const rooms = Object.keys(rec).filter((k) => /^room_\d+$/.test(k)).sort((a, b) => Number(a.slice(5)) - Number(b.slice(5))).map((k) => parseRoom(rec[k]))
    const paid = rec.paid_now || (rec.amount ? money(rec.amount) : '')
    const bookedOn = new Date(rec.at || Date.now()).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' })

    // ---- Header band
    doc.rect(0, 0, doc.page.width, 110).fill(INK)
    if (fs.existsSync(LOGO)) doc.image(LOGO, L, 22, { width: 66 })
    doc.fillColor(CREAM).font('Helvetica-Bold').fontSize(20).text(brand.name, L + 82, 30, { width: W - 82 })
    doc.font('Helvetica').fontSize(10).fillColor('#e8d5bd').text(brand.tagline, L + 82, 56)
    doc.font('Helvetica-Bold').fontSize(13).fillColor(GOLD).text('BOOKING CONFIRMATION', L + 82, 76)

    // ---- Status line
    let y = 132
    doc.fillColor(INK).font('Helvetica-Bold').fontSize(15).text(`Dear ${rec.guest || 'Guest'},`, L, y)
    y = doc.y + 4
    doc.font('Helvetica').fontSize(10.5).fillColor(MUTED).text('Thank you for choosing us. Your payment was received and your booking is confirmed. Please keep this document and show it at check-in.', L, y, { width: W })
    y = doc.y + 16

    const kv = (pairs, x, yy, w) => {
      let cy = yy
      pairs.forEach(([k, v]) => {
        doc.font('Helvetica').fontSize(8.5).fillColor(MUTED).text(k.toUpperCase(), x, cy, { width: w })
        doc.font('Helvetica-Bold').fontSize(10.5).fillColor(INK).text(String(v || '-'), x, doc.y + 1, { width: w })
        cy = doc.y + 8
      })
      return cy
    }

    // ---- Reference + guest panel
    const panelTop = y
    const colW = (W - 36) / 2
    const leftItems = [['Booked on', bookedOn], ['Payment ID', rec.paymentId], ['Order ID', rec.orderId], ['Address', String(rec.address || '').replace(' - ', ', ')]]
    const rightItems = [['Guest name', rec.guest], ['Phone', rec.phone], ['Email', rec.email], ['ID proof', rec.id_proof]]
    // Measure first so the cream panel is exactly tall enough (a long address wraps inside its column).
    const colHeight = (items) => items.reduce((h, [, v]) => h + 11 + doc.font('Helvetica-Bold').fontSize(10.5).heightOfString(String(v || '-'), { width: colW }) + 8, 0)
    const panelH = Math.max(colHeight(leftItems), colHeight(rightItems)) + 14
    doc.roundedRect(L, panelTop, W, panelH, 6).fill(CREAM)
    kv(leftItems, L + 14, panelTop + 12, colW)
    kv(rightItems, L + 22 + colW, panelTop + 12, colW)
    y = panelTop + panelH + 14

    // ---- Rooms table
    doc.font('Helvetica-Bold').fontSize(12).fillColor(INK).text('Your stay', L, y)
    y = doc.y + 6
    const cols = [{ t: 'Room', w: 0.29 }, { t: 'Check-in', w: 0.17 }, { t: 'Check-out', w: 0.17 }, { t: 'Nights', w: 0.1 }, { t: 'Guests', w: 0.1 }, { t: 'Amount', w: 0.17, r: true }]
    const xs = []; let acc = L
    cols.forEach((c) => { xs.push(acc); acc += c.w * W })
    doc.rect(L, y, W, 22).fill(INK)
    cols.forEach((c, i) => doc.fillColor(CREAM).font('Helvetica-Bold').fontSize(9).text(c.t, xs[i] + 6, y + 7, { width: c.w * W - 12, align: c.r ? 'right' : 'left' }))
    y += 22
    rooms.forEach((r) => {
      const cells = [r.name, fmtDate(r.checkIn), fmtDate(r.checkOut), r.nights, r.guests, money(r.amount)]
      doc.font('Helvetica').fontSize(10)
      const h = Math.max(...cells.map((c, i) => doc.heightOfString(String(c), { width: cols[i].w * W - 12 }))) + 14
      if (y + h > doc.page.height - 200) { doc.addPage(); y = doc.page.margins.top }
      cols.forEach((c, i) => doc.fillColor(INK).font(i === 0 ? 'Helvetica-Bold' : 'Helvetica').fontSize(10).text(String(cells[i]), xs[i] + 6, y + 7, { width: c.w * W - 12, align: c.r ? 'right' : 'left' }))
      y += h
      doc.moveTo(L, y).lineTo(L + W, y).strokeColor(LINE).lineWidth(0.6).stroke()
    })

    // ---- Totals
    y += 12
    const tw = 230, tx = L + W - tw
    const row = (label, val, bold) => {
      doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(bold ? 12 : 10.5).fillColor(INK).text(label, tx, y, { width: tw * 0.55 })
      doc.text(val, tx + tw * 0.45, y, { width: tw * 0.55, align: 'right' })
      y += bold ? 20 : 17
    }
    row('Stay total', money(rec.stay_total || paid))
    doc.moveTo(tx, y).lineTo(L + W, y).strokeColor(GOLD).lineWidth(1).stroke(); y += 6
    row('Paid online', money(paid), true)
    doc.font('Helvetica').fontSize(9).fillColor(MUTED).text('Payment status: PAID IN FULL', tx, y, { width: tw, align: 'right' })
    y = doc.y + 18

    // ---- Important info
    if (y > doc.page.height - 230) { doc.addPage(); y = doc.page.margins.top }
    doc.font('Helvetica-Bold').fontSize(12).fillColor(INK).text('Good to know', L, y)
    const notes = [
      'Carry the same government photo ID you used while booking (Aadhaar, Passport or Driving License). Foreign nationals must carry a valid passport and visa.',
      'Rooms are booked for the number of guests shown above. Extra guests or extra beds need prior approval and may cost extra.',
      'Cancellations and refunds follow our Refund & Cancellation Policy. Please contact us as early as possible if your plans change.',
      'The resort is in a hill area; weather or road conditions may affect travel. Call us if you need directions or help on the way.',
    ]
    doc.font('Helvetica').fontSize(9.5).fillColor(MUTED)
    notes.forEach((n) => { doc.text('•  ' + n, L, doc.y + 4, { width: W, indent: 0 }) })
    y = doc.y + 18

    // ---- Contact footer
    doc.roundedRect(L, y, W, 64, 6).strokeColor(LINE).lineWidth(0.8).stroke()
    doc.font('Helvetica-Bold').fontSize(10).fillColor(INK).text(brand.name, L + 14, y + 10)
    doc.font('Helvetica').fontSize(9.5).fillColor(MUTED)
      .text(brand.address, L + 14, doc.y + 2, { width: W - 28 })
      .text(`Phone: ${brand.phone}, ${brand.phone2}   |   Email: ${brand.email}`, L + 14, doc.y + 2, { width: W - 28 })
    doc.font('Helvetica').fontSize(8).fillColor(MUTED).text('This is a computer-generated confirmation and does not need a signature.', L, doc.page.height - 75, { width: W, align: 'center', lineBreak: false })
    doc.end()
  })
}
