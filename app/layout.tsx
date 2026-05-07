import type { Metadata } from 'next'
import { Instrument_Serif, Bricolage_Grotesque, Caveat } from 'next/font/google'
import './globals.css'

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

const sans = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
})

const script = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-script',
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
    <html lang="pl" className={`h-full ${serif.variable} ${sans.variable} ${script.variable}`}>
      <body className="min-h-full">
        {children}
      </body>
    </html>
  )
}
