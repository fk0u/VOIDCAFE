import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { getStorageItem, setStorageItem } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import type { Thread, ThreadFilters, Notification } from '@/data/types'
import { useAuthStore } from '@/stores/authStore'

const THREADS_KEY = 'threads'
const PAGE_SIZE = 6

function pushNotification(notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) {
  const notifs = getStorageItem<Notification[]>('notifications', [])
  notifs.unshift({
    ...notif,
    id: `notif-${generateId()}`,
    createdAt: new Date().toISOString(),
    read: false,
  })
  setStorageItem('notifications', notifs)
}

function getAllThreads(): Thread[] {
  return getStorageItem<Thread[]>(THREADS_KEY, [])
}

function getFilteredThreads(filters: ThreadFilters): Thread[] {
  let threads = getAllThreads()

  if (filters.community) {
    threads = threads.filter((t) => t.community === filters.community)
  }

  if (filters.search) {
    const q = filters.search.toLowerCase()
    threads = threads.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q) ||
        t.authorName.toLowerCase().includes(q) ||
        t.community.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(q))
    )
  }

  switch (filters.sort) {
    case 'trending':
      threads.sort((a, b) => b.viewCount - a.viewCount)
      break
    case 'most-liked':
      threads.sort((a, b) => b.likes - a.likes)
      break
    case 'latest':
    default:
      threads.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }

  return threads
}

// ─── Queries ─────────────────────────────────────────────────

export function useThreads(filters: ThreadFilters) {
  return useQuery({
    queryKey: ['threads', filters],
    queryFn: () => {
      // Simulate network delay
      return new Promise<Thread[]>((resolve) => {
        setTimeout(() => resolve(getFilteredThreads(filters)), 300)
      })
    },
  })
}

