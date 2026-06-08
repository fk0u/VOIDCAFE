import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TooltipItem {
  id: string
  name: string
  image?: string
  color?: string
}

interface AnimatedTooltipProps {
  items: TooltipItem[]
  className?: string
}

export function AnimatedTooltip({ items, className }: AnimatedTooltipProps) {
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null)

  return (
    <div className={cn('flex -space-x-2', className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap px-3 py-1.5 rounded-lg bg-void-elevated border border-void-border text-xs text-metal-200 shadow-lg"
              >
                {item.name}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-void-elevated border-r border-b border-void-border rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-void-black cursor-pointer transition-transform hover:scale-110 hover:z-10',
            )}
            style={{
              backgroundColor: item.color || '#7c3aed',
            }}
          >
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              item.name.charAt(0).toUpperCase()
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
