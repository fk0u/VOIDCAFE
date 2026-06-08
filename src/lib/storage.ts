const STORAGE_PREFIX = 'voidcafe_'

export function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key)
    if (item === null) return fallback
    return JSON.parse(item) as T
  } catch {
    return fallback
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
  } catch (e) {
    console.warn('localStorage write failed:', e)
  }
}

export function removeStorageItem(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key)
}

export function isSeeded(): boolean {
  return localStorage.getItem(STORAGE_PREFIX + 'seeded') === 'true'
}

export function markSeeded(): void {
  localStorage.setItem(STORAGE_PREFIX + 'seeded', 'true')
}
