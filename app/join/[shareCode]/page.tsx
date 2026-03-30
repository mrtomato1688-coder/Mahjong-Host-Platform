'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { formatGameDate, formatRelativeTime, isValidTaiwanPhone, formatPhoneNumber } from '@/lib/utils'
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, HelpCircle } from 'lucide-react'

// Mock game data for prototype
const mockGame = {
  id: '1',
  shareCode: 'abc12345',
  hostName: '明哥',
  date: '2026-04-05',
  timeSlot: '下午2點-6點',
  location: '明哥家 - 台北市信義區松仁路',
  maxSeats: 4,
  notes: '小賭怡情，每台$10，自摸加倍',
  status: 'active' as const,
  rsvps: [
    {
      id: '1',
      playerName: '阿明',
      playerPhone: '0912345678',
      status: 'confirmed' as const,
      createdAt: new Date(Date.now() - 1800000), // 30 mins ago
    },
    {
      id: '2',
      playerName: '小華',
      playerPhone: '0923456789',
      status: 'confirmed' as const,
      createdAt: new Date(Date.now() - 900000), // 15 mins ago
    },
  ],
}

export default function JoinGamePage() {
  const params = useParams()
  const shareCode = params.shareCode as string

  const [game, setGame] = useState(mockGame)
  const [formData, setFormData] = useState({
    playerName: '',
    playerPhone: '',
    status: 'confirmed' as 'confirmed' | 'declined' | 'maybe',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const confirmedRsvps = game.rsvps.filter(r => r.status === 'confirmed')
  const availableSeats = game.maxSeats - confirmedRsvps.length
  const isFull = availableSeats <= 0

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
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

    // Check if phone already registered
    const phoneExists = game.rsvps.some(
      r => r.playerPhone === formData.playerPhone
    )
    if (phoneExists) {
      newErrors.playerPhone = '此手機號碼已報名過'
    }

    // Check if game is full
    if (isFull && formData.status === 'confirmed') {
      newErrors.general = '抱歉，此局已額滿'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // TODO: Save to Supabase
      // For prototype, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('Submitting RSVP:', formData)

      // Simulate adding to list
      const newRsvp = {
        id: String(game.rsvps.length + 1),
        playerName: formData.playerName,
        playerPhone: formData.playerPhone,
        status: formData.status,
        createdAt: new Date(),
      }

      setGame(prev => ({
        ...prev,
        rsvps: [...prev.rsvps, newRsvp],
      }))

      setSubmitted(true)
    } catch (err) {
      alert('報名失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-mahjong-green/5 to-tile-ivory flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl">
            {formData.status === 'confirmed' && '✅'}
            {formData.status === 'declined' && '❌'}
            {formData.status === 'maybe' && '🤔'}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-dark-wood mb-2">
              {formData.status === 'confirmed' && '報名成功！'}
              {formData.status === 'declined' && '已記錄您無法參加'}
              {formData.status === 'maybe' && '已記錄您的回覆'}
            </h2>
            <p className="text-neutral-gray">
              主辦人會收到您的報名資訊
            </p>
          </div>

          <div className="bg-mahjong-green/5 rounded-lg p-4 text-left space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-mahjong-green" />
              <span className="font-semibold">{formatGameDate(game.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-mahjong-green" />
              <span className="text-sm text-neutral-gray">{game.timeSlot}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-mahjong-green" />
              <span className="text-sm text-neutral-gray">{game.location}</span>
            </div>
          </div>

          {formData.status === 'confirmed' && (
            <div className="text-sm text-neutral-gray/60">
              <p>💡 記得準時到場</p>
              <p>主辦人可能會聯繫您確認</p>
            </div>
          )}
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-mahjong-green/5 to-tile-ivory py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-5xl">🀄</div>
          <h1 className="text-3xl font-bold text-dark-wood">麻將局報名</h1>
          <p className="text-neutral-gray">主辦人：{game.hostName}</p>
        </div>

        {/* Game Details */}
        <Card className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-mahjong-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-lg text-dark-wood">
                  {formatGameDate(game.date)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-mahjong-green flex-shrink-0 mt-0.5" />
              <p className="text-neutral-gray">{game.timeSlot}</p>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-mahjong-green flex-shrink-0 mt-0.5" />
              <p className="text-neutral-gray">{game.location}</p>
            </div>

            {game.notes && (
              <div className="bg-mahjong-green/5 rounded-lg p-4 mt-4">
                <p className="text-sm text-neutral-gray">💬 {game.notes}</p>
              </div>
            )}
          </div>
        </Card>

        {/* RSVP Status */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-dark-wood">報名狀況</h3>
            <div className="text-right">
              <p className="text-2xl font-bold text-lucky-red">
                {confirmedRsvps.length}/{game.maxSeats}
              </p>
              <p className="text-xs text-neutral-gray">
                {isFull ? '已額滿' : `剩餘 ${availableSeats} 個位置`}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {Array.from({ length: game.maxSeats }).map((_, index) => {
              const rsvp = confirmedRsvps[index]
              return (
                <div
                  key={index}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border-2
                    ${rsvp
                      ? 'border-mahjong-green bg-mahjong-green/5'
                      : 'border-gray-200 bg-gray-50'
                    }
                  `}
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-mahjong-green">
                    {index + 1}
                  </div>
                  {rsvp ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-mahjong-green" />
                      <div className="flex-1">
                        <p className="font-semibold text-dark-wood">{rsvp.playerName}</p>
                        <p className="text-xs text-neutral-gray">
                          {formatRelativeTime(rsvp.createdAt)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-dashed border-gray-300" />
                      <p className="text-neutral-gray/50">空位</p>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* RSVP Form */}
        <Card>
          <h3 className="font-bold text-lg text-dark-wood mb-4">我要報名</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="姓名"
              type="text"
              placeholder="請輸入您的姓名"
              value={formData.playerName}
              onChange={(e) => handleChange('playerName', e.target.value)}
              error={errors.playerName}
              required
            />

            <Input
              label="手機號碼"
              type="tel"
              placeholder="0912-345-678"
              value={formData.playerPhone}
              onChange={(e) => handleChange('playerPhone', e.target.value)}
              error={errors.playerPhone}
              required
            />

            <div>
              <label className="label-text">參加狀態</label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[
                  { value: 'confirmed', label: '確定參加', icon: CheckCircle, color: 'mahjong-green' },
                  { value: 'declined', label: '不克參加', icon: XCircle, color: 'lucky-red' },
                  { value: 'maybe', label: '再看看', icon: HelpCircle, color: 'gold' },
                ].map(option => (
                  <label
                    key={option.value}
                    className={`
                      flex flex-col items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${formData.status === option.value
                        ? `border-${option.color} bg-${option.color}/5`
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={formData.status === option.value}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="sr-only"
                    />
                    <option.icon className={`w-6 h-6 text-${option.color}`} />
                    <span className="text-sm font-semibold">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {errors.general && (
              <div className="bg-lucky-red/10 border-2 border-lucky-red rounded-lg p-3 text-center">
                <p className="text-lucky-red font-semibold">{errors.general}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              disabled={isFull && formData.status === 'confirmed'}
            >
              確認送出
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-neutral-gray/60">
          <p>🀄 麻將揪咖 Mahjong Host Platform</p>
          <p className="text-xs mt-1">輕鬆揪團，一鍵開局</p>
        </div>
      </div>
    </main>
  )
}
