export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { Wishlist } from '@/types'
import Link from 'next/link'
import { SquigglyUnderline, Bow, FloatingDeco } from '@/components/decorations'
import DashboardTabs from '@/components/DashboardTabs'

const C = 'var(--font-serif)'
const B = 'var(--font-sans)'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Owned wishlists
  const { data: wishlists } = await supabase
    .from('wishlists')
    .select('id, title, occasion, wishlist_items(count)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  // Lists the user has reserved items on (requires user_id on reservations)
  const { data: myReservations } = await supabase
    .from('reservations')
    .select('item_id, wishlist_items(id, title, image_url, price, wishlists(id, title, slug, occasion))')
    .eq('user_id', user!.id)

  // Group reservations by wishlist
  type WLInfo = { id: string; title: string; slug: string; occasion: string | null }
  type ItemInfo = { id: string; title: string; image_url: string | null; price: number | null }
  const map = new Map<string, { wishlist: WLInfo; items: ItemInfo[] }>()

  for (const r of (myReservations ?? [])) {
    const wi = r.wishlist_items as unknown as {
      id: string; title: string; image_url: string | null; price: number | null;
      wishlists: WLInfo | null
    } | null
    if (!wi?.wishlists) continue
    const wl = wi.wishlists
    if (!map.has(wl.id)) map.set(wl.id, { wishlist: wl, items: [] })
    map.get(wl.id)!.items.push({ id: wi.id, title: wi.title, image_url: wi.image_url, price: wi.price })
  }
  const buyingFor = Array.from(map.values())

  const lists = (wishlists ?? []) as (Wishlist & { wishlist_items: { count: number }[] })[]

  return (
    <div style={{ padding: '0 0 80px' }}>
      <style>{`
        @media (max-width: 680px) {
          .dash-header { padding: 24px 20px 16px !important; flex-wrap: wrap; }
        }
      `}</style>

      {/* Header */}
      <header className="dash-header" style={{ padding: '32px 48px 20px', display: 'flex', alignItems: 'flex-end', gap: 24, position: 'relative' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-2)', marginBottom: 12, fontFamily: B, textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 600 }}>
            <span style={{ width: 18, height: 1, background: 'var(--ink-2)' }} />
            Dashboard
          </div>
          <h1 className="display" style={{ margin: 0, fontSize: 'clamp(40px, 5vw, 60px)', position: 'relative' }}>
            Moje <em style={{ color: 'var(--c1)' }}>listy</em>.
            <SquigglyUnderline width={120} color="var(--c1)" style={{ position: 'absolute', bottom: -10, left: 108 }} />
          </h1>
        </div>
        <FloatingDeco top={-10} right={60} rot={12} delay={0.3}>
          <Bow size={90} color="var(--c2)" />
        </FloatingDeco>
      </header>

      <DashboardTabs ownedLists={lists} buyingFor={buyingFor} />
    </div>
  )
}
