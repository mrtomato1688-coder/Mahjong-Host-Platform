'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { formatGameDate, formatRelativeTime, isValidTaiwanPhone, formatPhoneNumber } from '@/lib/utils'
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, HelpCircle, UtensilsCrossed } from 'lucide-react'
import type { Database } from '@/lib/supabase/types'

export default function JoinGamePage() {
  const params = useParams()
  const shareCode = params.shareCode as string

  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    playerName: '',
    playerPhone: '',
    status: 'confirmed' as 'confirmed' | 'declined' | 'maybe',
    foodPreferences: [] as string[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchGame()
  }, [shareCode])

  // Set up real-time subscription for RSVPs
  useEffect(() => {
    if (!game?.id) return

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const channel = supabase
      .channel(`rsvps:${game.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'rsvps',
          filter: `game_id=eq.${game.id}`,
        },
        (payload) => {
          const newRsvp = payload.new as any
          setGame((prev: any) => ({
            ...prev,
            rsvps: [
              ...prev.rsvps,
              {
                id: newRsvp.id,
                playerName: newRsvp.player_name,
                playerPhone: newRsvp.player_phone,
                status: newRsvp.status,
                foodPreferences: newRsvp.food_preferences || [],
                createdAt: newRsvp.created_at,
              },
            ],
          }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [game?.id])

  const fetchGame = async () => {
    try {
      const response = await fetch(`/api/games/${shareCode}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        setGame(data.game)
      } else {
        alert(data.error || '找不到此遊戲')
      }
    } catch (error) {
      console.error('Error fetching game:', error)
      alert('載入遊戲失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-mahjong-green/5 to-tile-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-mahjong-green"></div>
          <p className="text-neutral-gray mt-4">載入中...</p>
        </div>
      </main>
    )
  }

  if (!game) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-mahjong-green/5 to-tile-ivory flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl">❌</div>
          <div>
            <h2 className="text-2xl font-bold text-dark-wood mb-2">找不到此遊戲</h2>
            <p className="text-neutral-gray">連結可能已失效或不正確</p>
          </div>
        </Card>
      </main>
    )
  }

  const confirmedRsvps = game.rsvps?.filter((r: any) => r.status === 'confirmed') || []
  const availableSeats = game.maxSeats - confirmedRsvps.length
  const isFull = availableSeats <= 0

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const toggleFoodPreference = (item: string) => {
    setFormData(prev => ({
      ...prev,
      foodPreferences: prev.foodPreferences.includes(item)
        ? prev.foodPreferences.filter(i => i !== item)
        : [...prev.foodPreferences, item]
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.playerName.trim()) {
      newErrors.playerName = '請輸入姓名'
    } else if (formData.playerName.trim().length < 2) {
      newErrors.playerName = '姓名至少需要2個字'
    }

    if (!formData.playerPhone.trim()) {
      newErrors.playerPhone = '請輸入手機號碼'
    } else if (!isValidTaiwanPhone(formData.playerPhone)) {
      newErrors.playerPhone = '請輸入有效的台灣手機號碼'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (formData.status === 'confirmed' && isFull) {
      alert('抱歉，名額已滿')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/rsvps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game.id,
          playerName: formData.playerName,
          playerPhone: formData.playerPhone,
          status: formData.status,
          foodPreferences: formData.foodPreferences,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '報名失敗')
      }

      setSubmitted(true)
    } catch (err: any) {
      alert(err.message || '報名失敗，請稍後再試')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-mahjong-green/5 to-tile-ivory flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl">
            {formData.status === 'confirmed' ? '✅' : formData.status === 'declined' ? '❌' : '🤔'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-dark-wood mb-2">
              {formData.status === 'confirmed' ? '報名成功！' : 
               formData.status === 'declined' ? '已回覆不參加' : '已回覆考慮中'}
            </h2>
            <p className="text-neutral-gray">
              {formData.status === 'confirmed' 
                ? `${game.hostName} 會透過 LINE 通知您更多資訊`
                : '感謝您的回覆'}
            </p>
          </div>

          <div className="bg-mahjong-green/5 rounded-lg p-4 text-left space-y-2">
            <p className="text-sm font-semibold text-dark-wood">報名資訊</p>
            <p className="text-sm text-neutral-gray">姓名：{formData.playerName}</p>
            <p className="text-sm text-neutral-gray">手機：{formatPhoneNumber(formData.playerPhone)}</p>
            {formData.foodPreferences.length > 0 && (
              <p className="text-sm text-neutral-gray">
                餐飲：{formData.foodPreferences.join(', ')}
              </p>
            )}
          </div>
        </Card>
      </main>
    )
  }

  const statusOptions = [
    { value: 'confirmed', label: '確定參加', icon: CheckCircle, color: 'mahjong-green' },
    { value: 'declined', label: '不克參加', icon: XCircle, color: 'red-500' },
    { value: 'maybe', label: '再看看', icon: HelpCircle, color: 'yellow-600' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-mahjong-green/5 to-tile-ivory">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Game Info Card */}
        <Card className="mb-6">
          <div className="text-center mb-6">
            <span className="text-4xl mb-2 block">🀄</span>
            <h1 className="text-2xl font-bold text-dark-wood mb-1">麻將局 - 報名確認</h1>
            <p className="text-sm text-neutral-gray">主辦人：{game.hostName}</p>
          </div>

          <div className="space-y-3 border-t pt-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-mahjong-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-dark-wood">{formatGameDate(game.date)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-mahjong-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-dark-wood">{game.startTime} - {game.endTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-mahjong-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-dark-wood">{game.location}</p>
              </div>
            </div>

            {game.notes && (
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">💬</span>
                <p className="text-neutral-gray text-sm">{game.notes}</p>
              </div>
            )}
          </div>
        </Card>

        {/* RSVP Status */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-dark-wood flex items-center gap-2">
              <Users className="w-5 h-5 text-mahjong-green" />
              報名狀況
            </h3>
            <span className={`text-lg font-bold ${isFull ? 'text-red-500' : 'text-mahjong-green'}`}>
              {confirmedRsvps.length}/{game.maxSeats}
            </span>
          </div>

          {/* RSVP List */}
          <div className="space-y-2">
            {game.rsvps?.map((rsvp: any, idx: number) => (
              <div
                key={rsvp.id}
                className={`p-3 rounded-lg border ${
                  rsvp.status === 'confirmed' 
                    ? 'border-mahjong-green/30 bg-mahjong-green/5' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      rsvp.status === 'confirmed' ? 'bg-mahjong-green' : 'bg-gray-400'
                    }`}></span>
                    <span className="font-medium text-dark-wood">{rsvp.playerName}</span>
                  </div>
                  <span className="text-xs text-neutral-gray">
                    {formatRelativeTime(new Date(rsvp.createdAt))}
                  </span>
                </div>
                {rsvp.foodPreferences && rsvp.foodPreferences.length > 0 && (
                  <div className="mt-1 ml-4 text-sm text-neutral-gray">
                    {rsvp.foodPreferences.join(', ')}
                  </div>
                )}
              </div>
            ))}

            {/* Empty seats */}
            {availableSeats > 0 && Array.from({ length: Math.min(availableSeats, 4) }).map((_, idx) => (
              <div key={`empty-${idx}`} className="p-3 rounded-lg border border-dashed border-gray-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  <span className="text-neutral-gray">空位</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* RSVP Form */}
        <Card>
          <h3 className="font-semibold text-dark-wood mb-4">我要報名</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <Input
                label="姓名"
                type="text"
                placeholder="請輸入您的姓名"
                value={formData.playerName}
                onChange={(e) => handleChange('playerName', e.target.value)}
                error={errors.playerName}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <Input
                label="手機號碼"
                type="tel"
                placeholder="0912-345-678"
                value={formData.playerPhone}
                onChange={(e) => handleChange('playerPhone', e.target.value)}
                error={errors.playerPhone}
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="label-text mb-2 block">參加狀態</label>
              <div className="grid grid-cols-3 gap-3">
                {statusOptions.map(option => {
                  const Icon = option.icon
                  const isSelected = formData.status === option.value
                  return (
                    <label
                      key={option.value}
                      className={`
                        flex flex-col items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all
                        ${isSelected
                          ? `border-${option.color} bg-${option.color}/5`
                          : 'border-gray-300 hover:border-gray-400'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={isSelected}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="sr-only"
                      />
                      <Icon className={`w-6 h-6 ${isSelected ? `text-${option.color}` : 'text-gray-400'}`} />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* F&B Preferences */}
            {game.menuItems && game.menuItems.length > 0 && (
              <div>
                <label className="label-text flex items-center gap-2 mb-2">
                  <UtensilsCrossed className="w-4 h-4 text-mahjong-green" />
                  食物飲料 (可複選)
                </label>
                <div className="space-y-2">
                  {game.menuItems.map((item: any) => {
                    const isSelected = formData.foodPreferences.includes(`${item.emoji} ${item.name}`)
                    const hasQuantity = item.quantity > 0
                    const isOutOfStock = hasQuantity && item.quantity <= 0
                    
                    return (
                      <label
                        key={item.id}
                        className={`
                          flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                          ${isOutOfStock 
                            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                            : isSelected
                              ? 'border-mahjong-green bg-mahjong-green/5'
                              : 'border-gray-300 hover:border-mahjong-green/50'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleFoodPreference(`${item.emoji} ${item.name}`)}
                            disabled={isOutOfStock}
                            className="sr-only"
                          />
                          <span className="text-2xl">{item.emoji}</span>
                          <div>
                            <div className="font-medium text-dark-wood">{item.name}</div>
                            <div className="text-xs text-neutral-gray flex gap-2 mt-0.5">
                              <span>💰 ${item.price}</span>
                              {hasQuantity && (
                                <span className={isOutOfStock ? 'text-red-500' : ''}>
                                  📦 {isOutOfStock ? '已售完' : `剩${item.quantity}份`}
                                </span>
                              )}
                              {!hasQuantity && (
                                <span>📦 充足供應</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-mahjong-green">✓</span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={submitting}
              disabled={isFull && formData.status === 'confirmed'}
            >
              {isFull && formData.status === 'confirmed' ? '名額已滿' : '確認送出'}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}
