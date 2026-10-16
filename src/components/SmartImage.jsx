import { useState } from 'react'
import dims from '../data/imageDims'

// Shows the image if the file exists; otherwise a tinted mountain placeholder,
// so the layout looks right before real photos are added.
export default function SmartImage({ src, alt, className = '', ...rest }) {
  const [failed, setFailed] = useState(false)
  if (failed || !src) {
    return (
      <div role="img" aria-label={alt} className={`relative overflow-hidden bg-gradient-to-br from-cream via-sand to-cocoa ${className}`}>
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="300" cy="80" r="28" fill="#FFF8EC" opacity=".7" />
          <path d="M0 300V190l70-70 60 60 80-110 90 100 100-70v300z" fill="#8C6E63" opacity=".55" />
          <path d="M0 300V230l90-60 70 50 90-80 150 90v70z" fill="#2B1D18" opacity=".45" />
        </svg>
        <span className="absolute right-3 top-3 rounded-full bg-ink/60 px-3 py-1 text-xs font-semibold text-cream">Demo photo</span>
      </div>
    )
  }
  const [w, h] = dims[src] || []
  return <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" onError={() => setFailed(true)} className={className} {...rest} />
}
