import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight, MessageSquare, Heart } from 'lucide-react'
import { Link, useRouter } from '@tanstack/react-router'
import { useSearch } from '@/hooks/useSearch'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { formatTimeAgo, COMMUNITY_COLORS, cn } from '@/lib/utils'

export function SearchModal() {
  const { searchModalOpen, setSearchModalOpen } = usePreferencesStore()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const { data: results, isLoading } = useSearch(query)
  const router = useRouter()

  if (!searchModalOpen) return null

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = results[activeIndex]
      if (selected) {
        router.navigate({ to: '/thread/$threadId', params: { threadId: selected.id } })
        setSearchModalOpen(false)
        setQuery('')
      }
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] bg-void-black/80 backdrop-blur-sm flex items-start justify-center pt-[10vh]"
        onClick={() => {
          setSearchModalOpen(false)
          setQuery('')
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-void-card border border-void-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-void-border">
            <Search className="w-5 h-5 text-metal-500 shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActiveIndex(0)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search threads, users, communities..."
              className="flex-1 bg-transparent text-metal-200 placeholder:text-metal-600 outline-none text-sm"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-metal-500 hover:text-metal-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="px-2 py-0.5 rounded bg-void-elevated text-[10px] font-mono text-metal-600 border border-void-border">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {!query && (
              <div className="p-6 text-center">
                <p className="text-sm text-metal-500">Start typing to search...</p>
                <p className="text-xs text-metal-600 mt-1">
                  Search across all threads, communities, and users
                </p>
              </div>
            )}

            {query && isLoading && (
              <div className="p-6 text-center">
                <div className="w-5 h-5 border-2 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin mx-auto" />
                <p className="text-xs text-metal-500 mt-2">Searching the void...</p>
              </div>
            )}

            {query && !isLoading && results && results.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-sm text-metal-500">No results found</p>
                <p className="text-xs text-metal-600 mt-1">
                  Try different keywords
                </p>
              </div>
            )}

            {results && results.length > 0 && (
              <div className="py-2">
                {results.map((thread, idx) => {
                  const isActive = idx === activeIndex
                  return (
                  <Link
                    key={thread.id}
                    to="/thread/$threadId"
                    params={{ threadId: thread.id }}
                    onClick={() => {
                      setSearchModalOpen(false)
                      setQuery('')
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 transition-colors group",
                      isActive ? "bg-void-elevated" : "hover:bg-void-elevated"
                    )}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-2 shrink-0"
                      style={{
                        backgroundColor: COMMUNITY_COLORS[thread.community] || '#6b7280',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium transition-colors line-clamp-1",
                        isActive ? "text-neon-purple" : "text-metal-200 group-hover:text-neon-purple"
                      )}>
                        {thread.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-metal-500">
                        <span>{thread.community}</span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {thread.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {thread.replyCount}
                        </span>
                        <span>{formatTimeAgo(thread.createdAt)}</span>
                      </div>
                    </div>
                    <ArrowRight className={cn(
                      "w-4 h-4 transition-opacity mt-1",
                      isActive ? "text-neon-purple opacity-100" : "text-metal-600 opacity-0 group-hover:opacity-100"
                    )} />
                  </Link>
                )})}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
