'use client'

import { useState } from 'react'
import { WishlistItem } from '@/types'
import ItemCard from './ItemCard'
import AddItemModal from './AddItemModal'
import ItemDetailModal from './ItemDetailModal'

const B = 'var(--font-sans)'

type Filter = 'all' | 'available' | 'reserved'

export default function ItemsGrid({ items, wishlistId }: { items: WishlistItem[]; wishlistId: string }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<WishlistItem | null>(null)

  const available = items.filter(i => !i.is_reserved).length
  const reserved = items.filter(i => i.is_reserved).length

  const filtered = items.filter(item => {
    if (filter === 'available') return !item.is_reserved
    if (filter === 'reserved') return item.is_reserved
    return true
  })

  return (
    <div className="items-content" style={{ padding: '0 48px' }}>
      <style>{`
        @media (max-width: 680px) {
          .items-toolbar { flex-wrap: wrap; }
          .items-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .drag-hint { display: none !important; }
          .items-content { padding: 0 20px !important; }
        }
        @media (max-width: 420px) {
          .items-grid { grid-template-columns: 1fr !important; }
        }
        .filter-chip { transition: background .15s, color .15s, border-color .15s; }
        .filter-chip:hover { border-color: var(--ink-2) !important; color: var(--ink) !important; }
      `}</style>

      {/* Toolbar */}
      <div className="items-toolbar" style={{ display: 'flex', gap: 6, marginBottom: 20, alignItems: 'center' }}>
        {([
          { id: 'all' as Filter,       label: 'Wszystkie',     count: items.length },
          { id: 'available' as Filter, label: 'Dostępne',      count: available },
          { id: 'reserved' as Filter,  label: 'Zarezerwowane', count: reserved },
        ] as const).map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className="filter-chip" style={{
            fontFamily: B, fontSize: 13, fontWeight: filter === f.id ? 700 : 500,
            padding: '7px 14px', borderRadius: 999, cursor: 'pointer',
            border: `1px solid ${filter === f.id ? 'var(--ink)' : 'var(--line)'}`,
            background: filter === f.id ? 'var(--ink)' : 'transparent',
            color: filter === f.id ? 'var(--paper)' : 'var(--ink-2)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {f.label}
            <span style={{ fontSize: 11, opacity: .7 }}>{f.count}</span>
          </button>
        ))}
        <span className="drag-hint" style={{ marginLeft: 'auto', fontFamily: B, fontSize: 11, color: 'var(--ink-2)', letterSpacing: '.01em' }}>
          Przeciągnij, by zmienić kolejność ⟺
        </span>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', borderRadius: 20, border: '2px dashed var(--line-2)', marginBottom: 16 }}>
          <p style={{ fontFamily: B, color: 'var(--ink-2)', fontSize: 14, margin: 0 }}>Brak produktów.</p>
          <button onClick={() => setModalOpen(true)} className="btn btn-pop" style={{ marginTop: 16, fontSize: 13 }}>
            Dodaj pierwsze życzenie ✦
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', borderRadius: 20, border: '2px dashed var(--line-2)', marginBottom: 16 }}>
          <p style={{ fontFamily: B, color: 'var(--ink-2)', fontSize: 14, margin: 0 }}>Brak produktów w tej kategorii.</p>
        </div>
      ) : (
        <div className="items-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 16, marginBottom: 20,
        }}>
          {filtered.map((item, i) => (
            <ItemCard key={item.id} item={item} index={i} onOpen={setDetailItem} />
          ))}
        </div>
      )}

      {/* Add button */}
      {items.length > 0 && (
        <button onClick={() => setModalOpen(true)} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '14px', borderRadius: 16, border: '2px dashed var(--line-2)',
          background: 'transparent', color: 'var(--ink-2)', fontFamily: B, fontWeight: 500, fontSize: 14,
          cursor: 'pointer', transition: 'border-color .2s, color .2s, transform .25s cubic-bezier(.34,1.56,.64,1)',
        }}
        onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = 'var(--c1)'; el.style.color = 'var(--c1)'; el.style.transform = 'translateY(-1px)' }}
        onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = 'var(--line-2)'; el.style.color = 'var(--ink-2)'; el.style.transform = 'none' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Dodaj produkt
        </button>
      )}

      <ItemDetailModal item={detailItem} onClose={() => setDetailItem(null)} />

      <AddItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultListId={wishlistId}
        defaultItemCount={items.length}
      />
    </div>
  )
}
