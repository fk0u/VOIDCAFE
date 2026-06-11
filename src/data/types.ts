export interface User {
  id: string
  username: string
  displayName: string
  avatar: string // base64 or gradient placeholder
  bio: string
  biasList: string[]
  joinedAt: string
  threadCount: number
  likeCount: number
  replyCount: number
}

export interface Thread {
  id: string
  title: string
  body: string
  community: string
  authorId: string
  authorName: string
  authorAvatar: string
  coverImage?: string // base64 or gradient class
  likes: number
  likedBy: string[]
  replyCount: number
  viewCount: number
  isPinned?: boolean
  createdAt: string
  updatedAt: string
  tags?: string[]
}

export interface Comment {
  id: string
  threadId: string
  parentId: string | null
  authorId: string
  authorName: string
  authorAvatar: string
  body: string
  likes: number
  likedBy: string[]
  createdAt: string
  children?: Comment[]
}

export interface Community {
  id: string
  name: string
  description: string
  memberCount: number
  threadCount: number
  gradient: string
  icon: string
  image?: string
}

export interface Notification {
  id: string
  type: 'like' | 'reply' | 'mention' | 'follow'
  message: string
  threadId?: string
  fromUser: string
  fromAvatar: string
  read: boolean
  createdAt: string
}

export type SortOption = 'latest' | 'trending' | 'most-liked'

export interface ThreadFilters {
  community?: string
  sort: SortOption
  search?: string
}
