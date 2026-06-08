import { cn } from '@/lib/utils'
import { playHover, playClick } from '@/lib/synth'

const COMMUNITIES = [
  'AESPA', 'BTS', 'BLACKPINK', 'TWICE', 'Stray Kids',
  'NewJeans', '(G)I-DLE', 'IVE', 'LE SSERAFIM', 'ATEEZ',
]

const COMMUNITY_CHIP_COLORS: Record<string, string> = {
  AESPA: 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20',
  BTS: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20',
  BLACKPINK: 'bg-pink-500/10 text-pink-400 border-pink-500/20 hover:bg-pink-500/20',
  TWICE: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
  'Stray Kids': 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20',
  NewJeans: 'bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20',
  '(G)I-DLE': 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 hover:bg-fuchsia-500/20',
  IVE: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20',
  'LE SSERAFIM': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
  ATEEZ: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20',
}

interface CategoryChipsProps {
  selected: string
  onSelect: (community: string) => void
}

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onMouseEnter={playHover}
        onClick={() => {
          playClick()
          onSelect('')
        }}
        className={cn(
          'px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
          !selected
            ? 'bg-metal-200 text-void-black border-metal-200'
            : 'text-metal-400 border-void-border hover:border-metal-500 hover:text-metal-300'
        )}
      >
        All
      </button>
      {COMMUNITIES.map((c) => (
        <button
          key={c}
          onMouseEnter={playHover}
          onClick={() => {
            playClick()
            onSelect(selected === c ? '' : c)
          }}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
            selected === c
              ? COMMUNITY_CHIP_COLORS[c]
              : 'text-metal-500 border-void-border hover:border-void-border-light hover:text-metal-400'
          )}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
