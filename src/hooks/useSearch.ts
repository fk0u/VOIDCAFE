import { useQuery } from '@tanstack/react-query'
import { getStorageItem } from '@/lib/storage'
import type { Thread } from '@/data/types'
import { useState, useEffect } from 'react'

export function useSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => {
      return new Promise<Thread[]>((resolve) => {
        setTimeout(() => {
          if (!debouncedQuery.trim()) {
            resolve([])
            return
          }
          const threads = getStorageItem<Thread[]>('threads', [])
          const q = debouncedQuery.toLowerCase()
          const results = threads.filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              t.body.toLowerCase().includes(q) ||
              t.authorName.toLowerCase().includes(q) ||
              t.community.toLowerCase().includes(q) ||
              t.tags?.some((tag) => tag.toLowerCase().includes(q))
          )
          resolve(results.slice(0, 10))
        }, 150)
      })
    },
    enabled: debouncedQuery.length > 0,
  })
}
