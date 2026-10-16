import nodemailer from 'nodemailer'
import { brand } from '../src/data/resortData.js'
import { buildBookingPdf } from './bookingPdf.js'

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, HOTEL_EMAIL } = process.env

const port = Number(SMTP_PORT || 465)
const transporter = SMTP_HOST && SMTP_USER && SMTP_PASS
  ? nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } })
  : null

export const mailEnabled = Boolean(transporter)

// Startup check: logs whether the SMTP login really works.
export async function verifyMail() {
  if (!transporter) return console.warn('❌ SMTP NOT configured (add SMTP_HOST, SMTP_USER, SMTP_PASS to .env)')
  try { await transporter.verify(); console.log("✅ SMTP verified") }
  catch (e) { console.error('❌ SMTP verification FAILED:', e.message) }
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const money = (n) => 'INR ' + Number(String(n).replace(/[^\d.]/g, '') || 0).toLocaleString('en-IN')

// Room lines were stored in the Razorpay notes as room_1, room_2 ...
const roomsFrom = (rec) => Object.keys(rec).filter((k) => /^room_\d+$/.test(k)).sort((a, b) => Number(a.slice(5)) - Number(b.slice(5))).map((k) => rec[k])

// Builds the two emails (hotel alert + guest confirmation) from a saved booking record.
export function buildEmails(rec) {
  const rooms = roomsFrom(rec)
  const guest = rec.guest || 'Guest'
  const paid = rec.paid_now || (rec.amount ? money(rec.amount) : '')
  const ref = rec.paymentId || ''
  const roomsHtml = rooms.map((r) => `<li style="margin:4px 0">${esc(r)}</li>`).join('')
  const roomsText = rooms.map((r) => '  - ' + r).join('\n')

  const hotel = {
    subject: `New booking paid: ${guest} (${paid})`,
    text: `New paid booking\n\nGuest: ${guest}\nPhone: ${rec.phone || ''}\nEmail: ${rec.email || ''}\nAddress: ${rec.address || ''}\nID proof: ${rec.id_proof || ''}\n\nRooms:\n${roomsText}\n\nStay total: ${rec.stay_total || ''}\nPaid online: ${paid}\nPayment ID: ${ref}\nOrder ID: ${rec.orderId || ''}`,
    html: `<div style="font-family:Arial,sans-serif;color:#2B1D18"><h2>New paid booking</h2>
      <p><strong>Guest:</strong> ${esc(guest)}<br><strong>Phone:</strong> ${esc(rec.phone)}<br><strong>Email:</strong> ${esc(rec.email)}<br><strong>Address:</strong> ${esc(rec.address)}<br><strong>ID proof:</strong> ${esc(rec.id_proof)}</p>
      <p><strong>Rooms</strong></p><ul>${roomsHtml}</ul>
      <p><strong>Stay total:</strong> ${esc(rec.stay_total)}<br><strong>Paid online:</strong> ${esc(paid)}<br><strong>Payment ID:</strong> ${esc(ref)}<br><strong>Order ID:</strong> ${esc(rec.orderId)}</p></div>`,
  }

  const guestMail = {
    subject: `Your booking is confirmed - ${brand.name}`,
    text: `Dear ${guest},\n\nThank you for booking with ${brand.name}. Your payment was received and your booking is confirmed. Your booking confirmation is attached as a PDF.\n\nRooms:\n${roomsText}\n\nStay total: ${rec.stay_total || ''}\nPaid: ${paid}\nPayment ID: ${ref}\n\nQuestions? Call ${brand.phone} or reply to this email.\n\n${brand.address}`,
    html: `<div style="font-family:Arial,sans-serif;color:#2B1D18"><h2>Your booking is confirmed</h2>
      <p>Dear ${esc(guest)},</p><p>Thank you for booking with <strong>${esc(brand.name)}</strong>. Your payment was received and your booking is confirmed. Your booking confirmation is attached as a PDF.</p>
      <p><strong>Rooms</strong></p><ul>${roomsHtml}</ul>
      <p><strong>Stay total:</strong> ${esc(rec.stay_total)}<br><strong>Paid:</strong> ${esc(paid)}<br><strong>Payment ID:</strong> ${esc(ref)}</p>
      <p>Questions? Call ${esc(brand.phone)} or reply to this email.</p><p style="color:#6b5a52">${esc(brand.address)}</p></div>`,
  }
  return { hotel, guest: guestMail }
}

const sent = new Set() // payment IDs already emailed (verify + webhook can both fire)

// Sends both emails. Never throws: a mail problem must not break a paid booking.
export async function sendBookingEmails(rec) {
  if (!transporter) return console.warn('Email not configured (SMTP_* in .env): booking emails skipped.')
  if (rec.paymentId && sent.has(rec.paymentId)) return
  if (rec.paymentId) sent.add(rec.paymentId)
  const { hotel, guest } = buildEmails(rec)
  const from = MAIL_FROM || `"${brand.name}" <${SMTP_USER}>`
  const to = HOTEL_EMAIL || brand.email
  // Booking confirmation PDF goes to the guest only (the hotel gets all details as text).
  // If the PDF cannot be built, the emails still go out without it.
  const pdfFor = async () => {
    try { return [{ filename: `Booking-Confirmation-${(rec.paymentId || 'cosmo-hill').replace(/^pay_/, '')}.pdf`, content: await buildBookingPdf(rec), contentType: 'application/pdf' }] }
    catch (e) { console.error('Booking PDF failed:', e.message); return [] }
  }
  try { await transporter.sendMail({ from, to, subject: hotel.subject, text: hotel.text, html: hotel.html, replyTo: rec.email || undefined }) }
  catch (e) { console.error('Hotel email failed:', e.message) }
  if (rec.email) {
    try { await transporter.sendMail({ from, to: rec.email, subject: guest.subject, text: guest.text, html: guest.html, replyTo: to, attachments: await pdfFor() }) }
    catch (e) { console.error('Guest email failed:', e.message) }
  }
}
