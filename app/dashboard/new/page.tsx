'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OCCASIONS } from '@/types'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const C = 'var(--font-serif)'
const B = 'var(--font-sans)'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).slice(2, 7)
}

const OCCASION_EMOJIS: Record<string, string> = {
  birthday: '🎂', christmas: '🎄', wedding: '💍', nameday: '🌸',
  anniversary: '💐', baby: '🍼', graduation: '🎓', other: '🎁',
}

export default function NewWishlistPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [occasion, setOccasion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const slug = generateSlug(title)
    const { data, error } = await supabase
      .from('wishlists')
      .insert({ title, description: description || null, occasion: occasion || null, slug, user_id: user.id })
      .select().single()

    if (error) { setError('Coś poszło nie tak. Spróbuj ponownie.'); setLoading(false); return }
    router.push(`/dashboard/${data.id}`)
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 600 }}>
      <Link href="/dashboard" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13,
        color: 'var(--ink-2)', textDecoration: 'none', fontFamily: B, fontWeight: 500,
        marginBottom: 32, transition: 'color .15s',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--ink)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--ink-2)')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Wróć do list
      </Link>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: B, fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--c1)', marginBottom: 8 }}>Nowa lista</p>
        <h1 className="display" style={{ fontSize: 'clamp(36px, 4vw, 52px)', marginBottom: 8 }}>
          Dodaj <em>okazję</em>
        </h1>
        <p style={{ fontFamily: B, color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.6 }}>
          Wypełnij podstawowe informacje. Produkty dodasz w następnym kroku.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'var(--paper)', borderRadius: 24, padding: '28px 24px', boxShadow: 'var(--shadow-1)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Occasion picker */}
        <div>
          <label style={{ display: 'block', fontFamily: B, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 12 }}>Okazja</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button type="button" onClick={() => setOccasion('')} className="chip" data-active={!occasion ? '1' : '0'}>🎁 Ogólna</button>
            {OCCASIONS.map(o => (
              <button key={o.value} type="button" onClick={() => setOccasion(o.value)} className="chip" data-active={occasion === o.value ? '1' : '0'}>
                {OCCASION_EMOJIS[o.value] ?? '🎁'} {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label style={{ display: 'block', fontFamily: B, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 8 }}>
            Nazwa listy <span style={{ color: 'var(--c1)' }}>*</span>
          </label>
          <input
            type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder={`np. ${OCCASION_EMOJIS[occasion] ?? '🎁'} Urodziny Patryka 2025`}
            required className="field" style={{ fontSize: 15 }}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontFamily: B, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 8 }}>
            Opis <span style={{ color: 'var(--ink-2)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>(opcjonalnie)</span>
          </label>
          <textarea
            value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Krótki opis dla osób, które odwiedzą Twoją listę..."
            rows={3} className="field" style={{ fontSize: 14, resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>

        {error && (
          <div style={{ background: 'var(--c1-soft)', border: '1px solid rgba(224,122,95,.25)', color: 'var(--ink)', fontSize: 13, padding: '10px 14px', borderRadius: 12, fontFamily: B }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading || !title.trim()} className="btn btn-pop" style={{ justifyContent: 'center', fontSize: 15, padding: 15 }}>
          {loading ? 'Tworzenie...' : 'Stwórz listę i dodaj produkty →'}
        </button>
      </form>
    </div>
  )
}
