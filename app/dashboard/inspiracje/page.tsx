export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { Bow, FloatingDeco, Sparkle } from '@/components/decorations'

const C = 'var(--font-serif)'
const B = 'var(--font-sans)'

export default async function InspiracijePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div style={{ padding: '0 0 80px' }}>
      <header style={{ padding: '32px 48px 20px', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-2)', marginBottom: 12, fontFamily: B, textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 600 }}>
          <span style={{ width: 18, height: 1, background: 'var(--ink-2)' }} />
          Odkrywaj
        </div>
        <h1 className="display" style={{ margin: 0, fontSize: 'clamp(40px, 5vw, 60px)' }}>
          Inspi<em style={{ color: 'var(--c1)' }}>racje</em>.
        </h1>
      </header>

      <div style={{ padding: '0 48px' }}>
        <div style={{
          textAlign: 'center', padding: '80px 32px', borderRadius: 28,
          background: 'var(--paper)', boxShadow: 'var(--shadow-1)',
          position: 'relative', overflow: 'hidden',
        }}>
          <FloatingDeco top={-20} right={60} rot={12} delay={0}>
            <Bow size={90} color="var(--c2)" />
          </FloatingDeco>
          <FloatingDeco bottom={-10} left={40} rot={-8} delay={1}>
            <Sparkle size={24} color="var(--c4)" />
          </FloatingDeco>

          <div style={{ fontSize: 64, marginBottom: 20 }}>✦</div>
          <h2 style={{ fontFamily: C, fontStyle: 'italic', fontSize: 38, color: 'var(--ink)', marginBottom: 12 }}>
            Inspiracje — <em style={{ color: 'var(--c1)' }}>wkrótce</em>
          </h2>
          <p style={{ fontFamily: B, color: 'var(--ink-2)', fontSize: 15, maxWidth: 360, margin: '0 auto' }}>
            Kurujeujemy dla Ciebie kolekcje pomysłów na prezenty od najlepszych marek i twórców.
          </p>
        </div>
      </div>
    </div>
  )
}
