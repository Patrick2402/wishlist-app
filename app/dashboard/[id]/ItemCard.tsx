'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WishlistItem } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const B = 'var(--font-sans)'
const C = 'var(--font-serif)'

const PC: Record<number, { bg: string; dot: string }> = {
  1: { bg: 'var(--c1-soft)', dot: 'var(--c1)' },
  2: { bg: 'var(--c2-soft)', dot: 'var(--c2)' },
  3: { bg: 'var(--c3-soft)', dot: 'var(--c3)' },
}
const DOTS: Record<number, number> = { 1: 3, 2: 2, 3: 1 }

export default function ItemCard({ item, index = 0 }: { item: WishlistItem; index?: number }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [hover, setHover] = useState(false)

  const pc = PC[item.priority] ?? PC[2]
  const dots = DOTS[item.priority] ?? 2

  async function handleDelete() {
    if (!confirm('Usunąć ten produkt?')) return
    setDeleting(true)
    await createClient().from('wishlist_items').delete().eq('id', item.id)
    router.refresh()
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--paper)', borderRadius: 20,
        boxShadow: hover ? 'var(--shadow-2)' : 'var(--shadow-1)',
        transform: hover ? 'translateY(-3px)' : 'none',
        transition: 'transform .25s var(--spring), box-shadow .25s var(--smooth)',
        overflow: 'hidden',
        opacity: item.is_reserved ? 0.68 : 1,
        animation: `pop-in .5s var(--spring) ${index * 0.04}s both`,
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Image / colour area */}
      <div style={{ height: 148, background: pc.bg, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {item.image_url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={item.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: pc.dot, opacity: .2 }} />
            </div>
          )
        }

        {/* Priority dots */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 5 }}>
          {Array.from({ length: dots }).map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: pc.dot, boxShadow: '0 1px 4px rgba(0,0,0,.18)' }} />
          ))}
        </div>

        {/* Reserved badge */}
        {item.is_reserved && (
          <div style={{
            position: 'absolute', bottom: 8, left: 8,
            background: 'rgba(31,26,20,.7)', backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: 'white', borderRadius: 20,
            fontFamily: B, fontSize: 11, fontWeight: 600,
            padding: '4px 10px', letterSpacing: '.01em',
          }}>
            ✓ zarezerwowane
          </div>
        )}

        {/* Hover action buttons */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          display: 'flex', gap: 4,
          opacity: hover ? 1 : 0, transition: 'opacity .15s',
        }}>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer"
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

      {/* Body */}
      <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <h4 style={{
          fontFamily: B, fontWeight: 600, fontSize: 14, color: 'var(--ink)', margin: 0, lineHeight: 1.35,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {item.title}
        </h4>
        {item.notes && (
          <p style={{ fontFamily: B, fontSize: 12, color: 'var(--ink-2)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.notes}
          </p>
        )}
        {item.price && (
          <div style={{ marginTop: 'auto', paddingTop: 6 }}>
            <span style={{ fontFamily: C, fontStyle: 'italic', fontSize: 19, color: 'var(--c1)', fontWeight: 400 }}>
              {formatPrice(item.price, item.currency)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
