import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
// useLayoutEffect warns during the build's pre-render, so fall back to useEffect on the server.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { brand, menuPages } from '../data/resortData'
import './MenuBook.css'

/*
  Realistic 3D menu book (pure CSS 3D + a small rAF animation loop, no extra dependencies).

  Model: the book is a stack of "leaves" hinged at the spine. `step` = how many leaves have
  been turned from the right side to the left side.

  Desktop (two-page spread)
    leaf 0  cover (front)  | back = menu page 1     rigid board
    leaf 1  menu page 2    | back = menu page 3
    leaf 2  menu page 4    | back = menu page 5
    leaf 3  menu page 6    | back = menu page 7     (turning it closes the book on page 7)
    step 0 closed cover -> 1: pages 1-2 -> 2: pages 3-4 -> 3: pages 5-6 -> 4: closed, page 7

  Narrow screens (single page)
    cover, then pages 1..7 one at a time; same turning animation, the turned page leaves to the left.

  Soft leaves are cut into vertical strips; each strip gets a small extra rotation while the page
  turns, which bends the paper. Shading and cast shadows are driven by the same angle.
*/

const N_STRIPS = 10       // strips per soft leaf (paper bend resolution)
const Z = 0.6             // px of z-spacing between stacked leaves
const MAX_CURL = 34       // total degrees of paper bend at the middle of a turn
const BREAKPOINT = 860    // below this container width -> single page layout
const RATIO = 1.5         // page height / width (menu pages are 2:3)

const preloaded = [] // module-level: keeps decoded menu images in memory (no re-download)

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOut = (t) => 1 - (1 - t) * (1 - t)
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function buildLeaves(single) {
  if (!single) {
    return [
      { kind: 'rigid', front: { cover: true }, back: { page: 0 } },
      { kind: 'soft', front: { page: 1 }, back: { page: 2 } },
      { kind: 'soft', front: { page: 3 }, back: { page: 4 } },
      { kind: 'soft', front: { page: 5 }, back: { page: 6 } },
    ]
  }
  return [
    { kind: 'rigid', front: { cover: true }, back: { blank: true } },
    ...[0, 1, 2, 3, 4, 5].map((i) => ({ kind: 'soft', front: { page: i }, back: { blank: true } })),
    { kind: 'soft', front: { page: 6 }, back: { blank: true } }, // last page: never turns
  ]
}

// ---------- Cover (designed to match the site's cocoa / cream / gold branding) ----------
function Cover() {
  return (
    <div className="mb-cover">
      <div className="mb-cover-leather" />
      <div className="mb-cover-frame">
        <span className="mb-corner tl" /><span className="mb-corner tr" /><span className="mb-corner bl" /><span className="mb-corner br" />
        <div className="mb-cover-inner">
          <img className="mb-cover-logo" src={brand.logo} alt="" draggable="false" />
          <p className="mb-cover-eyebrow">{brand.name}</p>
          <h2 className="mb-cover-title">MENU</h2>
          <div className="mb-cover-rule"><i /><b /><i /></div>
          <p className="mb-cover-tag">{brand.tagline}</p>
          <svg className="mb-cover-ridge" viewBox="0 0 240 70" aria-hidden="true">
            <circle cx="182" cy="18" r="8" />
            <path d="M0 62 L38 34 L62 50 L104 12 L146 52 L176 36 L240 62" />
            <path d="M0 68 L240 68" />
          </svg>
          <p className="mb-cover-hint"><span>Tap to open</span></p>
        </div>
      </div>
      <div className="mb-cover-hinge" />
      <div className="mb-cover-shine" />
    </div>
  )
}

