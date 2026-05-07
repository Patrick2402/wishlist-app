'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OCCASIONS } from '@/types'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).slice(2, 7)
}

export default function NewWishlistPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [occasion, setOccasion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const slug = generateSlug(title)
    const { data, error } = await supabase
      .from('wishlists')
      .insert({ title, description: description || null, occasion: occasion || null, slug, user_id: user.id })
      .select()
      .single()

    if (error) {
      setError('Coś poszło nie tak. Spróbuj ponownie.')
      setLoading(false)
      return
    }

    router.push(`/dashboard/${data.id}`)
  }

  return (
    <div className="max-w-lg">
      <Link href="/dashboard" className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Wróć do list
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Nowa lista życzeń</h1>
      <p className="text-slate-500 text-sm mb-8">Wypełnij podstawowe informacje. Produkty dodasz w następnym kroku.</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Nazwa listy <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="np. Urodziny Patryka 2025"
            required
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Opis (opcjonalnie)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Krótki opis dla osób, które odwiedzą Twoją listę..."
            rows={3}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Okazja (opcjonalnie)</label>
          <select
            value={occasion}
            onChange={e => setOccasion(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition bg-white"
          >
            <option value="">Wybierz okazję...</option>
            {OCCASIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? 'Tworzenie...' : 'Stwórz listę i dodaj produkty'}
        </button>
      </form>
    </div>
  )
}
