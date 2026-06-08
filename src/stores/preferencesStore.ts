import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PreferencesState {
  sidebarCollapsed: boolean
  createModalOpen: boolean
  searchModalOpen: boolean
  terminalOpen: boolean
  preloaded: boolean
  feedMode: 'infinite' | 'paginated'
  synthEnabled: boolean
  synthVolume: number
  synthGlitchRate: number
  
  toggleSidebar: () => void
  setCreateModalOpen: (open: boolean) => void
  setSearchModalOpen: (open: boolean) => void
  setTerminalOpen: (open: boolean) => void
  setPreloaded: (preloaded: boolean) => void
  setFeedMode: (mode: 'infinite' | 'paginated') => void
  setSynthEnabled: (enabled: boolean) => void
  setSynthVolume: (vol: number) => void
  setSynthGlitchRate: (rate: number) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      createModalOpen: false,
      searchModalOpen: false,
      terminalOpen: false,
      preloaded: false,
      feedMode: 'paginated', // Default to paginated to showcase the pagination feature
      synthEnabled: false,
      synthVolume: 0.3,
      synthGlitchRate: 0.2,

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setCreateModalOpen: (open) => set({ createModalOpen: open }),
      setSearchModalOpen: (open) => set({ searchModalOpen: open }),
      setTerminalOpen: (open) => set({ terminalOpen: open }),
      setPreloaded: (preloaded) => set({ preloaded }),
      setFeedMode: (feedMode) => set({ feedMode }),
      setSynthEnabled: (synthEnabled) => set({ synthEnabled }),
      setSynthVolume: (synthVolume) => set({ synthVolume }),
      setSynthGlitchRate: (synthGlitchRate) => set({ synthGlitchRate }),
    }),
    {
      name: 'voidcafe_preferences',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        feedMode: state.feedMode,
        synthEnabled: state.synthEnabled,
        synthVolume: state.synthVolume,
        synthGlitchRate: state.synthGlitchRate,
      }),
    }
  )
)
