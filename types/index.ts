export type Profile = {
  id: string
  email: string | null
  display_name: string | null
  created_at: string
}

export type Wishlist = {
  id: string
  user_id: string
  title: string
  description: string | null
  slug: string
  occasion: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  wishlist_items?: WishlistItem[]
}

export type WishlistItem = {
  id: string
  wishlist_id: string
  title: string
  url: string | null
  image_url: string | null
  price: number | null
  currency: string
  notes: string | null
  priority: 1 | 2 | 3
  position: number
  is_reserved: boolean
  created_at: string
}

export type Reservation = {
  id: string
  item_id: string
  reserver_token: string
  reserver_name: string | null
  reserved_at: string
}

export const OCCASIONS = [
  { value: 'birthday', label: 'Urodziny' },
  { value: 'christmas', label: 'Boże Narodzenie' },
  { value: 'wedding', label: 'Ślub' },
  { value: 'nameday', label: 'Imieniny' },
  { value: 'baby_shower', label: 'Baby Shower' },
  { value: 'anniversary', label: 'Rocznica' },
  { value: 'other', label: 'Inne' },
]

export const PRIORITY_LABELS: Record<number, string> = {
  1: 'Bardzo chcę',
  2: 'Chciałbym',
  3: 'Fajnie byłoby',
}
