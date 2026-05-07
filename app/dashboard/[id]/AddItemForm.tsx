'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Link as LinkIcon, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PRIORITY_LABELS } from '@/types'

export default function AddItemForm({ wishlistId, itemCount }: { wishlistId: string; itemCount: number }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [price, setPrice] = useState('')
  const [priority, setPriority] = useState<1 | 2 | 3>(2)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.from('wishlist_items').insert({
      wishlist_id: wishlistId,
      title,
      url: url || null,
      price: price ? parseFloat(price) : null,
      priority,
      notes: notes || null,
      position: itemCount,
    })

    if (error) {
      setError('Nie udało się dodać produktu.')
      setLoading(false)
      return
    }

    setTitle('')
    setUrl('')
    setPrice('')
    setPriority(2)
    setNotes('')
    setOpen(false)
    router.refresh()
    setLoading(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-500 transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Dodaj produkt
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
      <h3 className="font-semibold text-slate-800">Nowy produkt</h3>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Nazwa produktu *</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="np. Buty Nike Air Max 90"
          required
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Link do produktu</label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://allegro.pl/..."
            className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Cena (PLN)</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Priorytet</label>
          <select
            value={priority}
            onChange={e => setPriority(Number(e.target.value) as 1 | 2 | 3)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white"
          >
            {([1, 2, 3] as const).map(p => (
              <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Notatka (np. rozmiar, kolor)</label>
        <input
          type="text"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="np. Rozmiar 42, kolor czarny"
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
        />
      </div>

      {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          Anuluj
        </button>
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 rounded-xl transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Dodaj produkt
        </button>
      </div>
    </form>
  )
}
