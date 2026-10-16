// Tiny History-API router: real URLs (/rooms) instead of #/rooms, with no extra dependency.
export const NAV_EVENT = 'cosmo:navigate'

export function navigate(to) {
  if (typeof window === 'undefined') return
  const url = new URL(to, window.location.origin)
  if (url.pathname === window.location.pathname && url.search === window.location.search) {
    if (url.hash) { window.history.pushState(null, '', url.pathname + url.search + url.hash); scrollToHash(url.hash) }
    else window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  window.history.pushState(null, '', url.pathname + url.search + url.hash)
  window.dispatchEvent(new Event(NAV_EVENT))
}

export function scrollToHash(hash) {
  const el = hash && document.getElementById(decodeURIComponent(hash.slice(1)))
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return true }
  return false
}

// Turns clicks on normal <a href="/..."> links into in-app navigation (keeps ctrl/cmd-click, new tabs, downloads, external links working).
export function interceptLinks(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const a = e.target.closest && e.target.closest('a[href]')
  if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
  const href = a.getAttribute('href')
  if (!href || !href.startsWith('/') || href.startsWith('//')) return
  e.preventDefault()
  navigate(href)
}

// Old links like /#/rooms (from before the site had real URLs) become /rooms.
export function upgradeLegacyHash() {
  if (typeof window === 'undefined') return
  const h = window.location.hash
  if (h.startsWith('#/')) {
    const target = h.slice(1) === '/menu' ? '/dining' : h.slice(1)
    window.history.replaceState(null, '', target)
  }
}
