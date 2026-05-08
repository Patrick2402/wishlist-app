'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WishlistItem } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const B = 'var(--font-sans)'

// Soft background per priority (matching design)
const PC_BG: Record<number, string> = {
  1: 'var(--c1-soft)',
  2: 'var(--c2-soft)',
  3: 'var(--c3-soft)',
}

// Accent colour per priority for illustration fill
const PC_ACCENT: Record<number, string> = {
  1: 'var(--c1)',
  2: 'var(--c2)',
  3: 'var(--c3)',
}

// Simple gift-box placeholder illustration (SVG) — used when no image_url
function GiftIllustration({ accent }: { accent: string }) {
  const s = 'rgba(31,26,20,.65)'
  return (
    <svg viewBox="0 0 200 160" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* box body */}
      <rect x="38" y="82" width="124" height="72" rx="6" fill={accent} stroke={s} strokeWidth="1.8"/>
      {/* lid */}
      <rect x="30" y="66" width="140" height="22" rx="5" fill={accent} stroke={s} strokeWidth="1.8"/>
      {/* ribbon vertical */}
      <rect x="94" y="66" width="12" height="88" rx="2" fill="var(--paper)" opacity=".55"/>
      {/* ribbon horizontal on lid */}
      <rect x="30" y="72" width="140" height="10" rx="2" fill="var(--paper)" opacity=".55"/>
      {/* bow left loop */}
      <path d="M100 66 Q78 38 62 48 Q54 56 76 66 Z" fill="var(--paper)" stroke={s} strokeWidth="1.4"/>
      {/* bow right loop */}
      <path d="M100 66 Q122 38 138 48 Q146 56 124 66 Z" fill="var(--paper)" stroke={s} strokeWidth="1.4"/>
      {/* bow centre */}
      <circle cx="100" cy="66" r="6" fill={accent} stroke={s} strokeWidth="1.4"/>
    </svg>
  )
}

export default function ItemCard({ item, index = 0 }: { item: WishlistItem; index?: number }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [hover, setHover] = useState(false)

  const bg = PC_BG[item.priority] ?? PC_BG[2]
  const accent = PC_ACCENT[item.priority] ?? PC_ACCENT[2]

  async function handleDelete() {
    if (!confirm('Usunąć ten produkt?')) return
    setDeleting(true)
    await createClient().from('wishlist_items').delete().eq('id', item.id)
    router.refresh()
  }

  // Format price: strip trailing ".00" for whole numbers, keep decimals otherwise
  const priceStr = item.price
    ? (Number.isInteger(item.price) || item.price % 1 === 0
        ? String(Math.round(item.price))
        : item.price.toFixed(2).replace('.', ','))
    : null

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', cursor: 'default',
        background: 'var(--paper)', borderRadius: 20,
        boxShadow: hover ? 'var(--shadow-2)' : 'var(--shadow-1)',
        transform: hover ? 'translateY(-4px) rotate(-.3deg)' : 'translateY(0)',
        transition: 'transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease',
        overflow: 'hidden',
        opacity: item.is_reserved ? 0.78 : 1,
        animation: `pop-in .6s cubic-bezier(.34,1.56,.64,1) ${index * 0.04}s both`,
      }}
    >
      {/* ── Image / illustration area ── */}
      <div style={{
        position: 'relative', background: bg,
        borderBottom: '1px solid var(--line)',
        height: 180,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}>
        <div style={{
          width: '100%', height: '100%', maxWidth: 200,
          transition: 'transform .35s cubic-bezier(.34,1.56,.64,1)',
          transform: hover ? 'scale(1.04) rotate(-1.5deg)' : 'none',
        }}>
          {item.image_url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={item.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            : <GiftIllustration accent={accent} />
          }
        </div>

        {/* Reserved sticker */}
        {item.is_reserved && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'var(--ink)', color: 'var(--paper)',
            padding: '4px 10px', borderRadius: 999,
            fontFamily: B, fontSize: 11, fontWeight: 600,
            transform: 'rotate(6deg)',
            boxShadow: '0 4px 10px rgba(31,26,20,.18)',
          }}>
            ✓ zarezerwowane
          </div>
        )}

        {/* Priority dots — top left, p <= priority filled */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 3 }}>
          {[1, 2, 3].map(p => (
            <span key={p} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: p <= item.priority ? 'var(--ink)' : 'rgba(31,26,20,.18)',
            }}/>
          ))}
        </div>

        {/* Delete + link buttons — top right on hover */}
        <div style={{
          position: 'absolute', bottom: 10, right: 10,
          display: 'flex', gap: 4,
          opacity: hover ? 1 : 0, transition: 'opacity .15s',
        }}>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,251,242,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', textDecoration: 'none', boxShadow: '0 1px 4px rgba(0,0,0,.12)' }}
              title="Otwórz produkt"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M7 17 17 7M9 7h8v8"/></svg>
            </a>
          )}
          <button onClick={handleDelete} disabled={deleting}
            style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,251,242,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c1)', border: 'none', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,.12)' }}
            title="Usuń produkt"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: 18 }}>
        <h4 style={{
          margin: 0, fontFamily: B, fontSize: 16, fontWeight: 600, lineHeight: 1.25,
          color: 'var(--ink)', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {item.title}
        </h4>
        {item.notes && (
          <p style={{ margin: '4px 0 0', fontFamily: B, fontSize: 12, color: 'var(--ink-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.notes}
          </p>
        )}
        {priceStr && (
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span className="display" style={{ fontSize: 24, color: 'var(--ink)', lineHeight: 1 }}>
              {priceStr}
            </span>
            <span style={{ fontFamily: B, fontSize: 14, color: 'var(--ink-2)' }}>zł</span>
          </div>
        )}
      </div>
    </article>
  )
}
