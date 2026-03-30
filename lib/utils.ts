import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a random 8-character share code
 */
export function generateShareCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Format Taiwan phone number
 * Input: 0912345678 or +886912345678
 * Output: 0912-345-678
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  // If starts with 886, replace with 0
  const normalized = cleaned.startsWith('886') 
    ? '0' + cleaned.slice(3) 
    : cleaned
  
  // Format as 0912-345-678
  if (normalized.length === 10) {
    return `${normalized.slice(0, 4)}-${normalized.slice(4, 7)}-${normalized.slice(7)}`
  }
  
  return phone // Return original if format doesn't match
}

/**
 * Validate Taiwan phone number
 */
export function isValidTaiwanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  
  // Check if it's 09XXXXXXXX (10 digits starting with 09)
  if (cleaned.startsWith('09') && cleaned.length === 10) {
    return true
  }
  
  // Check if it's +88609XXXXXXXX (13 digits)
  if (cleaned.startsWith('88609') && cleaned.length === 12) {
    return true
  }
  
  return false
}

/**
 * Format date for display
 * Input: 2026-04-05
 * Output: 4月5日 (六)
 */
export function formatGameDate(dateString: string): string {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const weekday = weekdays[date.getDay()]
  
  return `${month}月${day}日 (${weekday})`
}

/**
 * Format relative time
 * Input: Date object
 * Output: "剛才", "5分鐘前", "2小時前", "昨天", "3天前"
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return '剛才'
  if (diffMins < 60) return `${diffMins}分鐘前`
  if (diffHours < 24) return `${diffHours}小時前`
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  
  return formatGameDate(date.toISOString().split('T')[0])
}

/**
 * Get shareable URL for a game
 */
export function getGameShareUrl(shareCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/join/${shareCode}`
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}
