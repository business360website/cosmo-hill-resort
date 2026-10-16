// Realistic 3D menu book (vanilla JS, no dependencies).
//
// Physical model
//   Spread layout (desktop)  leaves: [cover | p1] [p2 | p3] [p4 | p5] [p6 | p7]
//   Single layout (mobile)   leaves: [cover] [p1] [p2] ... [p7]
// A leaf is a sheet that turns around the spine. Paper leaves are cut into
// vertical strips that rotate relative to each other, which gives a real curl.
// The cover is a rigid board (one strip).
//
// Sequence (spread): cover -> pages 1-2 -> 3-4 -> 5-6 -> close -> page 7.

const BEND = 24            // max curl (deg) across a turning paper leaf
const STRIPS = 10          // strips per paper leaf
const TURN_MS = 1150
const PEEK = 0.05          // hover / idle hint: leaf lifts to 5% of the turn
const BREAKPOINT = 820     // below this width the book uses the single-page layout
const PAGE_RATIO = 1.5     // page height = 1.5 x width (all menu pages are 2:3)

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const el = (tag, cls, parent) => {
  const n = document.createElement(tag)
  if (cls) n.className = cls
  if (parent) parent.appendChild(n)
  return n
}
const ICON = {
  prev: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
  next: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h6a2 2 0 012 2v12a2 2 0 00-2-2H4zM20 5h-6a2 2 0 00-2 2v12a2 2 0 012-2h6z"/></svg>',
  zoom: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg>',
  x: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
}

