# 📁 Project Directory Structure

VOIDCAFE utilizes a modular and highly organized structure, separating configuration, state, assets, UI component design tokens, and route page modules.

---

## 🗺️ Workspace Directory Map

```
VOIDCAFE/
├── docs/                      # Comprehensive technical documentation
├── public/                    # Static assets & PWA manifest configurations
└── src/                       # Application source code
    ├── assets/                # Local graphic files & fonts
    ├── components/            # Reusable UI component modules
    │   ├── common/            # Shared components (search, terminal, transitions)
    │   ├── layout/            # Layout shells (navbar, sidebar, mobile-nav)
    │   ├── thread/            # Thread-specific components (cards, lists, comments)
    │   └── ui/                # Core Aceternity UI and atomic styles
    ├── data/                  # Hardcoded seed database & TypeScript types
    ├── hooks/                 # Global React & TanStack query custom hooks
    ├── lib/                   # Utility helpers, storage, sound, and query client
    ├── routes/                # TanStack Router file-based pages
    ├── stores/                # Zustand global state stores (persisted & local)
    ├── index.css              # Custom Tailwind v4 styling declarations
    ├── main.tsx               # App mounting, db seed, and entry setup
    ├── routeTree.gen.ts       # TanStack Router automatically generated tree
    └── vite-env.d.ts          # Global TypeScript module declarations
```

---

## 🔍 Directory Breakdown

### 1. `components/`
- **`ui/`**: Low-level layout components (atomic design system). Inspired by Aceternity UI, they focus on high-fidelity animations, cursors, hover effects, and canvas overlays (e.g. `BackgroundBeams`, `Spotlight`, `Card3D`).
- **`common/`**: App-wide utility modal shells, modal helpers, page transition wrappers, and the interactive terminal console overlay.
- **`layout/`**: Major structural shells. Contains the responsive floating `Navbar`, widget-packed `Sidebar` containing the soundboard controls, and the `MobileNav` bottom bar.
- **`thread/`**: Domain specific components for thread feeds, comment trees, and post creator modals.

### 2. `data/`
- **`seed.ts`**: Contains the local database seeder (seeds 18 threads across 10 K-pop communities with nested comments and user bio cards on first-load).
- **`types.ts`**: Holds all unified TypeScript model schemas (`Thread`, `Comment`, `User`, `Notification`, etc.).

### 3. `hooks/`
- **`useThreads.ts`** & **`useComments.ts`**: Standardized data querying and mutation hooks that interface with the localStorage layer, incorporating optimistic cache updates.
- **`useSearch.ts`**: Custom debounced search hook mapping user inputs to matching databases.
- **`useKeyboardShortcuts.ts`**: Bind global keyboard event listeners (e.g., backtick to console, escape to close modals, `/` to focus search).

### 4. `lib/`
- **`synth.ts`**: Web Audio API audio synthesis engine. Contains node graph connections for background hums, chimes, and interaction hover/click audio effects.
- **`storage.ts`**: Safe wrappers around the browser `localStorage` and seeder checks.
- **`queryClient.ts`**: TanStack Query base configuration defining staleTimes and garbage collections.
- **`utils.ts`**: Shared layout helpers (e.g., `cn` class merger, dates, and number formatters).

### 5. `routes/`
TanStack Router automatically compiles folders and files inside this directory to generate pages:
- **`__root.tsx`**: Main parent view rendering `<Navbar />`, `<MobileNav />`, `<Preloader />`, `<VoidTerminal />`, and the `<Outlet />` sub-pages.
- **`index.tsx`**: Main feed page (`/`) showing hero stats, trending carousel, and thread filters.
- **`communities.tsx`**: The grid of communities (`/communities`).
- **`profile.tsx`**: User profile card, bias list editor, and tabbed activity logs (`/profile`).
- **`thread/$threadId.tsx`**: Singular thread detail page (`/thread/:threadId`) displaying the full comments hierarchy.
