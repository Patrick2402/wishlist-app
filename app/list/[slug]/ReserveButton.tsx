'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WishlistItem } from '@/types'
import { getOrCreateReserverToken } from '@/lib/utils'
import { Lock, Unlock, Loader2, Gift } from 'lucide-react'

export default function ReserveButton({ item }: { item: WishlistItem }) {
  const [reserved, setReserved] = useState(item.is_reserved)
  const [isMyReservation, setIsMyReservation] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!reserved) return
    const checkMine = async () => {
      const token = localStorage.getItem('wishlist_reserver_token')
      if (!token) return
      const supabase = createClient()
      const { data } = await supabase
        .from('reservations')
        .select('reserver_token')
        .eq('item_id', item.id)
        .single()
      setIsMyReservation(data?.reserver_token === token)
    }
    checkMine()
  }, [item.id, reserved])

  async function handleReserve() {
    setLoading(true)
    const supabase = createClient()
    const token = getOrCreateReserverToken()

    const { error: resError } = await supabase.from('reservations').insert({
      item_id: item.id,
      reserver_token: token,
    })

    if (!resError) {
      await supabase.from('wishlist_items').update({ is_reserved: true }).eq('id', item.id)
      setReserved(true)
      setIsMyReservation(true)
    }
    setLoading(false)
  }

  async function handleUnreserve() {
    if (!confirm('Anulować rezerwację tego prezentu?')) return
    setLoading(true)
    const supabase = createClient()
    const token = localStorage.getItem('wishlist_reserver_token')

    await supabase.from('reservations').delete().eq('item_id', item.id).eq('reserver_token', token)
    await supabase.from('wishlist_items').update({ is_reserved: false }).eq('id', item.id)
    setReserved(false)
    setIsMyReservation(false)
    setLoading(false)
  }

  if (reserved && !isMyReservation) {
    return (
      <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 text-slate-400 text-sm font-medium">
        <Lock className="w-3.5 h-3.5" />
        Zajęte
      </div>
    )
  }

  if (reserved && isMyReservation) {
    return (
      <button
        onClick={handleUnreserve}
        disabled={loading}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-500 text-sm font-medium transition-colors"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Unlock className="w-3.5 h-3.5" />}
        {loading ? '...' : 'Moje — anuluj'}
      </button>
    )
  }

  return (
    <button
      onClick={handleReserve}
      disabled={loading}
      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Gift className="w-3.5 h-3.5" />}
      {loading ? '...' : 'Zarezerwuj'}
    </button>
  )
}
