export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { WishlistItem, PRIORITY_LABELS, OCCASIONS } from '@/types'
import { formatPrice } from '@/lib/utils'
import AddItemForm from './AddItemForm'
import ItemCard from './ItemCard'
import ShareButton from './ShareButton'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditWishlistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: wishlist } = await supabase
    .from('wishlists')
    .select('*, wishlist_items(*)')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!wishlist) notFound()

  const items: WishlistItem[] = (wishlist.wishlist_items ?? []).sort(
    (a: WishlistItem, b: WishlistItem) => a.position - b.position
  )

  const occasionLabel = OCCASIONS.find(o => o.value === wishlist.occasion)?.label

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard" className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Moje listy
      </Link>

      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{wishlist.title}</h1>
          {occasionLabel && <span className="text-xs font-medium text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">{occasionLabel}</span>}
          {wishlist.description && <p className="text-slate-500 text-sm mt-2">{wishlist.description}</p>}
        </div>
        <ShareButton slug={wishlist.slug} />
      </div>

      <div className="mt-8 space-y-3">
        <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
          Produkty ({items.length})
        </h2>
        {items.map(item => (
          <ItemCard key={item.id} item={item} wishlistId={id} />
        ))}
        {items.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">Brak produktów. Dodaj pierwszy poniżej!</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <AddItemForm wishlistId={id} itemCount={items.length} />
      </div>
    </div>
  )
}
