'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { generateShareCode, getGameShareUrl, copyToClipboard } from '@/lib/utils'
import { Calendar, Clock, MapPin, Users, StickyNote } from 'lucide-react'

export default function NewGamePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [shareCode, setShareCode] = useState('')
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    location: '',
    maxSeats: 4,
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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

    if (!formData.timeSlot.trim()) {
      newErrors.timeSlot = '請輸入時段'
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
      // TODO: Save to Supabase
      // For prototype, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const code = generateShareCode()
      setShareCode(code)
      
      console.log('Creating game:', { ...formData, shareCode: code })
      
      setShowSuccess(true)
    } catch (err) {
      alert('建立失敗，請稍後再試')
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

            {/* Time Slot */}
            <div>
              <label className="label-text label-required flex items-center gap-2">
                <Clock className="w-4 h-4 text-mahjong-green" />
                時段
              </label>
              <Input
                type="text"
                placeholder="例：下午2點-6點"
                value={formData.timeSlot}
                onChange={(e) => handleChange('timeSlot', e.target.value)}
                error={errors.timeSlot}
              />
              <p className="text-sm text-neutral-gray/60 mt-1">
                自由輸入時段，例如「下午2點-6點」或「晚上7點開始」
              </p>
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
