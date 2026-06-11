import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { getStorageItem, setStorageItem } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import type { Comment, Thread, Notification } from '@/data/types'
import { useAuthStore } from '@/stores/authStore'

const COMMENTS_KEY = 'comments'

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

function getAllComments(): Comment[] {
  return getStorageItem<Comment[]>(COMMENTS_KEY, [])
}

function buildCommentTree(comments: Comment[]): Comment[] {
  const map = new Map<string, Comment>()
  const roots: Comment[] = []

  comments.forEach((c) => {
    map.set(c.id, { ...c, children: [] })
  })

  map.forEach((comment) => {
    if (comment.parentId) {
      const parent = map.get(comment.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(comment)
      }
    } else {
      roots.push(comment)
    }
  })

  // Sort by newest
  roots.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return roots
}

export function useComments(threadId: string) {
  return useQuery({
    queryKey: ['comments', threadId],
    queryFn: () => {
      return new Promise<Comment[]>((resolve) => {
        setTimeout(() => {
          const all = getAllComments()
          const threadComments = all.filter((c) => c.threadId === threadId)
          resolve(buildCommentTree(threadComments))
        }, 250)
      })
    },
  })
}

export function useCreateComment() {
  return useMutation({
    mutationFn: (
      newComment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'children'>
    ) => {
      return new Promise<Comment>((resolve) => {
        setTimeout(() => {
          const comment: Comment = {
            ...newComment,
            id: `comment-${generateId()}`,
            likes: 0,
            likedBy: [],
            createdAt: new Date().toISOString(),
          }
          const comments = getAllComments()
          comments.push(comment)
          setStorageItem(COMMENTS_KEY, comments)

          // Update thread reply count
          const threads = getStorageItem<Thread[]>('threads', [])
          const tIdx = threads.findIndex((t) => t.id === newComment.threadId)
          if (tIdx >= 0) {
            threads[tIdx].replyCount += 1
            setStorageItem('threads', threads)
            
            // Notify thread author
            const threadAuthorId = threads[tIdx].authorId
            if (threadAuthorId !== newComment.authorId) {
              pushNotification({
                type: 'reply',
                message: `${newComment.authorName} replied to your thread "${threads[tIdx].title}"`,
                threadId: threads[tIdx].id,
                fromUser: newComment.authorName,
                fromAvatar: newComment.authorAvatar,
              })
            }
          }
          
          useAuthStore.getState().incrementReplyCount(1)
          resolve(comment)
        }, 200)
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.threadId] })
      queryClient.invalidateQueries({ queryKey: ['threads'] })
      queryClient.invalidateQueries({ queryKey: ['thread', data.threadId] })
    },
  })
}

export function useLikeComment() {
  return useMutation({
    mutationFn: ({
      commentId,
      userId,
    }: {
      commentId: string
      userId: string
      threadId: string
    }) => {
      return new Promise<Comment>((resolve) => {
        const comments = getAllComments()
        const idx = comments.findIndex((c) => c.id === commentId)
        if (idx < 0) throw new Error('Comment not found')

        const comment = { ...comments[idx] }
        const likedIndex = comment.likedBy.indexOf(userId)

        if (likedIndex >= 0) {
          comment.likedBy = comment.likedBy.filter((id) => id !== userId)
          comment.likes -= 1
        } else {
          comment.likedBy = [...comment.likedBy, userId]
          comment.likes += 1
          
          if (comment.authorId !== userId) {
            const user = useAuthStore.getState().currentUser
            if (user) {
              pushNotification({
                type: 'like',
                message: `${user.displayName} liked your comment`,
                threadId: threadId,
                fromUser: user.displayName,
                fromAvatar: user.avatar,
              })
            }
          }
        }

        comments[idx] = comment
        setStorageItem(COMMENTS_KEY, comments)
        resolve({ comment, isLiked: likedIndex < 0 })
      })
    },
    onMutate: async ({ commentId, threadId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ['comments', threadId] })

      queryClient.setQueryData<Comment[]>(
        ['comments', threadId],
        (old) => {
          if (!old) return old
          return updateCommentInTree(old, commentId, userId)
        }
      )
    },
    onSettled: (data, _err, { threadId }) => {
      if (data) {
        useAuthStore.getState().incrementLikeCount(data.isLiked ? 1 : -1)
      }
      queryClient.invalidateQueries({ queryKey: ['comments', threadId] })
    },
  })
}

export function useDeleteComment() {
  return useMutation({
    mutationFn: ({ commentId, threadId }: { commentId: string, threadId: string }) => {
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          const comments = getAllComments()
          const idx = comments.findIndex((c) => c.id === commentId)
          if (idx < 0) return reject(new Error('Comment not found'))
          
          comments.splice(idx, 1)
          setStorageItem(COMMENTS_KEY, comments)
          
          useAuthStore.getState().incrementReplyCount(-1)
          
          // Decrement thread reply count
          const threads = getStorageItem<Thread[]>('threads', [])
          const tIdx = threads.findIndex((t) => t.id === threadId)
          if (tIdx >= 0) {
            threads[tIdx].replyCount = Math.max(0, threads[tIdx].replyCount - 1)
            setStorageItem('threads', threads)
          }
          
          resolve()
        }, 300)
      })
    },
    onSuccess: (_, { threadId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', threadId] })
      queryClient.invalidateQueries({ queryKey: ['thread', threadId] })
    },
  })
}

function updateCommentInTree(
  comments: Comment[],
  commentId: string,
  userId: string
): Comment[] {
  return comments.map((c) => {
    if (c.id === commentId) {
      const isLiked = c.likedBy.includes(userId)
      return {
        ...c,
        likes: isLiked ? c.likes - 1 : c.likes + 1,
        likedBy: isLiked
          ? c.likedBy.filter((id) => id !== userId)
          : [...c.likedBy, userId],
      }
    }
    if (c.children && c.children.length > 0) {
      return { ...c, children: updateCommentInTree(c.children, commentId, userId) }
    }
    return c
  })
}
