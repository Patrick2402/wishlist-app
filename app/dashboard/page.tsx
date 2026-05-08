export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { Wishlist, OCCASIONS } from '@/types'
import Link from 'next/link'
import { GiftBox, SquigglyUnderline, Bow, FloatingDeco, Sparkle } from '@/components/decorations'
import ListCardClient from '@/components/ListCardClient'

const C = 'var(--font-serif)'
const B = 'var(--font-sans)'
const S = 'var(--font-script)'

const ACCENT_CYCLE = [
  { c: 'var(--c1)', soft: 'var(--c1-soft)' },
  { c: 'var(--c3)', soft: 'var(--c3-soft)' },
  { c: 'var(--c5)', soft: 'var(--c5-soft)' },
  { c: 'var(--c2)', soft: 'var(--c2-soft)' },
  { c: 'var(--c4)', soft: 'var(--c4-soft)' },
]

const OCCASION_EMOJI: Record<string, string> = {
  birthday: '🎂', christmas: '🎄', wedding: '💍', nameday: '🌸',
  anniversary: '💐', baby: '🍼', graduation: '🎓', other: '🎁',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: wishlists } = await supabase
    .from('wishlists')
    .select('*, wishlist_items(count)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const occasionLabel = (val: string | null) =>
    OCCASIONS.find(o => o.value === val)?.label ?? 'Ogólna lista'

  const lists = (wishlists ?? []) as (Wishlist & { wishlist_items: { count: number }[] })[]

  return (
    <div style={{ padding: '0 0 80px' }}>
      <style>{`
        .new-list-card:hover { background: rgba(255,255,255,.5) !important; transform: translateY(-3px) rotate(-1deg) !important; }
        @media (max-width: 680px) {
          .dash-header { padding: 24px 20px 16px !important; flex-wrap: wrap; }
          .dash-content { padding: 0 16px !important; }
          .dash-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>
      {/* Header */}
      <header className="dash-header" style={{ padding: '32px 48px 20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, position: 'relative' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-2)', marginBottom: 12, fontFamily: B, textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 600 }}>
            <span style={{ width: 18, height: 1, background: 'var(--ink-2)' }} />
            Twoje listy
          </div>
          <h1 className="display" style={{ margin: 0, fontSize: 'clamp(40px, 5vw, 60px)', position: 'relative' }}>
            Moje <em style={{ color: 'var(--c1)' }}>listy</em>.
            <SquigglyUnderline width={120} color="var(--c1)" style={{ position: 'absolute', bottom: -10, left: 108 }} />
          </h1>
        </div>
        <Link href="/dashboard/new" className="btn btn-pop" style={{ fontSize: 14, padding: '12px 20px', whiteSpace: 'nowrap' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Nowa lista
        </Link>
      </header>

      {lists.length === 0 ? (
        /* Empty state */
        <div className="dash-content" style={{ padding: '0 48px' }}>
          <div style={{
            textAlign: 'center', padding: '64px 32px', borderRadius: 28,
            background: 'var(--paper)', boxShadow: 'var(--shadow-1)',
            position: 'relative', overflow: 'hidden',
          }}>
            <FloatingDeco top={-20} right={60} rot={12} delay={0}>
              <Bow size={90} color="var(--c2)" />
            </FloatingDeco>
            <FloatingDeco bottom={-10} left={40} rot={-8} delay={1}>
              <Sparkle size={24} color="var(--c4)" />
            </FloatingDeco>
            <GiftBox size={120} style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontFamily: C, fontStyle: 'italic', fontSize: 36, color: 'var(--ink)', marginBottom: 10 }}>
              Brak list życzeń
            </h2>
            <p style={{ fontFamily: B, color: 'var(--ink-2)', marginBottom: 28, fontSize: 15 }}>
              Stwórz pierwszą listę i zacznij zbierać marzenia!
            </p>
            <Link href="/dashboard/new" className="btn btn-pop" style={{ fontSize: 15, padding: '14px 28px' }}>
              Stwórz pierwszą listę ✦
            </Link>
          </div>
        </div>
      ) : (
        <div className="dash-content" style={{ padding: '8px 48px' }}>
          <div className="dash-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 28,
          }}>
            {lists.map((list, i) => {
              const itemCount = list.wishlist_items?.[0]?.count ?? 0
              const acc = ACCENT_CYCLE[i % ACCENT_CYCLE.length]
              const emoji = OCCASION_EMOJI[list.occasion ?? ''] ?? '🎁'
              return (
                <ListCardClient
                  key={list.id}
                  id={list.id}
                  title={list.title}
                  subtitle={occasionLabel(list.occasion)}
                  emoji={emoji}
                  itemCount={itemCount}
                  accent={acc.c}
                  accentSoft={acc.soft}
                  index={i}
                />
              )
            })}

            {/* Add new list card */}
            <Link href="/dashboard/new" className="new-list-card" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 10, height: 340, borderRadius: 22,
              border: '2px dashed var(--line-2)', textDecoration: 'none',
              background: 'transparent', color: 'var(--ink-2)',
              fontFamily: B, fontWeight: 500,
              transition: 'transform .3s var(--spring), background .3s',
              animation: `pop-in .7s var(--spring) ${lists.length * 0.06}s both`,
            }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--paper)', boxShadow: 'inset 0 0 0 1px var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <span className="display" style={{ fontSize: 22 }}>Nowa <em>lista</em></span>
              <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>kliknij i nazwij okazję</span>
            </Link>
          </div>

          {/* Footer promo */}
          <div style={{
            marginTop: 48, padding: '32px 36px', borderRadius: 28,
            background: `linear-gradient(135deg, var(--c4-soft), var(--c1-soft))`,
            display: 'flex', alignItems: 'center', gap: 32, position: 'relative', overflow: 'hidden',
          }}>
            <FloatingDeco top={-20} right={40} rot={10} delay={0.5}>
              <Bow size={110} color="var(--c1)" />
            </FloatingDeco>
            <FloatingDeco bottom={-30} right={200} rot={-6} delay={1.2}>
              <Sparkle size={28} color="var(--c4)" />
            </FloatingDeco>
            <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
              <div style={{ fontFamily: S, fontSize: 20, color: 'var(--ink-2)', marginBottom: 4 }}>jesienne święta</div>
              <h3 className="display" style={{ margin: '0 0 8px', fontSize: 32 }}>
                Pora pomyśleć o <em>Mikołaju</em>
              </h3>
              <p style={{ fontFamily: B, margin: '0 0 16px', color: 'var(--ink-2)', maxWidth: 400, fontSize: 14 }}>
                Stwórz listę dla całej rodziny i daj im podzielić się tym, kto co kupuje — bez podwójnych prezentów.
              </p>
              <Link href="/dashboard/new" className="btn btn-ghost" style={{ fontSize: 13 }}>
                Stwórz listę świąteczną
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
