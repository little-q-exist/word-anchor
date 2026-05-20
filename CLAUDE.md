# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common commands

```bash
npm run dev              # Start dev server (port 5173)
npm run build            # Production build
npm run lint             # ESLint
npm run typecheck        # TypeScript type checking (generates .react-router types first)
npm run format           # Prettier formatting
npm run test             # Vitest unit tests
npm run test:watch       # Vitest in watch mode
npm run test:e2e         # Playwright E2E tests (headless)
npm run test:e2e:headed  # Playwright E2E tests (headed)
npm run server           # json-server mock API on port 4000
```

## Architecture overview

**Stack**: React 19 + React Router 7 (SPA mode, SSR disabled) + Vite 7 + TypeScript + Ant Design 6 + TanStack React Query + Redux Toolkit + Axios.

**Backend**: Separate repo (`recite-word-server/`) running Express 5 + MongoDB + SM-2 spaced repetition algorithm. The frontend connects to it at `http://localhost:3000/api`.

**SPA mode**: `react-router.config.ts` sets `ssr: false`. The app hydrates from `entry.client.tsx`, which wraps `<HydratedRouter />` in Redux `<Provider>` and React `<StrictMode>`.

## State management split

- **Redux Toolkit** (`src/store.ts`, `src/features/userSlice.ts`) — auth only. User state (JWT token, username) persisted to `localStorage` under key `reciteWordAppUser`. On app init, `login()` reducer restores from localStorage or accepts a payload.
- **TanStack React Query** — all server state: learning sessions, words, user stats, familiarity updates. Queries are defined in each module's `hooks/queries/` directory.

## Path aliases (defined in `vite.config.ts`)

When an import path contains two or more consecutive `../` segments (i.e., references to a parent directory two or more levels up), a path alias must be used instead.
- `@/` → `src/`
- `@modules/` → `src/modules/`
- `@shared/` → `src/shared/`

## Module structure

Each feature module under `src/modules/<name>/` follows this pattern:
- `components/` — UI components
- `hooks/` + `hooks/queries/` — custom hooks and React Query hooks
- `services/` — Axios API calls (plain functions returning promises, not hooks)
- `types.ts` — module-specific TypeScript types

### Key modules

- **`word-learning`** — core learning/review flow. `LearnWord.tsx` orchestrates: session init → queue consumption → word display → familiarity rating → result screen.
- **`word-core`** — reusable word display components (`WordCards`, `WordSideButtonGroup`) and their API services, shared by both learning and vocabulary browsing.
- **`auth`** — login/register forms and auth API calls.
- **`vocabulary`** — word browsing, search, and detail views.

## Axios response unwrapping

`src/shared/services/config.ts` sets up interceptors:
- **Request**: injects JWT `Bearer` token from localStorage
- **Response**: if the payload matches `{ code, data, message }` shape (standard backend envelope), it unwraps to `data` automatically. Services receive unwrapped data directly.

Each service file calls `globalConfig()` at module load to ensure interceptors are registered (idempotent via `configured` flag).

## Learning queue engine (`useLearnQueue.ts`)

The central piece of the learning flow. Manages:
- `index` — current position in the word list
- `repeatQueue` — indices of words the user got wrong (familiarity < 4), re-queued for retry
- `isRepeating` — whether we're in the repeat phase (draining the repeatQueue)
- `version` — optimistic lock token synced with backend

On each state change, the queue snapshot is synced to the backend via `PATCH /users/:id/learning-sessions/:mode` with optimistic concurrency control. The snapshot is hydrated from the backend on page load, allowing session persistence across refreshes.

## Familiarity scoring

Buttons in `LearnWordButtons.tsx`:
- **Known** (5) — word mastered, passed
- **Unfamiliar** (3) — word needs review, goes to repeat queue
- **Unknown** (0) — word not known, goes to repeat queue

Scores < 4 trigger re-queuing. During the repeat phase, familiarity is handled locally (no API call); during the normal phase, it calls `PATCH /users/:id/words/:wordId/familiarity` which triggers backend SM-2 calculation.

## useSuccessQuery pattern

`src/modules/word-learning/hooks/queries/useSuccessQuery.ts` wraps `useQuery` to provide `onSuccess`/`onError` callbacks via refs (avoids stale closures). Used as the base for all query hooks in the app.

## Routing

Flat route config in `src/routes.ts`. All routes are nested under `layout/Layout.tsx` (header + menu + content area). Protected routes use the `ProtectedRoute` component which checks Redux user state and redirects to login if unauthenticated.

## Testing

- **Vitest** for unit tests (e.g., `useLearnQueue.test.ts`)
- **Playwright** for E2E tests in `src/test/`. Playwright config auto-starts the dev server on port 5173.
