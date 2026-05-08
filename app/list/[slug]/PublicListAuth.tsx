'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const B = 'var(--font-sans)'

export default function PublicListAuth({ slug }: { slug: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setChecking(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/list/${slug}` },
    })
    setSent(true)
    setLoading(false)
  }

  async function handleLogout() {
    await createClient().auth.signOut()
  }

  if (checking) return null

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: B, fontSize: 11, color: 'var(--ink-2)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.email}
        </span>
        <button onClick={handleLogout} style={{
          fontFamily: B, fontSize: 11, fontWeight: 600,
          color: 'var(--ink-2)', background: 'none',
          border: 'none', cursor: 'pointer',
          padding: '5px 10px', borderRadius: 8,
          boxShadow: 'inset 0 0 0 1px var(--line)',
        }}>
          Wyloguj
        </button>
      </div>
    )
  }

  if (sent) {
    return (
      <span style={{ fontFamily: B, fontSize: 12, color: 'var(--c3)', fontWeight: 600 }}>
        ✓ Sprawdź email
      </span>
    )
  }

  if (showForm) {
    return (
      <form onSubmit={handleLogin} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="twój@email.pl"
          required
          autoFocus
          style={{
            fontFamily: B, fontSize: 13, color: 'var(--ink)',
            border: 0, outline: 0, background: 'var(--bg)',
            boxShadow: 'inset 0 0 0 1px var(--line)',
            borderRadius: 10, padding: '6px 12px', width: 160,
          }}
        />
        <button type="submit" disabled={loading} className="btn btn-pop" style={{ fontSize: 12, padding: '6px 14px', borderRadius: 10 }}>
          {loading ? '…' : 'Wyślij link'}
        </button>
        <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-2)', fontSize: 18, padding: '0 4px', lineHeight: 1 }}>
          ×
        </button>
      </form>
    )
  }

  return (
    <button onClick={() => setShowForm(true)} style={{
      fontFamily: B, fontSize: 12, fontWeight: 600,
      color: 'var(--ink)', background: 'var(--paper)',
      border: 'none', cursor: 'pointer',
      padding: '6px 14px', borderRadius: 10,
      boxShadow: 'var(--shadow-1)',
      transition: 'transform .15s, box-shadow .15s',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none' }}
    >
      Zaloguj się
    </button>
  )
}
