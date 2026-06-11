import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { Heart, MessageSquare, Eye, Clock, Pin } from 'lucide-react'
import { Card3D } from '@/components/ui/card-3d'
import { Spotlight } from '@/components/ui/spotlight'
import { useToast } from '@/components/ui/toast'
import { useLikeThread } from '@/hooks/useThreads'
import { useAuthStore } from '@/stores/authStore'
import { cn, formatTimeAgo, formatNumber, getGradientForCommunity, COMMUNITY_COLORS } from '@/lib/utils'
import type { Thread } from '@/data/types'
import { playHover, playClick, playSuccess } from '@/lib/synth'

interface ThreadCardProps {
  thread: Thread
  index?: number
}

export function ThreadCard({ thread, index = 0 }: ThreadCardProps) {
  const { currentUser } = useAuthStore()
  const likeMutation = useLikeThread()
  const { toast } = useToast()
  const isLiked = currentUser ? thread.likedBy.includes(currentUser.id) : false

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!currentUser) {
      playClick()
      toast('You need to be logged in', 'warning')
      return
    }
    if (isLiked) {
      playClick()
    } else {
      playSuccess()
    }
    likeMutation.mutate({
      threadId: thread.id,
      userId: currentUser.id,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card3D containerClassName="w-full">
        <Spotlight className="rounded-xl">
          <Link
            to="/thread/$threadId"
            params={{ threadId: thread.id }}
            onMouseEnter={playHover}
            onClick={playClick}
            style={{
              '--community-color': COMMUNITY_COLORS[thread.community] || '#a855f7',
              '--community-glow': `${COMMUNITY_COLORS[thread.community] || '#a855f7'}20`,
            } as React.CSSProperties}
            className="block rounded-xl bg-void-card border border-void-border hover:border-[var(--community-color)] hover:shadow-[0_0_20px_var(--community-glow)] transition-all duration-300 overflow-hidden group"
          >
            {/* Cover Image / Gradient */}
            <div
              className={cn(
                'h-32 w-full bg-gradient-to-br relative overflow-hidden metallic-overlay',
                getGradientForCommunity(thread.community)
              )}
            >
              {thread.isPinned && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-void-black/60 backdrop-blur text-[10px] text-amber-400 font-medium">
                  <Pin className="w-3 h-3" />
                  Pinned
                </div>
              )}
              <div className="absolute bottom-2 left-2">
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white backdrop-blur"
                  style={{
                    backgroundColor: `${COMMUNITY_COLORS[thread.community] || '#6b7280'}90`,
                  }}
                >
                  {thread.community}
                </span>
              </div>
              {/* Scanline overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scanlines" />
            </div>

            <div className="p-4 space-y-2.5">
              {/* Author */}
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{
                    backgroundColor: COMMUNITY_COLORS[thread.community] || '#7c3aed',
                  }}
                >
                  {thread.authorName.charAt(0)}
                </div>
                <span className="text-xs font-medium text-metal-400">
                  {thread.authorName}
                </span>
                <span className="text-metal-600 text-xs">•</span>
                <span className="text-xs text-metal-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(thread.createdAt)}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-accent font-semibold text-metal-200 group-hover:text-neon-purple transition-colors line-clamp-2 leading-snug">
                {thread.title}
              </h3>

              {/* Preview */}
              <p className="text-sm text-metal-500 line-clamp-2 leading-relaxed">
                {thread.body}
              </p>

              {/* Tags */}
              {thread.tags && thread.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {thread.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-void-elevated text-[10px] font-medium text-metal-500 border border-void-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 pt-1">
                <motion.button
                  whileTap={{ scale: 1.3 }}
                  onClick={handleLike}
                  className={cn(
                    'flex items-center gap-1.5 text-xs transition-colors',
                    isLiked
                      ? 'text-blood-red'
                      : 'text-metal-500 hover:text-blood-red'
                  )}
                >
                  <Heart
                    className={cn('w-4 h-4', isLiked && 'fill-blood-red')}
                  />
                  {formatNumber(thread.likes)}
                </motion.button>
                <span className="flex items-center gap-1.5 text-xs text-metal-500">
                  <MessageSquare className="w-4 h-4" />
                  {formatNumber(thread.replyCount)}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-metal-500">
                  <Eye className="w-4 h-4" />
                  {formatNumber(thread.viewCount)}
                </span>
              </div>
            </div>
          </Link>
        </Spotlight>
      </Card3D>
    </motion.div>
  )
}
