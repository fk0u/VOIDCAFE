import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatTimeAgo(date: string | Date): string {
  const now = new Date()
  const d = new Date(date)
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getGradientForCommunity(community: string): string {
  const gradients: Record<string, string> = {
    AESPA: 'from-violet-600 via-purple-500 to-cyan-400',
    BTS: 'from-purple-600 via-violet-500 to-indigo-400',
    BLACKPINK: 'from-pink-600 via-rose-500 to-fuchsia-400',
    TWICE: 'from-orange-500 via-amber-400 to-yellow-300',
    'Stray Kids': 'from-red-600 via-rose-500 to-orange-400',
    NewJeans: 'from-sky-400 via-blue-400 to-indigo-300',
    '(G)I-DLE': 'from-violet-500 via-purple-400 to-pink-400',
    IVE: 'from-rose-400 via-pink-300 to-fuchsia-300',
    'LE SSERAFIM': 'from-emerald-500 via-teal-400 to-cyan-300',
    ATEEZ: 'from-red-500 via-orange-400 to-amber-300',
    General: 'from-gray-600 via-gray-500 to-gray-400',
  }
  return gradients[community] || gradients.General
}

export const COMMUNITY_COLORS: Record<string, string> = {
  AESPA: '#a855f7',
  BTS: '#8b5cf6',
  BLACKPINK: '#ec4899',
  TWICE: '#f59e0b',
  'Stray Kids': '#ef4444',
  NewJeans: '#38bdf8',
  '(G)I-DLE': '#c084fc',
  IVE: '#fb7185',
  'LE SSERAFIM': '#34d399',
  ATEEZ: '#f97316',
  General: '#6b7280',
}
