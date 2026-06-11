import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Send, Loader2 } from 'lucide-react'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useAuthStore } from '@/stores/authStore'
import { useCreateThread } from '@/hooks/useThreads'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import { playHover, playClick, playSuccess } from '@/lib/synth'

const COMMUNITIES = [
  'AESPA', 'BTS', 'BLACKPINK', 'TWICE', 'Stray Kids',
  'NewJeans', '(G)I-DLE', 'IVE', 'LE SSERAFIM', 'ATEEZ',
]

export function CreateThreadModal() {
  const { createModalOpen, setCreateModalOpen } = usePreferencesStore()
  const { currentUser } = useAuthStore()
  const createMutation = useCreateThread()
  const { toast } = useToast()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [community, setCommunity] = useState('')
  const [coverImage, setCoverImage] = useState<string | undefined>()
  const [tags, setTags] = useState('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setCoverImage(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!title.trim() || !body.trim() || !community || !currentUser) {
      playClick()
      toast('Please fill all required fields', 'warning')
      return
    }

    playClick()
    createMutation.mutate(
      {
        title: title.trim(),
        body: body.trim(),
        community,
        authorId: currentUser.id,
        authorName: currentUser.displayName,
        authorAvatar: currentUser.avatar,
        coverImage,
        isPinned: false,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      },
      {
        onSuccess: () => {
          playSuccess()
          toast('Thread created!', 'success')
          setCreateModalOpen(false)
          setTitle('')
          setBody('')
          setCommunity('')
          setCoverImage(undefined)
          setTags('')
        },
      }
    )
  }

  return (
    <AnimatePresence>
      {createModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-void-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setCreateModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-void-card border border-void-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-void-border">
              <h2 className="font-heading text-lg font-bold text-metal-200">
                Create Thread
              </h2>
              <button
                onMouseEnter={playHover}
                onClick={() => {
                  playClick()
                  setCreateModalOpen(false)
                }}
                className="p-1 rounded-lg text-metal-500 hover:text-metal-300 hover:bg-void-elevated transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Community Selector */}
              <div>
                <label className="text-xs font-medium text-metal-400 mb-1.5 block">
                  Community *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMUNITIES.map((c) => (
                    <button
                      key={c}
                      onMouseEnter={playHover}
                      onClick={() => {
                        playClick()
                        setCommunity(c)
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
                        community === c
                          ? 'bg-neon-purple/20 text-neon-purple border-neon-purple/30'
                          : 'text-metal-500 border-void-border hover:border-void-border-light'
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-medium text-metal-400 mb-1.5 block">
                  Title *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="An attention-grabbing title..."
                  className="w-full bg-void-surface border border-void-border rounded-xl px-4 py-2.5 text-sm text-metal-200 placeholder:text-metal-600 outline-none focus:border-neon-purple/50 transition-colors"
                  maxLength={150}
                />
                <p className="text-[10px] text-metal-600 mt-1 text-right">
                  {title.length}/150
                </p>
              </div>

              {/* Body */}
              <div>
                <label className="text-xs font-medium text-metal-400 mb-1.5 block">
                  Body *
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Share your thoughts with the void..."
                  className="w-full bg-void-surface border border-void-border rounded-xl px-4 py-2.5 text-sm text-metal-200 placeholder:text-metal-600 outline-none focus:border-neon-purple/50 transition-colors resize-none"
                  rows={6}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-xs font-medium text-metal-400 mb-1.5 block">
                  Cover Image (optional)
                </label>
                {coverImage ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      onClick={() => setCoverImage(undefined)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-void-black/60 text-white hover:bg-void-black/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 w-full h-24 rounded-xl border-2 border-dashed border-void-border hover:border-neon-purple/30 transition-colors cursor-pointer bg-void-surface/50">
                    <Upload className="w-5 h-5 text-metal-600" />
                    <span className="text-sm text-metal-500">
                      Drop an image or click to upload
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-medium text-metal-400 mb-1.5 block">
                  Tags (comma separated)
                </label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Comeback, MV Analysis, Hot Take"
                  className="w-full bg-void-surface border border-void-border rounded-xl px-4 py-2.5 text-sm text-metal-200 placeholder:text-metal-600 outline-none focus:border-neon-purple/50 transition-colors"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-void-border">
              <button
                onMouseEnter={playHover}
                onClick={() => {
                  playClick()
                  setCreateModalOpen(false)
                }}
                className="px-4 py-2 rounded-xl text-sm text-metal-400 hover:text-metal-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={playHover}
                onClick={handleSubmit}
                disabled={createMutation.isPending || !title.trim() || !body.trim() || !community}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-purple-dark text-white text-sm font-semibold hover:shadow-lg hover:shadow-neon-purple-glow transition-shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Post Thread
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
