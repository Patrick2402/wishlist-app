import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | null, currency = 'PLN'): string {
  if (!price) return ''
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency }).format(price)
}

export function getOrCreateReserverToken(): string {
  const key = 'wishlist_reserver_token'
  let token = localStorage.getItem(key)
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem(key, token)
  }
  return token
}
