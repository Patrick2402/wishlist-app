'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WishlistItem } from '@/types'
import { useRouter } from 'next/navigation'

const B = 'var(--font-sans)'
const C = 'var(--font-serif)'
const S = 'var(--font-script)'

const PC_BG: Record<number, string> = {
  1: 'var(--c1-soft)',
  2: 'var(--c2-soft)',
  3: 'var(--c3-soft)',
}
const PC_ACCENT: Record<number, string> = {
  1: 'var(--c1)',
  2: 'var(--c2)',
  3: 'var(--c3)',
}

function GiftIllustration({ accent }: { accent: string }) {
  const s = 'rgba(31,26,20,.65)'
  return (
    <svg viewBox="0 0 200 160" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect x="38" y="82" width="124" height="72" rx="6" fill={accent} stroke={s} strokeWidth="1.8"/>
      <rect x="30" y="66" width="140" height="22" rx="5" fill={accent} stroke={s} strokeWidth="1.8"/>
      <rect x="94" y="66" width="12" height="88" rx="2" fill="var(--paper)" opacity=".55"/>
      <rect x="30" y="72" width="140" height="10" rx="2" fill="var(--paper)" opacity=".55"/>
      <path d="M100 66 Q78 38 62 48 Q54 56 76 66 Z" fill="var(--paper)" stroke={s} strokeWidth="1.4"/>
      <path d="M100 66 Q122 38 138 48 Q146 56 124 66 Z" fill="var(--paper)" stroke={s} strokeWidth="1.4"/>
      <circle cx="100" cy="66" r="6" fill={accent} stroke={s} strokeWidth="1.4"/>
    </svg>
  )
}

export default function ItemDetailModal({
  item,
  onClose,
}: {
  item: WishlistItem | null
  onClose: () => void
}) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const open = !!item

  async function handleDelete() {
    if (!item) return
    if (!confirm('Usunąć ten produkt?')) return
    setDeleting(true)
    await createClient().from('wishlist_items').delete().eq('id', item.id)
    router.refresh()
    onClose()
    setDeleting(false)
  }

  if (!item) {
    return (
      <>
        <div style={{ position: 'fixed', inset: 0, opacity: 0, pointerEvents: 'none', zIndex: 100 }} />
        <div style={{ position: 'fixed', top: 16, right: 16, bottom: 16, width: 520, opacity: 0, transform: 'translateX(560px)', zIndex: 101 }} />
      </>
    )
  }

  const bg = PC_BG[item.priority] ?? PC_BG[2]
  const accent = PC_ACCENT[item.priority] ?? PC_ACCENT[2]

  const priceStr = item.price
    ? (item.price % 1 === 0 ? String(Math.round(item.price)) : item.price.toFixed(2).replace('.', ','))
    : null

  return (
    <>
      <style>{`
        .slide-panel {
          position: fixed; top: 16px; right: 16px; bottom: 16px; width: 520px;
          background: var(--paper); border-radius: 28px;
          box-shadow: 0 32px 80px rgba(31,26,20,.22), inset 0 0 0 .5px rgba(255,255,255,.6);
          z-index: 101; overflow: hidden; display: flex; flex-direction: column;
          transition: transform .5s cubic-bezier(.34,1.56,.64,1), opacity .3s ease;
        }
        @media (max-width: 600px) {
          .slide-panel { top: 0 !important; right: 0 !important; bottom: 0 !important; width: 100% !important; border-radius: 0 !important; }
        }
      `}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(31,26,20,.28)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity .35s ease', zIndex: 100,
      }} />

      {/* Panel */}
      <div
        className="slide-panel"
        style={{
          transform: open ? 'translateX(0) scale(1)' : 'translateX(560px) scale(.96)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      >

        {/* Image area */}
        <div style={{
          position: 'relative', padding: 32, background: bg,
          borderBottom: '1px solid var(--line)', flexShrink: 0,
        }}>
          <button onClick={onClose} aria-label="Zamknij" style={{
            position: 'absolute', top: 20, right: 20,
            appearance: 'none', border: 0, background: 'var(--paper)', cursor: 'pointer',
            width: 36, height: 36, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-1)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>

          <div style={{ width: '100%', height: 220 }}>
            {item.image_url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={item.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              : <GiftIllustration accent={accent} />
            }
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 32px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Brand (notes as brand, or occasion label) */}
          {item.notes && (
            <div style={{ fontFamily: B, fontSize: 12, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>
              {item.notes}
            </div>
          )}

          {/* Title */}
          <h2 className="display" style={{ margin: item.notes ? '6px 0 16px' : '0 0 16px', fontSize: 38, lineHeight: 1.05 }}>
            {item.title}
          </h2>

          {/* Price + priority dots */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 24 }}>
            {priceStr && (
              <div className="display" style={{ fontSize: 44, lineHeight: 1 }}>
                {priceStr} <span style={{ fontFamily: B, fontSize: 18, color: 'var(--ink-2)' }}>zł</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3].map(p => (
                <span key={p} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: p <= item.priority ? 'var(--ink)' : 'rgba(31,26,20,.18)',
                }}/>
              ))}
            </div>
          </div>

          {/* Notes block (shown as "od właściciela" note) */}
          {item.notes && (
            <div style={{
              padding: 18, borderRadius: 14, background: 'var(--bg)',
              boxShadow: 'inset 0 0 0 1px var(--line)', marginBottom: 20,
            }}>
              <div style={{ fontFamily: B, fontSize: 11, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, marginBottom: 6 }}>
                notatka
              </div>
              <p style={{ margin: 0, fontFamily: S, fontSize: 18, lineHeight: 1.4, color: 'var(--ink)' }}>
                {item.notes}
              </p>
            </div>
          )}

          {/* Link */}
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              padding: '14px 18px', borderRadius: 14,
              background: 'var(--paper)', boxShadow: 'inset 0 0 0 1px var(--line)',
              textDecoration: 'none', color: 'var(--ink)',
              transition: 'box-shadow .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = 'inset 0 0 0 1.5px var(--c1)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'inset 0 0 0 1px var(--line)')}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: B, fontSize: 11, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, marginBottom: 3 }}>link</div>
                <div style={{ fontFamily: B, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.url.replace(/^https?:\/\//, '')}
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M7 17 17 7M9 7h8v8"/></svg>
            </a>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '18px 32px', display: 'flex', gap: 12,
          borderTop: '1px solid var(--line)', flexShrink: 0,
          background: 'var(--paper)',
        }}>
          <button
            onClick={handleDelete} disabled={deleting}
            className="btn btn-ghost"
            style={{ flex: 1, justifyContent: 'center', fontSize: 14, color: 'var(--ink-2)' }}
          >
            {deleting ? 'Usuwanie…' : 'Usuń produkt'}
          </button>
          {item.url ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer"
              className="btn btn-pop"
              style={{ flex: 2, justifyContent: 'center', fontSize: 14, textDecoration: 'none' }}
            >
              Otwórz sklep ✦
            </a>
          ) : (
            <button className="btn btn-pop" style={{ flex: 2, justifyContent: 'center', fontSize: 14, opacity: .5 }} disabled>
              Brak linku
            </button>
          )}
        </div>
      </div>
    </>
  )
}
