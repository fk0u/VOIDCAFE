/* eslint-disable react-refresh/only-export-components */
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Flame, Zap } from 'lucide-react'
import { GlitchText } from '@/components/ui/glitch-text'
import { TextShimmer } from '@/components/ui/text-shimmer'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { Spotlight } from '@/components/ui/spotlight'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { ThreadList } from '@/components/thread/thread-list'
import { Sidebar } from '@/components/layout/sidebar'
import { useTrendingThreads } from '@/hooks/useThreads'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { cn, getGradientForCommunity, formatNumber } from '@/lib/utils'
import { PageTransition } from '@/components/common/page-transition'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { data: trending } = useTrendingThreads()
  const { setCreateModalOpen } = usePreferencesStore()

  return (
    <PageTransition>
      <div>
        {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden border-b border-void-border">
        {/* Cyber grid overlay */}
        <div className="absolute inset-0 cyber-grid opacity-35 pointer-events-none z-0" />
        <BackgroundBeams />
        <Spotlight className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GlitchText
                text="VOIDCAFE"
                className="text-5xl md:text-7xl lg:text-8xl text-metal-100 tracking-[0.15em]"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-metal-500 text-lg md:text-xl max-w-2xl mx-auto font-accent"
            >
              Where fandoms converge in the{' '}
              <TextShimmer className="font-semibold">digital void</TextShimmer>.
              <br />
              Discuss. Create. Obsess.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center justify-center gap-4"
            >
              <MagneticButton onClick={() => setCreateModalOpen(true)}>
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Start a Thread
                </span>
              </MagneticButton>
              <Link
                to="/communities"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-semibold text-sm tracking-wider text-metal-400 border border-void-border hover:border-metal-500 hover:text-metal-200 transition-all"
              >
                Explore Communities
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-8 text-sm pt-4"
            >
              {[
                { label: 'Threads', value: '15K+', icon: Sparkles },
                { label: 'Active Users', value: '8.2K', icon: Flame },
                { label: 'Communities', value: '10', icon: Zap },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 text-metal-500">
                  <stat.icon className="w-4 h-4 text-neon-purple" />
                  <span className="font-mono font-semibold text-metal-300">{stat.value}</span>
                  <span>{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </Spotlight>

        {/* Decorative scanlines */}
        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
      </section>

      {/* ═══ Trending Carousel ═══ */}
      {trending && trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="font-heading text-lg font-bold text-metal-200 flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-blood-red" />
            Trending Now
          </h2>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {trending.map((thread, i) => (
              <Link
                key={thread.id}
                to="/thread/$threadId"
                params={{ threadId: thread.id }}
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    'shrink-0 w-64 h-36 rounded-xl p-4 flex flex-col justify-end relative overflow-hidden group',
                    'bg-gradient-to-br',
                    getGradientForCommunity(thread.community)
                  )}
                >
                  <div className="absolute inset-0 bg-void-black/40 group-hover:bg-void-black/20 transition-colors" />
                  <div className="absolute inset-0 metallic-overlay" />
                  <div className="relative z-10">
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                      {thread.community}
                    </span>
                    <p className="text-sm font-semibold text-white line-clamp-2 mt-1 leading-snug">
                      {thread.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-white/60">
                      <span>♥ {formatNumber(thread.likes)}</span>
                      <span>💬 {thread.replyCount}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ Main Content ═══ */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <h2 className="font-heading text-lg font-bold text-metal-200 flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-neon-cyan" />
              Latest Threads
            </h2>
            <ThreadList />
          </div>
          <Sidebar />
        </div>
      </section>
      </div>
    </PageTransition>
  )
}
