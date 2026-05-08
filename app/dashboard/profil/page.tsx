export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { FloatingDeco, Sparkle, Bow } from '@/components/decorations'

const C = 'var(--font-serif)'
const B = 'var(--font-sans)'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const email = user?.email ?? ''
  const initial = (email[0] ?? '?').toUpperCase()

  return (
    <div style={{ padding: '0 0 80px' }}>
      <header style={{ padding: '32px 48px 20px', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-2)', marginBottom: 12, fontFamily: B, textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 600 }}>
          <span style={{ width: 18, height: 1, background: 'var(--ink-2)' }} />
          Twoje konto
        </div>
        <h1 className="display" style={{ margin: 0, fontSize: 'clamp(40px, 5vw, 60px)' }}>
          Pro<em style={{ color: 'var(--c5)' }}>fil</em>.
        </h1>
      </header>

      <div style={{ padding: '0 48px' }}>
        {/* User info card */}
        <div style={{
          padding: '32px 36px', borderRadius: 24,
          background: 'var(--paper)', boxShadow: 'var(--shadow-1)',
          display: 'flex', alignItems: 'center', gap: 20,
          marginBottom: 24,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--c5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: C, fontStyle: 'italic', fontSize: 26,
            color: 'var(--ink)',
            boxShadow: 'inset 0 0 0 2px rgba(31,26,20,.12)',
            flexShrink: 0,
          }}>{initial}</div>
          <div>
            <div style={{ fontFamily: B, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 4 }}>Adres email</div>
            <div style={{ fontFamily: B, fontWeight: 600, fontSize: 16, color: 'var(--ink)' }}>{email}</div>
          </div>
        </div>

        {/* Coming soon card */}
        <div style={{
          textAlign: 'center', padding: '64px 32px', borderRadius: 28,
          background: `linear-gradient(135deg, var(--c5-soft), var(--c2-soft))`,
          position: 'relative', overflow: 'hidden',
        }}>
          <FloatingDeco top={-20} right={60} rot={12} delay={0}>
            <Bow size={80} color="var(--c5)" />
          </FloatingDeco>
          <FloatingDeco bottom={-10} left={40} rot={-8} delay={1}>
            <Sparkle size={22} color="var(--c2)" />
          </FloatingDeco>

          <h2 style={{ fontFamily: C, fontStyle: 'italic', fontSize: 36, color: 'var(--ink)', marginBottom: 12 }}>
            Profil — <em style={{ color: 'var(--c5)' }}>wkrótce</em>
          </h2>
          <p style={{ fontFamily: B, color: 'var(--ink-2)', fontSize: 15, maxWidth: 360, margin: '0 auto' }}>
            Edycja profilu, awatar, powiązania z przyjaciółmi i ustawienia powiadomień.
          </p>
        </div>
      </div>
    </div>
  )
}
