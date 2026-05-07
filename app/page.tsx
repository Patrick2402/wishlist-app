'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

const C = 'var(--font-cormorant)'
const J = 'var(--font-jakarta)'

const CARDS = [
  { emoji: '🎧', title: 'Sony WH-1000XM5', price: '1 299 zł', rot: -8, delay: 0.2, bg: '#221810', top: '30px', left: '40px' },
  { emoji: '👟', title: 'Nike Air Jordan 1', price: '849 zł', rot: 6, delay: 0.4, bg: '#1A1208', top: '200px', left: '210px' },
  { emoji: '📚', title: 'Sapkowski Kolekcja', price: '289 zł', rot: -4, delay: 0.65, bg: '#1E1610', top: '360px', left: '20px' },
  { emoji: '🎮', title: 'PS5 DualSense', price: '349 zł', rot: 7, delay: 0.85, bg: '#1C1008', top: '110px', left: '340px' },
  { emoji: '💄', title: 'Charlotte Tilbury', price: '299 zł', rot: -5, delay: 1.05, bg: '#231410', top: '300px', left: '350px' },
]

function GiftCard({ emoji, title, price, rot, delay, bg, top, left }: typeof CARDS[0]) {
  return (
    <div style={{
      position: 'absolute', top, left,
      width: '155px',
      background: bg,
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      opacity: 0,
      animation: `cardIn 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s forwards`,
    }}>
      <div style={{ fontSize: '28px', lineHeight: 1 }}>{emoji}</div>
      <div style={{ marginTop: '10px', fontSize: '12px', fontWeight: 600, color: '#F5EDD8', lineHeight: 1.35 }}>{title}</div>
      <div style={{ marginTop: '5px', fontSize: '11px', color: '#C9A96E', fontFamily: J }}>{price}</div>
      <div style={{
        marginTop: '12px',
        height: '2px',
        borderRadius: '2px',
        background: 'linear-gradient(90deg, rgba(212,101,42,0.6), transparent)',
      }} />
    </div>
  )
}

