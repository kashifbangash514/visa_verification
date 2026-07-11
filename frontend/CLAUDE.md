# Frontend — Visa Verification SPA

React 19 + TypeScript + Vite SPA. Client-side routing via `react-router-dom` v7. Plain CSS
(one `.css` file co-located per component/page) — no CSS framework, no component library.
Data layer is a single Axios client; no React Query/Redux — state is local `useState`.

## Commands
Run from `frontend/`:
- `npm run dev` — Vite dev server (default :5173)
- `npm run build` — `tsc -b && vite build` (type-check then bundle to `dist/`)
- `npm run lint` — ESLint (flat config, `eslint.config.js`)
- `npm run preview` — serve the production build locally

No test suite — verify with `npm run build` (catches type errors) and by running the app.

## Routes (`src/App.tsx`)
- `/` → `PublicLookupPage` — public visa lookup form + result.
- `/admin/login` → `AdminLoginPage`.
- `/admin` → `AdminDashboardPage`, wrapped in `ProtectedRoute`.
- `*` → redirect to `/`.

In production the SPA is served by the NestJS backend, which returns `index.html` for
`/admin` and `/admin/login`. `vercel.json` provides the equivalent rewrite-to-`index.html`
fallback for Vercel hosting.

## Layout
- `src/api/axiosClient.ts` — the shared Axios instance. **Use this for every API call.**
  Base URL from `VITE_API_BASE_URL` (empty string in prod = same-origin). Request interceptor
  attaches `Bearer <token>`; response interceptor clears the token and redirects to
  `/admin/login` on 401 (except on the login request itself).
- `src/auth/token.ts` — token stored in `localStorage` under `visa_admin_token`. `isTokenValid`
  decodes the JWT payload and checks `exp` client-side.
- `src/auth/ProtectedRoute.tsx` — gate for admin routes; redirects if token invalid/expired.
- `src/pages/` — page-level components (`PublicLookupPage`, `AdminLoginPage`, `AdminDashboardPage`).
- `src/components/` — reusable UI: `AdminVisaForm`, `AdminVisaTable`, `AdminSidebar`,
  `Modal`/`ConfirmDialog`, `VisaResultCard`, `StatusSeal`, `SiteHeader`/`SiteFooter`, `Spinner`,
  `EmblemMark`, and the toast system (`ToastProvider` + `ToastContext`).
- `src/types/visa.ts` — `VisaPublicResponse` / `VisaAdminResponse` and the `VisaStatus` /
  `NumberOfEntries` unions. **Keep these in sync with the backend DTOs.**

## Conventions
- Types mirror the backend response shapes exactly. `VisaAdminResponse` includes
  `computedStatus` (server-derived) plus file paths and `createdAt`; the public shape omits those.
- Feedback to the user goes through the toast provider (`useToast`), not `alert`.
- Auth is JWT-in-localStorage only — the `status`/expiry check is a UX convenience; the backend
  is the real gate.
- Admin file uploads submit multipart form data (`visaPdf` required PDF, optional `photo` /
  `document`) matching the backend's field names; PDFs open via `GET /visas/:id/download` in a new tab.
- Component styling: one co-located `.css` per component, imported at the top of the `.tsx`.
  Follow the existing className patterns rather than introducing utility classes.

## Env
- `VITE_API_BASE_URL` — points at the backend for local dev (e.g. `http://localhost:3000`).
  Leave unset/empty for production same-origin builds. See `.env.example`.
- When running dev split (Vite :5173 + backend :3000), the backend needs `CORS_ORIGIN` set to
  the Vite URL.
