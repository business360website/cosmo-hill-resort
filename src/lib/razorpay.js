// Loads Razorpay's checkout script once, only when a guest actually clicks "Pay".
let loading
export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true)
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => { loading = undefined; reject(new Error('Could not load the payment window. Check your internet connection.')) }
    document.body.appendChild(s)
  })
  return loading
}

export async function postJson(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data
}
