import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="pl" className="h-full">
      <body className={`${inter.className} min-h-full antialiased`}>{children}</body>
    </html>
  )
}
