'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Bow, Sparkle, Heart, Star, FloatingDeco, GiftBox } from '@/components/decorations'

const C = 'var(--font-serif)'
const B = 'var(--font-sans)'
const S = 'var(--font-script)'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @keyframes panel-in  { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes form-in   { from{opacity:0;transform:translateX(20px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes float-up  { from{opacity:0;transform:translateY(18px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-soft { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        .send-btn:hover:not(:disabled) { background:color-mix(in srgb, var(--c1) 80%, black)!important; transform:translateY(-2px); box-shadow:0 8px 24px color-mix(in srgb, var(--c1) 35%, transparent)!important; }
        .send-btn { transition: background .2s, transform .15s, box-shadow .2s; }
        .back-link { color:var(--ink-2); text-decoration:none; font-size:13px; font-weight:500; font-family:var(--font-sans); transition:color .15s; }
        .back-link:hover { color:var(--ink); }
        @media(max-width:680px) { .login-left{display:none!important} .login-right{padding:40px 24px!important} .login-grid{grid-template-columns:1fr!important} }
      `}</style>

      <div className="login-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

        {/* LEFT — brand panel */}
        <div className="login-left" style={{
          background: 'var(--ink)', position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: 40, animation: 'panel-in .8s var(--smooth) both',
        }}>
          <div className="grain-overlay" style={{ opacity: .04 }} />

          {/* Glows */}
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,122,95,.14) 0%, transparent 65%)', top: -120, right: -120, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,83,.08) 0%, transparent 65%)', bottom: 60, left: -80, pointerEvents: 'none' }} />

          {/* Floating decorations */}
          <FloatingDeco top={100} right={80} rot={12} delay={0.4}>
            <Bow size={80} color="var(--c2)" />
          </FloatingDeco>
          <FloatingDeco bottom={160} right={40} rot={-18} delay={1.2}>
            <Star size={24} color="var(--c4)" />
          </FloatingDeco>
          <FloatingDeco top={240} left={20} rot={8} delay={0.8} scale={0.7}>
            <Sparkle size={20} color="var(--c3)" />
          </FloatingDeco>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 2, position: 'relative', zIndex: 1 }}>
            <span style={{ fontFamily: C, fontStyle: 'italic', fontSize: 26, color: 'rgba(255,253,248,.9)' }}>wisz</span>
            <span style={{ fontFamily: C, fontStyle: 'italic', fontSize: 26, color: 'var(--c1)' }}>list</span>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--c1)', display: 'inline-block', marginBottom: 5, marginLeft: 2 }} />
          </Link>

          {/* Main content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <blockquote style={{
              fontFamily: C, fontSize: 'clamp(28px, 3vw, 46px)',
              fontStyle: 'italic', fontWeight: 400,
              color: 'rgba(255,253,248,.92)', lineHeight: 1.18,
              margin: '0 0 28px', padding: 0,
            }}>
              "Najlepszy prezent<br />to taki, o którym<br />marzyłeś."
            </blockquote>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
              {['🎂 Urodziny', '🎄 Boże Narodzenie', '💍 Ślub', '🎁 Imieniny'].map(t => (
                <span key={t} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.10)', color: 'rgba(255,253,248,.55)', fontSize: 12, fontWeight: 500, padding: '5px 13px', borderRadius: 100, fontFamily: B }}>{t}</span>
              ))}
            </div>

            {/* Mini preview cards */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[{ e: '🎧', t: 'Sony XM5', p: '1 299 zł' }, { e: '👟', t: 'Air Jordan', p: '849 zł' }, { e: '📚', t: 'Sapkowski', p: '289 zł' }].map(c => (
                <div key={c.t} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{c.e}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,253,248,.9)', fontFamily: B }}>{c.t}</div>
                    <div style={{ fontSize: 10, color: 'var(--c2)', marginTop: 2, fontFamily: B }}>{c.p}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="login-right" style={{
          background: 'var(--bg)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          padding: '60px 8vw',
          animation: 'form-in .8s var(--smooth) .1s both',
        }}>
          <div style={{ width: '100%', maxWidth: 380 }}>

            {sent ? (
              <div style={{ textAlign: 'center', animation: 'float-up .6s var(--smooth) both' }}>
                <div style={{ fontSize: 64, marginBottom: 20, display: 'inline-block', animation: 'pulse-soft 2s ease infinite' }}>📬</div>
                <h2 style={{ fontFamily: C, fontStyle: 'italic', fontSize: 44, fontWeight: 400, color: 'var(--ink)', marginBottom: 14, lineHeight: 1.1 }}>
                  Sprawdź skrzynkę!
                </h2>
                <p style={{ fontFamily: B, color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.7, fontWeight: 300 }}>
                  Wysłaliśmy link na{' '}
                  <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{email}</strong>.
                  Kliknij w link żeby się zalogować.
                </p>
                <button
                  onClick={() => setSent(false)}
                  style={{ marginTop: 24, background: 'none', border: 'none', color: 'var(--ink-2)', fontSize: 13, cursor: 'pointer', fontFamily: B }}
                >
                  Wyślij ponownie ↩
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 40 }}>
                  <p style={{ fontFamily: B, fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--c1)', marginBottom: 10 }}>
                    Logowanie
                  </p>
                  <h1 style={{ fontFamily: C, fontStyle: 'italic', fontSize: 'clamp(38px,4.5vw,54px)', fontWeight: 400, color: 'var(--ink)', margin: '0 0 10px', lineHeight: 1.06 }}>
                    Witaj!
                  </h1>
                  <p style={{ fontFamily: B, color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.65, fontWeight: 300, margin: 0 }}>
                    Podaj email — wyślemy magiczny link. Żadnego hasła!
                  </p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: B, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 8 }}>
                      Adres email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="ty@przyklad.pl"
                      required
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        background: focused ? 'var(--paper)' : 'rgba(31,26,20,.05)',
                        border: `1.5px solid ${focused ? 'var(--c1)' : 'rgba(31,26,20,.12)'}`,
                        borderRadius: 14, padding: '14px 16px',
                        fontSize: 15, color: 'var(--ink)', outline: 'none', fontFamily: B,
                        transition: 'border-color .2s, background .2s',
                      }}
                    />
                  </div>

                  {error && (
                    <div style={{ background: 'var(--c1-soft)', border: '1px solid rgba(224,122,95,.25)', color: 'var(--ink)', fontSize: 13, padding: '10px 14px', borderRadius: 12, lineHeight: 1.4, fontFamily: B }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="send-btn btn btn-pop"
                    style={{ justifyContent: 'center', fontSize: 15, padding: 15, borderRadius: 14, marginTop: 2 }}
                  >
                    {loading ? 'Wysyłanie...' : 'Wyślij link logowania →'}
                  </button>
                </form>

                <div style={{ marginTop: 28, textAlign: 'center' }}>
                  <Link href="/" className="back-link">← Wróć do strony głównej</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
