import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { queryClient } from '@/lib/queryClient'
import { ToastProvider } from '@/components/ui/toast'
import { seedDatabase } from '@/data/seed'
import { useAuthStore } from '@/stores/authStore'
import { getStorageItem } from '@/lib/storage'
import type { User } from '@/data/types'
import { routeTree } from './routeTree.gen'
import './index.css'

// Seed database on first load
seedDatabase()

// Auto-login the current user
const authStore = useAuthStore.getState()
if (!authStore.isAuthenticated) {
  const users = getStorageItem<User[]>('users', [])
  const currentUser = users.find((u) => u.id === 'user-current')
  if (currentUser) {
    authStore.login(currentUser)
  }
}

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>
)
