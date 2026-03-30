import type { Metadata } from 'next'
import './globals.css'

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-tile-ivory">
        {children}
      </body>
    </html>
  )
}
