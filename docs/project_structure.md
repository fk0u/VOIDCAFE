# 📁 Project Directory Structure & Backend Migration Guide

This document maps out the code layout of the VOIDCAFE template and provides a blueprint for migrating from the simulated local storage database to a production backend.

---

## 🗺️ Workspace Directory Map

```
VOIDCAFE/
├── docs/                      # Technical markdown documentation
├── public/                    # Static files (PWA icons, manifest, favicon)
│   ├── voidcafe.svg           # Main SVG icon
│   └── manifest.json          # PWA application manifest
└── src/                       # Source code roots
    ├── assets/                # CSS utilities & fonts
    ├── components/            # Reusable UI component modules
    │   ├── common/            # Shared overlay modals, terminal, page transitions
    │   ├── layout/            # Layout shells (navbar, sidebar, mobile navigation)
    │   ├── thread/            # Thread lists, comment trees, and post creator modals
    │   └── ui/                # High-fidelity micro-animation components (Spotlight, Card3D)
    ├── data/                  # Hardcoded seed databases and TypeScript schemas
    │   ├── seed.ts            # Local storage seeder logic
    │   └── types.ts           # Global model typings (Thread, Comment, User)
    ├── hooks/                 # Custom queries, mutations, shortcuts, and search hooks
    │   ├── useComments.ts     # Comment querying/liking mutations
    │   ├── useKeyboardShortcuts.ts # Global document key listener bindings
    │   ├── useSearch.ts       # Debounced database query mappings
    │   └── useThreads.ts      # Thread lists, details, and liking mutations
    ├── lib/                   # Utility helpers and core instances
    │   ├── queryClient.ts     # React Query client instance
    │   ├── storage.ts         # LocalStorage wrappers and seeder verification
    │   ├── synth.ts           # Native Web Audio API synthesizer node-graph
    │   └── utils.ts           # Class merger `cn`, formatters, and community styling maps
    ├── routes/                # TanStack Router file-based route definitions
    │   ├── __root.tsx         # Parent application wrapper with shared layouts
    │   ├── index.tsx          # Home layout (hero banners, latest threads)
    │   ├── communities.tsx    # Grid filter page of communities
    │   ├── profile.tsx        # Profile editing and tabs (My Threads, Liked)
    │   └── thread/
    │       └── $threadId.tsx  # Thread detail page and comment tree rendering
    ├── index.css              # Custom Tailwind CSS declarations & CSS keyframes
    ├── main.tsx               # App mounting point & initial seeder runner
    ├── routeTree.gen.ts       # Router generated cache map (compiled automatically)
    └── vite-env.d.ts          # Vite ambient types declarations
```

---

## 🔧 Subdirectory Detail

### 1. `src/components/ui` (The Atomic Presentation Layer)
These are visual components designed to give the website its cyber-metallic, tech-themed appearance:
- [spotlight.tsx](file:///d:/Project/VOIDCAFE/src/components/ui/spotlight.tsx): Follows the cursor coordinates to draw a glowing radial gradient mask over cards.
- [card-3d.tsx](file:///d:/Project/VOIDCAFE/src/components/ui/card-3d.tsx): Listens to cursor hover bounds to dynamically calculate 3D skew rotations (`rotateX`, `rotateY`).
- [synth-widget.tsx](file:///d:/Project/VOIDCAFE/src/components/ui/synth-widget.tsx): Contains the interactive oscilloscope Canvas drawing loop and handles volume/rate controls.
- [floating-particles.tsx](file:///d:/Project/VOIDCAFE/src/components/ui/floating-particles.tsx): Pure-function generated aesthetic particles simulating rising dust in a dark scene.

### 2. `src/components/thread` (Domain Layouts)
Handles reading and editing threads:
- [thread-card.tsx](file:///d:/Project/VOIDCAFE/src/components/thread/thread-card.tsx): Cards displaying likes, views, community badges, and tags.
- [comment.tsx](file:///d:/Project/VOIDCAFE/src/components/thread/comment.tsx): Renders comments recursively to support nested comment replies up to 3 levels deep.

---

## 🔄 Backend Migration Guide

VOIDCAFE utilizes `localStorage` coupled with asynchronous timers in [useThreads.ts](file:///d:/Project/VOIDCAFE/src/hooks/useThreads.ts) and [useComments.ts](file:///d:/Project/VOIDCAFE/src/hooks/useComments.ts) to simulate real-world delays. Follow this guide to hook the template to a database backend.

### Step 1: Create Backend API Endpoints
Your backend (Node/Express, Go, Python, etc.) must expose endpoints matching the model schemas in [types.ts](file:///d:/Project/VOIDCAFE/src/data/types.ts):

| Endpoint | Method | Params / Body | Action |
|----------|--------|---------------|--------|
| `/api/threads` | `GET` | `?community=x&sort=latest&search=query&page=1` | Returns paginated or filtered threads |
| `/api/threads` | `POST` | `{ title, body, community, tags, coverImage }` | Creates a new thread |
| `/api/threads/:id` | `GET` | — | Returns single thread details (should increment view count on the DB) |
| `/api/threads/:id/like`| `POST` | `{ userId }` | Likes/unlikes a thread (toggles user in `likedBy`) |
| `/api/threads/:id/comments` | `GET` | — | Returns flat comments list (frontend constructs tree) |
| `/api/comments` | `POST` | `{ threadId, parentId, body }` | Posts comment (should increment `replyCount` of thread) |
| `/api/comments/:id/like`| `POST` | `{ userId }` | Likes/unlikes comment |

### Step 2: Swap LocalStorage with Fetch/Axios Calls
In [useThreads.ts](file:///d:/Project/VOIDCAFE/src/hooks/useThreads.ts), modify queries to fetch from your backend instead of the local storage helper:

#### Before (Simulated LocalStorage):
```typescript
export function useThread(id: string) {
  return useQuery({
    queryKey: ['thread', id],
    queryFn: () => {
      return new Promise<Thread | null>((resolve) => {
        setTimeout(() => {
          const threads = getAllThreads()
          const thread = threads.find((t) => t.id === id) || null
          resolve(thread)
        }, 200)
      })
    },
  })
}
```

#### After (API Connection):
```typescript
import axios from 'axios'

export function useThread(id: string) {
  return useQuery({
    queryKey: ['thread', id],
    queryFn: async () => {
      const response = await axios.get<Thread>(`/api/threads/${id}`)
      return response.data
    },
  })
}
```

Apply the same change to the mutations (`useCreateThread`, `useLikeThread`, `useCreateComment`, `useLikeComment`).

### Step 3: Replace Seeder with Auth Fetch
On application boot, instead of seeding a mock database, fetch the current logged-in user profile from your session:
1. Open [main.tsx](file:///d:/Project/VOIDCAFE/src/main.tsx).
2. Remove `seedDatabase()`.
3. Set up an authentication check:
   ```typescript
   // Auto-login checking session cookies/tokens from backend
   const authStore = useAuthStore.getState()
   if (!authStore.isAuthenticated) {
     axios.get<User>('/api/auth/me')
       .then((res) => authStore.login(res.data))
       .catch(() => console.log('Session expired'))
   }
   ```
