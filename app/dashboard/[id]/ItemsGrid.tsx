'use client'

import { useState } from 'react'
import { WishlistItem } from '@/types'
import ItemCard from './ItemCard'
import AddItemForm from './AddItemForm'

const B = 'var(--font-sans)'

type Filter = 'all' | 'available' | 'reserved'

export default function ItemsGrid({ items, wishlistId }: { items: WishlistItem[]; wishlistId: string }) {
  const [filter, setFilter] = useState<Filter>('all')

  const available = items.filter(i => !i.is_reserved).length
  const reserved = items.filter(i => i.is_reserved).length

  const filtered = items.filter(item => {
    if (filter === 'available') return !item.is_reserved
    if (filter === 'reserved') return item.is_reserved
    return true
  })

  return (
    <div style={{ padding: '0 48px' }}>
      <style>{`
        @media (max-width: 680px) {
          .items-toolbar { flex-wrap: wrap; }
          .items-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .drag-hint { display: none !important; }
        }
        @media (max-width: 420px) {
          .items-grid { grid-template-columns: 1fr !important; }
        }
        .filter-chip { transition: background .15s, color .15s, border-color .15s; }
        .filter-chip:hover { border-color: var(--ink-2) !important; color: var(--ink) !important; }
      `}</style>

      {/* Toolbar */}
      {items.length > 0 && (
        <div className="items-toolbar" style={{ display: 'flex', gap: 6, marginBottom: 20, alignItems: 'center' }}>
          {(
            [
              { id: 'all' as Filter,       label: 'Wszystkie',      count: items.length },
              { id: 'available' as Filter, label: 'Dostępne',       count: available },
              { id: 'reserved' as Filter,  label: 'Zarezerwowane',  count: reserved },
            ] as const
          ).map(f => (
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
      )}

      {/* Grid */}
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', borderRadius: 20, border: '2px dashed var(--line-2)', marginBottom: 16 }}>
          <p style={{ fontFamily: B, color: 'var(--ink-2)', fontSize: 14, margin: 0 }}>Brak produktów. Dodaj pierwszy poniżej!</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', borderRadius: 20, border: '2px dashed var(--line-2)', marginBottom: 16 }}>
          <p style={{ fontFamily: B, color: 'var(--ink-2)', fontSize: 14, margin: 0 }}>Brak produktów w tej kategorii.</p>
        </div>
      ) : (
        <div className="items-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16, marginBottom: 20,
        }}>
          {filtered.map((item, i) => (
            <ItemCard key={item.id} item={item} index={i} />
          ))}
        </div>
      )}

      <AddItemForm wishlistId={wishlistId} itemCount={items.length} />
    </div>
  )
}
