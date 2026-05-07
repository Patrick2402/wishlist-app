import { createClient } from '@/lib/supabase/server'
import { Wishlist, OCCASIONS } from '@/types'
import Link from 'next/link'
import { Gift, ExternalLink, ChevronRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: wishlists } = await supabase
    .from('wishlists')
    .select('*, wishlist_items(count)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const occasionLabel = (val: string | null) =>
    OCCASIONS.find(o => o.value === val)?.label ?? 'Ogólna lista'

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Moje listy</h1>
          <p className="text-slate-500 text-sm mt-1">Zarządzaj swoimi listami życzeń</p>
        </div>
      </div>

      {!wishlists || wishlists.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Brak list życzeń</h2>
          <p className="text-slate-500 mb-6 text-sm">Stwórz pierwszą listę i zacznij zbierać marzenia!</p>
          <Link
            href="/dashboard/new"
            className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-6 py-3 rounded-full transition-colors inline-block"
          >
            Stwórz pierwszą listę
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(wishlists as (Wishlist & { wishlist_items: { count: number }[] })[]).map(list => {
            const itemCount = list.wishlist_items?.[0]?.count ?? 0
            const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/list/${list.slug}`
            return (
              <div key={list.id} className="bg-white rounded-2xl border border-slate-100 hover:border-rose-100 hover:shadow-md transition-all p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
                    {occasionLabel(list.occasion)}
                  </span>
                  <span className="text-xs text-slate-400">{itemCount} pozycji</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-1 truncate">{list.title}</h3>
                {list.description && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{list.description}</p>
                )}
                <div className="flex items-center gap-2 mt-auto">
                  <Link
                    href={`/dashboard/${list.id}`}
                    className="flex-1 text-center text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 py-2 rounded-xl transition-colors"
                  >
                    Edytuj
                  </Link>
                  <a
                    href={`/list/${list.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Podgląd publiczny"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
