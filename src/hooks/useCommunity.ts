import { useQuery } from '@tanstack/react-query'
import { getStorageItem } from '@/lib/storage'
import type { Community } from '@/data/types'

export function useCommunity(communityId: string) {
  return useQuery({
    queryKey: ['community', communityId],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      const communities = getStorageItem<Community[]>('communities', [])
      const community = communities.find((c) => c.id === communityId || c.name === communityId)
      
      if (!community) {
        throw new Error('Community not found')
      }
      
      return community
    },
  })
}
