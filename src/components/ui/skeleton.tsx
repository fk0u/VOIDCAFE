import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('skeleton-shimmer rounded-lg', className)} />
  )
}

export function ThreadCardSkeleton() {
  return (
    <div className="rounded-xl bg-void-card border border-void-border p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="w-24 h-3" />
          <Skeleton className="w-16 h-2.5" />
        </div>
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton className="w-full h-5" />
      <Skeleton className="w-3/4 h-4" />
      <Skeleton className="w-full h-32 rounded-lg" />
      <div className="flex gap-4 pt-1">
        <Skeleton className="w-14 h-4" />
        <Skeleton className="w-14 h-4" />
        <Skeleton className="w-14 h-4" />
      </div>
    </div>
  )
}

export function CommentSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="w-7 h-7 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-2/3 h-4" />
        <Skeleton className="w-16 h-3" />
      </div>
    </div>
  )
}
