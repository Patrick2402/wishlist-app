'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const C = 'var(--font-serif)'
const B = 'var(--font-sans)'

type NavIconProps = { name: string; active: boolean }

function NavIcon({ name, active }: NavIconProps) {
  const c = active ? 'var(--ink)' : 'var(--ink-2)'
  const sw = 1.7
  switch (name) {
    case 'lists':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="18" rx="3"/>
          <path d="M8 8h8M8 12h8M8 16h5"/>
        </svg>
      )
    case 'compass':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <path d="M15.5 8.5 13 13l-4.5 2.5L11 11Z" fill={active ? 'var(--c1)' : 'none'}/>
        </svg>
      )
    case 'activity':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h4l3-7 4 14 3-7h4"/>
        </svg>
      )
    case 'user':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M3 21c1.5-4.5 5-7 9-7s7.5 2.5 9 7"/>
        </svg>
      )
    default:
      return null
  }
}

const NAV = [
  { id: 'lists',      label: 'Listy',      href: '/dashboard', icon: 'lists',    soon: false },
  { id: 'inspiracje', label: 'Inspiracje', href: null,          icon: 'compass',  soon: true  },
  { id: 'aktywnosc',  label: 'Aktywność',  href: null,          icon: 'activity', soon: true  },
  { id: 'profil',     label: 'Profil',     href: null,          icon: 'user',     soon: true  },
]

export default function DashboardSidebar({ email }: { email: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const initial = (email[0] ?? '?').toUpperCase()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (href: string) => href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  return (
    <>
      <style>{`
        @media (max-width: 680px) {
          .dash-sidebar { display: none !important; }
          .dash-bottom-nav { display: flex !important; }
          .dash-main { padding-bottom: 72px !important; }
        }
        .add-wish-btn:hover {
          transform: translateY(-2px) rotate(-1deg) !important;
          box-shadow: 0 6px 0 rgba(31,26,20,.22), 0 16px 36px rgba(31,26,20,.22) !important;
        }
        .add-wish-btn { transition: transform .25s var(--spring), box-shadow .25s var(--smooth); }
      `}</style>

      {/* Desktop sidebar */}
      <aside className="dash-sidebar" style={{
        width: 220, flexShrink: 0, padding: '24px 14px',
        display: 'flex', flexDirection: 'column', gap: 4,
        borderRight: '1px solid var(--line)',
        background: 'var(--paper)',
        position: 'relative', zIndex: 2,
      }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', padding: '4px 12px 28px', display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontFamily: C, fontStyle: 'italic', fontSize: 28, color: 'var(--ink)', lineHeight: 1 }}>wisz</span>
          <span style={{ fontFamily: C, fontStyle: 'italic', fontSize: 28, color: 'var(--c1)', lineHeight: 1 }}>list</span>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--c1)', display: 'inline-block', marginBottom: 6, marginLeft: 2 }} />
        </Link>

        {NAV.map(n => {
          if (n.soon) {
            return (
              <div key={n.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 12,
                fontFamily: B, fontWeight: 500, fontSize: 14,
                color: 'var(--ink-3, rgba(31,26,20,.3))',
                cursor: 'default', opacity: 0.55,
              }}>
                <NavIcon name={n.icon} active={false} />
                <span>{n.label}</span>
                <span style={{ marginLeft: 'auto', fontFamily: B, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-2)', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 6, padding: '2px 5px' }}>soon</span>
              </div>
            )
          }
          const active = isActive(n.href!)
          return (
            <Link key={n.id} href={n.href!} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 12, textDecoration: 'none',
              background: active ? 'var(--bg)' : 'transparent',
              boxShadow: active ? 'inset 0 0 0 1px var(--line), 0 2px 8px rgba(31,26,20,.06)' : 'none',
              fontFamily: B, fontWeight: active ? 600 : 500, fontSize: 14,
              color: active ? 'var(--ink)' : 'var(--ink-2)',
              transition: 'background .2s, transform .2s var(--spring)',
              transform: active ? 'translateX(2px)' : 'none',
            }}
            onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.5)' }}
            onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <NavIcon name={n.icon} active={active} />
              <span>{n.label}</span>
              {active && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--c1)' }} />}
            </Link>
          )
        })}

        <div style={{ flex: 1 }} />

        {/* Dodaj życzenie — bottom CTA */}
        <Link href="/dashboard/new" className="add-wish-btn" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px', borderRadius: 16,
          background: 'var(--ink)', color: 'var(--paper)',
          fontFamily: B, fontWeight: 600, fontSize: 14,
          textDecoration: 'none',
          boxShadow: '0 4px 0 rgba(31,26,20,.18), 0 10px 24px rgba(31,26,20,.18)',
          marginBottom: 10,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Dodaj życzenie
        </Link>

        {/* User pill */}
        <div style={{ padding: '8px 12px', borderRadius: 999, background: 'var(--bg)', boxShadow: 'inset 0 0 0 1px var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', background: 'var(--c1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: C, fontStyle: 'italic', fontSize: 15, color: 'var(--paper)',
            boxShadow: 'inset 0 0 0 1.5px rgba(31,26,20,.18)',
            flexShrink: 0,
          }}>{initial}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: B, fontWeight: 600, fontSize: 12, lineHeight: 1.1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ink)' }}>{email}</div>
            <div style={{ fontFamily: B, fontSize: 11, color: 'var(--ink-2)', lineHeight: 1.1 }}>Plan free</div>
          </div>
          <button onClick={handleSignOut} title="Wyloguj" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--ink-2)', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="dash-bottom-nav" style={{
        display: 'none',
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        height: 64,
        background: 'rgba(255,251,242,.92)', backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--line)',
        alignItems: 'center', justifyContent: 'space-around',
        padding: '0 4px',
      }}>
        {NAV.map(n => {
          if (n.soon) {
            return (
              <div key={n.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1, padding: '8px 0', opacity: 0.4 }}>
                <NavIcon name={n.icon} active={false} />
                <span style={{ fontFamily: B, fontSize: 10, fontWeight: 600, color: 'var(--ink-2)' }}>{n.label}</span>
              </div>
            )
          }
          const active = isActive(n.href!)
          return (
            <Link key={n.id} href={n.href!} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              textDecoration: 'none', flex: 1, padding: '8px 0',
            }}>
              <NavIcon name={n.icon} active={active} />
              <span style={{ fontFamily: B, fontSize: 10, fontWeight: 600, color: active ? 'var(--c1)' : 'var(--ink-2)' }}>{n.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
