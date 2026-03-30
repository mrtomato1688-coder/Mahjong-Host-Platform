import type { Metadata } from 'next'
import { Noto_Sans_TC, Inter } from 'next/font/google'
import './globals.css'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  weight: ['300', '400', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: '🀄 麻將揪咖 | Mahjong Host Platform',
  description: '輕鬆揪團，一鍵開局 - Easy Invites, One-Click Games',
  keywords: ['mahjong', '麻將', 'game hosting', 'RSVP', 'Taiwan'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={`${notoSansTC.variable} ${inter.variable} font-sans antialiased bg-tile-ivory`}>
        {children}
      </body>
    </html>
  )
}
