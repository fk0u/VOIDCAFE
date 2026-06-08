import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { getStorageItem, setStorageItem } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import type { Comment } from '@/data/types'

const COMMENTS_KEY = 'comments'

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
          const threads = getStorageItem<any[]>('threads', [])
          const tIdx = threads.findIndex((t) => t.id === newComment.threadId)
          if (tIdx >= 0) {
            threads[tIdx].replyCount += 1
            setStorageItem('threads', threads)
          }

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
        }

        comments[idx] = comment
        setStorageItem(COMMENTS_KEY, comments)
        resolve(comment)
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
    onSettled: (_data, _err, { threadId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', threadId] })
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
