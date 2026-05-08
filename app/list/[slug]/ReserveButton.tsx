'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WishlistItem } from '@/types'
import { getOrCreateReserverToken } from '@/lib/utils'
import { fireConfetti } from '@/lib/confetti'

const B = 'var(--font-sans)'

export default function ReserveButton({ item }: { item: WishlistItem }) {
  const [reserved, setReserved] = useState(item.is_reserved)
  const [isMyReservation, setIsMyReservation] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const token = localStorage.getItem('wishlist_reserver_token')
      const { data: { user } } = await supabase.auth.getUser()

      // Migrate any anonymous reservations to the logged-in account
      if (user && token) {
        await supabase.from('reservations')
          .update({ user_id: user.id })
          .eq('reserver_token', token)
          .is('user_id', null)
      }

      if (!reserved) return

      const { data } = await supabase
        .from('reservations')
        .select('reserver_token, user_id')
        .eq('item_id', item.id)
        .single()

      if (!data) return
      if (user && data.user_id === user.id) setIsMyReservation(true)
      else if (token && data.reserver_token === token) setIsMyReservation(true)
    }
    init()
  }, [item.id, reserved])

  async function handleReserve(e: React.MouseEvent<HTMLButtonElement>) {
    setLoading(true)
    const supabase = createClient()
    const token = getOrCreateReserverToken()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('reservations').insert({
      item_id: item.id,
      reserver_token: token,
      user_id: user?.id ?? null,
    })
    if (!error) {
      await supabase.from('wishlist_items').update({ is_reserved: true }).eq('id', item.id)
      setReserved(true)
      setIsMyReservation(true)
      fireConfetti(e.clientX, e.clientY)
    }
    setLoading(false)
  }

  async function handleUnreserve() {
    if (!confirm('Anulować rezerwację tego prezentu?')) return
    setLoading(true)
    const supabase = createClient()
    const token = localStorage.getItem('wishlist_reserver_token')
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('reservations').delete().eq('item_id', item.id).eq('user_id', user.id)
    } else if (token) {
      await supabase.from('reservations').delete().eq('item_id', item.id).eq('reserver_token', token)
    }
    await supabase.from('wishlist_items').update({ is_reserved: false }).eq('id', item.id)
    setReserved(false)
    setIsMyReservation(false)
    setLoading(false)
  }

  if (reserved && !isMyReservation) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '8px 14px', borderRadius: 999,
        background: 'var(--bg-2)', color: 'var(--ink-2)',
        fontFamily: B, fontSize: 12, fontWeight: 600,
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Zajęte
      </div>
    )
  }

  if (reserved && isMyReservation) {
    return (
      <button onClick={handleUnreserve} disabled={loading} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '8px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
        background: 'var(--c3-soft)', color: 'var(--ink)',
        fontFamily: B, fontSize: 12, fontWeight: 600,
        transition: 'background .2s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--c1-soft)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--c3-soft)' }}
      >
        {loading
          ? '...'
          : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Moje — anuluj</>
        }
      </button>
    )
  }

  return (
    <button onClick={handleReserve} disabled={loading} className="btn btn-pop" style={{ fontSize: 12, padding: '8px 14px', borderRadius: 999, gap: 6 }}>
      {loading
        ? '...'
        : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>Rezerwuję</>
      }
    </button>
  )
}
