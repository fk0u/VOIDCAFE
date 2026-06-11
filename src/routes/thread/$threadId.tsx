/* eslint-disable react-refresh/only-export-components */
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, MessageSquare, Eye, Share2, Bookmark, Clock, Send, Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useThread, useLikeThread, useDeleteThread } from '@/hooks/useThreads'
import { useComments, useCreateComment } from '@/hooks/useComments'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/components/ui/toast'
import { Comment } from '@/components/thread/comment'
import { Spotlight } from '@/components/ui/spotlight'
import { CommentSkeleton, Skeleton } from '@/components/ui/skeleton'
import { cn, formatTimeAgo, formatNumber, getGradientForCommunity, COMMUNITY_COLORS } from '@/lib/utils'
import { PageTransition } from '@/components/common/page-transition'

export const Route = createFileRoute('/thread/$threadId')({
  component: ThreadDetailPage,
})

function ThreadDetailPage() {
  const { threadId } = Route.useParams()
  const { data: thread, isLoading: threadLoading } = useThread(threadId)
  const { data: comments, isLoading: commentsLoading } = useComments(threadId)
  const { currentUser } = useAuthStore()
  const likeMutation = useLikeThread()
  const deleteMutation = useDeleteThread()
  const createCommentMutation = useCreateComment()
  const { toast } = useToast()
  const router = useRouter()
  const [commentText, setCommentText] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)

  const isLiked = thread && currentUser ? thread.likedBy.includes(currentUser.id) : false
  const isAuthor = thread && currentUser ? thread.authorId === currentUser.id : false

  const handleLike = () => {
    if (!currentUser || !thread) return
    likeMutation.mutate({ threadId: thread.id, userId: currentUser.id })
  }

  const handleDelete = () => {
    if (!thread || !window.confirm('Are you sure you want to delete this thread?')) return
    deleteMutation.mutate(thread.id, {
      onSuccess: () => {
        toast('Thread deleted', 'success')
        router.navigate({ to: '/' })
      }
    })
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks', 'success')
  }

  const handleComment = () => {
    if (!commentText.trim() || !currentUser || !thread) return
    createCommentMutation.mutate(
      {
        threadId: thread.id,
        parentId: null,
        authorId: currentUser.id,
        authorName: currentUser.displayName,
        authorAvatar: currentUser.avatar,
        body: commentText.trim(),
      },
      {
        onSuccess: () => {
          setCommentText('')
          toast('Comment posted!', 'success')
        },
      }
    )
  }

  if (threadLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="w-full h-48 rounded-xl" />
        <Skeleton className="w-3/4 h-8" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-2/3 h-4" />
      </div>
    )
  }

  if (!thread) {
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="font-heading text-2xl font-bold text-metal-300">
            Thread Not Found
          </h2>
          <p className="text-metal-500 mt-2">This thread has been lost in the void.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-4 text-neon-purple hover:text-neon-purple/80 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-metal-500 hover:text-metal-300 transition-colors text-sm mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <Spotlight className="rounded-2xl">
        <article className="rounded-2xl bg-void-card border border-void-border overflow-hidden">
          {/* Cover */}
          <div
            className={cn(
              'h-48 md:h-56 bg-gradient-to-br relative overflow-hidden metallic-overlay',
              getGradientForCommunity(thread.community)
            )}
          >
            {thread.coverImage && (
              <img
                src={thread.coverImage}
                alt={thread.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-void-card via-transparent to-transparent" />
            <div className="absolute inset-0 scanlines opacity-20" />
            <div className="absolute bottom-4 left-4">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm"
                style={{
                  backgroundColor: `${COMMUNITY_COLORS[thread.community] || '#6b7280'}90`,
                }}
              >
                {thread.community}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: COMMUNITY_COLORS[thread.community] || '#7c3aed' }}
              >
                {thread.authorName.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-metal-200">{thread.authorName}</p>
                <p className="text-xs text-metal-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(thread.createdAt)}
                </p>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl md:text-3xl font-black text-metal-100 leading-tight">
              {thread.title}
            </h1>

            {/* Tags */}
            {thread.tags && thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {thread.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-void-elevated text-xs font-medium text-metal-400 border border-void-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Body */}
            <div className="text-metal-400 leading-relaxed whitespace-pre-line text-[15px]">
              {thread.body}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-void-border">
              <motion.button
                whileTap={{ scale: 1.2 }}
                onClick={handleLike}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  isLiked
                    ? 'bg-blood-red/10 text-blood-red border border-blood-red/20'
                    : 'text-metal-500 hover:text-blood-red hover:bg-blood-red/5 border border-transparent'
                )}
              >
                <Heart className={cn('w-4 h-4', isLiked && 'fill-blood-red')} />
                {formatNumber(thread.likes)}
              </motion.button>
              <span className="flex items-center gap-2 text-sm text-metal-500">
                <MessageSquare className="w-4 h-4" />
                {formatNumber(thread.replyCount)}
              </span>
              <span className="flex items-center gap-2 text-sm text-metal-500">
                <Eye className="w-4 h-4" />
                {formatNumber(thread.viewCount)}
              </span>
              <div className="flex-1" />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast('Link copied!', 'info')
                }}
                className="p-2 rounded-lg text-metal-500 hover:text-metal-300 hover:bg-void-elevated transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                onClick={handleBookmark}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  isBookmarked 
                    ? "text-neon-cyan bg-neon-cyan/10" 
                    : "text-metal-500 hover:text-neon-cyan hover:bg-neon-cyan/5"
                )}
              >
                <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-neon-cyan")} />
              </button>
              {isAuthor && (
                <button 
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="p-2 rounded-lg text-metal-500 hover:text-blood-red hover:bg-blood-red/5 transition-all ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </article>
      </Spotlight>

      {/* Comment Section */}
      <div className="mt-6">
        <h3 className="font-heading text-lg font-bold text-metal-200 mb-4">
          Comments ({thread.replyCount})
        </h3>

        {/* Comment Form */}
        <div className="rounded-xl bg-void-card border border-void-border p-4 mb-6">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-void-surface border border-void-border rounded-xl px-4 py-3 text-sm text-metal-200 placeholder:text-metal-600 outline-none focus:border-neon-purple/50 resize-none transition-colors"
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleComment}
              disabled={!commentText.trim() || createCommentMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-purple-dark text-white text-sm font-semibold hover:shadow-lg hover:shadow-neon-purple-glow transition-shadow disabled:opacity-50"
            >
              {createCommentMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Comment
            </motion.button>
          </div>
        </div>

        {/* Comments List */}
        {commentsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <CommentSkeleton key={i} />
            ))}
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-1">
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} threadId={threadId} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-metal-500 text-sm">No comments yet</p>
            <p className="text-metal-600 text-xs mt-1">Be the first to enter the void</p>
          </div>
        )}
      </div>
      </div>
    </PageTransition>
  )
}
