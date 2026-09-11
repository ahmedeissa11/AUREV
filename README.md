# AUREV — Luxury Automotive Marketplace

A frontend-only, portfolio-grade marketplace for curated performance and luxury automobiles.
Cinematic, dark, restrained: 85% black / 10% light / 5% crimson.

> **Phase status:** frontend complete-scope. No backend, database, auth, or payments by design.
> All data flows through a mock API facade (`src/data/api.ts`) with realistic latency, so a real
> backend can be attached without touching a single component.

---

## Stack

| Concern  | Choice | Why |
| -------- | ------ | --- |
| Framework | React 19 + TypeScript (strict) | component architecture, typed domain model |
| Build | Vite 6 | dev speed, code-split production bundles |
| Routing | React Router 7 | declarative multi-page SPA, URL-synced state |
| Styling | Tailwind CSS v4 (`@theme` tokens) + hand-written component layer | unique identity, no component-library look |
| Motion | Custom: IntersectionObserver + CSS (`src/lib/motion.tsx`) | zero animation dependencies, GPU-friendly, `prefers-reduced-motion` native |
| Fonts | Self-hosted Fontsource — Archivo / JetBrains Mono / Cormorant Garamond | no external requests; mono for data, serif-italic for editorial accents |
| State | React context + `localStorage` (`src/state/LibraryContext.tsx`) | wishlist & compare persist across reloads |

## Routes

| Path | Page |
| ---- | ---- |
| `/` | Cinematic home: hero, ticker, editorial featured collection, brand strip, performance band, magazine-style feature, pillars, concierge band |
| `/collection` | Full inventory — search, filter sidebar (mobile drawer), sorting, URL-synced state, skeletons, empty state |
| `/vehicle/:id` | Showroom: gallery + fullscreen viewer, specs, animated performance, equipment, curator's note, inquiry modal, similar vehicles, JSON-LD |
| `/brands` | Editorial hover-preview index of 12 marques (inventory categories only) |
| `/sell` | Consignment pitch, valuation process, trust figures, validated multi-part form with photo staging + success confirmation |
| `/about` | House story: statement type, parallax photography, stats with count-up, timeline, values |
| `/concierge` | Five adaptive request types, viewing scheduler, direct lines, ticket confirmation |
| `/wishlist` | Saved garage (localStorage) + elegant empty state |
| `/compare` | Up to 3 vehicles, attribute table with best-value marking, mobile horizontal scroll |
| `*` | Designed 404 |

## Architecture notes

```
src/
├── data/          # domain types, mock inventory, async API facade (swap for fetch later)
├── lib/           # query engine (pure), formatting, motion, hooks, SEO
├── state/         # LibraryContext — wishlist + compare (max 3)
├── layout/        # RootLayout, Header (scroll-transform), MobileMenu, SearchOverlay, Footer
├── components/
│   ├── ui/        # Button, Modal/Drawer, Field, Skeleton, Ticker, Logo, icons…
│   ├── cars/      # CarCard, QuickView, Favorite/Compare actions
│   ├── filters/   # FilterPanel (controlled, shared by sidebar & drawer)
│   ├── gallery/   # VehicleGallery + lightbox (keyboard + swipe)
│   └── sections/  # homepage editorial sections
└── pages/         # lazy-loaded routes
```

- **Every form is frontend-only** with validation + mock success states (reference numbers included).
- **Accessibility:** semantic landmarks, focus traps in every overlay, `aria-pressed` toggles,
  keyboard galleries, visible focus rings, live region for result counts, reduced-motion paths
  for every animation.
- **Performance:** route-level code splitting, lazy images with decode hints, `content-visibility`
  friendly section isolation, zero runtime CSS-in-JS.
- **SEO:** per-route titles/descriptions/OG/canonical via `useSeo`, JSON-LD `Car` schema on detail,
  manifest, robots.

## Scripts

```bash
npm run dev       # Vite dev server (0.0.0.0:5173)
npm run build     # tsc --noEmit && vite build
```

## Connecting a backend later (recommended path)

1. Create Supabase (or any REST) project; tables `vehicles`, `sell_listings`, `concierge_requests`.
2. Replace the bodies of `src/data/api.ts` with `fetch`/SDK calls — signatures already async.
3. Move `queryVehicles()` into an endpoint (it is pure over `Vehicle[]` + `Filters` — trivial port).
4. Hydrate `LibraryContext` from the user account, keeping localStorage as cache.
5. Swap mock `setTimeout` confirmations for mutation calls; success UI already exists.

*All marques mentioned are inventory categories only — no affiliation is implied. Imagery is
generated for this showcase.*
