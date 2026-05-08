'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Bow, Sparkle, FloatingDeco } from '@/components/decorations'

const C = 'var(--font-serif)'
const B = 'var(--font-sans)'

const ERROR_MESSAGES: Record<string, string> = {
  link_expired: 'Ten link już wygasł lub był użyty. Poproś o nowy link poniżej.',
  invalid_link: 'Nieprawidłowy link logowania. Spróbuj zalogować się ponownie.',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const err = params.get('error')
    if (err && ERROR_MESSAGES[err]) setError(ERROR_MESSAGES[err])
  }, [])

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
        @keyframes fade-up-in { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-soft  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        .send-btn:hover:not(:disabled) {
          background: color-mix(in srgb, var(--c1) 80%, black) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px color-mix(in srgb, var(--c1) 35%, transparent) !important;
        }
        .send-btn { transition: background .2s, transform .15s, box-shadow .2s; }
        .back-link { color: var(--ink-2); text-decoration: none; font-size: 13px; font-weight: 500; font-family: var(--font-sans); transition: color .15s; }
        .back-link:hover { color: var(--ink); }
      `}</style>

      {/* Full-page cream background */}
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Floating decorations */}
        <FloatingDeco top={60} right={80} rot={14} delay={0.3}>
          <Bow size={100} color="var(--c2)" />
        </FloatingDeco>
        <FloatingDeco top={160} left={60} rot={-10} delay={1.1} scale={0.8}>
          <Sparkle size={28} color="var(--c4)" />
        </FloatingDeco>
        <FloatingDeco bottom={100} right={120} rot={20} delay={0.7} scale={0.7}>
          <Sparkle size={20} color="var(--c3)" />
        </FloatingDeco>
        <FloatingDeco bottom={60} left={100} rot={-14} delay={1.6}>
          <Bow size={70} color="var(--c5)" />
        </FloatingDeco>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 48, animation: 'fade-up-in .7s var(--smooth) both', position: 'relative', zIndex: 1 }}>
          <span style={{ fontFamily: C, fontStyle: 'italic', fontSize: 32, color: 'var(--ink)', lineHeight: 1 }}>wisz</span>
          <span style={{ fontFamily: C, fontStyle: 'italic', fontSize: 32, color: 'var(--c1)', lineHeight: 1 }}>list</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c1)', display: 'inline-block', marginBottom: 6, marginLeft: 2 }} />
        </Link>

        {/* Editorial headline */}
        <div style={{
          textAlign: 'center',
          maxWidth: 520,
          marginBottom: 44,
          animation: 'fade-up-in .8s var(--smooth) .1s both',
          position: 'relative',
          zIndex: 1,
        }}>
          <blockquote style={{
            fontFamily: C,
            fontStyle: 'italic',
            fontSize: 'clamp(26px, 4vw, 40px)',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.22,
            margin: 0,
            padding: 0,
          }}>
            &ldquo;Najlepszy prezent<br />to taki, o którym<br /><em style={{ color: 'var(--c1)' }}>marzyłeś.</em>&rdquo;
          </blockquote>
        </div>

        {/* Form card */}
        <div style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--paper)',
          borderRadius: 24,
          padding: '36px 32px',
          boxShadow: 'var(--shadow-2), inset 0 0 0 .5px rgba(255,255,255,.7)',
          position: 'relative',
          zIndex: 1,
          animation: 'fade-up-in .9s var(--smooth) .2s both',
        }}>

          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 20, display: 'inline-block', animation: 'pulse-soft 2s ease infinite' }}>📬</div>
              <h2 style={{ fontFamily: C, fontStyle: 'italic', fontSize: 40, fontWeight: 400, color: 'var(--ink)', marginBottom: 14, lineHeight: 1.1 }}>
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
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: B, fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--c1)', marginBottom: 8 }}>
                  Logowanie
                </p>
                <h1 style={{ fontFamily: C, fontStyle: 'italic', fontSize: 'clamp(30px, 3.5vw, 38px)', fontWeight: 400, color: 'var(--ink)', margin: '0 0 8px', lineHeight: 1.1 }}>
                  Witaj!
                </h1>
                <p style={{ fontFamily: B, color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.65, fontWeight: 300, margin: 0 }}>
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
                      background: focused ? 'var(--bg)' : 'rgba(31,26,20,.04)',
                      border: `1.5px solid ${focused ? 'var(--c1)' : 'rgba(31,26,20,.12)'}`,
                      borderRadius: 14, padding: '14px 16px',
                      fontSize: 15, color: 'var(--ink)', outline: 'none', fontFamily: B,
                      transition: 'border-color .2s, background .2s',
                    }}
                  />
                </div>

                {error && (
                  <div style={{ background: 'var(--c1-soft)', border: '1px solid rgba(255,184,156,.35)', color: 'var(--ink)', fontSize: 13, padding: '10px 14px', borderRadius: 12, lineHeight: 1.4, fontFamily: B }}>
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

              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Link href="/" className="back-link">← Wróć do strony głównej</Link>
              </div>
            </>
          )}
        </div>

        {/* Subtle footer tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 32, justifyContent: 'center', animation: 'fade-up-in 1s var(--smooth) .4s both', position: 'relative', zIndex: 1 }}>
          {['🎂 Urodziny', '🎄 Boże Narodzenie', '💍 Ślub', '🎁 Imieniny'].map(t => (
            <span key={t} style={{ background: 'rgba(31,26,20,.05)', border: '1px solid rgba(31,26,20,.08)', color: 'var(--ink-2)', fontSize: 12, fontWeight: 500, padding: '5px 13px', borderRadius: 100, fontFamily: B }}>{t}</span>
          ))}
        </div>
      </div>
    </>
  )
}
