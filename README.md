# LifeVault — Frontend

The web UI for LifeVault, a private personal life archive. Next.js 16 App Router, React 19, plain JavaScript (no TypeScript), Tailwind CSS v4 and shadcn-style Radix primitives.

This app is **UI only**. Authentication, validation, persistence, uploads and every business rule live in the sibling Express API at `../lifevault-backend`. There are no Next.js route handlers and no server actions for data.

> Full project documentation (features, API reference, data model, deployment): [`../README.md`](../README.md)

---

## Stack

| Piece | Choice |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack, React Compiler, `cacheComponents`) |
| Runtime UI | React 19, client components |
| Language | JavaScript (`.js` / `.jsx`) |
| Styling | Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`) |
| Components | shadcn-style primitives on Radix UI |
| Forms | React Hook Form + Zod |
| Icons / toasts | `lucide-react`, `sonner` |

## Prerequisites

- Node.js 20+ (developed on Node 26)
- npm (only `package-lock.json` is committed)
- The backend running, plus its MongoDB — see [`../lifevault-backend/README.md`](../lifevault-backend/README.md)

## Quick start

```bash
npm install
cp .env.example .env.local     # then set NEXT_PUBLIC_API_URL
npm run dev                    # http://localhost:3000
```

Start the backend first. Any authenticated page needs it; if it is unreachable the API client renders the "Cannot reach the LifeVault API" error state.

> **macOS note:** AirPlay owns port 5000, so the local backend runs on `5001`. Set `NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1` in `.env.local` and `PORT=5001` in the backend `.env`.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | **yes** | Full API base **including** `/api/v1`, e.g. `https://api.example.com/api/v1`. |
| `NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID` | no | Google OAuth web client ID. Enables the "Continue with Google" button; leave empty to hide it. |

This is the only variable. `NEXT_PUBLIC_*` values are compiled into the browser bundle — never put secrets here. `.env*` is gitignored; `.env.example` is the committed template.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on `:3000` with Turbopack. |
| `npm run build` | Production build; the only full compile verification. |
| `npm start` | Serve the production build. |
| `npm run lint` | Bare `eslint` over the repo (`eslint-config-next/core-web-vitals`). Must end with 0 errors. |

There is no test runner and no `typecheck` script. Run `npm run lint && npm run build` before finishing any change.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | public | Landing page |
| `/login`, `/signup` | public | Auth forms |
| `/dashboard` | authenticated | Stats, search, recent, favorites, reminders, rediscover |
| `/archives` | authenticated | Paginated list, search, type/category/favorite filters, sorting |
| `/archives/new` | authenticated | Create item (type-aware metadata + uploads) |
| `/archives/[id]` | authenticated | Detail view, favorite toggle, edit/delete |
| `/archives/[id]/edit` | authenticated | Edit item |
| `/knowledge` | authenticated | Learning/Research experience (notes, links, books, documents, videos) |
| `/memories` | authenticated | Memories, images, events, videos |
| `/entertainment` | authenticated | Movies and books with status/rating/review |
| `/ideas` | authenticated | Business/personal ideas with priority and status |
| `/collections`, `/collections/[id]` | authenticated | Curated groups of items |
| `/timeline` | authenticated | Year/month chronological view |
| `/reminders` | authenticated | Manual and archive-linked reminders |
| `/favorites` | authenticated | Paginated favorites |
| `/settings` | authenticated | Categories, tags, theme |
| `/profile` | authenticated | Name, avatar, bio, password |

`src/app/(app)/layout.jsx` wraps every authenticated route in `AppShell` + `AuthGuard`.

## Data flow

```
component → src/services/<resource>.js → src/lib/api.js (apiRequest)
          → fetch(`${NEXT_PUBLIC_API_URL}/...`, { credentials: "include" })
          → Express API → MongoDB
```

