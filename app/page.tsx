import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-mahjong-green/5 to-tile-ivory">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-mahjong-green">
            🀄
          </h1>
          <h2 className="text-4xl font-bold text-dark-wood">
            麻將揪咖
          </h2>
          <p className="text-xl text-neutral-gray">
            輕鬆揪團，一鍵開局
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login" className="btn-primary w-full sm:w-auto">
            主辦人登入
          </Link>
          <Link href="/demo" className="btn-secondary w-full sm:w-auto">
            查看示範
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="tile-card text-center">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="font-bold text-lg mb-2">快速建立</h3>
            <p className="text-sm text-neutral-gray">
              30秒建立新局<br />自動生成分享連結
            </p>
          </div>
          
          <div className="tile-card text-center">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-bold text-lg mb-2">即時報名</h3>
            <p className="text-sm text-neutral-gray">
              玩家一鍵報名<br />即時更新座位狀態
            </p>
          </div>
          
          <div className="tile-card text-center">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="font-bold text-lg mb-2">輕鬆分享</h3>
            <p className="text-sm text-neutral-gray">
              LINE直接轉發<br />無需安裝APP
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-neutral-gray/60 pt-8">
          Made with ❤️ for Mahjong Lovers
        </div>
      </div>
    </main>
  )
}
