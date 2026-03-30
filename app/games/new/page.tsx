'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { getGameShareUrl, copyToClipboard } from '@/lib/utils'
import { Calendar, Clock, MapPin, Users, StickyNote, UtensilsCrossed, Plus, X } from 'lucide-react'

interface MenuItem {
  name: string
  emoji: string
}

const PRESET_MENU_ITEMS: MenuItem[] = [
  { name: '啤酒', emoji: '🍺' },
  { name: '汽水', emoji: '🥤' },
  { name: '麵食', emoji: '🍜' },
  { name: '披薩', emoji: '🍕' },
  { name: '便當', emoji: '🍱' },
  { name: '點心', emoji: '🍪' },
  { name: '茶飲', emoji: '🍵' },
  { name: '咖啡', emoji: '☕' },
]

export default function NewGamePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [shareCode, setShareCode] = useState('')
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    maxSeats: 4,
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // F&B state
  const [enableFB, setEnableFB] = useState(false)
  const [selectedMenuItems, setSelectedMenuItems] = useState<MenuItem[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [newItemEmoji, setNewItemEmoji] = useState('🍽️')

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.date) {
      newErrors.date = '請選擇日期'
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.date = '日期不能早於今天'
      }
    }

    if (!formData.startTime.trim()) {
      newErrors.startTime = '請選擇開始時間'
    }

    if (!formData.endTime.trim()) {
      newErrors.endTime = '請選擇結束時間'
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = '結束時間必須晚於開始時間'
    }

    if (!formData.location.trim()) {
      newErrors.location = '請輸入地點'
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
      // Call API to create game
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          location: formData.location,
          maxSeats: formData.maxSeats,
          notes: formData.notes || null,
          menuItems: enableFB ? selectedMenuItems.map(item => ({
            name: item.name,
            emoji: item.emoji,
          })) : [],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '建立失敗')
      }

      setShareCode(data.game.shareCode)
      setShowSuccess(true)
    } catch (err: any) {
      alert(err.message || '建立失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = async () => {
    const url = getGameShareUrl(shareCode)
    await copyToClipboard(url)
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  const toggleMenuItem = (item: MenuItem) => {
    setSelectedMenuItems(prev => {
      const exists = prev.some(i => i.name === item.name && i.emoji === item.emoji)
      if (exists) {
        return prev.filter(i => !(i.name === item.name && i.emoji === item.emoji))
      } else {
        return [...prev, item]
      }
    })
  }

  const removeMenuItem = (item: MenuItem) => {
    setSelectedMenuItems(prev => prev.filter(i => !(i.name === item.name && i.emoji === item.emoji)))
  }

  const addCustomMenuItem = () => {
    if (!newItemName.trim()) return
    
    const newItem: MenuItem = {
      name: newItemName.trim(),
      emoji: newItemEmoji
    }
    
    setSelectedMenuItems(prev => [...prev, newItem])
    setNewItemName('')
    setNewItemEmoji('🍽️')
  }

  if (showSuccess) {
    const shareUrl = getGameShareUrl(shareCode)
    
    return (
      <main className="min-h-screen bg-gradient-to-br from-mahjong-green/5 to-tile-ivory flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl">✅</div>
          <div>
            <h2 className="text-2xl font-bold text-dark-wood mb-2">遊戲建立成功！</h2>
            <p className="text-neutral-gray">分享以下連結給玩家報名</p>
          </div>

          <div className="bg-mahjong-green/5 rounded-lg p-4 break-all">
            <p className="text-sm font-mono text-mahjong-green">{shareUrl}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleCopyLink}
            >
              📋 複製連結
            </Button>
            
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleGoToDashboard}
            >
              返回控制台
            </Button>
          </div>

          <div className="text-xs text-neutral-gray/60 pt-4 border-t">
            <p>💡 提示：將連結轉發到 LINE 群組</p>
            <p>玩家點開即可快速報名</p>
          </div>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-mahjong-green/5 to-tile-ivory">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🀄</span>
            <h1 className="text-2xl font-bold text-dark-wood">建立新局</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="label-text label-required flex items-center gap-2">
                <Calendar className="w-4 h-4 text-mahjong-green" />
                日期
              </label>
              <input
                type="date"
                className={`input-field ${errors.date ? 'input-error' : ''}`}
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.date && (
                <div className="error-message">{errors.date}</div>
              )}
            </div>

            {/* Time Picker - Start and End */}
            <div>
              <label className="label-text label-required flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-mahjong-green" />
                時間
              </label>
              <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-start">
                <div>
                  <input
                    type="time"
                    className={`input-field ${errors.startTime ? 'input-error' : ''}`}
                    value={formData.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                  />
                  <p className="text-xs text-neutral-gray/60 mt-1">開始時間</p>
                  {errors.startTime && (
                    <div className="error-message">{errors.startTime}</div>
                  )}
                </div>
                
                <div className="text-neutral-gray/60 pt-2">→</div>
                
                <div>
                  <input
                    type="time"
                    className={`input-field ${errors.endTime ? 'input-error' : ''}`}
                    value={formData.endTime}
                    onChange={(e) => handleChange('endTime', e.target.value)}
                  />
                  <p className="text-xs text-neutral-gray/60 mt-1">結束時間</p>
                  {errors.endTime && (
                    <div className="error-message">{errors.endTime}</div>
                  )}
                </div>
              </div>
              {formData.startTime && formData.endTime && !errors.startTime && !errors.endTime && (
                <p className="text-sm text-mahjong-green mt-2">
                  ✓ {formData.startTime} - {formData.endTime}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="label-text label-required flex items-center gap-2">
                <MapPin className="w-4 h-4 text-mahjong-green" />
                地點
              </label>
              <Input
                type="text"
                placeholder="例：明哥家 - 台北市信義區松仁路"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                error={errors.location}
                maxLength={200}
              />
            </div>

            {/* Max Seats */}
            <div>
              <label className="label-text label-required flex items-center gap-2">
                <Users className="w-4 h-4 text-mahjong-green" />
                桌數
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 4, label: '1桌 (4人)' },
                  { value: 8, label: '2桌 (8人)' },
                  { value: 12, label: '3桌 (12人)' },
                ].map(option => (
                  <label
                    key={option.value}
                    className={`
                      flex items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${formData.maxSeats === option.value
                        ? 'border-mahjong-green bg-mahjong-green/5'
                        : 'border-gray-300 hover:border-mahjong-green/50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="maxSeats"
                      value={option.value}
                      checked={formData.maxSeats === option.value}
                      onChange={(e) => handleChange('maxSeats', parseInt(e.target.value))}
                      className="sr-only"
                    />
                    <span className="font-semibold">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* F&B Configuration */}
            <div className="border-t pt-6">
              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableFB}
                  onChange={(e) => setEnableFB(e.target.checked)}
                  className="w-5 h-5 text-mahjong-green rounded focus:ring-mahjong-green"
                />
                <span className="label-text flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-mahjong-green" />
                  提供餐飲選項
                </span>
              </label>

              {enableFB && (
                <div className="space-y-4 bg-tile-ivory/50 rounded-lg p-4">
                  {/* Selected Items */}
                  {selectedMenuItems.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-dark-wood mb-2">已選擇項目:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedMenuItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-mahjong-green/30"
                          >
                            <span>{item.emoji} {item.name}</span>
                            <button
                              type="button"
                              onClick={() => removeMenuItem(item)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preset Items */}
                  <div>
                    <p className="text-sm font-semibold text-dark-wood mb-2">快速選擇:</p>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_MENU_ITEMS.map((item, idx) => {
                        const isSelected = selectedMenuItems.some(
                          i => i.name === item.name && i.emoji === item.emoji
                        )
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleMenuItem(item)}
                            className={`
                              px-3 py-2 rounded-lg border-2 transition-all
                              ${isSelected
                                ? 'border-mahjong-green bg-mahjong-green text-white'
                                : 'border-gray-300 bg-white hover:border-mahjong-green/50'
                              }
                            `}
                          >
                            {item.emoji} {item.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Custom Item Input */}
                  <div>
                    <p className="text-sm font-semibold text-dark-wood mb-2">新增自訂項目:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="項目名稱"
                        value={newItemEmoji}
                        onChange={(e) => setNewItemEmoji(e.target.value)}
                        className="input-field w-20 text-center"
                        maxLength={2}
                      />
                      <input
                        type="text"
                        placeholder="例：鹹酥雞"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="input-field flex-1"
                        maxLength={20}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addCustomMenuItem()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addCustomMenuItem}
                        disabled={!newItemName.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="label-text flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-mahjong-green" />
                備註 (選填)
              </label>
              <textarea
                className="input-field min-h-[100px] resize-y"
                placeholder="例：小賭怡情，每台$10，自摸加倍"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                maxLength={500}
              />
              <p className="text-sm text-neutral-gray/60 mt-1">
                {formData.notes.length}/500 字
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => router.back()}
              >
                取消
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                loading={loading}
              >
                建立遊戲
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  )
}
