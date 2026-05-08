'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { PRIORITY_LABELS } from '@/types'

const B = 'var(--font-sans)'

export default function AddItemForm({ wishlistId, itemCount }: { wishlistId: string; itemCount: number }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [price, setPrice] = useState('')
  const [priority, setPriority] = useState<1 | 2 | 3>(2)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')
  const fetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function fetchOgData(rawUrl: string) {
    if (!rawUrl.startsWith('http')) return
    setFetching(true)
    try {
      const res = await fetch(`/api/fetch-og?url=${encodeURIComponent(rawUrl)}`)
      const data = await res.json()
      if (data.image && !imageUrl) setImageUrl(data.image)
      if (data.title && !title) setTitle(data.title)
    } catch {}
    setFetching(false)
  }

  function handleUrlChange(val: string) {
    setUrl(val)
    if (fetchTimer.current) clearTimeout(fetchTimer.current)
    fetchTimer.current = setTimeout(() => fetchOgData(val), 800)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.from('wishlist_items').insert({
      wishlist_id: wishlistId, title,
      url: url || null,
      image_url: imageUrl || null,
      price: price ? parseFloat(price) : null,
      priority, notes: notes || null, position: itemCount,
    })
    if (error) { setError('Nie udało się dodać produktu.'); setLoading(false); return }
    setTitle(''); setUrl(''); setImageUrl(''); setPrice(''); setPriority(2); setNotes('')
    setOpen(false)
    router.refresh()
    setLoading(false)
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '14px', borderRadius: 16, border: '2px dashed var(--line-2)',
        background: 'transparent', color: 'var(--ink-2)', fontFamily: B, fontWeight: 500, fontSize: 14,
        cursor: 'pointer', transition: 'border-color .2s, color .2s, transform .25s var(--spring)',
      }}
      onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = 'var(--c1)'; el.style.color = 'var(--c1)'; el.style.transform = 'translateY(-1px)' }}
      onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = 'var(--line-2)'; el.style.color = 'var(--ink-2)'; el.style.transform = 'none' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
        Dodaj produkt
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: 'var(--paper)', borderRadius: 20, padding: '24px 20px', boxShadow: 'var(--shadow-1)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <h3 style={{ fontFamily: B, fontWeight: 700, fontSize: 15, color: 'var(--ink)', margin: 0 }}>Nowy produkt</h3>
        <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-2)', padding: 4 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>

      {/* URL — first, triggers auto-detect */}
      <div>
        <label style={{ display: 'block', fontFamily: B, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 6 }}>
          Link do produktu
          {fetching && <span style={{ marginLeft: 8, color: 'var(--c2)', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>Pobieranie danych…</span>}
        </label>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7 0l4-4a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-4 4a5 5 0 0 0 7 7l1-1"/></svg>
          <input type="url" value={url} onChange={e => handleUrlChange(e.target.value)} placeholder="https://allegro.pl/… (auto-detect nazwy i zdjęcia)" className="field" style={{ paddingLeft: 38, fontSize: 14 }} />
        </div>
      </div>

      {/* Title */}
      <div>
        <label style={{ display: 'block', fontFamily: B, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 6 }}>
          Nazwa produktu <span style={{ color: 'var(--c1)' }}>*</span>
        </label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="np. Buty Nike Air Max 90" required className="field" style={{ fontSize: 14 }} />
      </div>

      {/* Image preview + URL */}
      <div>
        <label style={{ display: 'block', fontFamily: B, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 6 }}>Zdjęcie produktu</label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          {imageUrl && (
            <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--line)', position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button type="button" onClick={() => setImageUrl('')} style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: 'rgba(31,26,20,.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>
          )}
          <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://... (auto-wypełniane z linku)" className="field" style={{ fontSize: 13, flex: 1 }} />
        </div>
      </div>

      {/* Price + Priority */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontFamily: B, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 6 }}>Cena (PLN)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" min="0" step="0.01" className="field" style={{ fontSize: 14 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: B, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 6 }}>Priorytet</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {([1, 2, 3] as const).map(p => (
              <button key={p} type="button" onClick={() => setPriority(p)} className="chip" data-active={priority === p ? '1' : '0'} style={{ flex: 1, justifyContent: 'center', fontSize: 11 }}>
                {PRIORITY_LABELS[p].slice(0, 6)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label style={{ display: 'block', fontFamily: B, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 6 }}>Notatka</label>
        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="np. Rozmiar 42, kolor czarny" className="field" style={{ fontSize: 14 }} />
      </div>

      {error && (
        <div style={{ background: 'var(--c1-soft)', border: '1px solid rgba(224,122,95,.25)', color: 'var(--ink)', fontSize: 13, padding: '10px 14px', borderRadius: 12, fontFamily: B }}>{error}</div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>Anuluj</button>
        <button type="submit" disabled={loading || !title.trim()} className="btn btn-pop" style={{ flex: 2, justifyContent: 'center', fontSize: 13 }}>
          {loading ? 'Dodawanie...' : 'Dodaj produkt ✦'}
        </button>
      </div>
    </form>
  )
}
