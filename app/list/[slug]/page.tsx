export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { WishlistItem, OCCASIONS, PRIORITY_LABELS } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Gift } from 'lucide-react'
import ReserveButton from './ReserveButton'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('wishlists').select('title, description').eq('slug', slug).single()
  if (!data) return {}
  return {
    title: `${data.title} — Lista życzeń`,
    description: data.description ?? `Lista życzeń: ${data.title}`,
  }
}

export default async function PublicWishlistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: wishlist } = await supabase
    .from('wishlists')
    .select('*, wishlist_items(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!wishlist) notFound()

  const items: WishlistItem[] = (wishlist.wishlist_items ?? []).sort(
    (a: WishlistItem, b: WishlistItem) => a.position - b.position
  )

  const occasionLabel = OCCASIONS.find(o => o.value === wishlist.occasion)?.label

  const reservedCount = items.filter(i => i.is_reserved).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-rose-500">
            <Gift className="w-5 h-5" />
            Wishlist
          </Link>
          <span className="text-xs text-slate-400">{reservedCount}/{items.length} zarezerwowanych</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* List header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-rose-500" />
          </div>
          {occasionLabel && (
            <span className="text-xs font-medium text-rose-500 bg-rose-50 px-3 py-1 rounded-full mb-3 inline-block">
              {occasionLabel}
            </span>
          )}
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{wishlist.title}</h1>
          {wishlist.description && (
            <p className="text-slate-500 max-w-md mx-auto">{wishlist.description}</p>
          )}
        </div>

        {/* Info banner */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 mb-8 text-sm text-amber-700">
          Kliknij <strong>Zarezerwuj</strong> przy produkcie, który chcesz podarować — właściciel listy
          nie zobaczy kto co zarezerwował. Prezent pozostanie niespodzianką!
        </div>

        {/* Items */}
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm ${item.is_reserved ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {PRIORITY_LABELS[item.priority]}
                    </span>
                    {item.is_reserved && (
                      <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        Już zarezerwowane
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg leading-tight">{item.title}</h3>
                  {item.notes && (
                    <p className="text-sm text-slate-500 mt-1">{item.notes}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {item.price && (
                      <span className="font-bold text-rose-500 text-lg">
                        {formatPrice(item.price, item.currency)}
                      </span>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-rose-500 underline underline-offset-2 transition-colors"
                      >
                        Zobacz produkt
                      </a>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  <ReserveButton item={item} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Gift className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Lista jest jeszcze pusta.</p>
          </div>
        )}

        <div className="text-center mt-10 text-slate-400 text-xs">
          Stwórz własną listę na{' '}
          <Link href="/" className="text-rose-400 hover:text-rose-500 underline">
            wishlist.app
          </Link>
        </div>
      </div>
    </div>
  )
}
