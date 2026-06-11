import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Bell,
  Plus,
  Home,
  Users,
  User,
  Keyboard,
  Terminal,
} from 'lucide-react'
import { BrandText } from '@/components/ui/brand-text'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useAuthStore } from '@/stores/authStore'
import { getStorageItem, setStorageItem } from '@/lib/storage'
import type { Notification } from '@/data/types'
import { cn, formatTimeAgo } from '@/lib/utils'
import { playHover, playClick } from '@/lib/synth'

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/communities', label: 'Communities', icon: Users },
  { to: '/profile', label: 'Profile', icon: User },
] as const

export function Navbar() {
  const { setCreateModalOpen, setSearchModalOpen, setTerminalOpen } = usePreferencesStore()
  const { currentUser } = useAuthStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const router = useRouter()

  // Load notifications
  const loadNotifications = () => {
    setNotifications(getStorageItem<Notification[]>('notifications', []))
  }

  // Initial load
  useState(() => {
    loadNotifications()
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    setStorageItem('notifications', updated)
  }

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    setStorageItem('notifications', updated)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-heavy border-b border-void-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
            <span className="font-heading font-black text-sm text-white">V</span>
          </div>
          <BrandText
            text="VOIDCAFE"
            as="span"
            className="text-lg hidden sm:block"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 ml-4">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onMouseEnter={playHover}
              onClick={playClick}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-metal-400 hover:text-metal-200 hover:bg-void-elevated transition-all duration-200"
              activeProps={{
                className: 'text-neon-purple bg-neon-purple/10',
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>

        <div className="flex-1" />

        {/* Search Button */}
        <button
          onMouseEnter={playHover}
          onClick={() => {
            playClick()
            setSearchModalOpen(true)
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-void-surface border border-void-border text-metal-500 hover:text-metal-300 hover:border-void-border-light transition-all text-sm"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded bg-void-elevated text-[10px] font-mono text-metal-600 border border-void-border">
            /
          </kbd>
        </button>

        {/* Create Thread */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={playHover}
          onClick={() => {
            playClick()
            setCreateModalOpen(true)
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-neon-purple to-neon-purple-dark text-white text-sm font-semibold hover:shadow-lg hover:shadow-neon-purple-glow transition-shadow"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New</span>
        </motion.button>

        {/* Terminal Console */}
        <button
          onMouseEnter={playHover}
          onClick={() => {
            playClick()
            setTerminalOpen(true)
          }}
          className="p-2 rounded-lg text-metal-400 hover:text-neon-cyan hover:bg-neon-cyan/5 border border-transparent hover:border-neon-cyan/20 transition-all cursor-pointer hidden sm:block"
          title="Open terminal console (Press ~)"
        >
          <Terminal className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onMouseEnter={playHover}
            onClick={() => {
              playClick()
              if (!showNotifications) loadNotifications()
              setShowNotifications(!showNotifications)
            }}
            className="relative p-2 rounded-lg text-metal-400 hover:text-metal-200 hover:bg-void-elevated transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blood-red text-[10px] font-bold text-white flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-void-card border border-void-border shadow-2xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-void-border flex items-center justify-between">
                    <h3 className="font-heading text-sm font-semibold text-metal-200 flex items-center gap-2">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-neon-purple/20 text-neon-purple font-medium">
                          {unreadCount} new
                        </span>
                      )}
                    </h3>
                    {notifications.length > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-metal-500 hover:text-neon-cyan transition-colors"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-sm text-metal-500">
                        No notifications yet
                      </p>
                    ) : (
                      notifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => {
                            setShowNotifications(false)
                            if (notif.threadId) {
                              router.navigate({ to: '/thread/$threadId', params: { threadId: notif.threadId }})
                            }
                          }}
                          className={cn(
                            'w-full px-4 py-3 flex items-start gap-3 hover:bg-void-elevated transition-colors text-left',
                            !notif.read && 'bg-neon-purple/5'
                          )}
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ backgroundColor: '#7c3aed' }}
                          >
                            {notif.fromUser.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0 pr-6 relative">
                            <p className="text-sm text-metal-300">
                              <span className="font-semibold text-metal-200">
                                {notif.fromUser}
                              </span>{' '}
                              {notif.message.replace(`${notif.fromUser} `, '')}
                            </p>
                            <p className="text-xs text-metal-500 mt-0.5">
                              {formatTimeAgo(notif.createdAt)}
                            </p>
                            <button
                              onClick={(e) => removeNotification(notif.id, e)}
                              className="absolute right-0 top-0 p-1 text-metal-600 hover:text-blood-red opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-neon-purple mt-2 shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar */}
        <Link
          to="/profile"
          className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-xs font-bold text-white border-2 border-void-border hover:border-neon-purple/50 transition-colors"
        >
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            currentUser?.displayName?.charAt(0) || 'V'
          )}
        </Link>
      </div>
    </nav>
  )
}