export default function MenuBook() {
  const rootRef = useRef(null)
  const [size, setSize] = useState({ W: 0, H: 0, single: false })
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)

  const stepRef = useRef(0)
  const busyRef = useRef(false)
  const P = useRef([])            // turn progress per leaf, 0 (right) .. 1 (left)
  const anims = useRef(new Map()) // leaf -> running tween
  const raf = useRef(0)
  const els = useRef({})          // DOM refs for imperative per-frame updates
  const swipe = useRef({ x: 0, y: 0, done: false })

  const { W, H, single } = size
  const leaves = useMemo(() => buildLeaves(single), [single])
  const maxStep = single ? leaves.length - 1 : leaves.length

  // ---------- responsive sizing ----------
  useIsoLayoutEffect(() => {
    let lastW = 0, lastH = 0, frame = 0
    const calc = () => {
      frame = 0
      const cw = rootRef.current?.clientWidth || 0
      if (!cw) return
      // Mobile browsers fire resize when the address bar hides/shows while scrolling.
      // Ignore small height-only changes so the book is not rebuilt (that caused flicker).
      const ih = window.innerHeight
      if (lastW === cw && lastH && Math.abs(ih - lastH) < 160) return
      lastW = cw; lastH = ih
      const isSingle = cw < BREAKPOINT
      const availH = Math.max(440, ih - 250)
      let w = isSingle ? Math.min(cw - 20, availH / RATIO, 540) : Math.min((cw - 56) / 2, availH / RATIO, 580)
      w = Math.max(200, Math.floor(w / 2) * 2)
      setSize((s) => (s.W === w && s.single === isSingle ? s : { W: w, H: Math.round(w * RATIO), single: isSingle }))
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(calc) }
    calc()
    const ro = new ResizeObserver(schedule)
    ro.observe(rootRef.current)
    window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(frame); ro.disconnect(); window.removeEventListener('resize', schedule) }
  }, [])

  // Layout mode changed (leaf set differs): start again from the closed cover.
  const lastMode = useRef(null)
  useIsoLayoutEffect(() => {
    if (lastMode.current !== null && lastMode.current !== single) {
      anims.current.clear(); busyRef.current = false; setBusy(false); stepRef.current = 0; setStep(0)
    }
    lastMode.current = single
  }, [single])

  // preload every page once so turning never shows a blank face
  useEffect(() => {
    if (preloaded.length) return
    menuPages.forEach((p) => { const i = new Image(); i.decoding = 'async'; i.src = p.src; preloaded.push(i) })
  }, [])

  // ---------- per-frame rendering ----------
  const applyLeaf = useCallback((li) => {
    const r = els.current[li]
    const leaf = leaves[li]
    if (!r || !r.leaf || !leaf) return
    const p = P.current[li] ?? 0
    const theta = 180 * p
    const rad = (theta * Math.PI) / 180
    const sin = Math.sin(rad)
    const n = leaves.length
    const z = p < 0.5 ? (n - li) * Z : li * Z
    r.leaf.style.transform = `translateZ(${z}px) rotateY(${-theta}deg)`

    if (leaf.kind === 'soft') {
      const c = (MAX_CURL * Math.sin(Math.PI * p)) / N_STRIPS // degrees of extra bend per strip
      for (let i = 0; i < N_STRIPS; i++) {
        if (i > 0) r.strips[i].style.transform = `rotateY(${c}deg)`
        const ti = ((theta - i * c) * Math.PI) / 180
        const d = (0.34 * Math.abs(Math.sin(ti))).toFixed(3)
        r.shF[i].style.opacity = d
        r.shB[i].style.opacity = d
      }
    } else {
      const d = (0.3 * sin).toFixed(3)
      r.shF.style.opacity = d
      r.shB.style.opacity = d
    }

    // shadow this leaf casts on the page beneath it
    const cast = r.cast
    if (cast) {
      const cos = Math.cos(rad)
      const len = W * 0.34 * sin
      const a = (0.42 * sin).toFixed(3)
      if (len < 0.5) {
        cast.style.opacity = 0
      } else {
        let x0, x1, dir
        if (theta < 90) { x0 = W * cos - W * 0.03; x1 = Math.min(W, W * cos + len); dir = 'right' }
        else { const xe = W * cos; x0 = Math.max(-W, xe - len); x1 = xe + W * 0.03; dir = 'left' }
        const width = Math.max(0, x1 - x0)
        const stop = ((W * 0.03) / Math.max(1, width)) * 100
        cast.style.opacity = 1
        cast.style.left = `${x0}px`
        cast.style.width = `${width}px`
        cast.style.background = `linear-gradient(to ${dir},rgba(20,10,4,${a}) ${stop}%,rgba(20,10,4,0))`
      }
    }
  }, [leaves, W])

  const applyBook = useCallback(() => {
    const e = els.current.book
    if (!e || !e.book) return
    const arr = P.current
    const last = leaves.length - 1
    const p0 = arr[0] ?? 0
    const pl = single ? 0 : arr[last] ?? 0
    // keep the visible book centred: cover alone sits right of spine, final page alone sits left
    const x = single ? 0 : (-W / 2) * (1 - p0) + (W / 2) * pl
    e.book.style.transform = `translateX(${x}px)`
    // hard-cover boards behind the pages
    if (e.plate) {
      const left = single ? -5 : -5 - (W + 3) * p0
      const right = single ? W + 5 : W + 5 - W * pl
      e.plate.style.left = `${left}px`
      e.plate.style.width = `${right - left}px`
    }
    // visible stack of page edges on each side
    let rightCount = 0
    let leftCount = 0
    arr.forEach((p, i) => { if (single && i === last) return; if (p < 0.5) rightCount++; else leftCount++ })
    const edge = (sx, k) => Array.from({ length: k }, (_, j) => `${sx * (j + 1)}px ${j + 1}px 0 ${j % 2 ? '#efe9dd' : '#d6cfc1'}`).join(',')
    if (e.stackR) e.stackR.style.boxShadow = rightCount > 1 ? edge(1, clamp(Math.round(rightCount * 1.3), 1, 6)) : 'none'
    if (e.stackL) e.stackL.style.boxShadow = leftCount > 1 ? edge(-1, clamp(Math.round(leftCount * 1.3), 1, 6)) : 'none'
  }, [leaves, single, W])

  const applyAll = useCallback(() => {
    leaves.forEach((_, i) => applyLeaf(i))
    applyBook()
  }, [leaves, applyLeaf, applyBook])

  // After every layout change: rebuild progress from `step` and paint.
  useIsoLayoutEffect(() => {
    if (!W) return
    if (P.current.length !== leaves.length) P.current = leaves.map((_, i) => (i < stepRef.current ? 1 : 0))
    applyAll()
  }, [W, H, single, leaves, applyAll])

  // ---------- tween loop ----------
  const tick = useCallback((now) => {
    raf.current = 0
    anims.current.forEach((a, li) => {
      if (now < a.t0) return
      if (a.from === null) a.from = P.current[li] ?? 0
      const t = clamp((now - a.t0) / a.dur, 0, 1)
      P.current[li] = a.from + (a.to - a.from) * a.ease(t)
      if (t >= 1) { P.current[li] = a.to; anims.current.delete(li); a.res() }
    })
    applyAll()
    if (anims.current.size) raf.current = requestAnimationFrame(tick)
  }, [applyAll])

  const run = useCallback((li, to, { delay = 0, dur = 1100, ease = easeInOut } = {}) =>
    new Promise((res) => {
      const prev = anims.current.get(li)
      if (prev) prev.res()
      const k = reduceMotion() ? 0.35 : 1
      anims.current.set(li, { from: null, to, t0: performance.now() + delay * k, dur: dur * k, ease, res })
      if (!raf.current) raf.current = requestAnimationFrame(tick)
    }), [tick])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  // ---------- navigation ----------
  const goTo = useCallback((target) => {
    const cur = stepRef.current
    target = clamp(target, 0, maxStep)
    if (busyRef.current || target === cur) return
    busyRef.current = true
    setBusy(true)
    const forward = target > cur
    const list = []
    if (forward) for (let i = cur; i < target; i++) list.push(i)
    else for (let i = cur - 1; i >= target; i--) list.push(i)
    const multi = list.length > 1
    const jobs = list.map((li, k) =>
      run(li, forward ? 1 : 0, { delay: k * 170, dur: multi ? 950 : li === 0 || (!single && li === leaves.length - 1) ? 1300 : 1150 }))
    stepRef.current = target
    setStep(target)
    Promise.all(jobs).then(() => { busyRef.current = false; setBusy(false) })
  }, [maxStep, run, single, leaves.length])

  const next = useCallback(() => goTo(stepRef.current + 1), [goTo])
  const prev = useCallback(() => goTo(stepRef.current - 1), [goTo])
  const closeBook = useCallback(() => goTo(0), [goTo])

  // gentle peel on hover (only when idle)
  const peel = useCallback((li, to) => {
    if (busyRef.current || li < 0 || li >= leaves.length || (single && li === leaves.length - 1)) return
    run(li, to, { dur: 260, ease: easeOut })
  }, [leaves.length, run, single])

  // Keyboard works anywhere on the page (the book is the page's main content).
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      const onButton = t && t.tagName === 'BUTTON'
      if (e.key === 'ArrowRight') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      else if ((e.key === 'Enter' || e.key === ' ') && stepRef.current === 0 && !onButton) { e.preventDefault(); next() }
      else if (e.key === 'Escape' || e.key === 'Home') { closeBook() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, closeBook])

  // swipe support
  const onPointerDown = (e) => { swipe.current = { x: e.clientX, y: e.clientY, done: false } }
  const onPointerUp = (e) => {
    const dx = e.clientX - swipe.current.x
    const dy = e.clientY - swipe.current.y
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      swipe.current.done = true
      setTimeout(() => { swipe.current.done = false }, 80)
      if (dx < 0) next(); else prev()
    }
  }
  const guard = (fn) => () => { if (!swipe.current.done) fn() }

  // ---------- render helpers ----------
  const box = (pg) => {
    const s = Math.min(W / pg.w, H / pg.h)
    const dw = pg.w * s
    const dh = pg.h * s
    return { dw, dh, ox: (W - dw) / 2, oy: (H - dh) / 2 }
  }
  const faceStyle = (def, side, i, sw, fw) => {
    if (def.blank || def.cover) return undefined
    const pg = menuPages[def.page]
    const b = box(pg)
    const x = side === 'front' ? b.ox - i * sw : b.ox - (W - i * sw - fw)
    return {
      backgroundColor: pg.bg,
      // matching paper above/below pages that are not exactly 2:3, so nothing is cropped or stretched
      backgroundImage: `url(${pg.src}), linear-gradient(to bottom, ${pg.bgTop} 0%, ${pg.bgTop} 50%, ${pg.bgBottom} 50%, ${pg.bgBottom} 100%)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${b.dw}px ${b.dh}px, 100% 100%`,
      backgroundPosition: `${x}px ${b.oy}px, 0 0`,
    }
  }
  const G = W * 0.16 // width of the gutter shadow near the spine
  const gut = (x) => 0.3 * Math.pow(Math.max(0, 1 - x / G), 2)
  const gutStyle = (side, i, sw, fw) => {
    const a0 = gut(i * sw)
    const a1 = gut(i * sw + fw)
    if (a0 < 0.004 && a1 < 0.004) return null
    const [from, to] = side === 'front' ? [a0, a1] : [a1, a0]
    return { background: `linear-gradient(to right, rgba(20,10,4,${from.toFixed(3)}), rgba(20,10,4,${to.toFixed(3)}))` }
  }

  const setRef = (li, key, idx) => (el) => {
    const r = (els.current[li] = els.current[li] || { strips: [], shF: [], shB: [] })
    if (idx === undefined) r[key] = el
    else r[key][idx] = el
  }

  const renderStrip = (li, leaf, idx) => {
    const sw = W / N_STRIPS
    const fw = idx === N_STRIPS - 1 ? sw : sw + 1
    const gf = gutStyle('front', idx, sw, fw)
    const gb = gutStyle('back', idx, sw, fw)
    return (
      <div key={idx} ref={setRef(li, 'strips', idx)} className="mb-strip" style={{ left: idx === 0 ? 0 : sw, width: fw }}>
        <div className={`mb-face front ${leaf.front.blank ? 'blank' : ''}`} style={faceStyle(leaf.front, 'front', idx, sw, fw)}>
          {gf && <div className="mb-gut" style={gf} />}
          <div className="mb-shade" ref={setRef(li, 'shF', idx)} />
        </div>
        <div className={`mb-face back ${leaf.back.blank ? 'blank' : ''}`} style={faceStyle(leaf.back, 'back', idx, sw, fw)}>
          {gb && <div className="mb-gut" style={gb} />}
          <div className="mb-shade" ref={setRef(li, 'shB', idx)} />
        </div>
        {idx < N_STRIPS - 1 && renderStrip(li, leaf, idx + 1)}
      </div>
    )
  }

  const renderLeaf = (leaf, li) => {
    if (leaf.kind === 'soft') {
      return (
        <div key={li} ref={setRef(li, 'leaf')} className="mb-leaf" style={{ width: W, height: H }}>
          {renderStrip(li, leaf, 0)}
        </div>
      )
    }
    return (
      <div key={li} ref={setRef(li, 'leaf')} className="mb-leaf" style={{ width: W, height: H }}>
        <div className="mb-face front rigid">
          {leaf.front.cover && <Cover />}
          <div className="mb-shade" ref={setRef(li, 'shF')} />
        </div>
        <div className={`mb-face back rigid ${leaf.back.blank ? 'blank' : ''}`} style={faceStyle(leaf.back, 'back', 0, W, W)}>
          <div className="mb-gut" style={{ background: 'linear-gradient(to left, rgba(20,10,4,.3), rgba(20,10,4,.1) 7%, rgba(20,10,4,0) 16%)' }} />
          <div className="mb-shade" ref={setRef(li, 'shB')} />
        </div>
      </div>
    )
  }

  // ---------- hotspots ----------
  const S = single ? W : 2 * W + 56
  const spine = single ? 0 : S / 2
  let hot = []
  if (W) {
    if (single) {
      if (step === 0) hot = [{ id: 'open', left: 0, w: W, label: 'Open the menu', onClick: next, enter: () => peel(0, 0.05), leave: () => peel(0, 0) }]
      else {
        hot = [
          { id: 'prev', left: 0, w: W * 0.3, label: 'Previous page', onClick: prev },
          step === maxStep
            ? { id: 'close', left: W * 0.3, w: W * 0.7, label: 'Return to the front cover', onClick: closeBook }
            : { id: 'next', left: W * 0.3, w: W * 0.7, label: 'Next page', onClick: next, enter: () => peel(step, 0.035), leave: () => peel(step, 0) },
        ]
      }
    } else if (step === 0) {
      hot = [{ id: 'open', left: spine - W / 2, w: W, label: 'Open the menu book', onClick: next, enter: () => peel(0, 0.05), leave: () => peel(0, 0) }]
    } else if (step === maxStep) {
      hot = [{ id: 'close', left: spine - W / 2, w: W, label: 'Close the book and return to the front cover', onClick: closeBook }]
    } else {
      hot = [
        { id: 'prev', left: spine - W, w: W, label: 'Previous page', onClick: prev, enter: () => peel(step - 1, 0.965), leave: () => peel(step - 1, 1) },
        { id: 'next', left: spine, w: W, label: 'Next page', onClick: next, enter: () => peel(step, 0.035), leave: () => peel(step, 0) },
      ]
    }
  }

  const status =
    step === 0 ? 'Front cover'
      : single ? `Page ${step} of 7`
        : step === maxStep ? 'Page 7'
          : `Pages ${2 * step - 1} and ${2 * step}`

  return (
    <div ref={rootRef} className="mb-root" aria-label="Interactive menu book. Use the arrow keys to turn pages." role="group">
      <p className="mb-sr" aria-live="polite">{status}</p>
      {W > 0 && (
        <div
          key={single ? 'single' : 'spread'}
          className={`mb-stage ${single ? 'single' : ''}`}
          style={{ width: S, height: H, margin: `${Math.round(H * 0.07)}px auto` }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div className="mb-scene" style={{ perspective: `${W * 4.2}px` }}>
            <div ref={setRef('book', 'book')} className="mb-book" style={{ left: spine }}>
              <div ref={setRef('book', 'plate')} className="mb-plate" style={{ top: -5, height: H + 10 }} />
              <div ref={setRef('book', 'stackL')} className="mb-stack" style={{ left: -W, width: W, height: H }} />
              <div ref={setRef('book', 'stackR')} className="mb-stack" style={{ left: 0, width: W, height: H }} />
              {leaves.map(renderLeaf)}
              {leaves.map((_, li) => (
                (single && li === leaves.length - 1) ? null : (
                  <div key={`c${li}`} ref={setRef(li, 'cast')} className="mb-cast" style={{ height: H, transform: `translateZ(${(leaves.length + 1) * Z + 0.3}px)` }} />
                )
              ))}
            </div>
          </div>
          <div className="mb-hot">
            {hot.map((h) => (
              <button key={h.id} type="button" className={`mb-hotspot ${h.id}`} style={{ left: h.left, width: h.w }} aria-label={h.label}
                disabled={busy} onClick={guard(h.onClick)} onMouseEnter={h.enter} onMouseLeave={h.leave} onFocus={h.enter} onBlur={h.leave} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-controls">
        <button type="button" className="mb-btn" onClick={prev} disabled={busy || step === 0} aria-label="Previous page"><ChevronLeft size={18} /></button>
        <span className="mb-status">{status}</span>
        <button type="button" className="mb-btn" onClick={next} disabled={busy || step === maxStep} aria-label="Next page"><ChevronRight size={18} /></button>
        <button type="button" className="mb-btn mb-close" onClick={closeBook} disabled={busy || step === 0}><X size={16} /> Close book</button>
      </div>
    </div>
  )
}
