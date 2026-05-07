'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WishlistItem, PRIORITY_LABELS } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const B = 'var(--font-sans)'

const PRIORITY_DOT_COLORS: Record<number, string> = {
  1: 'var(--c3)',
  2: 'var(--c2)',
  3: 'var(--c1)',
}

const PRIORITY_BG: Record<number, string> = {
  1: 'var(--c3-soft)',
  2: 'var(--c2-soft)',
  3: 'var(--c1-soft)',
}

export default function ItemCard({ item, wishlistId, index = 0 }: { item: WishlistItem; wishlistId: string; index?: number }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [hover, setHover] = useState(false)

  async function handleDelete() {
    if (!confirm('Usunąć ten produkt?')) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('wishlist_items').delete().eq('id', item.id)
    router.refresh()
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--paper)', borderRadius: 18,
        boxShadow: hover ? 'var(--shadow-2)' : 'var(--shadow-1)',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'transform .25s var(--spring), box-shadow .25s var(--smooth)',
        padding: '16px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
        opacity: item.is_reserved ? 0.72 : 1,
        animation: `pop-in .5s var(--spring) ${index * 0.04}s both`,
      }}
    >
      {/* Priority indicator */}
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: PRIORITY_BG[item.priority] ?? 'var(--bg-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: PRIORITY_DOT_COLORS[item.priority] ?? 'var(--c2)' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
          <span className="chip" style={{ background: PRIORITY_BG[item.priority] ?? 'var(--bg-2)', boxShadow: 'none', fontSize: 11, padding: '3px 9px' }}>
            {PRIORITY_LABELS[item.priority]}
          </span>
          {item.is_reserved && (
            <span className="chip" style={{ background: 'var(--c3-soft)', boxShadow: 'none', fontSize: 11, padding: '3px 9px', color: 'var(--ink)' }}>
              ✓ Zarezerwowane
            </span>
          )}
        </div>
        <h4 style={{ fontFamily: B, fontWeight: 600, fontSize: 15, color: 'var(--ink)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 3, flexWrap: 'wrap' }}>
          {item.price && (
            <span style={{ fontFamily: B, fontWeight: 700, fontSize: 14, color: 'var(--c1)' }}>{formatPrice(item.price, item.currency)}</span>
          )}
          {item.notes && <span style={{ fontFamily: B, fontSize: 12, color: 'var(--ink-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{item.notes}</span>}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: hover ? 1 : 0, transition: 'opacity .2s', flexShrink: 0 }}>
        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer"
            style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)', textDecoration: 'none', transition: 'color .15s, background .15s' }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--ink)'; el.style.background = 'var(--bg-2)' }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--ink-2)'; el.style.background = 'var(--bg)' }}
            title="Otwórz produkt"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M7 17 17 7M9 7h8v8"/></svg>
          </a>
        )}
        <button onClick={handleDelete} disabled={deleting}
          style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)', border: 'none', cursor: 'pointer', transition: 'color .15s, background .15s' }}
          onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--c1)'; el.style.background = 'var(--c1-soft)' }}
          onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--ink-2)'; el.style.background = 'var(--bg)' }}
          title="Usuń produkt"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>
    </div>
  )
}
