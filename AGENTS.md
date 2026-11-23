# AGENTS.md

LifeVault frontend: Next.js 16 App Router, plain JavaScript (no TypeScript), React 19, Tailwind CSS v4.

LifeVault is a personal life archive. This app is the UI only — all data, auth and business logic live in the separate Express backend at `../lifevault-backend` (see the repository root `README.md`).

## Commands

- Use **npm** (only `package-lock.json` is committed, despite the default README listing yarn/pnpm/bun).
- `npm install` — install dependencies.
- `npm run dev` — dev server on :3000. Requires the backend (see below).
- `npm run lint` — bare `eslint` over the cwd, using `eslint.config.mjs` (`eslint-config-next/core-web-vitals`). Must finish with 0 errors.
- `npm run build` — production build; also the only full compile/verification pass.
- There is no test runner and no `typecheck` script. No CI workflows or git hooks exist, so run lint and build yourself before finishing.

## Local environment

- Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL`.
- `.env*` is gitignored; `.env.example` is the committed template. Never put private secrets in `NEXT_PUBLIC_*` — those values ship to the browser.
- The backend and its MongoDB must be running for any authenticated page to work. A missing backend surfaces as the API client's "Cannot reach the LifeVault API" error state.
- On macOS, port 5000 is taken by AirPlay (`ControlCenter`), so the local dev backend runs on **5001** and `.env.local` points at `http://localhost:5001/api/v1`. Deployed backends use a normal public URL.
- Auth is a JWT in an HTTP-only cookie (`lifevault_token`) set by the backend. The frontend never reads or stores tokens; `fetch` uses `credentials: "include"`, and CORS + Origin/Referer checks live in the backend.
- Uploads call `POST /uploads` with `FormData`. Without Cloudinary credentials the backend returns 503; the UI surfaces that message. Do not fake upload success in the UI.

## Layout

- All app code lives in `src/`; routes are `src/app/**` (entry: `src/app/layout.js`, root page: `src/app/page.js`).
- Route groups: `src/app/(app)` is the authenticated shell (`layout.jsx` renders `AppShell` + `AuthGuard`); public routes are `page.js`, `login/`, `signup/`.
- `@/*` maps to `./src/*` via `jsconfig.json` — use it instead of long relative imports.
- Where things go:
  - `src/components/ui/**` — shadcn-style primitives (Radix + Tailwind). Add new primitives here.
  - `src/components/common/**` — shared states (page header, empty/error/loading, pagination, tag input, color picker).
  - `src/components/archives/**` — archive card/grid, form, metadata fields, uploader, category experience.
  - `src/components/layout/**` — sidebar, topbar, reminder bell, mobile nav, auth guard.
  - `src/services/**` — one module per backend resource; every network call goes through these.
  - `src/lib/api.js` — `fetch` wrapper (`apiRequest`, `buildQuery`, `ApiError`). Do not call `fetch` directly from components.
  - `src/lib/constants.js` — nav items, archive type metadata, status enums, chip colors.
  - `src/context/**` — auth and theme providers.
  - `src/hooks/use-api.js` — `useApi(loader, deps)` data loading hook and `useDebouncedValue`.
- Backend is a sibling project at `../lifevault-backend` with the REST API under `/api/v1`; there are no Next.js route handlers and no server actions for data. Do not move business logic into this app.

## Conventions

- Success responses are `{ success, data, meta? }`; errors are `{ success: false, message, details? }`. `apiRequest` unwraps nothing — services read `res.data.*`.
- Paginated lists return `{ data: { items }, meta: { page, limit, total, totalPages, hasMore } }`.
- Metadata (book/movie/idea/memory/etc.) is validated by type on the backend. Keep form fields in `components/archives/metadata-fields.jsx` in sync with `../lifevault-backend/src/services/archive.service.js`.
- Every page needs loading, empty and error states — reuse `PageLoading`/`CardGridSkeleton`, `EmptyState`, `ErrorState`.
- Use `toast` (sonner) for action feedback; do not silently swallow errors.
- Icons come from `lucide-react`. Client components that receive props from server components must not be passed functions (components crossing the server/client boundary are client components already — prefer string props for icon selectors, e.g. `icon="book"` in `CategoryExperience`).
- React Compiler is on: do not add `useMemo`/`useCallback` by default, and avoid `watch()` from React Hook Form in render (use `useWatch`).

## Toolchain gotchas

- `next.config.mjs` enables `reactCompiler`, `cacheComponents`, `partialPrefetching`, and Turbopack. Keep these on unless asked.
- Tailwind v4 is wired through the `turbopack.rules` CSS loader (`@tailwindcss/turbopack`) and `@import "tailwindcss"` in `src/app/globals.css`. There is intentionally no `tailwind.config.js` or PostCSS config — do not add them; theme tokens go in the `@theme` block of `globals.css`.
- `eslint.config.mjs` disables `react-hooks/set-state-in-effect` and `react-hooks/purity` because a few components intentionally sync React state with browser APIs (localStorage, fetch-on-deps, clock-based reminder UI).
- The dev server reports "instant navigation validation" errors for route-group pages under `(app)`. They are dev-only diagnostics from `cacheComponents`/`partialPrefetching`, not runtime failures; production builds prerender all routes successfully.
- The backend CORS allowlist is `FRONTEND_URL` plus `EXTRA_ORIGINS`. A new preview domain must be added there or browser requests will be blocked.
- Every page under `src/app/(app)` is a client component because data comes from the cookie-authenticated API. Server-side fetching would need to forward cookies; keep the current client-data pattern unless a deliberate refactor is requested.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
