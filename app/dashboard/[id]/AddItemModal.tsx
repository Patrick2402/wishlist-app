'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const B = 'var(--font-sans)'
const C = 'var(--font-serif)'

type List = { id: string; title: string; accent: string }

const ACCENTS = ['var(--c1)', 'var(--c3)', 'var(--c5)', 'var(--c2)', 'var(--c4)']

const PRIORITY_OPTS = [
  { value: 3 as const, label: 'Może być',   dots: 1 },
  { value: 2 as const, label: 'Chętnie',    dots: 2 },
  { value: 1 as const, label: 'Bardzo chcę', dots: 3 },
]

export default function AddItemModal({
  open,
  onClose,
  defaultListId,
  defaultItemCount,
}: {
  open: boolean
  onClose: () => void
  defaultListId: string
  defaultItemCount: number
}) {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [price, setPrice] = useState('')
  const [priority, setPriority] = useState<1 | 2 | 3>(2)
  const [notes, setNotes] = useState('')
  const [selectedList, setSelectedList] = useState(defaultListId)
  const [lists, setLists] = useState<List[]>([])
  const [fetching, setFetching] = useState(false)
  const [unfurled, setUnfurled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load all user lists for the picker
  useEffect(() => {
    createClient().from('wishlists').select('id, title').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) {
        setLists(data.map((l, i) => ({ id: l.id, title: l.title, accent: ACCENTS[i % ACCENTS.length] })))
      }
    })
  }, [])

  // Reset form on close
  useEffect(() => {
    if (!open) {
      setUrl(''); setTitle(''); setImageUrl(''); setPrice('')
      setPriority(2); setNotes(''); setUnfurled(false); setError('')
      setSelectedList(defaultListId)
    }
  }, [open, defaultListId])

  async function fetchOg(rawUrl: string) {
    if (!rawUrl.startsWith('http')) return
    setFetching(true)
    try {
      const res = await fetch(`/api/fetch-og?url=${encodeURIComponent(rawUrl)}`)
      const data = await res.json()
      if (data.image) setImageUrl(data.image)
      if (data.title) setTitle(data.title)
      if (data.image || data.title) setUnfurled(true)
    } catch { /* silent */ }
    setFetching(false)
  }

  function handleUrlChange(val: string) {
    setUrl(val)
    setUnfurled(false)
    if (fetchTimer.current) clearTimeout(fetchTimer.current)
    if (val.length > 8) {
      fetchTimer.current = setTimeout(() => fetchOg(val), 800)
    }
  }

  async function handleSubmit() {
    if (!title.trim()) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: countData } = await supabase
      .from('wishlist_items')
      .select('id', { count: 'exact', head: true })
      .eq('wishlist_id', selectedList)
    const position = (countData as unknown as { count: number } | null)?.count ?? defaultItemCount
    const { error: err } = await supabase.from('wishlist_items').insert({
      wishlist_id: selectedList, title: title.trim(),
      url: url || null,
      image_url: imageUrl || null,
      price: price ? parseFloat(price) : null,
      priority, notes: notes || null, position,
    })
    if (err) { setError('Nie udało się dodać produktu.'); setLoading(false); return }
    router.refresh()
    onClose()
    setLoading(false)
  }

  const currentList = lists.find(l => l.id === selectedList)

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(31,26,20,.28)',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity .35s ease', zIndex: 100,
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 16, right: 16, bottom: 16, width: 520,
        background: 'var(--paper)', borderRadius: 28,
        boxShadow: '0 32px 80px rgba(31,26,20,.22), inset 0 0 0 .5px rgba(255,255,255,.6)',
        transform: open ? 'translateX(0) scale(1)' : 'translateX(560px) scale(.96)',
        opacity: open ? 1 : 0,
        transition: 'transform .5s cubic-bezier(.34,1.56,.64,1), opacity .3s ease',
        zIndex: 101, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <style>{`
          @media (max-width: 600px) {
            .add-modal-panel { top: 0 !important; right: 0 !important; bottom: 0 !important; width: 100% !important; border-radius: 0 !important; }
          }
          .modal-field:focus { box-shadow: inset 0 0 0 1.5px var(--c1) !important; outline: none !important; }
          .modal-chip-btn { transition: background .15s, box-shadow .15s; }
          .modal-chip-btn:hover { background: var(--bg-2) !important; }
        `}</style>

        {/* Header */}
        <div style={{ padding: '28px 32px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: B, fontSize: 11, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 700 }}>
              nowe życzenie
            </div>
            <h2 className="display" style={{ margin: '6px 0 0', fontSize: 36, lineHeight: 1.05 }}>
              Dodaj <em>marzenie</em>
            </h2>
          </div>
          <button onClick={onClose} aria-label="Zamknij" style={{
            appearance: 'none', border: 0, background: 'var(--bg)', cursor: 'pointer',
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0, marginTop: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 0 0 1px var(--line)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ padding: '24px 32px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* URL */}
          <div>
            <label style={{ fontFamily: B, fontSize: 12, color: 'var(--ink-2)', fontWeight: 700, display: 'block', marginBottom: 6, letterSpacing: '.04em' }}>
              Wklej link ze sklepu
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '0 14px', height: 52, borderRadius: 14,
              background: 'var(--bg)', boxShadow: 'inset 0 0 0 1px var(--line)',
              transition: 'box-shadow .15s',
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7 0l4-4a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-4 4a5 5 0 0 0 7 7l1-1"/></svg>
              <input
                type="url"
                value={url}
                onChange={e => handleUrlChange(e.target.value)}
                placeholder="np. olx.pl/aparat-pentax"
                style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontFamily: B, fontSize: 15, color: 'var(--ink)' }}
              />
              {fetching && (
                <span style={{ fontFamily: B, fontSize: 11, color: 'var(--ink-2)' }}>…</span>
              )}
              {!fetching && url.length > 8 && unfurled && (
                <span style={{ fontFamily: B, fontSize: 11, color: 'var(--c3)', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c3)', flexShrink: 0 }}/>
                  wykryto
                </span>
              )}
            </div>
          </div>

          {/* Unfurl preview */}
          <div style={{
            height: unfurled ? 100 : 0, opacity: unfurled ? 1 : 0,
            transition: 'height .5s cubic-bezier(.34,1.56,.64,1), opacity .35s ease',
            overflow: 'hidden', borderRadius: 16,
          }}>
            <div style={{
              display: 'flex', gap: 14, padding: 14, height: 100,
              background: 'var(--c1-soft)', borderRadius: 16,
              boxShadow: 'inset 0 0 0 1px var(--line)',
            }}>
              {imageUrl && (
                <div style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'var(--paper)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
                <div style={{ fontFamily: B, fontSize: 11, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>znaleziono</div>
                <h4 className="display" style={{ fontSize: 18, margin: 0, lineHeight: 1.15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h4>
              </div>
              <button onClick={() => { setUnfurled(false); setTitle(''); setImageUrl('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-2)', padding: 4, alignSelf: 'flex-start', flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>
          </div>

          {/* Title (always shown — editable / fallback) */}
          <div>
            <label style={{ fontFamily: B, fontSize: 12, color: 'var(--ink-2)', fontWeight: 700, display: 'block', marginBottom: 6, letterSpacing: '.04em' }}>
              Nazwa produktu <span style={{ color: 'var(--c1)' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="np. Buty Nike Air Max 90"
              className="modal-field"
              style={{
                width: '100%', height: 48, padding: '0 14px', borderRadius: 12,
                border: 0, fontFamily: B, fontSize: 15, color: 'var(--ink)',
                background: 'var(--bg)', boxShadow: 'inset 0 0 0 1px var(--line)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* List picker */}
          {lists.length > 1 && (
            <div>
              <label style={{ fontFamily: B, fontSize: 12, color: 'var(--ink-2)', fontWeight: 700, display: 'block', marginBottom: 10, letterSpacing: '.04em' }}>
                Do której listy?
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {lists.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedList(l.id)}
                    className="modal-chip-btn"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '7px 14px', borderRadius: 999, border: 0, cursor: 'pointer',
                      fontFamily: B, fontSize: 13, fontWeight: 600,
                      background: selectedList === l.id ? l.accent : 'var(--paper)',
                      color: 'var(--ink)',
                      boxShadow: selectedList === l.id
                        ? 'inset 0 0 0 1.5px rgba(31,26,20,.14), 0 2px 8px rgba(31,26,20,.1)'
                        : 'inset 0 0 0 1px var(--line)',
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: selectedList === l.id ? 'var(--ink)' : l.accent, flexShrink: 0 }}/>
                    {l.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div>
            <label style={{ fontFamily: B, fontSize: 12, color: 'var(--ink-2)', fontWeight: 700, display: 'block', marginBottom: 6, letterSpacing: '.04em' }}>
              Cena (PLN) <span style={{ fontWeight: 400, opacity: .6 }}>— opcjonalnie</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="0.00"
              min="0" step="0.01"
              className="modal-field"
              style={{
                width: '100%', height: 48, padding: '0 14px', borderRadius: 12,
                border: 0, fontFamily: B, fontSize: 15, color: 'var(--ink)',
                background: 'var(--bg)', boxShadow: 'inset 0 0 0 1px var(--line)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontFamily: B, fontSize: 12, color: 'var(--ink-2)', fontWeight: 700, display: 'block', marginBottom: 6, letterSpacing: '.04em' }}>
              Notatka (opcjonalnie)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Najlepiej w rozmiarze 42, kolor czarny."
              className="modal-field"
              style={{
                width: '100%', minHeight: 80, padding: '12px 14px', borderRadius: 12,
                border: 0, fontFamily: B, fontSize: 14, color: 'var(--ink)',
                background: 'var(--bg)', boxShadow: 'inset 0 0 0 1px var(--line)',
                resize: 'vertical', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Priority */}
          <div>
            <label style={{ fontFamily: B, fontSize: 12, color: 'var(--ink-2)', fontWeight: 700, display: 'block', marginBottom: 8, letterSpacing: '.04em' }}>
              Priorytet
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {PRIORITY_OPTS.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className="modal-chip-btn"
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '9px 12px', borderRadius: 999, border: 0, cursor: 'pointer',
                    fontFamily: B, fontSize: 13, fontWeight: priority === p.value ? 700 : 500,
                    background: priority === p.value ? 'var(--ink)' : 'var(--paper)',
                    color: priority === p.value ? 'var(--paper)' : 'var(--ink)',
                    boxShadow: priority === p.value ? 'none' : 'inset 0 0 0 1px var(--line)',
                    transition: 'background .15s, color .15s',
                  }}
                >
                  <span style={{ display: 'flex', gap: 3 }}>
                    {[0, 1, 2].map(d => (
                      <span key={d} style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: d < p.dots
                          ? (priority === p.value ? 'var(--paper)' : 'var(--ink)')
                          : (priority === p.value ? 'rgba(255,255,255,.25)' : 'rgba(31,26,20,.18)'),
                      }}/>
                    ))}
                  </span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: 'var(--c1-soft)', border: '1px solid rgba(224,122,95,.25)', color: 'var(--ink)', fontSize: 13, padding: '10px 14px', borderRadius: 12, fontFamily: B }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '18px 32px', display: 'flex', gap: 12, justifyContent: 'flex-end',
          borderTop: '1px solid var(--line)', flexShrink: 0,
          background: 'var(--paper)',
        }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ fontSize: 14 }}>Anuluj</button>
          <button
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
            className="btn btn-pop"
            style={{ fontSize: 14, padding: '11px 22px' }}
          >
            {loading ? 'Dodawanie…' : 'Dodaj do listy ✦'}
          </button>
        </div>
      </div>
    </>
  )
}
