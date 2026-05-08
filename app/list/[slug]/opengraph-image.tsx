export const runtime = 'edge'
export const alt = 'Lista życzeń'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

const OCCASIONS: Record<string, string> = {
  birthday: '🎂 Urodziny', christmas: '🎄 Boże Narodzenie', wedding: '💍 Ślub',
  nameday: '🌸 Imieniny', baby_shower: '🍼 Baby Shower', anniversary: '💐 Rocznica', other: '🎁',
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('wishlists')
    .select('title, description, occasion, wishlist_items(count)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  const title = data?.title ?? 'Lista życzeń'
  const description = data?.description ?? 'Sprawdź czego sobie życzę!'
  const occasion = data?.occasion ? (OCCASIONS[data.occasion] ?? '🎁') : '🎁'
  const count = (data?.wishlist_items as unknown as { count: number }[])?.[0]?.count ?? 0

  return new ImageResponse(
    <div
      style={{
        width: '100%', height: '100%',
        background: '#FAF6EE',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '72px 80px',
        fontFamily: 'Georgia, serif',
        position: 'relative',
      }}
    >
      {/* Background accent */}
      <div style={{
        position: 'absolute', top: -120, right: -120,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(224,122,95,.12) 0%, transparent 65%)',
        display: 'flex',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: -80,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,168,83,.10) 0%, transparent 65%)',
        display: 'flex',
      }} />

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
        <span style={{ fontSize: 32, color: '#1F1A14', fontStyle: 'italic' }}>wisz</span>
        <span style={{ fontSize: 32, color: '#E07A5F', fontStyle: 'italic' }}>list</span>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#E07A5F', marginBottom: 8, marginLeft: 3, display: 'flex' }} />
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1, justifyContent: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(224,122,95,.12)', borderRadius: 100,
          padding: '8px 20px', width: 'fit-content',
          fontSize: 22, color: '#7A6A54',
        }}>
          {occasion}
        </div>
        <div style={{
          fontSize: 80, fontStyle: 'italic', color: '#1F1A14',
          lineHeight: 1.05, fontWeight: 400,
          maxWidth: 800,
        }}>
          {title}
        </div>
        {description && (
          <div style={{ fontSize: 28, color: '#7A6A54', maxWidth: 700, lineHeight: 1.4 }}>
            {description.length > 80 ? description.slice(0, 80) + '…' : description}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 22, color: '#7A6A54' }}>
          {count > 0 ? `${count} ${count === 1 ? 'prezent' : 'prezentów'} na liście` : 'Lista życzeń'}
        </div>
        <div style={{
          background: '#1F1A14', color: '#FFFDF8',
          padding: '14px 32px', borderRadius: 100,
          fontSize: 22, fontStyle: 'italic',
        }}>
          Zarezerwuj prezent →
        </div>
      </div>
    </div>,
    { ...size }
  )
}