export function createMenuBook(host, options) {
  const { pages, brand = {}, onChange } = options
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const turnMs = reduced ? 450 : TURN_MS

  let mode = null            // 'spread' | 'single'
  let pw = 0, ph = 0
  let turned = 0             // number of leaves turned over to the left
  let busy = false
  let ready = false
  let destroyed = false
  let hovering = false
  let leaves = []            // { def, slot, castR, castL, strips[], prog, n }
  let anims = []             // per-leaf running animation tokens
  let ui = {}
  let idleTimer = null
  let ro = null

  host.innerHTML = ''
  host.classList.add('mb-host')
  host.tabIndex = 0
  host.setAttribute('role', 'group')
  host.setAttribute('aria-label', 'Interactive menu book. Use the arrow keys to turn pages.')

  // ---------- leaf definitions ----------
  const coverFace = () => {
    const c = el('div', 'mb-cover')
    c.innerHTML = `
      <div class="mb-cover-linen"></div>
      <div class="mb-cover-frame"></div>
      <div class="mb-cover-inner">
        <img class="mb-cover-logo" src="${brand.logo || ''}" alt="" width="120" height="120" />
        <p class="mb-cover-eyebrow">${brand.name || 'The Cosmo Hill Resort'}</p>
        <div class="mb-cover-orn"><i></i><b></b><i></i></div>
        <h2 class="mb-cover-title"><span>Menu</span></h2>
        <svg class="mb-cover-brush" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true"><path d="M4 22C40 10 70 28 110 18S190 6 232 20 284 14 296 18c-12 6-40 2-70 6S150 34 110 26 36 32 4 22z" fill="#F47A20"/></svg>
        <p class="mb-cover-tag">${brand.tagline || 'Relax, Refresh, Rejuvenate'}</p>
      </div>
      <svg class="mb-cover-hills" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 120V70l60-36 50 30 70-52 70 56 60-34 90 48v68z" fill="none" stroke="#d9a94f" stroke-opacity=".55" stroke-width="1.2"/>
        <path d="M0 120V92l80-34 60 34 80-42 70 40 110-30v60z" fill="none" stroke="#d9a94f" stroke-opacity=".35" stroke-width="1"/>
      </svg>
      <div class="mb-cover-hint"><span>Tap to open</span></div>
      <div class="mb-cover-shine"></div>`
    return c
  }

  function buildDefs(m) {
    if (m === 'spread') {
      return [
        { rigid: true, front: { node: coverFace }, back: { img: pages[0] } },
        { front: { img: pages[1] }, back: { img: pages[2] } },
        { front: { img: pages[3] }, back: { img: pages[4] } },
        { front: { img: pages[5] }, back: { img: pages[6] } },
      ]
    }
    const d = [{ rigid: true, front: { node: coverFace }, back: {} }]
    pages.forEach((p, i) => d.push({ front: { img: p }, back: {}, last: i === pages.length - 1 }))
    return d
  }
  // spread: 4 turns (cover, 3 sheets). single: 7 turns; leaf 7 (page 7) is never turned.
  const limit = () => (mode === 'spread' ? 4 : pages.length)

  // spread <-> single position mapping so a resize keeps the reader on the same page
  const toSingle = (s) => (s === 0 ? 0 : 2 * s - 1)
  const toSpread = (t) => (t === 0 ? 0 : Math.ceil(t / 2))

  // ---------- DOM ----------
  const viewport = el('div', 'mb-viewport', host)
  const stage = el('div', 'mb-stage', viewport)
  const toolbar = el('div', 'mb-toolbar', host)
  const live = el('div', 'mb-sr', host)
  live.setAttribute('aria-live', 'polite')

  ui.prev = el('button', 'mb-btn mb-btn-round', toolbar)
  ui.prev.type = 'button'
  ui.prev.innerHTML = ICON.prev
  ui.prev.setAttribute('aria-label', 'Previous page')
  ui.info = el('div', 'mb-info', toolbar)
  ui.next = el('button', 'mb-btn mb-btn-round', toolbar)
  ui.next.type = 'button'
  ui.next.innerHTML = ICON.next
  ui.next.setAttribute('aria-label', 'Next page')
  const extra = el('div', 'mb-extra', toolbar)
  ui.close = el('button', 'mb-btn mb-btn-pill', extra)
  ui.close.type = 'button'
  ui.close.innerHTML = `${ICON.close}<span>Close book</span>`
  ui.zoom = el('button', 'mb-btn mb-btn-pill', extra)
  ui.zoom.type = 'button'
  ui.zoom.innerHTML = `${ICON.zoom}<span>Zoom</span>`

  // side arrows (large screens, outside the book)
  ui.sidePrev = el('button', 'mb-side mb-side-prev', host)
  ui.sidePrev.type = 'button'
  ui.sidePrev.innerHTML = ICON.prev
  ui.sidePrev.setAttribute('aria-label', 'Previous page')
  ui.sideNext = el('button', 'mb-side mb-side-next', host)
  ui.sideNext.type = 'button'
  ui.sideNext.innerHTML = ICON.next
  ui.sideNext.setAttribute('aria-label', 'Next page')

  // ---------- build the book for the current mode ----------
  function build() {
    stage.innerHTML = ''
    leaves = []
    anims.forEach((a) => a && a.cancel && a.cancel())
    anims = []
    stage.className = 'mb-stage mb-' + mode

    ui.boardL = el('div', 'mb-board mb-board-l', stage)
    ui.boardR = el('div', 'mb-board mb-board-r', stage)
    ui.edgeL = el('div', 'mb-edge mb-edge-l', stage)
    ui.edgeR = el('div', 'mb-edge mb-edge-r', stage)

    const defs = buildDefs(mode)
    defs.forEach((def, i) => {
      const slot = el('div', 'mb-slot', stage)
      const castR = el('div', 'mb-cast mb-cast-r', slot)
      const castL = el('div', 'mb-cast mb-cast-l', slot)
      const n = def.rigid ? 1 : STRIPS
      const strips = []
      let parent = slot
      for (let k = 0; k < n; k++) {
        const s = el('div', 'mb-strip', parent)
        s.style.setProperty('--n', n)
        s.style.setProperty('--k', k)
        s.style.setProperty('--sw', `calc(var(--pw) / ${n})`)
        if (n === 1) s.classList.add('mb-rigid')
        const f = el('div', 'mb-face mb-front', s)
        const b = el('div', 'mb-face mb-back', s)
        const fs = el('i', 'mb-shade', f)
        const bs = el('i', 'mb-shade', b)
        if (def.front.img) {
          f.style.backgroundImage = `url(${def.front.img})`
          f.style.backgroundPosition = `calc(var(--sw) * ${-k}) 0`
        } else if (def.front.node && k === 0) {
          f.insertBefore(def.front.node(), fs)
        }
        if (def.back.img) {
          b.style.backgroundImage = `url(${def.back.img})`
          b.style.backgroundPosition = `calc(var(--sw) * ${k + 1} - var(--pw)) 0`
        } else {
          b.classList.add('mb-blank')
        }
        strips.push({ s, fs, bs })
        parent = s
      }
      leaves.push({ def, slot, castR, castL, strips, n, prog: 0 })
    })

    ui.gutter = el('div', 'mb-gutter', stage)
    ui.hit = el('div', 'mb-hit', stage)
    bindHit()
    leaves.forEach((_, i) => setProg(i, i < turned ? 1 : 0))
    settleZ()
    updateStage(false)
    updateUI()
  }

  // ---------- rendering of one leaf ----------
  function setProg(i, p) {
    const L = leaves[i]
    if (!L) return
    L.prog = p
    const theta = -180 * p
    const b = L.def.rigid || reduced ? 0 : -BEND * Math.sin(2 * Math.PI * p)
    const n = L.n
    const per = n > 1 ? b / (n - 1) : 0
    for (let k = 0; k < n; k++) {
      const st = L.strips[k]
      const rel = k === 0 ? theta : per
      st.s.style.transform = rel === 0 ? '' : `rotateY(${rel.toFixed(3)}deg)`
      const abs = theta + per * k
      const c = Math.cos((abs * Math.PI) / 180)
      // light from the top-left: the leaf darkens as it turns edge-on
      st.fs.style.opacity = c >= 0 ? (0.34 * (1 - c)).toFixed(3) : '0'
      st.bs.style.opacity = c < 0 ? (0.34 * (1 + c)).toFixed(3) : '0'
    }
    // cast shadows on the stacks below
    const a = 180 * p
    const sa = Math.sin((a * Math.PI) / 180)
    L.castR.style.opacity = (0.62 * sa * (1 - p)).toFixed(3)
    L.castL.style.opacity = (0.62 * sa * p).toFixed(3)
    if (mode === 'single') {
      // in the single-page layout the leaf leaves the screen to the left
      L.slot.style.opacity = p > 0.7 ? String(Math.max(0, (1 - p) / 0.3)) : ''
      L.slot.style.visibility = p >= 0.999 ? 'hidden' : ''
    } else {
      L.slot.style.opacity = ''
      L.slot.style.visibility = ''
    }
  }

  function settleZ() {
    leaves.forEach((L, i) => {
      L.slot.style.zIndex = String(i < turned ? i + 1 : 100 - i)
    })
  }

  // ---------- animation ----------
  function animateLeaf(i, to, duration, delay = 0, ease = easeInOut) {
    return new Promise((resolve) => {
      if (anims[i]) anims[i].cancel()
      const L = leaves[i]
      if (!L) return resolve()
      let raf = 0
      let timer = 0
      const token = {
        cancel() {
          cancelAnimationFrame(raf)
          clearTimeout(timer)
          resolve()
        },
      }
      anims[i] = token
      const run = () => {
        const from = L.prog
        const t0 = performance.now()
        if (duration > 400) L.slot.style.zIndex = String(to > from ? 1000 + i : 1000 + leaves.length - i)
        const tick = (now) => {
          if (destroyed) return resolve()
          const t = clamp((now - t0) / duration, 0, 1)
          setProg(i, from + (to - from) * ease(t))
          if (t < 1) raf = requestAnimationFrame(tick)
          else {
            anims[i] = null
            resolve()
          }
        }
        raf = requestAnimationFrame(tick)
      }
      if (delay > 0) timer = setTimeout(run, delay)
      else run()
    })
  }

  // ---------- stage (book position, boards, page-block thickness) ----------
  function updateStage(animated) {
    const max = limit()
    let tx = 0
    if (mode === 'spread') tx = turned === 0 ? -pw / 2 : turned === max ? pw / 2 : 0
    stage.style.transition = animated ? `transform ${turnMs}ms cubic-bezier(.45,.05,.25,1)` : 'none'
    stage.style.transform = `translate3d(${tx}px,0,0)`
    const dur = animated ? '' : 'none'
    ;[ui.boardL, ui.boardR, ui.edgeL, ui.edgeR].forEach((n) => (n.style.transition = dur))
    if (mode === 'spread') {
      ui.boardL.style.opacity = turned > 0 ? '1' : '0'
      ui.boardR.style.opacity = turned < max ? '1' : '0'
      const eL = turned * 1.6
      const eR = (max - turned) * 1.6
      ui.edgeL.style.opacity = turned > 0 ? '1' : '0'
      ui.edgeR.style.opacity = turned < max ? '1' : '0'
      ui.edgeL.style.setProperty('--e', eL + 'px')
      ui.edgeR.style.setProperty('--e', eR + 'px')
    } else {
      ui.boardL.style.opacity = '0'
      ui.edgeL.style.opacity = '0'
      ui.boardR.style.opacity = '1'
      ui.edgeR.style.opacity = '1'
      ui.edgeR.style.setProperty('--e', Math.max(0, (max - turned) * 0.8) + 'px')
    }
    stage.classList.toggle('mb-start', turned === 0)
    stage.classList.toggle('mb-end', turned === max)
    // only the visible half of the book is clickable while it is closed
    if (mode === 'spread' && (turned === 0 || turned === max)) {
      ui.hit.style.left = turned === 0 ? '50%' : '0'
      ui.hit.style.width = '50%'
    } else {
      ui.hit.style.left = '0'
      ui.hit.style.width = '100%'
    }
    ui.gutter.style.opacity = mode === 'spread' && turned > 0 && turned < max ? '1' : '0'
    if (animated) ui.gutter.style.transition = `opacity ${turnMs}ms ease`
  }

  // ---------- state, navigation ----------
  function label() {
    if (mode === 'spread') return ['Front cover', 'Pages 1–2', 'Pages 3–4', 'Pages 5–6', 'Page 7'][turned]
    return turned === 0 ? 'Front cover' : `Page ${turned} of ${pages.length}`
  }
  function visiblePages() {
    if (mode === 'spread') {
      if (turned === 0) return []
      const out = [2 * turned - 1]
      if (turned <= 3) out.push(2 * turned)
      return out
    }
    return turned === 0 ? [] : [turned]
  }
  function updateUI() {
    const max = limit()
    ui.info.textContent = label()
    live.textContent = label()
    const off = (btn, v) => {
      btn.setAttribute('aria-disabled', v ? 'true' : 'false')
      btn.classList.toggle('mb-off', v)
    }
    off(ui.prev, turned === 0 || busy || !ready)
    off(ui.sidePrev, turned === 0 || busy || !ready)
    off(ui.next, turned === max || busy || !ready)
    off(ui.sideNext, turned === max || busy || !ready)
    off(ui.close, turned === 0 || busy || !ready)
    off(ui.zoom, turned === 0)
    host.dataset.state = String(turned)
    host.dataset.mode = mode
    host.dataset.busy = busy ? '1' : '0'
    host.classList.toggle('mb-closed-front', turned === 0)
    host.classList.toggle('mb-loading', !ready)
    if (onChange) onChange({ turned, mode, label: label(), pages: visiblePages() })
  }

  function go(dir) {
    if (busy || !ready || destroyed) return false
    const max = limit()
    const target = turned + dir
    if (target < 0 || target > max) return false
    busy = true
    const leaf = dir > 0 ? turned : turned - 1
    turned = target
    updateStage(true)
    updateUI()
    animateLeaf(leaf, dir > 0 ? 1 : 0, turnMs).then(() => {
      if (destroyed) return
      busy = false
      settleZ()
      updateUI()
    })
    return true
  }

  function closeBook() {
    if (busy || !ready || turned === 0 || destroyed) return false
    busy = true
    const from = turned
    turned = 0
    updateStage(true)
    updateUI()
    const jobs = []
    for (let i = from - 1; i >= 0; i--) {
      jobs.push(animateLeaf(i, 0, turnMs * 0.8, (from - 1 - i) * (reduced ? 0 : 120)))
    }
    Promise.all(jobs).then(() => {
      if (destroyed) return
      busy = false
      settleZ()
      updateUI()
    })
    return true
  }

  // ---------- pointer / keyboard ----------
  function zoneOf(clientX) {
    const r = stage.getBoundingClientRect()
    const x = (clientX - r.left) / r.width
    if (mode === 'spread') return x < 0.5 ? 'left' : 'right'
    return x < 0.3 ? 'left' : 'right'
  }
  function peek(zone) {
    if (busy || !ready) return
    const max = limit()
    if (zone === 'right' && turned < max) animateLeaf(turned, PEEK, 260, 0, easeOut)
    else if (zone === 'left' && turned > 0 && turned < max) animateLeaf(turned - 1, 1 - PEEK, 260, 0, easeOut)
  }
  function unpeek() {
    if (busy) return
    const a = turned < limit() ? turned : -1
    const b = turned > 0 ? turned - 1 : -1
    if (a >= 0 && leaves[a] && leaves[a].prog > 0 && leaves[a].prog < 0.2) animateLeaf(a, 0, 300, 0, easeOut)
    if (b >= 0 && leaves[b] && leaves[b].prog < 1 && leaves[b].prog > 0.8) animateLeaf(b, 1, 300, 0, easeOut)
  }
  function activate(zone) {
    const max = limit()
    if (turned === 0) return go(1)
    if (turned === max) return zone === 'left' && mode === 'single' ? go(-1) : closeBook()
    return zone === 'left' ? go(-1) : go(1)
  }

  let down = null
  function bindHit() {
    const hit = ui.hit
    hit.addEventListener('pointerdown', (e) => {
      down = { x: e.clientX, y: e.clientY, t: performance.now() }
    })
    hit.addEventListener('pointerup', (e) => {
      if (!down) return
      const dx = e.clientX - down.x
      const dy = e.clientY - down.y
      down = null
      if (Math.abs(dx) > 45 && Math.abs(dy) < 90) {
        if (dx < 0) {
          if (turned === limit()) closeBook()
          else go(1)
        } else go(-1)
        return
      }
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12) activate(zoneOf(e.clientX))
    })
    hit.addEventListener('pointercancel', () => (down = null))
    hit.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return
      const z = zoneOf(e.clientX)
      const max = limit()
      hit.dataset.zone = turned === 0 ? 'right' : turned === max ? (mode === 'spread' ? 'left' : z) : z
      if (!hovering || hit._z !== z) {
        hovering = true
        if (hit._z && hit._z !== z) unpeek()
        hit._z = z
        peek(turned === 0 ? 'right' : z)
      }
    })
    hit.addEventListener('pointerleave', () => {
      hovering = false
      hit._z = null
      unpeek()
    })
  }

  const onKeyDown = (e) => {
    if (zoomOpen() || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
    const t = e.target
    if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return
    const r = host.getBoundingClientRect()
    const onScreen = r.bottom > 0 && r.top < window.innerHeight
    if (!onScreen) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      turned === limit() ? closeBook() : go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    } else if (e.key === 'Escape') closeBook()
    else if ((e.key === 'Enter' || e.key === ' ') && t === host) {
      e.preventDefault()
      if (turned === 0) go(1)
    }
  }
  document.addEventListener('keydown', onKeyDown)
  ui.prev.onclick = ui.sidePrev.onclick = () => go(-1)
  ui.next.onclick = ui.sideNext.onclick = () => go(1)
  ui.close.onclick = () => closeBook()
  ui.zoom.onclick = () => openZoom()

  // ---------- zoom (readable full-size pages) ----------
  let zoomEl = null
  const zoomOpen = () => !!zoomEl
  function openZoom() {
    const vis = visiblePages()
    if (!vis.length || zoomEl) return
    zoomEl = el('div', 'mb-zoom', document.body)
    zoomEl.setAttribute('role', 'dialog')
    zoomEl.setAttribute('aria-modal', 'true')
    zoomEl.setAttribute('aria-label', 'Menu pages, full size')
    const closeBtn = el('button', 'mb-zoom-x', zoomEl)
    closeBtn.type = 'button'
    closeBtn.innerHTML = ICON.x
    closeBtn.setAttribute('aria-label', 'Close zoom')
    const inner = el('div', 'mb-zoom-inner', zoomEl)
    vis.forEach((n) => {
      const im = el('img', 'mb-zoom-img', inner)
      im.src = pages[n - 1]
      im.alt = `Menu page ${n}`
    })
    const close = () => {
      if (!zoomEl) return
      zoomEl.remove()
      zoomEl = null
      document.removeEventListener('keydown', onKey, true)
      host.focus({ preventScroll: true })
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
    }
    document.addEventListener('keydown', onKey, true)
    closeBtn.onclick = close
    zoomEl.addEventListener('click', (e) => e.target === zoomEl && close())
    zoomEl._close = close
    closeBtn.focus()
  }

  // ---------- sizing ----------
  function measure() {
    const W = host.clientWidth || host.parentElement.clientWidth || 360
    const H = window.innerHeight
    const m = W < BREAKPOINT ? 'single' : 'spread'
    let size
    if (m === 'spread') {
      const availW = W - 2 * 76
      const availH = Math.max(440, H - 200)
      size = clamp(Math.min(availW / 2, availH / PAGE_RATIO), 300, 640)
    } else {
      const availH = Math.max(420, H - 190)
      size = clamp(Math.min(W - 32, availH / PAGE_RATIO), 260, 560)
    }
    return { m, size: Math.floor(size) }
  }
  function layout() {
    const { m, size } = measure()
    const changed = m !== mode
    if (changed) {
      if (mode) turned = m === 'single' ? toSingle(turned) : toSpread(turned)
      mode = m
    }
    pw = size
    ph = Math.round(size * PAGE_RATIO)
    host.style.setProperty('--pw', pw + 'px')
    host.style.setProperty('--ph', ph + 'px')
    host.style.setProperty('--persp', Math.round(pw * 3.4) + 'px')
    host.classList.toggle('mb-wide', mode === 'spread')
    host.style.setProperty('--stage-w', (mode === 'spread' ? pw * 2 : pw) + 'px')
    if (changed || !leaves.length) {
      busy = false
      build()
    } else updateStage(false)
  }

  // ---------- idle hint on the closed cover ----------
  function startIdle() {
    if (reduced) return
    idleTimer = setInterval(() => {
      if (destroyed || busy || hovering || turned !== 0 || !ready || document.hidden) return
      animateLeaf(0, PEEK * 1.4, 520, 0, easeOut).then(() => {
        if (!busy && !hovering && turned === 0) animateLeaf(0, 0, 700, 0, easeInOut)
      })
    }, 4800)
  }

  // ---------- preload, then go ----------
  function preload() {
    let left = pages.length
    const done = () => {
      if (--left === 0 && !ready) ready = true, updateUI()
    }
    pages.forEach((src) => {
      const im = new Image()
      im.onload = im.onerror = () => (im.decode ? im.decode().catch(() => {}).then(done) : done())
      im.src = src
    })
    setTimeout(() => {
      if (!ready) {
        ready = true
        updateUI()
      }
    }, 7000)
  }

  layout()
  preload()
  startIdle()
  ro = new ResizeObserver(() => !destroyed && layout())
  ro.observe(host)
  window.addEventListener('resize', layout)

  return {
    next: () => go(1),
    prev: () => go(-1),
    close: closeBook,
    getState: () => ({ turned, mode, busy, ready, label: label(), pages: visiblePages(), limit: limit() }),
    destroy() {
      destroyed = true
      clearInterval(idleTimer)
      anims.forEach((a) => a && a.cancel && a.cancel())
      ro && ro.disconnect()
      window.removeEventListener('resize', layout)
      document.removeEventListener('keydown', onKeyDown)
      if (zoomEl) zoomEl._close()
      host.innerHTML = ''
      host.classList.remove('mb-host')
    },
  }
}
