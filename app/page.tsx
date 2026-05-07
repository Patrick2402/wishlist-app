'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Sparkle, Bow, Heart, Star, GiftBox, GiftTag, SquigglyUnderline, FloatingDeco } from '@/components/decorations'

const C = 'var(--font-serif)'
const B = 'var(--font-sans)'
const S = 'var(--font-script)'

const MOCK_LISTS = [
  { title: 'Urodziny Kasi', subtitle: 'Czerwiec 2025', items: 12, reserved: 4, accent: 'var(--c1)', soft: 'var(--c1-soft)', emoji: '🎂', rot: -4 },
  { title: 'Boże Narodzenie', subtitle: 'Cała rodzina', items: 18, reserved: 11, accent: 'var(--c3)', soft: 'var(--c3-soft)', emoji: '🎄', rot: 2 },
  { title: 'Ślub Magdy', subtitle: 'Wrzesień 2025', items: 9, reserved: 7, accent: 'var(--c5)', soft: 'var(--c5-soft)', emoji: '💍', rot: -1 },
]

const FEATURES = [
  { n: '01', title: 'Jeden link,\nwszyscy wiedzą', body: 'Udostępnij link do listy — znajomi sami wybiorą co kupić. Zero duplikatów, zero niezręcznych pytań.', accent: 'var(--c1-soft)', icon: 'link' },
  { n: '02', title: 'Anonimowe\nrezerwacje', body: 'Osoba rezerwująca prezent jest dla ciebie niewidoczna. Niespodzianka jest ocalona.', accent: 'var(--c3-soft)', icon: 'lock' },
  { n: '03', title: 'Zawsze\nbezpłatnie', body: 'Tworzenie list, udostępnianie i rezerwacje są bezpłatne. Zawsze. Obiecujemy.', accent: 'var(--c5-soft)', icon: 'gift' },
]

