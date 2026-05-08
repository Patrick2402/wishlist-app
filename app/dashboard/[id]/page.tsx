export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { WishlistItem, OCCASIONS } from '@/types'
import ItemsGrid from './ItemsGrid'
import ShareButton from './ShareButton'
import Link from 'next/link'
import { SquigglyUnderline, GiftBox, FloatingDeco, Bow } from '@/components/decorations'

const C = 'var(--font-serif)'
const B = 'var(--font-sans)'

const OCCASION_EMOJI: Record<string, string> = {
  birthday: '🎂', christmas: '🎄', wedding: '💍', nameday: '🌸',
  anniversary: '💐', baby: '🍼', graduation: '🎓', other: '🎁',
}

export default async function EditWishlistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: wishlist } = await supabase
    .from('wishlists')
    .select('*, wishlist_items(*)')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!wishlist) notFound()

  const items: WishlistItem[] = (wishlist.wishlist_items ?? []).sort(
    (a: WishlistItem, b: WishlistItem) => a.position - b.position
  )

  const occasionObj = OCCASIONS.find(o => o.value === wishlist.occasion)
  const emoji = OCCASION_EMOJI[wishlist.occasion ?? ''] ?? '🎁'

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Header */}
      <div style={{ padding: '24px 48px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-2)', fontFamily: B }}>
        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Listy
        </Link>
        <span style={{ opacity: .5 }}>/</span>
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{wishlist.title}</span>
      </div>

      <header style={{ padding: '16px 48px 20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          {occasionObj && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-2)', marginBottom: 10, fontFamily: B, textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 600 }}>
              <span style={{ width: 18, height: 1, background: 'var(--ink-2)' }} />
              Lista · {occasionObj.label}
            </div>
          )}
          <h1 className="display" style={{ margin: 0, fontSize: 'clamp(36px, 4.5vw, 56px)', position: 'relative' }}>
            <em>{wishlist.title}</em>
            <span style={{ position: 'absolute', top: -16, right: -48, transform: 'rotate(8deg)', display: 'inline-block', animation: 'float-soft 6s ease-in-out infinite' }}>
              <Bow size={68} color="var(--c2)" />
            </span>
          </h1>
          {wishlist.description && (
            <p style={{ fontFamily: B, color: 'var(--ink-2)', fontSize: 14, marginTop: 8 }}>{wishlist.description}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <ShareButton slug={wishlist.slug} />
          <a href="#add-item" className="btn btn-pop" style={{ fontSize: 13, padding: '10px 18px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Dodaj
          </a>
        </div>
      </header>

      {/* Stats strip */}
      <div style={{ margin: '0 48px 28px', padding: '18px 24px', borderRadius: 18, background: 'var(--paper)', boxShadow: 'inset 0 0 0 1px var(--line)', display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: B, fontSize: 11, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>Życzeń</div>
          <div className="display" style={{ fontSize: 32 }}>{items.length}</div>
        </div>
        <div style={{ width: 1, height: 36, background: 'var(--line)' }}/>
        <div>
          <div style={{ fontFamily: B, fontSize: 11, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>Zarezerwowanych</div>
          <div className="display" style={{ fontSize: 32 }}>{items.filter(i => i.is_reserved).length}</div>
        </div>
        <div style={{ width: 1, height: 36, background: 'var(--line)' }}/>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-2)', fontFamily: B, marginBottom: 6 }}>
            <span>Postęp</span>
            <span className="mono">{items.length > 0 ? Math.round((items.filter(i => i.is_reserved).length / items.length) * 100) : 0}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: 'var(--bg-2)', overflow: 'hidden' }}>
            <div style={{ width: items.length > 0 ? `${(items.filter(i => i.is_reserved).length / items.length) * 100}%` : '0%', height: '100%', background: 'var(--c1)', borderRadius: 999, transition: 'width 1s var(--spring)' }} />
          </div>
        </div>
      </div>

      <div id="add-item">
        <ItemsGrid items={items} wishlistId={id} />
      </div>
    </div>
  )
}