export default function HomePage() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!heroRef.current) return
      const r = heroRef.current.getBoundingClientRect()
      setMouse({
        x: ((e.clientX - r.left) / r.width - 0.5) * 28,
        y: ((e.clientY - r.top) / r.height - 0.5) * 18,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('vis')),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.rv').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @keyframes cardIn {
          from { opacity:0; transform:translateY(50px) rotate(var(--r,0deg)); }
          to   { opacity:1; transform:translateY(0)    rotate(var(--r,0deg)); }
        }
        @keyframes sway {
          0%,100% { transform:translateY(0px); }
          50%      { transform:translateY(-10px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(32px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes badgePop {
          from { opacity:0; transform:scale(0.85) translateY(8px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes grain {
          0%,100% { transform:translate(0,0); }
          10%     { transform:translate(-1%,-2%); }
          30%     { transform:translate(2%, 1%); }
          60%     { transform:translate(-2%, 3%); }
          80%     { transform:translate(1%, -1%); }
        }
        .rv {
          opacity:0;
          transform:translateY(28px);
          transition: opacity .75s cubic-bezier(.16,1,.3,1), transform .75s cubic-bezier(.16,1,.3,1);
        }
        .rv.vis { opacity:1; transform:translateY(0); }
        .rv.d1 { transition-delay:.12s; }
        .rv.d2 { transition-delay:.24s; }
        .rv.d3 { transition-delay:.36s; }
        .cta-btn:hover { background:#be5420 !important; transform:translateY(-2px); }
        .cta-btn { transition: background .2s, transform .2s; }
        .ghost-btn:hover { background:rgba(255,255,255,0.1) !important; }
        .ghost-btn { transition: background .2s; }
        .feature-card:hover { border-color:rgba(212,101,42,0.25) !important; transform:translateY(-4px); }
        .feature-card { transition: border-color .2s, transform .2s; }
        @media (max-width:768px) {
          .hero-cards { display:none !important; }
          .hero-text { max-width:100% !important; }
          .grid-3 { grid-template-columns:1fr !important; }
          .grid-features { grid-template-columns:1fr !important; }
          nav .nav-links { display:none !important; }
        }
      `}</style>

      <div style={{ background:'#0F0904', color:'#F5EDD8', overflowX:'hidden', fontFamily: J }}>

        {/* ── NAV ── */}
        <nav style={{
          position:'fixed', top:0, left:0, right:0, zIndex:100,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'14px 6vw',
          background:'rgba(15,9,4,0.75)',
          backdropFilter:'blur(24px)',
          borderBottom:'1px solid rgba(255,255,255,0.05)',
        }}>
          <span style={{ fontFamily:C, fontSize:'22px', fontWeight:600, display:'flex', alignItems:'center', gap:'8px' }}>
            🎁 Wishlist
          </span>
          <div className="nav-links" style={{ display:'flex', gap:'8px', alignItems:'center' }}>
            <Link href="/login" style={{ color:'rgba(245,237,216,0.55)', textDecoration:'none', fontSize:'14px', padding:'8px 16px' }}>
              Zaloguj się
            </Link>
            <Link href="/login" className="cta-btn" style={{
              background:'#D4652A', color:'#F5EDD8', textDecoration:'none',
              fontSize:'14px', fontWeight:600, padding:'10px 22px', borderRadius:'100px',
            }}>
              Zacznij za darmo →
            </Link>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section ref={heroRef} style={{
          minHeight:'100vh', display:'flex', alignItems:'center',
          padding:'120px 6vw 80px', position:'relative', overflow:'hidden',
        }}>
          {/* grain overlay */}
          <div style={{
            position:'absolute', inset:'-50%',
            backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='.035'/%3E%3C/svg%3E")`,
            animation:'grain 7s steps(1) infinite',
            pointerEvents:'none', zIndex:0,
          }} />

          {/* ambient glows */}
          <div style={{ position:'absolute', width:'700px', height:'700px', borderRadius:'50%', background:'radial-gradient(circle, rgba(212,101,42,0.11) 0%, transparent 65%)', top:'-150px', right:'15%', pointerEvents:'none' }} />
          <div style={{ position:'absolute', width:'450px', height:'450px', borderRadius:'50%', background:'radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 65%)', bottom:'5%', left:'5%', pointerEvents:'none' }} />

          {/* text */}
          <div className="hero-text" style={{ flex:'0 0 52%', maxWidth:'52%', position:'relative', zIndex:1 }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:'7px',
              background:'rgba(212,101,42,0.1)', border:'1px solid rgba(212,101,42,0.22)',
              color:'#D4652A', fontSize:'12px', fontWeight:700, letterSpacing:'.06em',
              textTransform:'uppercase', padding:'5px 14px', borderRadius:'100px',
              marginBottom:'28px',
              animation:'badgePop .7s cubic-bezier(.16,1,.3,1) .1s both',
            }}>
              ✦ Koniec z duplikatami prezentów
            </div>

            <h1 style={{
              fontFamily:C, fontSize:'clamp(52px, 5.8vw, 92px)',
              fontWeight:500, fontStyle:'italic', lineHeight:1.04,
              margin:'0 0 22px',
              animation:'fadeUp .9s cubic-bezier(.16,1,.3,1) .2s both',
            }}>
              Lista życzeń,<br />
              <em style={{ color:'#D4652A', fontStyle:'normal' }}>którą naprawdę</em><br />
              chcesz dostać
            </h1>

            <p style={{
              fontSize:'clamp(15px,1.2vw,18px)', lineHeight:1.7,
              color:'rgba(245,237,216,0.55)', maxWidth:'400px',
              margin:'0 0 36px', fontWeight:300,
              animation:'fadeUp .9s cubic-bezier(.16,1,.3,1) .35s both',
            }}>
              Wklej link z Allegro, Zalando czy Amazon. Udostępnij rodzinie.
              Oni rezerwują anonimowo — nikt nie kupuje dwa razy tego samego.
            </p>

            <div style={{
              display:'flex', gap:'12px', flexWrap:'wrap',
              animation:'fadeUp .9s cubic-bezier(.16,1,.3,1) .5s both',
            }}>
              <Link href="/login" className="cta-btn" style={{
                background:'#D4652A', color:'#F5EDD8', textDecoration:'none',
                fontSize:'16px', fontWeight:600, padding:'15px 30px',
                borderRadius:'100px', display:'inline-flex', alignItems:'center', gap:'8px',
              }}>
                Stwórz listę życzeń <span>→</span>
              </Link>
              <a href="#jak-to-dziala" className="ghost-btn" style={{
                background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                color:'rgba(245,237,216,0.8)', textDecoration:'none',
                fontSize:'16px', fontWeight:500, padding:'15px 30px', borderRadius:'100px',
              }}>
                Jak to działa?
              </a>
            </div>

            <div style={{
              marginTop:'48px', display:'flex', alignItems:'center', gap:'16px',
              animation:'fadeUp .9s cubic-bezier(.16,1,.3,1) .65s both',
            }}>
              <div style={{ display:'flex', marginRight:'4px' }}>
                {['🧑','👩','👦','👴'].map((f,i) => (
                  <div key={i} style={{ width:'32px', height:'32px', borderRadius:'50%', background:`hsl(${i*30+15},40%,35%)`, border:'2px solid #0F0904', marginLeft: i ? '-8px' : 0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>{f}</div>
                ))}
              </div>
              <p style={{ fontSize:'13px', color:'rgba(245,237,216,0.45)', fontWeight:300 }}>
                Dołącz do <strong style={{ color:'rgba(245,237,216,0.7)', fontWeight:600 }}>setek Polaków</strong> którzy już korzystają
              </p>
            </div>
          </div>

          {/* floating cards */}
          <div className="hero-cards" style={{
            flex:'0 0 48%', position:'relative', height:'520px',
            transform:`translate(${mouse.x * 0.4}px, ${mouse.y * 0.25}px)`,
            transition:'transform .4s cubic-bezier(.16,1,.3,1)',
          }}>
            {CARDS.map(c => (
              <div key={c.title} style={{
                position:'absolute', top:c.top, left:c.left,
                animation:`cardIn .9s cubic-bezier(.16,1,.3,1) ${c.delay}s both`,
              }}>
                <div style={{ animation:`sway ${4.5 + c.delay}s ease-in-out ${c.delay + 0.9}s infinite` }}>
                  <div style={{
                    width:'155px',
                    background:c.bg,
                    border:'1px solid rgba(255,255,255,0.07)',
                    borderRadius:'16px',
                    padding:'16px',
                    boxShadow:`0 24px 64px rgba(0,0,0,0.5)`,
                    transform:`rotate(${c.rot}deg)`,
                  }}>
                    <div style={{ fontSize:'28px', lineHeight:1 }}>{c.emoji}</div>
                    <div style={{ marginTop:'10px', fontSize:'12px', fontWeight:600, color:'#F5EDD8', lineHeight:1.35 }}>{c.title}</div>
                    <div style={{ marginTop:'5px', fontSize:'11px', color:'#C9A96E' }}>{c.price}</div>
                    <div style={{ marginTop:'12px', height:'2px', borderRadius:'2px', background:'linear-gradient(90deg, rgba(212,101,42,0.5), transparent)' }} />
                  </div>
                </div>
              </div>
            ))}

            {/* reserved badge example */}
            <div style={{
              position:'absolute', top:'230px', left:'160px',
              background:'#1B3024', border:'1px solid rgba(139,173,138,0.2)',
              borderRadius:'12px', padding:'10px 14px',
              animation:`cardIn .9s cubic-bezier(.16,1,.3,1) 1.2s both`,
              boxShadow:'0 12px 40px rgba(0,0,0,0.4)',
            }}>
              <div style={{ fontSize:'11px', fontWeight:600, color:'#8BAD8A', display:'flex', alignItems:'center', gap:'6px' }}>
                <span>✓</span> Zarezerwowane
              </div>
            </div>
          </div>

          {/* scroll indicator */}
          <div style={{
            position:'absolute', bottom:'32px', left:'50%', transform:'translateX(-50%)',
            display:'flex', flexDirection:'column', alignItems:'center', gap:'6px',
            animation:'fadeUp .9s cubic-bezier(.16,1,.3,1) 1.2s both',
          }}>
            <div style={{ width:'1px', height:'36px', background:'linear-gradient(to bottom, rgba(245,237,216,0.4), transparent)' }} />
            <span style={{ fontSize:'10px', letterSpacing:'.1em', color:'rgba(245,237,216,0.3)', textTransform:'uppercase' }}>scroll</span>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="jak-to-dziala" style={{ background:'#F7F0E3', color:'#120C08', padding:'100px 6vw' }}>
          <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
            <div className="rv" style={{ marginBottom:'64px' }}>
              <p style={{ fontSize:'11px', fontWeight:700, letterSpacing:'.14em', color:'#D4652A', textTransform:'uppercase', marginBottom:'14px' }}>Jak to działa</p>
              <h2 style={{ fontFamily:C, fontSize:'clamp(34px,4vw,60px)', fontWeight:500, fontStyle:'italic', lineHeight:1.08, margin:0 }}>
                Trzy kroki do<br />idealnych prezentów
              </h2>
            </div>

            <div className="grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'56px' }}>
              {[
                { n:'01', emoji:'🔗', t:'Dodaj produkty', d:'Wklej link z dowolnego sklepu — Allegro, Zalando, ASOS. Tytuł, zdjęcie i cena pojawiają się automatycznie.' },
                { n:'02', emoji:'📨', t:'Udostępnij link', d:'Każda lista ma unikalny URL. Jeden klik — rodzina i znajomi widzą co chcesz dostać.' },
                { n:'03', emoji:'🎉', t:'Dostań to co chcesz', d:'Goście rezerwują prezenty anonimowo. Ty nie wiesz kto co kupuje — niespodzianki zachowane!' },
              ].map((s,i) => (
                <div key={s.n} className={`rv d${i+1}`}>
                  <div style={{ fontFamily:C, fontSize:'80px', fontWeight:300, color:'rgba(18,12,8,0.07)', lineHeight:1, marginBottom:'-24px' }}>{s.n}</div>
                  <div style={{ fontSize:'36px', marginBottom:'16px' }}>{s.emoji}</div>
                  <h3 style={{ fontFamily:C, fontSize:'26px', fontWeight:600, marginBottom:'12px', lineHeight:1.2 }}>{s.t}</h3>
                  <p style={{ fontSize:'15px', lineHeight:1.7, color:'rgba(18,12,8,0.55)', fontWeight:300 }}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ background:'#130A04', padding:'100px 6vw' }}>
          <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
            <div className="rv" style={{ textAlign:'center', marginBottom:'56px' }}>
              <h2 style={{ fontFamily:C, fontSize:'clamp(34px,4vw,60px)', fontWeight:500, fontStyle:'italic', lineHeight:1.08, margin:'0 0 14px' }}>
                Wszystko czego potrzebujesz
              </h2>
              <p style={{ color:'rgba(245,237,216,0.4)', fontSize:'17px', fontWeight:300, margin:0 }}>
                Zaprojektowane dla polskich użytkowników
              </p>
            </div>

            <div className="grid-features" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'18px' }}>
              {[
                { i:'🛍️', t:'Dowolny sklep', d:'Allegro, Zalando, ASOS, Amazon, Empik — wklejasz link, my pobieramy dane automatycznie.', a:'#D4652A' },
                { i:'🔒', t:'100% prywatności', d:'Właściciel listy nigdy nie widzi kto co zarezerwował. Tylko że dane jest zajęte.', a:'#C9A96E' },
                { i:'✨', t:'Zero konta dla gości', d:'Rodzina rezerwuje jednym kliknięciem. Żadnej rejestracji, żadnej aplikacji do pobrania.', a:'#8BAD8A' },
                { i:'📱', t:'Mobile first', d:'Działa pięknie na każdym urządzeniu. Udostępniasz przez WhatsApp — otwiera się od razu.', a:'#A98BD4' },
                { i:'🎯', t:'Priorytety prezentów', d:'"Bardzo chcę", "Chciałbym", "Fajnie byłoby" — goście wiedzą co jest ważniejsze.', a:'#D4652A' },
                { i:'🔗', t:'Jeden link', d:'Jeden unikalny URL na listę. Wyślij przez SMS, email, WhatsApp — działa wszędzie.', a:'#C9A96E' },
              ].map((f,i) => (
                <div key={f.t} className={`rv feature-card d${(i%3)+1}`} style={{
                  background:'rgba(255,255,255,0.025)',
                  border:'1px solid rgba(255,255,255,0.07)',
                  borderRadius:'20px', padding:'28px',
                }}>
                  <div style={{
                    width:'48px', height:'48px', borderRadius:'14px',
                    background:`${f.a}18`, display:'flex', alignItems:'center',
                    justifyContent:'center', fontSize:'22px', marginBottom:'20px',
                  }}>{f.i}</div>
                  <h3 style={{ fontFamily:C, fontSize:'22px', fontWeight:600, marginBottom:'10px', color:'#F5EDD8', lineHeight:1.2 }}>{f.t}</h3>
                  <p style={{ fontSize:'14px', lineHeight:1.65, color:'rgba(245,237,216,0.45)', fontWeight:300, margin:0 }}>{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUOTE ── */}
        <section style={{ background:'#F7F0E3', padding:'80px 6vw', textAlign:'center' }}>
          <div className="rv" style={{ maxWidth:'700px', margin:'0 auto' }}>
            <div style={{ fontFamily:C, fontSize:'clamp(28px,3.5vw,52px)', fontStyle:'italic', fontWeight:400, color:'#120C08', lineHeight:1.2, marginBottom:'24px' }}>
              "Najlepszy prezent to taki,<br />którego sam byś sobie nie kupił."
            </div>
            <p style={{ color:'rgba(18,12,8,0.4)', fontSize:'14px', fontWeight:500, letterSpacing:'.06em', textTransform:'uppercase' }}>
              — Stare polskie powiedzenie
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ background:'#D4652A', padding:'100px 6vw', textAlign:'center', position:'relative', overflow:'hidden' }}>
          <div style={{
            position:'absolute', inset:0, opacity:.04,
            backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='%23fff'/%3E%3C/svg%3E")`,
          }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <div className="rv">
              <h2 style={{ fontFamily:C, fontSize:'clamp(40px,5vw,76px)', fontWeight:500, fontStyle:'italic', color:'#F5EDD8', margin:'0 0 16px', lineHeight:1.05 }}>
                Twoje wymarzone urodziny<br />zaczynają się tutaj
              </h2>
            </div>
            <p className="rv d1" style={{ color:'rgba(245,237,216,0.75)', fontSize:'18px', marginBottom:'36px', fontWeight:300 }}>
              Stwórz pierwszą listę w mniej niż minutę. Całkowicie za darmo.
            </p>
            <div className="rv d2">
              <Link href="/login" style={{
                display:'inline-block',
                background:'#F5EDD8', color:'#D4652A',
                textDecoration:'none', fontSize:'17px', fontWeight:700,
                padding:'16px 40px', borderRadius:'100px',
                transition:'transform .2s, box-shadow .2s',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'translateY(-3px)'; (e.target as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.transform = ''; (e.target as HTMLElement).style.boxShadow = '' }}
              >
                Stwórz listę życzeń →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background:'#0A0502', padding:'28px 6vw', textAlign:'center', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ color:'rgba(245,237,216,0.2)', fontSize:'13px', fontWeight:300, margin:0 }}>
            &copy; {new Date().getFullYear()} Wishlist — Made with ❤️ in Poland
          </p>
        </footer>

      </div>
    </>
  )
}
