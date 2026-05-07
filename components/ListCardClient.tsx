'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'

const C = 'var(--font-serif)'
const B = 'var(--font-sans)'

interface Props {
  id: string
  title: string
  subtitle: string
  emoji: string
  itemCount: number
  accent: string
  accentSoft: string
  index?: number
}

export default function ListCardClient({ id, title, subtitle, emoji, itemCount, accent, accentSoft, index = 0 }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hover, setHover] = useState(false)

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTilt({ x: -py * 6, y: px * 8 })
  }
  const onLeave = () => { setTilt({ x: 0, y: 0 }); setHover(false) }
  const onEnter = () => setHover(true)

  return (
    <Link
      href={`/dashboard/${id}`}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onEnter}
      style={{
        display: 'block', textDecoration: 'none',
        animation: `pop-in .7s var(--spring) ${index * 0.06}s both`,
        perspective: 800,
        height: 340,
      }}
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform .3s var(--smooth)',
      }}>
        {/* Bottom paper */}
        <div style={{
          position: 'absolute', inset: 18, borderRadius: 18,
          background: accentSoft, opacity: 0.9,
          transform: 'rotate(-3deg) translateZ(-20px)',
        }} />
        {/* Middle paper */}
        <div style={{
          position: 'absolute', inset: 10, borderRadius: 18,
          background: 'var(--paper)',
          transform: 'rotate(2deg) translateZ(-10px)',
        }} />
        {/* Top paper */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 20,
          background: 'var(--paper)', padding: 24,
          boxShadow: hover ? 'var(--shadow-2), inset 0 0 0 .5px rgba(255,255,255,.7)' : 'var(--shadow-1), inset 0 0 0 .5px rgba(255,255,255,.7)',
          display: 'flex', flexDirection: 'column',
          transition: 'box-shadow .3s var(--smooth)',
        }}>
          {/* Cover + chip */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
              boxShadow: 'inset 0 0 0 1px rgba(31,26,20,.16)',
              transition: 'transform .3s var(--spring)',
              transform: hover ? 'rotate(-5deg) scale(1.05)' : 'none',
            }}>{emoji}</div>
            <span className="chip" style={{ background: accentSoft, boxShadow: 'none', fontSize: 11 }}>
              {itemCount} {itemCount === 1 ? 'rzecz' : 'rzeczy'}
            </span>
          </div>

          <div style={{ flex: 1 }}>
            <h3 className="display" style={{ margin: '0 0 6px', fontSize: 32, lineHeight: 1.05, color: 'var(--ink)' }}>
              {title}
            </h3>
            <p style={{ fontFamily: B, margin: 0, color: 'var(--ink-2)', fontSize: 14 }}>{subtitle}</p>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11, color: 'var(--ink-2)', fontFamily: B }}>
                <span>Elementy</span>
                <span className="mono">{itemCount}</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: 'var(--bg-2)', overflow: 'hidden' }}>
                <div style={{ width: itemCount > 0 ? '100%' : '0%', height: '100%', background: accent, borderRadius: 999, transition: 'width .8s var(--spring)' }} />
              </div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: hover ? accent : 'var(--ink)', color: 'var(--paper)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .25s var(--smooth), transform .25s var(--spring)',
              transform: hover ? 'scale(1.1)' : 'none',
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
