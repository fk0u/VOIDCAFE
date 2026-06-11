/* eslint-disable react-refresh/only-export-components */
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navbar } from '@/components/layout/navbar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { FloatingParticles } from '@/components/ui/floating-particles'
import { SearchModal } from '@/components/common/search-modal'
import { CreateThreadModal } from '@/components/thread/create-thread-modal'
import { Preloader } from '@/components/ui/preloader'
import { VoidTerminal } from '@/components/common/void-terminal'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { cn } from '@/lib/utils'

function RootComponent() {
  useKeyboardShortcuts()
  const { preloaded } = usePreferencesStore()

  return (
    <div className="min-h-screen bg-void-black relative">
      {/* Cinematic Cyber Preloader */}
      <Preloader />

      {/* Interactive Command Terminal */}
      <VoidTerminal />

      {/* Main App Content - reveals smoothly once preloaded is true */}
      <div
        className={cn(
          'transition-all duration-1000 ease-out',
          !preloaded ? 'opacity-0 scale-95 blur-md pointer-events-none' : 'opacity-100 scale-100 blur-0'
        )}
      >
        <FloatingParticles count={15} />
        <Navbar />
        <main className="pt-16">
          <Outlet />
        </main>
        <MobileNav />
        <SearchModal />
        <CreateThreadModal />
      </div>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
