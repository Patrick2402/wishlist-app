'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WishlistItem, PRIORITY_LABELS } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Trash2, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'

const PRIORITY_COLORS: Record<number, string> = {
  1: 'bg-red-50 text-red-600',
  2: 'bg-amber-50 text-amber-600',
  3: 'bg-slate-50 text-slate-500',
}

export default function ItemCard({ item, wishlistId }: { item: WishlistItem; wishlistId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Usunąć ten produkt?')) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('wishlist_items').delete().eq('id', item.id)
    router.refresh()
  }

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-4 flex items-start gap-3 group ${item.is_reserved ? 'opacity-60' : ''}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[item.priority]}`}>
            {PRIORITY_LABELS[item.priority]}
          </span>
          {item.is_reserved && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600">
              Zarezerwowane
            </span>
          )}
        </div>
        <h4 className="font-medium text-slate-900 truncate">{item.title}</h4>
        <div className="flex items-center gap-3 mt-1">
          {item.price && (
            <span className="text-sm font-semibold text-rose-500">{formatPrice(item.price, item.currency)}</span>
          )}
          {item.notes && <span className="text-xs text-slate-400 truncate">{item.notes}</span>}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
