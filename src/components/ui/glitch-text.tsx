import { cn } from '@/lib/utils'

interface GlitchTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p'
}

export function GlitchText({ text, className, as: Tag = 'h1' }: GlitchTextProps) {
  return (
    <Tag
      data-text={text}
      className={cn('glitch-text font-heading font-black tracking-wider', className)}
    >
      {text}
    </Tag>
  )
}
