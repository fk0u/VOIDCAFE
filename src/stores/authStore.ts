import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/data/types'

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  updateAvatar: (avatar: string) => void
  incrementLikeCount: (delta: number) => void
  incrementThreadCount: (delta: number) => void
  incrementReplyCount: (delta: number) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      login: (user) => set({ currentUser: user, isAuthenticated: true }),
      logout: () => set({ currentUser: null, isAuthenticated: false }),
      updateProfile: (updates) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, ...updates }
            : null,
        })),
      updateAvatar: (avatar) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, avatar }
            : null,
        })),
      incrementLikeCount: (delta) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, likeCount: (state.currentUser.likeCount || 0) + delta }
            : null,
        })),
      incrementThreadCount: (delta) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, threadCount: (state.currentUser.threadCount || 0) + delta }
            : null,
        })),
      incrementReplyCount: (delta) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, replyCount: (state.currentUser.replyCount || 0) + delta }
            : null,
        })),
    }),
    {
      name: 'voidcafe_auth',
    }
  )
)
