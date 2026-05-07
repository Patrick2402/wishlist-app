import type { Metadata } from 'next'
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'Wishlist — Lista życzeń',
  description: 'Stwórz listę życzeń i udostępnij znajomym. Koniec z duplikatami prezentów!',
  openGraph: {
    title: 'Wishlist — Lista życzeń',
    description: 'Stwórz listę życzeń i udostępnij znajomym. Koniec z duplikatami prezentów!',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`h-full ${cormorant.variable} ${jakarta.variable}`}>
      <body className="min-h-full antialiased" style={{ fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