- **Never call `fetch` from a component**; add or extend a module in `src/services/`.
- `apiRequest` sends the auth cookie (`credentials: "include"`), parses the envelope and throws `ApiError` with `message`, `status` and `details`.
- Responses are `{ success, data, meta? }` for success and `{ success: false, message, details? }` for errors. Services read `res.data.*`.
- Paginated lists return `data.items` plus `meta: { page, limit, total, totalPages, hasMore }`.
- `useApi(loader, deps)` (`src/hooks/use-api.js`) provides loading/error/reload state; `useDebouncedValue` powers search inputs.

Authentication is a JWT in the HTTP-only `lifevault_token` cookie set by the backend. The frontend never reads or stores the token; a `401` from the API raises the shared unauthorized event and `AuthGuard` returns the user to `/login`.

## Structure

```
src/
├── app/
│   ├── layout.js               # fonts, providers, metadata, theme bootstrap
│   ├── page.js                 # landing page
│   ├── login/, signup/         # public auth routes
│   └── (app)/                  # authenticated shell + all app routes
├── components/
│   ├── ui/                     # shadcn-style primitives (Radix + Tailwind)
│   ├── common/                 # page header, empty/error/loading, pagination, tag input, color picker
│   ├── archives/               # card, grid, form, metadata fields, uploader, category experience
│   ├── collections/, reminders/, settings/, auth/, layout/
├── context/                    # auth + theme providers
├── hooks/use-api.js            # useApi + useDebouncedValue
├── lib/                        # api client, utils, constants
└── services/                   # one module per backend resource
```

`@/*` maps to `./src/*` (`jsconfig.json`) — prefer it over long relative imports.

## Conventions

- Every page implements loading, empty and error states using `PageLoading`/`CardGridSkeleton`, `EmptyState` and `ErrorState`.
- Report action outcomes with `toast` (sonner); do not swallow errors.
- Keep `components/archives/metadata-fields.jsx` in sync with `lifevault-backend/src/services/archive.service.js` — metadata is validated per type on the server.
- Icons come from `lucide-react`. Prefer string icon keys across component boundaries (e.g. `icon="book"` for `CategoryExperience`) instead of passing components.
- React Compiler is enabled: avoid adding `useMemo`/`useCallback` by default, and use `useWatch` rather than `watch()` in render.
- Theme tokens live in the `@theme` block of `src/app/globals.css`; there is intentionally no Tailwind or PostCSS config file.
- `react-hooks/set-state-in-effect` and `react-hooks/purity` are disabled in `eslint.config.mjs` for deliberate browser-API syncing (localStorage, clocks, fetch-on-deps).

## Verification

```bash
npm run lint
npm run build
```

The production build prerenders all 22 routes. The dev server prints "instant navigation validation" diagnostics for `(app)` routes under `cacheComponents`/`partialPrefetching`; these are dev-only and do not affect production builds.

Browser QA was done with Playwright (Chromium) against both servers: desktop and mobile layouts, light/dark themes, auth flows, archive CRUD, favorites, collections, search/filter, timeline, reminders, settings and responsive navigation.

## Deployment

Vercel is the intended host:

1. Import the repository and set **Root Directory** to `lifevault-frontend`.
2. Framework preset: Next.js. Install `npm install`, build `npm run build`.
3. Set `NEXT_PUBLIC_API_URL=https://your-api-host/api/v1` for the Production scope, then redeploy so the value is inlined.
4. Add the deployed frontend origin to the backend's `FRONTEND_URL` (or `EXTRA_ORIGINS`), otherwise CORS blocks requests.

Both apps must be HTTPS in production: the backend issues `SameSite=None; Secure` cookies when `NODE_ENV=production`.

## Known limitations

- Uploads require Cloudinary credentials on the backend; without them `POST /uploads` returns `503` and the uploader surfaces that message rather than faking success.
- Reminders are in-app only: the bell polls while the app is open. No email, push or background delivery.
- No password reset/email verification, no real-time cross-tab sync, no offline/PWA mode, no sharing or public links.
- No component or E2E test suite is committed; verification is lint, production build and manual Playwright QA.
- All authenticated pages are client components because data comes from the cookie-authenticated API.

## License

ISC — see `../lifevault-backend/package.json`.
