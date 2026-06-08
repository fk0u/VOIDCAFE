import { useEffect, useRef, useState } from 'react'
import { useInView, motion, AnimatePresence } from 'framer-motion'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { ThreadCard } from './thread-card'
import { ThreadCardSkeleton } from '@/components/ui/skeleton'
import { CategoryChips } from '@/components/common/category-chips'
import { useInfiniteThreads, usePaginatedThreads, fetchPaginatedThreads } from '@/hooks/useThreads'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { queryClient } from '@/lib/queryClient'
import type { SortOption } from '@/data/types'
import { cn } from '@/lib/utils'

interface ThreadListProps {
  community?: string
  showFilters?: boolean
}

export function ThreadList({ community: initialCommunity, showFilters = true }: ThreadListProps) {
  const { feedMode, setFeedMode } = usePreferencesStore()
  const [selectedCommunity, setSelectedCommunity] = useState(initialCommunity || '')
  const [sort, setSort] = useState<SortOption>('latest')
  const [page, setPage] = useState(1)
  
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(loadMoreRef, { margin: '200px' })

  const filters = {
    community: selectedCommunity || undefined,
    sort,
  }

  // 1. Infinite Query (used when feedMode === 'infinite')
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInfiniteLoading,
  } = useInfiniteThreads(filters)

  // 2. Paginated Query (used when feedMode === 'paginated')
  const {
    data: paginatedData,
    isLoading: isPaginatedLoading,
  } = usePaginatedThreads(filters, page)

  // Infinite Scroll Trigger
  useEffect(() => {
    if (feedMode === 'infinite' && isInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage, feedMode])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [selectedCommunity, sort])

  // Prefetch adjacent pages for paginated feed
  useEffect(() => {
    if (feedMode !== 'paginated' || !paginatedData) return

    // Prefetch page + 1
    if (page < paginatedData.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ['threads', 'paginated', filters, page + 1, 6],
        queryFn: () => fetchPaginatedThreads(filters, page + 1, 6),
      })
    }

    // Prefetch page - 1
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ['threads', 'paginated', filters, page - 1, 6],
        queryFn: () => fetchPaginatedThreads(filters, page - 1, 6),
      })
    }
  }, [page, paginatedData, selectedCommunity, sort, feedMode])

  // Determine current threads and loading state based on mode
  const threads = feedMode === 'infinite'
    ? (infiniteData?.pages.flatMap((page) => page.threads) || [])
    : (paginatedData?.threads || [])

  const isLoading = feedMode === 'infinite' ? isInfiniteLoading : isPaginatedLoading

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'latest', label: 'Latest' },
    { value: 'trending', label: 'Trending' },
    { value: 'most-liked', label: 'Most Liked' },
  ]

  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="space-y-3">
          <CategoryChips
            selected={selectedCommunity}
            onSelect={setSelectedCommunity}
          />
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Sort options */}
            <div className="flex gap-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer',
                    sort === opt.value
                      ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                      : 'text-metal-500 hover:text-metal-300 hover:bg-void-elevated border border-transparent'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Feed Mode Toggle */}
            <div className="flex items-center gap-1.5 border border-void-border rounded-lg p-0.5 bg-void-surface">
              <button
                onClick={() => setFeedMode('infinite')}
                className={cn(
                  'px-2.5 py-1 rounded-md text-[10px] font-heading font-bold tracking-wider transition-all cursor-pointer',
                  feedMode === 'infinite'
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 shadow-[0_0_8px_rgba(34,211,238,0.1)]'
                    : 'text-metal-500 hover:text-metal-300'
                )}
              >
                INFINITE FEED
              </button>
              <button
                onClick={() => setFeedMode('paginated')}
                className={cn(
                  'px-2.5 py-1 rounded-md text-[10px] font-heading font-bold tracking-wider transition-all cursor-pointer',
                  feedMode === 'paginated'
                    ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30 shadow-[0_0_8px_rgba(168,85,247,0.1)]'
                    : 'text-metal-500 hover:text-metal-300'
                )}
              >
                PAGINATED ARCHIVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thread Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <ThreadCardSkeleton key={i} />
          ))}
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-metal-500 text-sm">No threads found</p>
          <p className="text-metal-600 text-xs mt-1">Try a different filter</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={feedMode === 'paginated' ? `${page}-${selectedCommunity}-${sort}` : 'infinite'}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="grid gap-4 md:grid-cols-2"
          >
            {threads.map((thread, i) => (
              <ThreadCard key={thread.id} thread={thread} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Mode Specific Pagination / Load More UI */}
      {feedMode === 'infinite' ? (
        /* Infinite Trigger */
        <div ref={loadMoreRef} className="py-4 flex justify-center">
          {isFetchingNextPage && (
            <Loader2 className="w-5 h-5 text-neon-purple animate-spin" />
          )}
          {!hasNextPage && threads.length > 0 && (
            <p className="text-xs text-metal-600 font-mono">
              — end of the void —
            </p>
          )}
        </div>
      ) : (
        /* Paginated Controls */
        !isLoading && paginatedData && paginatedData.totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-6 font-mono text-xs">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-void-border text-metal-400 disabled:opacity-30 disabled:hover:text-metal-400 hover:text-metal-200 hover:border-metal-600 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: paginatedData.totalPages }).map((_, idx) => {
              const pageNum = idx + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    'w-8 h-8 rounded-lg border font-bold flex items-center justify-center transition-all cursor-pointer',
                    page === pageNum
                      ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_12px_rgba(168,85,247,0.15)] font-black'
                      : 'border-void-border text-metal-500 hover:text-metal-300 hover:border-metal-600'
                  )}
                >
                  {pageNum}
                </button>
              )
            })}
            
            <button
              onClick={() => setPage((p) => Math.min(paginatedData.totalPages, p + 1))}
              disabled={page === paginatedData.totalPages}
              className="p-2 rounded-lg border border-void-border text-metal-400 disabled:opacity-30 disabled:hover:text-metal-400 hover:text-metal-200 hover:border-metal-600 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )
      )}
    </div>
  )
}
