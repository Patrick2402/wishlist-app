'use client'

import { useState } from 'react'
import Link from 'next/link'
import ListCardClient from './ListCardClient'
import { GiftBox, Bow, FloatingDeco, Sparkle, SquigglyUnderline } from './decorations'
import { OCCASIONS } from '@/types'

const occasionLabel = (val: string | null) =>
  OCCASIONS.find(o => o.value === val)?.label ?? 'Ogólna lista'

const B = 'var(--font-sans)'
const C = 'var(--font-serif)'
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

type OwnedList = {
  id: string
  title: string
  occasion: string | null
  wishlist_items: { count: number }[]
}

type ReservedItem = {
  id: string
  title: string
  image_url: string | null
  price: number | null
}

type BuyingForEntry = {
  wishlist: { id: string; title: string; slug: string; occasion: string | null }
  items: ReservedItem[]
}

export default function DashboardTabs({
  ownedLists,
  buyingFor,
}: {
  ownedLists: OwnedList[]
  buyingFor: BuyingForEntry[]
}) {
  const [tab, setTab] = useState<'mine' | 'buying'>('mine')

  return (
    <>
      <style>{`
        .new-list-card:hover { background: rgba(255,255,255,.5) !important; transform: translateY(-3px) rotate(-1deg) !important; }
        @media (max-width: 680px) {
          .dash-content { padding: 0 16px !important; }
          .dash-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>

      {/* Tab switcher */}
      <div className="dash-content" style={{ padding: '0 48px', marginBottom: 24 }}>
        <div style={{ display: 'inline-flex', gap: 4, background: 'var(--paper)', padding: 4, borderRadius: 16, boxShadow: 'inset 0 0 0 1px var(--line)' }}>
          <button
            onClick={() => setTab('mine')}
            style={{
              fontFamily: B, fontSize: 13, fontWeight: tab === 'mine' ? 700 : 500,
              padding: '8px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: tab === 'mine' ? 'var(--ink)' : 'transparent',
              color: tab === 'mine' ? 'var(--paper)' : 'var(--ink-2)',
              transition: 'background .2s, color .2s',
            }}
          >
            Moje listy
            <span style={{ marginLeft: 6, fontSize: 11, opacity: .7 }}>{ownedLists.length}</span>
          </button>
          <button
            onClick={() => setTab('buying')}
            style={{
              fontFamily: B, fontSize: 13, fontWeight: tab === 'buying' ? 700 : 500,
              padding: '8px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: tab === 'buying' ? 'var(--ink)' : 'transparent',
              color: tab === 'buying' ? 'var(--paper)' : 'var(--ink-2)',
              transition: 'background .2s, color .2s',
            }}
          >
            Kupuję na
            <span style={{ marginLeft: 6, fontSize: 11, opacity: .7 }}>{buyingFor.length}</span>
          </button>
        </div>
      </div>

      {/* --- MOJE LISTY --- */}
      {tab === 'mine' && (
        <div className="dash-content" style={{ padding: '0 48px' }}>
          {ownedLists.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '64px 32px', borderRadius: 28,
              background: 'var(--paper)', boxShadow: 'var(--shadow-1)',
              position: 'relative', overflow: 'hidden',
            }}>
              <FloatingDeco top={-20} right={60} rot={12} delay={0}>
                <Bow size={90} color="var(--c2)" />
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
          ) : (
            <>
              <div className="dash-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 28,
              }}>
                {ownedLists.map((list, i) => {
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

                <Link href="/dashboard/new" className="new-list-card" style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 10, height: 340, borderRadius: 22,
                  border: '2px dashed var(--line-2)', textDecoration: 'none',
                  background: 'transparent', color: 'var(--ink-2)',
                  fontFamily: B, fontWeight: 500,
                  transition: 'transform .3s var(--spring), background .3s',
                  animation: `pop-in .7s var(--spring) ${ownedLists.length * 0.06}s both`,
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
                background: 'linear-gradient(135deg, var(--c4-soft), var(--c1-soft))',
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
            </>
          )}
        </div>
      )}

      {/* --- KUPUJĘ NA --- */}
      {tab === 'buying' && (
        <div className="dash-content" style={{ padding: '0 48px' }}>
          {buyingFor.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '64px 32px', borderRadius: 28,
              background: 'var(--paper)', boxShadow: 'var(--shadow-1)',
            }}>
              <GiftBox size={100} style={{ margin: '0 auto 20px', opacity: .4 }} />
              <h2 style={{ fontFamily: C, fontStyle: 'italic', fontSize: 32, color: 'var(--ink)', marginBottom: 8 }}>
                Brak rezerwacji
              </h2>
              <p style={{ fontFamily: B, color: 'var(--ink-2)', fontSize: 14 }}>
                Wejdź na listę znajomego i zarezerwuj prezent — pojawi się tutaj.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {buyingFor.map((entry, i) => {
                const emoji = OCCASION_EMOJI[entry.wishlist.occasion ?? ''] ?? '🎁'
                const acc = ACCENT_CYCLE[i % ACCENT_CYCLE.length]
                return (
                  <div key={entry.wishlist.id} style={{
                    background: 'var(--paper)', borderRadius: 22,
                    boxShadow: 'var(--shadow-1)', overflow: 'hidden',
                    animation: `pop-in .5s var(--spring) ${i * 0.05}s both`,
                  }}>
                    {/* Wishlist header */}
                    <div style={{
                      padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: acc.soft, borderBottom: '1px solid var(--line)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 24 }}>{emoji}</span>
                        <div>
                          <div style={{ fontFamily: B, fontSize: 11, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600, marginBottom: 2 }}>
                            Lista życzeń
                          </div>
                          <div style={{ fontFamily: C, fontStyle: 'italic', fontSize: 22, color: 'var(--ink)' }}>
                            {entry.wishlist.title}
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/list/${entry.wishlist.slug}`}
                        style={{
                          fontFamily: B, fontSize: 12, fontWeight: 600,
                          color: 'var(--ink)', textDecoration: 'none',
                          padding: '7px 14px', borderRadius: 10,
                          background: 'var(--paper)', boxShadow: 'var(--shadow-1)',
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M7 17 17 7M9 7h8v8"/></svg>
                        Otwórz listę
                      </Link>
                    </div>

                    {/* Reserved items */}
                    <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ fontFamily: B, fontSize: 11, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>
                        Twoje rezerwacje ({entry.items.length})
                      </div>
                      {entry.items.map(item => (
                        <div key={item.id} style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '12px 16px', borderRadius: 14,
                          background: 'var(--bg)', boxShadow: 'inset 0 0 0 1px var(--line)',
                        }}>
                          {item.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image_url} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                          ) : (
                            <div style={{ width: 44, height: 44, borderRadius: 10, background: acc.soft, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={acc.c} strokeWidth="2" strokeLinecap="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/></svg>
                            </div>
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: B, fontSize: 14, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.title}
                            </div>
                            {item.price && (
                              <div style={{ fontFamily: C, fontStyle: 'italic', fontSize: 16, color: 'var(--ink-2)' }}>
                                {item.price} zł
                              </div>
                            )}
                          </div>
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '5px 12px', borderRadius: 999,
                            background: 'var(--c3-soft)', color: 'var(--ink)',
                            fontFamily: B, fontSize: 11, fontWeight: 600, flexShrink: 0,
                          }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Zarezerwowane
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </>
  )
}
