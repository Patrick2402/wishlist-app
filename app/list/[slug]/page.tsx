export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { WishlistItem, OCCASIONS, PRIORITY_LABELS } from '@/types'
import { formatPrice } from '@/lib/utils'
import ReserveButton from './ReserveButton'
import PublicListAuth from './PublicListAuth'
import Link from 'next/link'
import type { Metadata } from 'next'
import { GiftBox, Bow, Sparkle, FloatingDeco, SquigglyUnderline } from '@/components/decorations'

const C = 'var(--font-serif)'
const B = 'var(--font-sans)'
const S = 'var(--font-script)'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('wishlists').select('title, description').eq('slug', slug).single()
  if (!data) return {}
  const title = `${data.title} — Lista życzeń`
  const description = data.description ?? `Sprawdź listę życzeń: ${data.title}. Kliknij i zarezerwuj prezent!`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pl_PL',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

const PRIORITY_COLORS: Record<number, { bg: string; dot: string }> = {
  1: { bg: 'var(--c3-soft)', dot: 'var(--c3)' },
  2: { bg: 'var(--c2-soft)', dot: 'var(--c2)' },
  3: { bg: 'var(--c1-soft)', dot: 'var(--c1)' },
}

export default async function PublicWishlistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: wishlist } = await supabase
    .from('wishlists')
    .select('*, wishlist_items(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!wishlist) notFound()

  const items: WishlistItem[] = (wishlist.wishlist_items ?? []).sort(
    (a: WishlistItem, b: WishlistItem) => a.position - b.position
  )

  const occasionLabel = OCCASIONS.find(o => o.value === wishlist.occasion)?.label
  const reservedCount = items.filter(i => i.is_reserved).length
  const progress = items.length > 0 ? Math.round((reservedCount / items.length) * 100) : 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <style>{`.product-link { color: var(--ink-2); transition: color .15s; } .product-link:hover { color: var(--c1) !important; }`}</style>
      {/* Sticky nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(250,246,238,.88)', backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid var(--line)',
        padding: '0 32px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontFamily: C, fontStyle: 'italic', fontSize: 22, color: 'var(--ink)' }}>wisz</span>
          <span style={{ fontFamily: C, fontStyle: 'italic', fontSize: 22, color: 'var(--c1)' }}>list</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--c1)', display: 'inline-block', marginBottom: 4, marginLeft: 2 }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: B, fontSize: 12, color: 'var(--ink-2)', fontWeight: 500 }}>
            {reservedCount}/{items.length} zarezerwowanych
          </span>
          <PublicListAuth slug={slug} />
        </div>
      </nav>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Hero header */}
        <div style={{ textAlign: 'center', marginBottom: 40, position: 'relative' }}>
          <FloatingDeco top={-20} right={0} rot={12} delay={0.3}>
            <Bow size={80} color="var(--c2)" />
          </FloatingDeco>
          <FloatingDeco bottom={0} left={-10} rot={-10} delay={1}>
            <Sparkle size={22} color="var(--c4)" />
          </FloatingDeco>

          <GiftBox size={100} style={{ margin: '0 auto 20px' }} />

          {occasionLabel && (
            <span className="chip" style={{ marginBottom: 14, display: 'inline-flex' }}>{occasionLabel}</span>
          )}
          <h1 style={{
            fontFamily: C, fontStyle: 'italic', fontWeight: 400,
            fontSize: 'clamp(36px, 5vw, 52px)', color: 'var(--ink)', marginBottom: 10, lineHeight: 1.08,
            position: 'relative', display: 'inline-block',
          }}>
            {wishlist.title}
            <SquigglyUnderline width={200} color="var(--c1)" style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)' }} />
          </h1>
          {wishlist.description && (
            <p style={{ fontFamily: B, color: 'var(--ink-2)', maxWidth: 420, margin: '16px auto 0', fontSize: 15, lineHeight: 1.65 }}>{wishlist.description}</p>
          )}

          {/* Progress */}
          {items.length > 0 && (
            <div style={{ marginTop: 24, maxWidth: 340, margin: '24px auto 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-2)', fontFamily: B, marginBottom: 6 }}>
                <span>Zarezerwowane</span>
                <span className="mono">{reservedCount}/{items.length} · {progress}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: 'var(--bg-2)', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--c1)', borderRadius: 999, transition: 'width 1s var(--spring)' }} />
              </div>
            </div>
          )}
        </div>

        {/* Info banner */}
        <div style={{
          padding: '14px 18px', borderRadius: 16, marginBottom: 28,
          background: 'var(--c4-soft)', boxShadow: 'inset 0 0 0 1px rgba(31,26,20,.08)',
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.3 }}>✦</span>
          <p style={{ fontFamily: B, fontSize: 13, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
            Kliknij <strong style={{ color: 'var(--ink)' }}>Rezerwuję</strong> przy produkcie, który chcesz podarować — właściciel listy nie zobaczy kto co zarezerwował. Prezent pozostanie niespodzianką!
          </p>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <GiftBox size={80} style={{ margin: '0 auto 16px', opacity: .4 }} />
            <p style={{ fontFamily: B, color: 'var(--ink-2)' }}>Lista jest jeszcze pusta.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map((item, i) => {
              const pc = PRIORITY_COLORS[item.priority] ?? PRIORITY_COLORS[2]
              return (
                <div key={item.id} style={{
                  background: 'var(--paper)', borderRadius: 20,
                  boxShadow: 'var(--shadow-1)', padding: '18px 20px',
                  opacity: item.is_reserved ? 0.68 : 1,
                  animation: `pop-in .5s var(--spring) ${i * 0.05}s both`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    {/* Image or priority dot */}
                    <div style={{ width: 64, height: 64, borderRadius: 14, background: pc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--line)' }}>
                      {item.image_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={item.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: 12, height: 12, borderRadius: '50%', background: pc.dot }} />
                      }
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                        <span className="chip" style={{ background: pc.bg, boxShadow: 'none', fontSize: 11, padding: '3px 9px' }}>
                          {PRIORITY_LABELS[item.priority]}
                        </span>
                        {item.is_reserved && (
                          <span className="chip" style={{ background: 'var(--c3-soft)', boxShadow: 'none', fontSize: 11, padding: '3px 9px' }}>
                            ✓ Zarezerwowane
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontFamily: B, fontWeight: 600, fontSize: 16, color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1.3 }}>{item.title}</h3>
                      {item.notes && (
                        <p style={{ fontFamily: B, fontSize: 13, color: 'var(--ink-2)', margin: '0 0 8px' }}>{item.notes}</p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        {item.price && (
                          <span style={{ fontFamily: C, fontStyle: 'italic', fontSize: 20, color: 'var(--c1)', fontWeight: 400 }}>
                            {formatPrice(item.price, item.currency)}
                          </span>
                        )}
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="product-link" style={{ fontFamily: B, fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M7 17 17 7M9 7h8v8"/></svg>
                            Zobacz produkt
                          </a>
                        )}
                      </div>
                    </div>

                    <div style={{ flexShrink: 0 }}>
                      <ReserveButton item={item} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <p style={{ fontFamily: S, fontSize: 20, color: 'var(--ink-2)', marginBottom: 6 }}>chcesz własną listę?</p>
          <Link href="/" style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16,
            color: 'var(--c1)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            Stwórz na wiszlist →
          </Link>
        </div>
      </div>
    </div>
  )
}
