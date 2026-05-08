'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const C = 'var(--font-serif)'
const B = 'var(--font-sans)'

const NAV = [
  {
    id: 'lists', label: 'Listy', href: '/dashboard',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--c1)' : 'var(--ink-2)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="3"/>
        <path d="M8 8h8M8 12h8M8 16h5"/>
      </svg>
    ),
  },
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
          const active = isActive(n.href)
          return (
            <Link key={n.id} href={n.href} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 12, textDecoration: 'none',
              background: active ? 'var(--bg)' : 'transparent',
              boxShadow: active ? 'inset 0 0 0 1px var(--line), 0 2px 8px rgba(31,26,20,.06)' : 'none',
              fontFamily: B, fontWeight: active ? 600 : 500, fontSize: 14,
              color: active ? 'var(--ink)' : 'var(--ink-2)',
              transition: 'background .2s, transform .2s var(--spring)',
              transform: active ? 'translateX(2px)' : 'none',
            }}
            onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(31,26,20,.04)' }}
            onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              {n.icon(active)}
              <span>{n.label}</span>
              {active && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--c1)' }} />}
            </Link>
          )
        })}

        <Link href="/dashboard/new" className="btn" style={{
          marginTop: 8, justifyContent: 'center', fontSize: 13, padding: '12px 16px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Nowa lista
        </Link>

        <div style={{ flex: 1 }} />

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
        background: 'rgba(255,253,248,.92)', backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--line)',
        alignItems: 'center', justifyContent: 'space-around',
        padding: '0 8px',
      }}>
        {/* Listy */}
        <Link href="/dashboard" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          textDecoration: 'none', flex: 1, padding: '8px 0',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isActive('/dashboard') ? 'var(--c1)' : 'var(--ink-2)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="3" width="16" height="18" rx="3"/>
            <path d="M8 8h8M8 12h8M8 16h5"/>
          </svg>
          <span style={{ fontFamily: B, fontSize: 10, fontWeight: 600, color: isActive('/dashboard') ? 'var(--c1)' : 'var(--ink-2)' }}>Listy</span>
        </Link>

        {/* Nowa lista — center CTA */}
        <Link href="/dashboard/new" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          textDecoration: 'none', flex: 1, padding: '4px 0',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--ink)', color: 'var(--paper)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(31,26,20,.25)',
            marginTop: -16,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </div>
          <span style={{ fontFamily: B, fontSize: 10, fontWeight: 600, color: 'var(--ink-2)' }}>Nowa</span>
        </Link>

        {/* Wyloguj */}
        <button onClick={handleSignOut} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          background: 'none', border: 'none', cursor: 'pointer', flex: 1, padding: '8px 0',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', background: 'var(--c1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: C, fontStyle: 'italic', fontSize: 14, color: 'var(--paper)',
          }}>{initial}</div>
          <span style={{ fontFamily: B, fontSize: 10, fontWeight: 600, color: 'var(--ink-2)' }}>Konto</span>
        </button>
      </nav>
    </>
  )
}
