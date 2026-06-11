/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Edit3,
  Heart,
  MessageSquare,
  Calendar,
  Upload,
  Save,
  X,
  Hash,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/components/ui/toast'
import { Spotlight } from '@/components/ui/spotlight'
import { getStorageItem } from '@/lib/storage'
import { cn, formatNumber } from '@/lib/utils'
import type { Thread } from '@/data/types'
import { PageTransition } from '@/components/common/page-transition'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

type ProfileTab = 'threads' | 'liked' | 'replies'

function ProfilePage() {
  const { currentUser, updateProfile, updateAvatar } = useAuthStore()
  const { toast } = useToast()
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<ProfileTab>('threads')
  const [editBio, setEditBio] = useState(currentUser?.bio || '')
  const [editBias, setEditBias] = useState(currentUser?.biasList?.join(', ') || '')
  const [editName, setEditName] = useState(currentUser?.displayName || '')

  const allThreads = getStorageItem<Thread[]>('threads', [])
  const myThreads = allThreads.filter((t) => t.authorId === currentUser?.id)
  const likedThreads = allThreads.filter(
    (t) => currentUser && t.likedBy.includes(currentUser.id)
  )

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      updateAvatar(ev.target?.result as string)
      toast('Avatar updated!', 'success')
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    updateProfile({
      displayName: editName,
      bio: editBio,
      biasList: editBias.split(',').map((b) => b.trim()).filter(Boolean),
    })
    setEditing(false)
    toast('Profile updated!', 'success')
  }

  const stats = [
    { label: 'Threads', value: myThreads.length, icon: MessageSquare },
    { label: 'Likes', value: currentUser?.likeCount || 0, icon: Heart },
    {
      label: 'Joined',
      value: currentUser?.joinedAt
        ? new Date(currentUser.joinedAt).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          })
        : 'Unknown',
      icon: Calendar,
    },
  ]

  const TABS: { value: ProfileTab; label: string; count: number }[] = [
    { value: 'threads', label: 'My Threads', count: myThreads.length },
    { value: 'liked', label: 'Liked', count: likedThreads.length },
    { value: 'replies', label: 'Replies', count: currentUser?.replyCount || 0 },
  ]

  const displayThreads = activeTab === 'threads' ? myThreads : activeTab === 'liked' ? likedThreads : []

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <Spotlight className="rounded-2xl mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-void-card border border-void-border overflow-hidden"
        >
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-neon-purple-dark via-neon-purple to-neon-cyan relative">
            <div className="absolute inset-0 scanlines opacity-30" />
            <div className="absolute inset-0 metallic-overlay" />
          </div>

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-12 mb-4">
              <div className="w-24 h-24 rounded-full border-4 border-void-card bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-3xl font-heading font-black text-white overflow-hidden">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentUser?.displayName?.charAt(0) || 'V'
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-void-elevated border border-void-border flex items-center justify-center cursor-pointer hover:bg-void-surface transition-colors">
                <Upload className="w-4 h-4 text-metal-400" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>

            {/* Name & Bio */}
            {editing ? (
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-metal-500 mb-1 block">Display Name</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-void-surface border border-void-border rounded-lg px-3 py-2 text-sm text-metal-200 outline-none focus:border-neon-purple/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-metal-500 mb-1 block">Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full bg-void-surface border border-void-border rounded-lg px-3 py-2 text-sm text-metal-200 outline-none focus:border-neon-purple/50 resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-xs text-metal-500 mb-1 block">
                    Biases (comma separated)
                  </label>
                  <input
                    value={editBias}
                    onChange={(e) => setEditBias(e.target.value)}
                    className="w-full bg-void-surface border border-void-border rounded-lg px-3 py-2 text-sm text-metal-200 outline-none focus:border-neon-purple/50"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-neon-purple/20 text-neon-purple text-sm font-medium hover:bg-neon-purple/30 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-metal-500 text-sm hover:text-metal-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <h1 className="font-heading text-xl font-bold text-metal-100">
                    {currentUser?.displayName || 'Void Walker'}
                  </h1>
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1.5 rounded-lg text-metal-500 hover:text-neon-purple hover:bg-neon-purple/10 transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-metal-500 mt-1">
                  @{currentUser?.username || 'void_walker'}
                </p>
                <p className="text-sm text-metal-400 mt-2 leading-relaxed">
                  {currentUser?.bio || 'No bio yet. Tell the void about yourself.'}
                </p>
                {currentUser?.biasList && currentUser.biasList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {currentUser.biasList.map((bias) => (
                      <span
                        key={bias}
                        className="px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple text-xs font-medium border border-neon-purple/20"
                      >
                        <Hash className="w-3 h-3 inline mr-0.5" />
                        {bias}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <stat.icon className="w-4 h-4 text-metal-600" />
                  <div>
                    <p className="text-sm font-semibold text-metal-200">
                      {typeof stat.value === 'number'
                        ? formatNumber(stat.value)
                        : stat.value}
                    </p>
                    <p className="text-[10px] text-metal-600">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </Spotlight>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-void-border">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'px-4 py-3 text-sm font-medium transition-all border-b-2',
              activeTab === tab.value
                ? 'text-neon-purple border-neon-purple'
                : 'text-metal-500 border-transparent hover:text-metal-300'
            )}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-metal-600">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {displayThreads.length > 0 ? (
        <div className="space-y-3">
          {displayThreads.map((thread) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <a
                href={`/thread/${thread.id}`}
                className="block rounded-xl bg-void-card border border-void-border p-4 hover:border-void-border-light transition-all group"
              >
                <h3 className="font-accent font-semibold text-metal-200 group-hover:text-neon-purple transition-colors line-clamp-1">
                  {thread.title}
                </h3>
                <p className="text-sm text-metal-500 line-clamp-1 mt-1">
                  {thread.body}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-metal-600">
                  <span>{thread.community}</span>
                  <span>♥ {thread.likes}</span>
                  <span>💬 {thread.replyCount}</span>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-metal-500 text-sm">
            {activeTab === 'threads'
              ? 'No threads yet. Create your first!'
              : activeTab === 'liked'
              ? 'No liked threads yet.'
              : 'No replies yet.'}
          </p>
        </div>
      )}
      </div>
    </PageTransition>
  )
}
