import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, Users, MessageSquare } from 'lucide-react'
import { useCommunity } from '@/hooks/useCommunity'
import { ThreadList } from '@/components/thread/thread-list'
import { PageTransition } from '@/components/common/page-transition'
import { cn, formatNumber } from '@/lib/utils'

export const Route = createFileRoute('/community/$communityId')({
  component: CommunityPage,
})

function CommunityPage() {
  const { communityId } = Route.useParams()
  const { data: community, isLoading, error } = useCommunity(communityId)
  
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !community) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-metal-200">Community not found</h1>
        <Link to="/communities" className="text-neon-purple hover:underline mt-4 inline-block">
          Return to Communities
        </Link>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-void-black">
        {/* Parallax Hero Banner */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden rounded-b-[2rem] border-b border-void-border">
          <motion.div 
            style={{ y, opacity }}
            className="absolute inset-0 w-full h-full"
          >
            {community.image ? (
              <>
                <img 
                  src={community.image} 
                  alt={community.name} 
                  className="w-full h-full object-cover"
                />
                <div className={cn("absolute inset-0 opacity-60 mix-blend-color bg-gradient-to-br", community.gradient)} />
              </>
            ) : (
              <div className={cn('w-full h-full bg-gradient-to-br metallic-overlay', community.gradient)} />
            )}
            {/* Scanlines and gradients */}
            <div className="absolute inset-0 bg-void-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-void-black via-void-black/50 to-transparent" />
            <div className="absolute inset-0 scanlines opacity-20" />
          </motion.div>

          {/* Banner Content */}
          <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-4 pb-8 md:pb-12 z-10">
            <Link 
              to="/communities"
              className="absolute top-4 left-4 p-2 rounded-full bg-void-black/50 border border-void-border/50 text-metal-200 hover:text-white hover:bg-void-card backdrop-blur-sm transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-end gap-6"
            >
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-void-card/80 backdrop-blur-md border border-void-border flex items-center justify-center text-4xl md:text-5xl shadow-2xl shrink-0">
                {community.icon}
              </div>
              <div className="pb-2">
                <h1 className="font-heading text-4xl md:text-6xl font-black text-white drop-shadow-lg mb-2">
                  {community.name}
                </h1>
                <p className="text-metal-300 max-w-2xl text-sm md:text-base line-clamp-2 md:line-clamp-none drop-shadow-md">
                  {community.description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-b border-void-border bg-void-card/30 backdrop-blur-sm sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 text-metal-300 shrink-0">
              <Users className="w-4 h-4 text-neon-purple" />
              <span className="font-medium">{formatNumber(community.memberCount)} Members</span>
            </div>
            <div className="w-px h-4 bg-void-border shrink-0" />
            <div className="flex items-center gap-2 text-metal-300 shrink-0">
              <MessageSquare className="w-4 h-4 text-neon-cyan" />
              <span className="font-medium">{formatNumber(community.threadCount)} Threads</span>
            </div>
            <div className="w-px h-4 bg-void-border shrink-0" />
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <span className="text-sm text-metal-400">Live in the Void</span>
            </div>
          </div>
        </div>

        {/* Threads Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ThreadList community={community.name} showFilters={false} />
        </div>
      </div>
    </PageTransition>
  )
}
