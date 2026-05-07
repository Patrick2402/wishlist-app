'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Gift } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl text-rose-500 mb-8">
        <Gift className="w-6 h-6" />
        Wishlist
      </Link>

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Sprawdź email!</h2>
            <p className="text-slate-500">
              Wysłaliśmy link logowania na adres{' '}
              <span className="font-medium text-slate-700">{email}</span>. Kliknij w link żeby się zalogować.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Witaj!</h1>
            <p className="text-slate-500 mb-6 text-sm">
              Podaj email — wyślemy Ci magiczny link do logowania. Bez hasła!
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ty@przyklad.pl"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {loading ? 'Wysyłanie...' : 'Wyślij link logowania'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
