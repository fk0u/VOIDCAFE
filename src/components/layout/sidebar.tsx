import { motion } from 'framer-motion'
import { TrendingUp, Users, Clock, ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
import { SynthWidget } from '@/components/ui/synth-widget'
import { getStorageItem } from '@/lib/storage'
import { formatTimeAgo, COMMUNITY_COLORS } from '@/lib/utils'
import type { Thread } from '@/data/types'

const ONLINE_USERS = [
  { id: '1', name: 'KWANGYA Warrior', color: '#a855f7' },
  { id: '2', name: 'Purple Army', color: '#8b5cf6' },
  { id: '3', name: 'BLINK Forever', color: '#ec4899' },
  { id: '4', name: 'STAY Loud', color: '#ef4444' },
  { id: '5', name: 'Bunny Hop', color: '#38bdf8' },
  { id: '6', name: 'Neverland Queen', color: '#c084fc' },
]

const TOP_BIASES = [
  { name: 'Karina', group: 'AESPA', mentions: 234 },
  { name: 'Jungkook', group: 'BTS', mentions: 198 },
  { name: 'Jennie', group: 'BLACKPINK', mentions: 176 },
  { name: 'Minji', group: 'NewJeans', mentions: 145 },
  { name: 'Hyunjin', group: 'Stray Kids', mentions: 132 },
]

export function Sidebar() {
  const threads = getStorageItem<Thread[]>('threads', [])
  const recentThreads = [...threads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <aside className="w-72 shrink-0 space-y-4 hidden lg:block">
      {/* Sound Synthesizer Widget */}
      <SynthWidget />

      {/* Top Biases */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl bg-void-card border border-void-border p-4"
      >
        <h3 className="font-heading text-sm font-semibold text-metal-200 flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-neon-purple" />
          Top Biases
        </h3>
        <div className="space-y-2.5">
          {TOP_BIASES.map((bias, i) => (
            <div key={bias.name} className="flex items-center gap-3">
              <span className="text-xs font-mono text-metal-600 w-4">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-metal-200 truncate">
                  {bias.name}
                </p>
                <p className="text-xs text-metal-500">{bias.group}</p>
              </div>
              <span className="text-xs font-mono text-metal-500">
                {bias.mentions}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Online Users */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl bg-void-card border border-void-border p-4"
      >
        <h3 className="font-heading text-sm font-semibold text-metal-200 flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-neon-cyan" />
          Online Now
          <span className="ml-auto flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-metal-500">{ONLINE_USERS.length}</span>
          </span>
        </h3>
        <AnimatedTooltip items={ONLINE_USERS} />
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl bg-void-card border border-void-border p-4"
      >
        <h3 className="font-heading text-sm font-semibold text-metal-200 flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-amber-400" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentThreads.map((thread) => (
            <Link
              key={thread.id}
              to="/thread/$threadId"
              params={{ threadId: thread.id }}
              className="group flex items-start gap-2"
            >
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{
                  backgroundColor:
                    COMMUNITY_COLORS[thread.community] || '#6b7280',
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-metal-300 group-hover:text-neon-purple transition-colors truncate">
                  {thread.title}
                </p>
                <p className="text-[10px] text-metal-600 mt-0.5">
                  {thread.authorName} • {formatTimeAgo(thread.createdAt)}
                </p>
              </div>
              <ChevronRight className="w-3 h-3 text-metal-600 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
            </Link>
          ))}
        </div>
      </motion.div>
    </aside>
  )
}