function MockListCard({ list, style }: { list: (typeof MOCK_LISTS)[0]; style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'relative', width: 280, height: 340, ...style }}>
      <div style={{ position: 'absolute', inset: 16, borderRadius: 18, background: list.soft, transform: 'rotate(-3deg)' }} />
      <div style={{ position: 'absolute', inset: 8, borderRadius: 18, background: 'var(--paper)', transform: 'rotate(1.5deg)' }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 20, background: 'var(--paper)', padding: 22,
        boxShadow: 'var(--shadow-2), inset 0 0 0 .5px rgba(255,255,255,.8)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: list.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: 'inset 0 0 0 1px rgba(31,26,20,.14)' }}>{list.emoji}</div>
          <span className="chip" style={{ background: list.soft, boxShadow: 'none', fontSize: 11 }}>{list.items} życzeń</span>
        </div>
        <div style={{ flex: 1 }}>
          <h3 className="display" style={{ fontSize: 28, marginBottom: 4 }}>{list.title}</h3>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', fontFamily: B }}>{list.subtitle}</p>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11, color: 'var(--ink-2)', fontFamily: B }}>
            <span>Zarezerwowane</span>
            <span className="mono">{list.reserved}/{list.items}</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'var(--bg-2)', overflow: 'hidden' }}>
            <div style={{ width: `${(list.reserved / list.items) * 100}%`, height: '100%', background: list.accent, borderRadius: 999 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (!heroRef.current) return
      const r = heroRef.current.getBoundingClientRect()
      setMouse({
        x: (e.clientX - r.left - r.width / 2) / r.width,
        y: (e.clientY - r.top - r.height / 2) / r.height,
      })
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  return (
    <>
      <style>{`
        @keyframes hero-in {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .hw { animation: hero-in .9s var(--smooth) both; }
        .hw:nth-child(1){animation-delay:.05s} .hw:nth-child(2){animation-delay:.18s}
        .hw:nth-child(3){animation-delay:.31s} .hw:nth-child(4){animation-delay:.44s}
        .nav-link { color:var(--ink-2); text-decoration:none; font-weight:500; font-size:14px; font-family:var(--font-sans); transition:color .15s; }
        .nav-link:hover { color:var(--ink); }
        .fc { transition: transform .35s var(--spring), box-shadow .35s var(--smooth); }
        .fc:hover { transform:translateY(-6px) rotate(-.4deg); box-shadow:var(--shadow-2) !important; }
        @media (max-width:860px) {
          .hero-grid { grid-template-columns:1fr !important; }
          .hero-cards { display:none !important; }
          .feat-grid  { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(250,246,238,.88)', backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid var(--line)',
        padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 58, animation: 'hero-in .5s var(--smooth) both',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontFamily: C, fontSize: 26, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1 }}>wisz</span>
          <span style={{ fontFamily: C, fontSize: 26, fontStyle: 'italic', color: 'var(--c1)', lineHeight: 1 }}>list</span>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--c1)', display: 'inline-block', marginBottom: 5, marginLeft: 2 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Link href="/login" className="nav-link">Zaloguj się</Link>
          <Link href="/login" className="btn" style={{ padding: '9px 18px', fontSize: 13, borderRadius: 12 }}>Stwórz listę →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{
        position: 'relative', overflow: 'hidden',
        minHeight: 'calc(100vh - 58px)',
        display: 'flex', alignItems: 'center', background: 'var(--bg)',
      }}>
        <div className="grain-overlay" />
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,122,95,.10) 0%, transparent 65%)', top: -120, right: -80, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,178,154,.09) 0%, transparent 65%)', bottom: -60, left: '25%', pointerEvents: 'none' }} />

        <FloatingDeco top={80} left={28} rot={-18} delay={0}><Star size={26} color="var(--c4)" /></FloatingDeco>
        <FloatingDeco top={160} right={480} rot={14} delay={0.8} scale={0.8}><Heart size={20} color="var(--c1)" /></FloatingDeco>
        <FloatingDeco bottom={110} left={52} rot={8} delay={1.4}><Sparkle size={18} color="var(--c3)" /></FloatingDeco>
        <FloatingDeco top={50} right={48} rot={10} delay={0.4}><GiftTag size={50} color="var(--c4)" /></FloatingDeco>

        <div className="hero-grid" style={{
          width: '100%', maxWidth: 1200, margin: '0 auto', padding: '64px 48px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center',
        }}>
          {/* Left */}
          <div>
            <div style={{ marginBottom: 22, display: 'flex', flexWrap: 'wrap', gap: 8, animation: 'hero-in .6s var(--smooth) both' }}>
              {['🎂 Urodziny', '🎄 Boże Narodzenie', '💍 Ślub', '🎁 Imieniny'].map(t => (
                <span key={t} className="chip" style={{ fontSize: 12 }}>{t}</span>
              ))}
            </div>

            <h1 style={{ fontFamily: C, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(44px, 5.5vw, 72px)', lineHeight: 1.06, marginBottom: 24, color: 'var(--ink)' }}>
              <span className="hw">Marzenia </span>
              <span className="hw">zebrane, </span>
              <span className="hw" style={{ color: 'var(--c1)' }}>niespodzianki </span>
              <span className="hw">ocalałe.</span>
            </h1>

            <p style={{ fontFamily: B, fontSize: 17, lineHeight: 1.7, color: 'var(--ink-2)', marginBottom: 36, maxWidth: 440, animation: 'hero-in .9s var(--smooth) .4s both' }}>
              Zbierz życzenia w jednym miejscu, udostępnij link — a znajomi sami wybiorą co kupić. Koniec z duplikatami.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', animation: 'hero-in .9s var(--smooth) .55s both' }}>
              <Link href="/login" className="btn btn-pop" style={{ fontSize: 15, padding: '14px 28px' }}>Stwórz pierwszą listę ✦</Link>
              <a href="#jak-to-dziala" className="btn btn-ghost" style={{ fontSize: 15, padding: '14px 28px' }}>Jak to działa?</a>
            </div>

            <div style={{ marginTop: 44, display: 'flex', alignItems: 'center', gap: 14, animation: 'hero-in .9s var(--smooth) .7s both' }}>
              <div style={{ display: 'flex' }}>
                {['#E07A5F','#81B29A','#9FC8E0','#D4A853'].map((c, i) => (
                  <div key={c} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: '2.5px solid var(--bg)', marginLeft: i === 0 ? 0 : -10, position: 'relative', zIndex: 4 - i, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C, fontStyle: 'italic', fontSize: 14, color: 'var(--paper)' }}>
                    {['K','M','A','P'][i]}
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: B, fontSize: 13, color: 'var(--ink-2)', margin: 0 }}>Dołącz do setek rodzin korzystających z wishlist</p>
            </div>
          </div>

          {/* Right — cards */}
          <div className="hero-cards" style={{ position: 'relative', height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {MOCK_LISTS.map((list, i) => (
              <div key={list.title} style={{
                position: 'absolute',
                transform: `rotate(${list.rot + mouse.x * 3}deg) translateY(${-i * 14 + mouse.y * 8}px) translateX(${mouse.x * (i - 1) * 10}px) scale(${1 - i * 0.04})`,
                zIndex: 3 - i,
                transition: 'transform .5s var(--smooth)',
                left: `${24 + i * 14}px`, top: `${i * 12}px`,
                animation: `pop-in .8s var(--spring) ${i * 0.12 + 0.2}s both`,
              }}>
                <MockListCard list={list} />
              </div>
            ))}
            <FloatingDeco top={10} right={10} rot={12} delay={0.3}><Bow size={72} color="var(--c2)" /></FloatingDeco>
            <FloatingDeco bottom={30} right={0} rot={-12} delay={1.1}><Sparkle size={24} color="var(--c1)" /></FloatingDeco>
            <FloatingDeco bottom={70} left={0} rot={6} delay={0.7}><Heart size={18} color="var(--c5)" /></FloatingDeco>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="jak-to-dziala" style={{ background: 'var(--paper)', borderTop: '1px solid var(--line)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: S, fontSize: 22, color: 'var(--ink-2)', marginBottom: 8 }}>jak to działa?</p>
            <h2 style={{ fontFamily: C, fontStyle: 'italic', fontSize: 'clamp(36px, 4vw, 56px)', color: 'var(--ink)', fontWeight: 400, position: 'relative', display: 'inline-block' }}>
              Trzy kroki do spokoju
              <SquigglyUnderline width={280} color="var(--c1)" style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)' }} />
            </h2>
          </div>
          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
            {FEATURES.map((f, i) => (
              <div key={f.n} className="fc" style={{
                padding: '32px 28px', borderRadius: 24, background: f.accent,
                position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-1)',
                animation: `pop-in .7s var(--spring) ${i * 0.1 + 0.1}s both`,
              }}>
                <div style={{ fontFamily: C, fontStyle: 'italic', fontSize: 64, color: 'rgba(31,26,20,.07)', lineHeight: 1, position: 'absolute', top: 16, right: 20 }}>{f.n}</div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(31,26,20,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  {f.icon === 'link' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7 0l4-4a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-4 4a5 5 0 0 0 7 7l1-1"/></svg>}
                  {f.icon === 'lock' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                  {f.icon === 'gift' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>}
                </div>
                <h3 style={{ fontFamily: C, fontStyle: 'italic', fontSize: 28, marginBottom: 10, whiteSpace: 'pre-line', color: 'var(--ink)' }}>{f.title}</h3>
                <p style={{ fontFamily: B, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.65, margin: 0 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 48px', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        <div className="grain-overlay" style={{ opacity: .03 }} />
        <FloatingDeco top={-30} right={100} rot={12} delay={0}><Bow size={100} color="var(--c2)" /></FloatingDeco>
        <FloatingDeco bottom={-20} left={80} rot={-10} delay={1.2}><Star size={30} color="var(--c4)" /></FloatingDeco>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <GiftBox size={120} style={{ margin: '0 auto 28px' }} />
          <p style={{ fontFamily: S, fontSize: 24, color: 'var(--c1)', marginBottom: 12 }}>gotowy?</p>
          <h2 style={{ fontFamily: C, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(36px, 4.5vw, 56px)', lineHeight: 1.08, color: 'var(--ink)', marginBottom: 16 }}>
            Zacznij zbierać marzenia.<br />To zajmie minutę.
          </h2>
          <p style={{ fontFamily: B, fontSize: 16, color: 'var(--ink-2)', marginBottom: 32, lineHeight: 1.7 }}>
            Bez instalacji, bez karty kredytowej. Wystarczy adres email.
          </p>
          <Link href="/login" className="btn btn-pop" style={{ fontSize: 16, padding: '16px 32px', borderRadius: 16 }}>
            Stwórz listę za darmo ✦
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--line)', padding: '22px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--paper)', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontFamily: C, fontStyle: 'italic', fontSize: 20, color: 'var(--ink)' }}>wisz</span>
          <span style={{ fontFamily: C, fontStyle: 'italic', fontSize: 20, color: 'var(--c1)' }}>list</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--c1)', display: 'inline-block', marginBottom: 4, marginLeft: 2 }} />
        </div>
        <p style={{ fontFamily: B, fontSize: 12, color: 'var(--ink-2)' }}>Magia prezentów, bez dramy. Made with ✦ in Poland.</p>
      </footer>
    </>
  )
}
