# 🏗️ Application Architecture

VOIDCAFE is architected as a highly optimized, fully client-side single-page application (SPA). It simulates full server capabilities (database, mutations, cache invalidations, and prefetching) using local storage and TanStack state engines.

---

## 🎛️ Global State: Zustand

Global layout variables, preferences, and authentication states are governed by **Zustand**. 

### Persistence Strategy
Zustand's state stores are split into persisted and in-memory states to maintain system integrity:

1. **`authStore.ts`**:
   - Stores current logged-in user profile data and session parameters.
   - Fully persisted to `localStorage` under key `voidcafe_auth`.
2. **`preferencesStore.ts`**:
   - Stores visual controls like `feedMode` (Infinite Scroll vs Paginated), `synthVolume`, and LFO `synthGlitchRate`.
   - **Selective Persistence (Partialization)**: Layout overlay toggles (such as `terminalOpen`, `createModalOpen`, and `preloaded` flags) are **excluded** from persistence. This ensures that refreshing the browser fresh-boots the preloader and closes modal overlays while retaining user volume/feed preferences.

---

## 🧭 File-Based Routing: TanStack Router

VOIDCAFE utilizes **TanStack Router** (v1) for state-safe, TypeScript-first routing.

- **Generated Route Tree**: Vite plugin compiles files in `/src/routes` into a compiled route tree at `routeTree.gen.ts`.
- **Automatic Code Splitting**: Subpages (like `/profile` or `/thread/$threadId`) are dynamically split into separate JS chunks, minimizing the initial HTML bundle size.
- **Visual Nesting**: A parent `__root.tsx` wraps the entire application layout, providing shared layout nodes (navbars, background particles, search overlays, and preloader animations) while subpages render inside `<Outlet />`.

---

## 🔄 Data Fetching & Caching: TanStack Query (v5)

All data interactions simulate network calls with asynchronous promises and randomized timeouts (e.g. 200ms - 400ms network simulation delays).

### Caching and Stale Time
- **`staleTime`**: Set to 5 minutes. Queries remain fresh in cache, preventing redundant simulations during quick navigation.
- **`gcTime`**: Set to 30 minutes. Inactive queries are garbage collected.

### Pagination & Prefetching ("Best Caching" Practices)
For the Paginated Archive feed, two key performance enhancements are implemented:

1. **Placeholder Keeping**:
   - The query hook is configured with `placeholderData: (previousData) => previousData`.
   - When moving from Page 1 to Page 2, TanStack Query continues rendering Page 1's posts instead of flashing a loading skeleton, completing a smooth transition when Page 2 is loaded.
2. **Prefetching adjacent pages**:
   - Inside the feed component, a mounting hook triggers background cache fetches:
     ```typescript
     // Prefetch next page
     if (page < totalPages) {
       queryClient.prefetchQuery({
         queryKey: ['threads', 'paginated', filters, page + 1, limit],
         queryFn: () => fetchPaginatedThreads(filters, page + 1, limit),
       })
     }
     ```
   - Clicking "Next Page" loads the next page instantly with **0ms latency** because the data is already inside the React Query cache.

### Optimistic Updates with Rollback
Mutations (such as Liking a Thread or Liking a Comment) reflect changes immediately on the UI before the virtual server confirms the request:
1. **Cancel Queries**: Outstanding queries are cancelled to prevent overwrites.
2. **Snapshot Cache**: Stores the previous state in a context snapshot.
3. **Optimistically Mutate**: Sets cache values instantly (e.g., increments like count, adds user to `likedBy` array).
4. **Error Rollback**: If the mutation promise rejects, the `onError` hook restores the snapped previous state, maintaining synchronization.
5. **Settled Invalidation**: Triggers cache invalidation (`invalidateQueries`) upon completion to fetch the final virtual state.
