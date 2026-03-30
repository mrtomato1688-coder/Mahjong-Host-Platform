'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { isValidTaiwanPhone, formatPhoneNumber } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isValidTaiwanPhone(phone)) {
      setError('請輸入有效的台灣手機號碼')
      return
    }

    setLoading(true)

    try {
      // TODO: Integrate with Supabase Auth
      // For prototype, simulate OTP sending
      console.log('Sending OTP to:', phone)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStep('otp')
    } catch (err) {
      setError('發送驗證碼失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (otp.length !== 6) {
      setError('請輸入6位數驗證碼')
      return
    }

    setLoading(true)

    try {
      // TODO: Integrate with Supabase Auth
      // For prototype, accept any 6-digit code
      console.log('Verifying OTP:', otp, 'for phone:', phone)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For prototype, auto-approve and redirect
      router.push('/dashboard')
    } catch (err) {
      setError('驗證碼錯誤或已過期')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-mahjong-green/5 to-tile-ivory">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="text-6xl">🀄</div>
          <h1 className="text-3xl font-bold text-dark-wood">麻將揪咖</h1>
          <p className="text-neutral-gray">主辦人登入</p>
        </div>

        <Card>
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <Input
                  label="手機號碼"
                  type="tel"
                  placeholder="0912-345-678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={error}
                  required
                  autoFocus
                />
                <p className="text-sm text-neutral-gray/60 mt-2">
                  我們將發送驗證碼到您的手機
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
              >
                發送驗證碼
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <div className="mb-4 text-center">
                  <p className="text-sm text-neutral-gray">
                    驗證碼已發送至
                  </p>
                  <p className="font-bold text-mahjong-green">
                    {formatPhoneNumber(phone)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-sm text-mahjong-green hover:underline mt-2"
                  >
                    修改號碼
                  </button>
                </div>

                <Input
                  label="驗證碼"
                  type="text"
                  placeholder="請輸入6位數驗證碼"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  error={error}
                  required
                  autoFocus
                  maxLength={6}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
                disabled={otp.length !== 6}
              >
                驗證並登入
              </Button>

              <button
                type="button"
                onClick={handleSendOTP}
                className="w-full text-center text-sm text-mahjong-green hover:underline"
                disabled={loading}
              >
                重新發送驗證碼
              </button>
            </form>
          )}
        </Card>

        {/* Prototype Note */}
        <div className="text-center">
          <p className="text-xs text-neutral-gray/50">
            🚧 Prototype Version - 任何6位數驗證碼皆可通過
          </p>
        </div>
      </div>
    </main>
  )
}