export function useInfiniteThreads(filters: ThreadFilters) {
  return useInfiniteQuery({
    queryKey: ['threads', 'infinite', filters],
    queryFn: ({ pageParam = 0 }) => {
      return new Promise<{ threads: Thread[]; nextPage: number | null }>(
        (resolve) => {
          setTimeout(() => {
            const all = getFilteredThreads(filters)
            const start = pageParam * PAGE_SIZE
            const threads = all.slice(start, start + PAGE_SIZE)
            const nextPage =
              start + PAGE_SIZE < all.length ? pageParam + 1 : null
            resolve({ threads, nextPage })
          }, 400)
        }
      )
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  })
}

export function fetchPaginatedThreads(filters: ThreadFilters, page: number, pageSize: number = PAGE_SIZE) {
  return new Promise<{ threads: Thread[]; totalCount: number; totalPages: number }>(
    (resolve) => {
      setTimeout(() => {
        const all = getFilteredThreads(filters)
        const start = (page - 1) * pageSize
        const threads = all.slice(start, start + pageSize)
        const totalCount = all.length
        const totalPages = Math.ceil(totalCount / pageSize)
        resolve({ threads, totalCount, totalPages })
      }, 300)
    }
  )
}

export function usePaginatedThreads(filters: ThreadFilters, page: number, pageSize: number = PAGE_SIZE) {
  return useQuery({
    queryKey: ['threads', 'paginated', filters, page, pageSize],
    queryFn: () => fetchPaginatedThreads(filters, page, pageSize),
    placeholderData: (previousData) => previousData,
  })
}

export function useThread(id: string) {
  return useQuery({
    queryKey: ['thread', id],
    queryFn: () => {
      return new Promise<Thread | null>((resolve) => {
        setTimeout(() => {
          const threads = getAllThreads()
          const thread = threads.find((t) => t.id === id) || null
          // Increment view count
          if (thread) {
            thread.viewCount += 1
            const all = getAllThreads()
            const idx = all.findIndex((t) => t.id === id)
            if (idx >= 0) {
              all[idx] = thread
              setStorageItem(THREADS_KEY, all)
            }
          }
          resolve(thread)
        }, 200)
      })
    },
  })
}

export function useTrendingThreads() {
  return useQuery({
    queryKey: ['threads', 'trending'],
    queryFn: () => {
      return new Promise<Thread[]>((resolve) => {
        setTimeout(() => {
          const threads = getAllThreads()
          threads.sort((a, b) => b.likes + b.viewCount - (a.likes + a.viewCount))
          resolve(threads.slice(0, 8))
        }, 200)
      })
    },
  })
}

// ─── Mutations ───────────────────────────────────────────────

export function useCreateThread() {
  return useMutation({
    mutationFn: (
      newThread: Omit<Thread, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likes' | 'likedBy' | 'replyCount'>
    ) => {
      return new Promise<Thread>((resolve) => {
        setTimeout(() => {
          const thread: Thread = {
            ...newThread,
            id: `thread-${generateId()}`,
            likes: 0,
            likedBy: [],
            replyCount: 0,
            viewCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          const threads = getAllThreads()
          threads.unshift(thread)
          setStorageItem(THREADS_KEY, threads)
          resolve(thread)
        }, 300)
      })
    },
    onSuccess: () => {
      useAuthStore.getState().incrementThreadCount(1)
      queryClient.invalidateQueries({ queryKey: ['threads'] })
    },
  })
}

export function useLikeThread() {
  return useMutation({
    mutationFn: ({
      threadId,
      userId,
    }: {
      threadId: string
      userId: string
    }) => {
      return new Promise<Thread>((resolve) => {
        const threads = getAllThreads()
        const idx = threads.findIndex((t) => t.id === threadId)
        if (idx < 0) throw new Error('Thread not found')

        const thread = { ...threads[idx] }
        const likedIndex = thread.likedBy.indexOf(userId)

        if (likedIndex >= 0) {
          thread.likedBy = thread.likedBy.filter((id) => id !== userId)
          thread.likes -= 1
        } else {
          thread.likedBy = [...thread.likedBy, userId]
          thread.likes += 1
          if (thread.authorId !== userId) {
            const user = useAuthStore.getState().currentUser
            if (user) {
              pushNotification({
                type: 'like',
                message: `${user.displayName} liked your thread "${thread.title}"`,
                threadId: thread.id,
                fromUser: user.displayName,
                fromAvatar: user.avatar,
              })
            }
          }
        }

        threads[idx] = thread
        setStorageItem(THREADS_KEY, threads)
        resolve({ thread, isLiked: likedIndex < 0 })
      })
    },
    onMutate: async ({ threadId, userId }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['threads'] })
      await queryClient.cancelQueries({ queryKey: ['thread', threadId] })

      const previousThread = queryClient.getQueryData<Thread>([
        'thread',
        threadId,
      ])

      // Update single thread cache
      queryClient.setQueryData<Thread>(['thread', threadId], (old) => {
        if (!old) return old
        const isLiked = old.likedBy.includes(userId)
        return {
          ...old,
          likes: isLiked ? old.likes - 1 : old.likes + 1,
          likedBy: isLiked
            ? old.likedBy.filter((id) => id !== userId)
            : [...old.likedBy, userId],
        }
      })

      return { previousThread }
    },
    onError: (_err, { threadId }, context) => {
      if (context?.previousThread) {
        queryClient.setQueryData(['thread', threadId], context.previousThread)
      }
    },
    onSettled: (data) => {
      if (data) {
        useAuthStore.getState().incrementLikeCount(data.isLiked ? 1 : -1)
      }
      queryClient.invalidateQueries({ queryKey: ['threads'] })
    },
  })
}

export function useDeleteThread() {
  return useMutation({
    mutationFn: (threadId: string) => {
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          const threads = getAllThreads()
          const idx = threads.findIndex((t) => t.id === threadId)
          if (idx < 0) return reject(new Error('Thread not found'))
          
          threads.splice(idx, 1)
          setStorageItem(THREADS_KEY, threads)
          
          useAuthStore.getState().incrementThreadCount(-1)
          resolve()
        }, 300)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] })
    },
  })
}
