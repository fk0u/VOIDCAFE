import { cn } from '@/lib/utils'

interface BrandTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p'
}

export function BrandText({ text, className, as: Tag = 'h1' }: BrandTextProps) {
  return (
    <Tag
      data-text={text}
      className={cn(
        'relative inline-block font-accent font-black tracking-[0.2em] uppercase',
        'bg-clip-text text-transparent bg-gradient-to-r from-metal-100 via-white to-metal-300',
        'animate-hologram-pulse',
        className
      )}
    >
      <span 
        className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-neon-purple/80 via-neon-cyan/80 to-neon-purple/80 blur-[8px] animate-shimmer-fast bg-[length:200%_auto] -z-10 pointer-events-none"
        aria-hidden="true"
      >
        {text}
      </span>
      {text}
    </Tag>
  )
}
