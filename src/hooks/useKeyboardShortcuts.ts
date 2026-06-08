import { useEffect } from 'react'
import { usePreferencesStore } from '@/stores/preferencesStore'

export function useKeyboardShortcuts() {
  const { setCreateModalOpen, setSearchModalOpen, setTerminalOpen } = usePreferencesStore()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      // Escape key handler: closes modals and blurs input
      if (e.key === 'Escape') {
        e.preventDefault()
        setCreateModalOpen(false)
        setSearchModalOpen(false)
        setTerminalOpen(false)
        if (isInput) {
          ;(target as HTMLInputElement).blur()
        }
        return
      }

      // Backtick key handler: toggles terminal console globally
      if (e.key === '`') {
        e.preventDefault()
        const state = usePreferencesStore.getState()
        setTerminalOpen(!state.terminalOpen)
        return
      }

      // Block other shortcuts when typing in inputs
      if (isInput) return

      switch (e.key) {
        case 'n':
        case 'N':
          e.preventDefault()
          setCreateModalOpen(true)
          break
        case '/':
          e.preventDefault()
          setSearchModalOpen(true)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setCreateModalOpen, setSearchModalOpen, setTerminalOpen])
}
