/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Users, MessageSquare, TrendingUp } from 'lucide-react'
import { Card3D } from '@/components/ui/card-3d'
import { Spotlight } from '@/components/ui/spotlight'
import { getStorageItem } from '@/lib/storage'
import { cn, formatNumber } from '@/lib/utils'
import type { Community } from '@/data/types'
import { useState } from 'react'
import { ThreadList } from '@/components/thread/thread-list'
import { PageTransition } from '@/components/common/page-transition'

export const Route = createFileRoute('/communities')({
  component: CommunitiesPage,
})

function CommunitiesPage() {
  const communities = getStorageItem<Community[]>('communities', [])
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading text-3xl font-black text-metal-100 flex items-center gap-3">
          <Users className="w-8 h-8 text-neon-purple" />
          Communities
        </h1>
        <p className="text-metal-500 mt-2 font-accent">
          Find your fandom. Enter the void.
        </p>
      </motion.div>

      {/* Community Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
        {communities.map((community, i) => (
          <motion.div
            key={community.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card3D>
              <Spotlight fill="rgba(168, 85, 247, 0.1)">
                <button
                  onClick={() => setSelected(selected === community.name ? null : community.name)}
                  className={cn(
                    'w-full rounded-xl border transition-all duration-300 overflow-hidden text-left',
                    selected === community.name
                      ? 'border-neon-purple/50 bg-neon-purple/5'
                      : 'border-void-border bg-void-card hover:border-void-border-light'
                  )}
                >
                  {/* Gradient Header */}
                  <div
                    className={cn(
                      'h-20 bg-gradient-to-br relative overflow-hidden metallic-overlay',
                      community.gradient
                    )}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl">{community.icon}</span>
                    </div>
                    <div className="absolute inset-0 scanlines opacity-20" />
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-heading text-sm font-bold text-metal-200">
                      {community.name}
                    </h3>
                    <p className="text-xs text-metal-500 line-clamp-2 leading-relaxed">
                      {community.description}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[10px] text-metal-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {formatNumber(community.memberCount)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {formatNumber(community.threadCount)}
                      </span>
                    </div>
                  </div>
                </button>
              </Spotlight>
            </Card3D>
          </motion.div>
        ))}
      </div>

      {/* Filtered Thread List */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-heading text-xl font-bold text-metal-200 flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-neon-cyan" />
            {selected} Threads
          </h2>
          <ThreadList community={selected} showFilters={false} />
        </motion.div>
      )}

      {!selected && (
        <div className="text-center py-8">
          <p className="text-metal-600 text-sm">
            Select a community to view threads
          </p>
        </div>
      )}
      </div>
    </PageTransition>
  )
}
