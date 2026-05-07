'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const C = 'var(--font-cormorant)'
const J = 'var(--font-jakarta)'

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
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes panelIn {
          from { opacity:0; transform:translateX(-20px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes formIn {
          from { opacity:0; transform:translateX(16px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes pulse {
          0%,100% { transform:scale(1); }
          50%      { transform:scale(1.05); }
        }
        @keyframes grain {
          0%,100% { transform:translate(0,0); }
          25%     { transform:translate(1%,-1%); }
          75%     { transform:translate(-1%,1%); }
        }
        .send-btn:hover:not(:disabled) { background:#be5420 !important; transform:translateY(-2px); box-shadow:0 8px 24px rgba(212,101,42,0.35) !important; }
        .send-btn { transition: background .2s, transform .15s, box-shadow .2s; }
        .back-link:hover { color:rgba(18,12,8,0.7) !important; }
        .back-link { transition: color .15s; }
        @media (max-width: 700px) {
          .login-left { display:none !important; }
          .login-right { padding:40px 24px !important; }
          .login-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div className="login-grid" style={{
        display:'grid', gridTemplateColumns:'1fr 1fr',
        minHeight:'100vh', fontFamily:J,
      }}>

        {/* ── LEFT PANEL ── */}
        <div className="login-left" style={{
          background:'#0C0804',
          position:'relative', overflow:'hidden',
          display:'flex', flexDirection:'column',
          justifyContent:'space-between',
          padding:'40px',
          animation:'panelIn .8s cubic-bezier(.16,1,.3,1) both',
        }}>

          {/* grain */}
          <div style={{
            position:'absolute', inset:'-50%',
            backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E")`,
            animation:'grain 8s steps(1) infinite',
            pointerEvents:'none', zIndex:0,
          }} />

          {/* glows */}
          <div style={{ position:'absolute', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle, rgba(212,101,42,0.13) 0%, transparent 65%)', top:'-100px', right:'-100px', pointerEvents:'none' }} />
          <div style={{ position:'absolute', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 65%)', bottom:'80px', left:'-80px', pointerEvents:'none' }} />

          {/* logo */}
          <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'10px', position:'relative', zIndex:1 }}>
            <span style={{ fontSize:'20px' }}>🎁</span>
            <span style={{ fontFamily:C, fontSize:'22px', fontWeight:600, color:'#F5EDD8' }}>Wishlist</span>
          </Link>

          {/* main content */}
          <div style={{ position:'relative', zIndex:1 }}>
            <blockquote style={{
              fontFamily:C, fontSize:'clamp(28px,3vw,46px)',
              fontStyle:'italic', fontWeight:400,
              color:'#F5EDD8', lineHeight:1.18,
              margin:'0 0 28px', padding:0,
            }}>
              "Najlepszy prezent<br />to taki, o którym<br />marzyłeś."
            </blockquote>

            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'36px' }}>
              {['🎂 Urodziny', '🎄 Boże Narodzenie', '💍 Ślub', '🎁 Imieniny'].map(t => (
                <span key={t} style={{
                  background:'rgba(255,255,255,0.05)',
                  border:'1px solid rgba(255,255,255,0.09)',
                  color:'rgba(245,237,216,0.55)',
                  fontSize:'12px', fontWeight:500,
                  padding:'5px 13px', borderRadius:'100px',
                }}>{t}</span>
              ))}
            </div>

            {/* floating mini cards */}
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              {[
                { e:'🎧', t:'Sony XM5', p:'1 299 zł' },
                { e:'👟', t:'Air Jordan', p:'849 zł' },
                { e:'📚', t:'Sapkowski', p:'289 zł' },
              ].map(c => (
                <div key={c.t} style={{
                  background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(255,255,255,0.07)',
                  borderRadius:'12px', padding:'10px 14px',
                  display:'flex', alignItems:'center', gap:'10px',
                }}>
                  <span style={{ fontSize:'18px' }}>{c.e}</span>
                  <div>
                    <div style={{ fontSize:'11px', fontWeight:600, color:'#F5EDD8' }}>{c.t}</div>
                    <div style={{ fontSize:'10px', color:'#C9A96E', marginTop:'2px' }}>{c.p}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="login-right" style={{
          background:'#F7F0E3',
          display:'flex', flexDirection:'column',
          justifyContent:'center', alignItems:'center',
          padding:'60px 8vw',
          animation:'formIn .8s cubic-bezier(.16,1,.3,1) .1s both',
        }}>
          <div style={{ width:'100%', maxWidth:'380px' }}>

            {sent ? (
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:'60px', marginBottom:'20px', animation:'pulse 2s ease infinite' }}>📬</div>
                <h2 style={{ fontFamily:C, fontSize:'40px', fontWeight:500, fontStyle:'italic', color:'#120C08', marginBottom:'14px', lineHeight:1.1 }}>
                  Sprawdź skrzynkę!
                </h2>
                <p style={{ color:'rgba(18,12,8,0.5)', fontSize:'16px', lineHeight:1.65, fontWeight:300 }}>
                  Wysłaliśmy link na{' '}
                  <strong style={{ color:'#120C08', fontWeight:600 }}>{email}</strong>.
                  Kliknij w link żeby się zalogować.
                </p>
                <button
                  onClick={() => setSent(false)}
                  style={{ marginTop:'24px', background:'none', border:'none', color:'rgba(18,12,8,0.4)', fontSize:'13px', cursor:'pointer', fontFamily:J }}
                >
                  Wyślij ponownie ↩
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom:'40px' }}>
                  <p style={{ fontSize:'11px', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#D4652A', marginBottom:'10px' }}>
                    Logowanie
                  </p>
                  <h1 style={{ fontFamily:C, fontSize:'clamp(36px,4vw,52px)', fontWeight:500, fontStyle:'italic', color:'#120C08', margin:'0 0 10px', lineHeight:1.08 }}>
                    Witaj!
                  </h1>
                  <p style={{ color:'rgba(18,12,8,0.45)', fontSize:'15px', lineHeight:1.6, fontWeight:300, margin:0 }}>
                    Podaj email — wyślemy magiczny link. Żadnego hasła!
                  </p>
                </div>

                <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                  <div>
                    <label style={{
                      display:'block', fontSize:'11px', fontWeight:700,
                      letterSpacing:'.1em', textTransform:'uppercase',
                      color:'rgba(18,12,8,0.45)', marginBottom:'8px',
                    }}>
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
                        width:'100%', boxSizing:'border-box',
                        background:'rgba(18,12,8,0.05)',
                        border:`1.5px solid ${focused ? '#D4652A' : 'rgba(18,12,8,0.1)'}`,
                        borderRadius:'12px', padding:'14px 16px',
                        fontSize:'15px', color:'#120C08',
                        outline:'none', fontFamily:J,
                        transition:'border-color .2s',
                      }}
                    />
                  </div>

                  {error && (
                    <div style={{
                      background:'#FFF0EE', border:'1px solid rgba(212,101,42,0.25)',
                      color:'#8B2E24', fontSize:'13px', padding:'10px 14px',
                      borderRadius:'10px', lineHeight:1.4,
                    }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="send-btn"
                    style={{
                      background: loading || !email.trim() ? 'rgba(212,101,42,0.5)' : '#D4652A',
                      color:'#F5EDD8', border:'none',
                      borderRadius:'12px', padding:'15px',
                      fontSize:'15px', fontWeight:600,
                      cursor: loading || !email.trim() ? 'not-allowed' : 'pointer',
                      fontFamily:J, letterSpacing:'.01em',
                    }}
                  >
                    {loading ? 'Wysyłanie...' : 'Wyślij link logowania →'}
                  </button>
                </form>

                <div style={{ marginTop:'28px', textAlign:'center' }}>
                  <Link href="/" className="back-link" style={{
                    color:'rgba(18,12,8,0.35)', fontSize:'13px',
                    textDecoration:'none', fontWeight:500,
                  }}>
                    ← Wróć do strony głównej
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </>
  )
}
