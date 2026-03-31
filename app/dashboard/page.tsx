'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { formatGameDate, getGameShareUrl, copyToClipboard } from '@/lib/utils'
import { Calendar, MapPin, Users, Copy, ExternalLink, Edit, UtensilsCrossed } from 'lucide-react'

// Mock data for prototype
const mockGames = [
  {
    id: '1',
    shareCode: 'abc12345',
    date: '2026-04-05',
    timeSlot: '下午2點-6點',
    location: '明哥家 - 台北市信義區',
    maxSeats: 4,
    notes: '小賭怡情，每台$10',
    rsvpCount: 3,
    status: 'active' as 'active' | 'cancelled' | 'completed',
  },
  {
    id: '2',
    shareCode: 'xyz67890',
    date: '2026-04-12',
    timeSlot: '晚上7點-11點',
    location: '阿華家 - 新北市板橋區',
    maxSeats: 8,
    notes: null,
    rsvpCount: 1,
    status: 'active' as 'active' | 'cancelled' | 'completed',
  },
]

export default function DashboardPage() {
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games')
      const data = await response.json()
      
      if (response.ok && data.success) {
        setGames(data.games)
      } else {
        console.error('Failed to fetch games:', data.error)
      }
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = async (shareCode: string, gameId: string) => {
    const url = getGameShareUrl(shareCode)
    const success = await copyToClipboard(url)
    
    if (success) {
      setCopiedId(gameId)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const upcomingGames = games.filter(g => g.status === 'active')
  const pastGames = games.filter(g => g.status === 'completed')

  return (
    <main className="min-h-screen bg-gradient-to-br from-mahjong-green/5 to-tile-ivory">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🀄</span>
              <div>
                <h1 className="text-2xl font-bold text-dark-wood">我的局</h1>
                <p className="text-sm text-neutral-gray">麻將揪咖 Host Dashboard</p>
              </div>
            </div>
            <Link href="/games/new">
              <Button variant="primary">
                + 建立新局
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-mahjong-green"></div>
            <p className="text-neutral-gray mt-4">載入中...</p>
          </div>
        ) : (
          <>
            {/* Upcoming Games */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-dark-wood mb-4">
                即將開始 ({upcomingGames.length})
              </h2>
              
              {upcomingGames.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-4xl mb-4">🀫</div>
              <p className="text-neutral-gray mb-4">還沒有建立任何局</p>
              <Link href="/games/new">
                <Button variant="secondary">建立第一局</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingGames.map(game => (
                <Card key={game.id} className="space-y-4">
                  {/* Game Info */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-5 h-5 text-mahjong-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-dark-wood">
                          {formatGameDate(game.date)}
                        </p>
                        <p className="text-sm text-neutral-gray">
                          {game.startTime && game.endTime 
                            ? `${game.startTime} - ${game.endTime}`
                            : game.timeSlot || '時間未定'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-mahjong-green flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-neutral-gray">{game.location}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-mahjong-green" />
                      <p className="text-sm font-semibold">
                        <span className="text-lucky-red">{game.rsvpCount}</span>
                        <span className="text-neutral-gray">/{game.maxSeats} 人已報名</span>
                      </p>
                    </div>

                    {game.notes && (
                      <div className="bg-mahjong-green/5 rounded-lg p-3">
                        <p className="text-sm text-neutral-gray">{game.notes}</p>
                      </div>
                    )}

                    {game.menuItems && game.menuItems.length > 0 && (
                      <div className="bg-tile-ivory/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <UtensilsCrossed className="w-4 h-4 text-mahjong-green" />
                          <span className="text-sm font-semibold text-dark-wood">餐飲選項</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {game.menuItems.map((item: any) => (
                            <span key={item.id} className="text-xs bg-white px-2 py-1 rounded border border-mahjong-green/20">
                              {item.item_emoji || item.emoji} {item.item_name || item.name}
                              {' '}${item.price}
                              {item.quantity > 0 && ` (${item.quantity}份)`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-1 text-sm"
                      onClick={() => handleCopyLink(game.shareCode, game.id)}
                    >
                      <Copy className="w-4 h-4" />
                      {copiedId === game.id ? '已複製！' : '複製連結'}
                    </Button>
                    
                    <Link href={`/games/${game.id}`} className="flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full flex items-center justify-center gap-1 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        查看
                      </Button>
                    </Link>
                    
                    <Link href={`/games/${game.id}/edit`} className="flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full flex items-center justify-center gap-1 text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        編輯
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

            {/* Past Games */}
            {pastGames.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-dark-wood mb-4">
                  過往記錄 ({pastGames.length})
                </h2>
                <div className="text-center py-8">
                  <p className="text-neutral-gray">暫無過往記錄</p>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  )
}
