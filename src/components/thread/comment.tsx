import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Reply, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { useLikeComment, useCreateComment, useDeleteComment } from '@/hooks/useComments'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/components/ui/toast'
import { cn, formatTimeAgo } from '@/lib/utils'
import type { Comment as CommentType } from '@/data/types'
import { playHover, playClick, playSuccess } from '@/lib/synth'

const LEVEL_COLORS = ['border-neon-purple/40', 'border-neon-cyan/30', 'border-blood-red/20']

interface CommentProps {
  comment: CommentType
  threadId: string
  level?: number
}

export function Comment({ comment, threadId, level = 0 }: CommentProps) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const { currentUser } = useAuthStore()
  const likeMutation = useLikeComment()
  const createMutation = useCreateComment()
  const deleteMutation = useDeleteComment()
  const { toast } = useToast()

  const isLiked = currentUser ? comment.likedBy.includes(currentUser.id) : false
  const isAuthor = currentUser?.id === comment.authorId

  const handleLike = () => {
    if (!currentUser) {
      playClick()
      return
    }
    if (isLiked) {
      playClick()
    } else {
      playSuccess()
    }
    likeMutation.mutate({
      commentId: comment.id,
      userId: currentUser.id,
      threadId,
    })
  }

  const handleReply = () => {
    if (!replyText.trim() || !currentUser) return
    playClick()
    createMutation.mutate(
      {
        threadId,
        parentId: comment.id,
        authorId: currentUser.id,
        authorName: currentUser.displayName,
        authorAvatar: currentUser.avatar,
        body: replyText.trim(),
      },
      {
        onSuccess: () => {
          playSuccess()
          setReplyText('')
          setShowReply(false)
          toast('Reply posted!', 'success')
        },
      }
    )
  }

  const handleDelete = () => {
    if (!window.confirm('Delete this comment?')) return
    playClick()
    deleteMutation.mutate(
      { commentId: comment.id, threadId },
      {
        onSuccess: () => {
          playSuccess()
          toast('Comment deleted', 'success')
        },
      }
    )
  }

  const hasChildren = comment.children && comment.children.length > 0
  const canReply = level < 2

  return (
    <div className={cn('pl-0', level > 0 && 'pl-4 ml-2 border-l-2', LEVEL_COLORS[level] || '')}>
      <div className="py-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
            style={{ backgroundColor: '#7c3aed' }}
          >
            {comment.authorName.charAt(0)}
          </div>
          <span className="text-xs font-semibold text-metal-300">
            {comment.authorName}
          </span>
          <span className="text-xs text-metal-600">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>

        {/* Body */}
        <p className="text-sm text-metal-400 leading-relaxed ml-8">
          {comment.body}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-8 mt-2">
          <motion.button
            whileTap={{ scale: 1.4 }}
            onMouseEnter={playHover}
            onClick={handleLike}
            className={cn(
              'flex items-center gap-1 text-xs transition-colors cursor-pointer',
              isLiked ? 'text-blood-red' : 'text-metal-600 hover:text-blood-red'
            )}
          >
            <Heart className={cn('w-3.5 h-3.5', isLiked && 'fill-blood-red')} />
            {comment.likes > 0 && comment.likes}
          </motion.button>

          {canReply && (
            <button
              onMouseEnter={playHover}
              onClick={() => {
                playClick()
                setShowReply(!showReply)
              }}
              className="flex items-center gap-1 text-xs text-metal-600 hover:text-neon-cyan transition-colors cursor-pointer"
            >
              <Reply className="w-3.5 h-3.5" />
              Reply
            </button>
          )}

          {hasChildren && (
            <button
              onMouseEnter={playHover}
              onClick={() => {
                playClick()
                setCollapsed(!collapsed)
              }}
              className="flex items-center gap-1 text-xs text-metal-600 hover:text-metal-400 transition-colors cursor-pointer"
            >
              {collapsed ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  Show {comment.children!.length} replies
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  Hide replies
                </>
              )}
            </button>
          )}

          {isAuthor && (
            <button
              onMouseEnter={playHover}
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-1 text-xs text-metal-600 hover:text-blood-red transition-colors ml-auto cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Reply Form */}
        {showReply && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-8 mt-3"
          >
            <div className="flex gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-void-surface border border-void-border rounded-lg px-3 py-2 text-sm text-metal-200 placeholder:text-metal-600 outline-none focus:border-neon-purple/50 resize-none"
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onMouseEnter={playHover}
                onClick={() => {
                  playClick()
                  setShowReply(false)
                }}
                className="px-3 py-1 rounded-lg text-xs text-metal-500 hover:text-metal-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onMouseEnter={playHover}
                onClick={handleReply}
                disabled={!replyText.trim() || createMutation.isPending}
                className="px-3 py-1 rounded-lg text-xs bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {createMutation.isPending ? 'Posting...' : 'Reply'}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Nested Children */}
      {hasChildren && !collapsed && (
        <div className="space-y-0">
          {comment.children!.map((child) => (
            <Comment
              key={child.id}
              comment={child}
              threadId={threadId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
