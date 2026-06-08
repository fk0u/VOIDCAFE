import { cn } from '@/lib/utils'

interface TextShimmerProps {
  children: React.ReactNode
  className?: string
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p'
}

export function TextShimmer({ children, className, as: Tag = 'span' }: TextShimmerProps) {
  return (
    <Tag className={cn('metallic-shimmer', className)}>
      {children}
    </Tag>
  )
}
