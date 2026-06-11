import { Link } from '@tanstack/react-router'
import { Home, Users, Plus, User } from 'lucide-react'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { motion } from 'framer-motion'

const MOBILE_LINKS = [
  { to: '/' as const, label: 'Home', icon: Home },
  { to: '/communities' as const, label: 'Communities', icon: Users },
  { to: '/profile' as const, label: 'Profile', icon: User },
]

export function MobileNav() {
  const { setCreateModalOpen } = usePreferencesStore()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-heavy border-t border-void-border md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {MOBILE_LINKS.slice(0, 2).map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-metal-500 hover:text-metal-200 transition-colors"
            activeProps={{ className: 'text-neon-purple' }}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}

        {/* Center Create Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setCreateModalOpen(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-purple to-neon-purple-dark text-white flex items-center justify-center shadow-lg shadow-neon-purple-glow -mt-4"
        >
          <Plus className="w-6 h-6" />
        </motion.button>

        {MOBILE_LINKS.slice(2).map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-metal-500 hover:text-metal-200 transition-colors"
            activeProps={{ className: 'text-neon-purple' }}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
