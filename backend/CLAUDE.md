# Backend — Visa Verification API

NestJS 10 + TypeORM + MySQL REST API. In production this same process also serves the
built frontend (static files from `public/`) and exposes the API — no `/api` prefix.

## Commands
Run from `backend/`:
- `npm run start:dev` — watch-mode dev server (default port 3000)
- `npm run start:prod` — run compiled `dist/main.js`
- `npm run build` — `nest build`
- `npm run lint` — ESLint with `--fix`
- `npm run format` — Prettier over `src/**/*.ts`
- `npm run migration:run` / `migration:revert` — apply/undo migrations (dev, via ts-node)
- `npm run migration:run:prod` — run migrations against compiled `dist/`
- `npm run migration:generate -- src/database/migrations/<Name>` — generate from entity diff
- `npm run seed:admin` (dev) / `seed:admin:prod` (compiled) — create first admin from
  `ADMIN_USERNAME`/`ADMIN_PASSWORD`; idempotent (skips if username exists)

There is no test suite. Verify changes by building + linting and, when relevant, running
the dev server against a local MySQL.

## Layout
- `src/main.ts` — bootstrap: CORS, global `ValidationPipe` (`whitelist` + `transform`),
  global `AllExceptionsFilter`.
- `src/app.module.ts` — TypeORM async config, `ServeStaticModule` (serves `../public`),
  wires `AuthModule` + `VisasModule`. `synchronize: false` — schema changes go through migrations.
- `src/app.controller.ts` — serves `index.html` for the SPA routes `/admin` and `/admin/login`.
- `src/auth/` — JWT login. `POST /auth/login` → `{ accessToken }`. `JwtAuthGuard` protects
  admin routes; strategy in `strategies/jwt.strategy.ts`.
- `src/visas/` — the core feature (controller, service, DTOs, multer config, `computeStatus`).
- `src/entities/` — `Visa`, `Admin` TypeORM entities.
- `src/database/data-source.ts` — standalone DataSource for the TypeORM CLI (migrations/seed).
- `src/common/filters/http-exception.filter.ts` — uniform error JSON:
  `{ statusCode, message, path, timestamp }`.

## API surface
- `POST /visas/lookup` — public. Rate-limited to **5 req/min per IP** (`@nestjs/throttler`).
  Matches on `passportNumber` + `evisaNumber`; returns `VisaPublicResponse` or 404 "VISA not verified."
- `GET /visas/:id/download` — public. Streams the visa PDF `inline` after re-validating the
  record against the DB. Uploaded files are **never** served via static middleware.
- `GET /visas` — admin (JWT). Lists all, newest first, as `VisaAdminResponse`.
- `POST /visas` — admin (JWT). Multipart create; fields `visaPdf` (required, PDF),
  `photo`, `document` (optional).
- `DELETE /visas/:id` — admin (JWT). Removes record + its stored files.

## Conventions & gotchas
- **Status is computed, not just stored.** `status` column is the admin-set value; the public
  response's `status` and admin `computedStatus` come from `utils/compute-status.ts`
  (REVOKED stays REVOKED; no/expired `visaValidUntil` → EXPIRED; else compare against today).
  When changing status logic, edit `compute-status.ts` only.
- **Responses go through mappers** — never return raw entities. Use `toPublicVisaResponse` /
  `toAdminVisaResponse`. Public response deliberately omits file paths and `createdAt`.
- **File uploads** (`visas/multer.config.ts`): disk storage, UUID filenames, per-field mimetype
  allowlist, 5 MB limit. Uploads live in `UPLOADS_DIR` (prefers `RAILWAY_VOLUME_MOUNT_PATH`,
  then `UPLOADS_DIR` env, else `./uploads`). On create failure or delete, orphaned files are
  unlinked (`deleteUploadedFiles` / `deleteStoredFile`). File-filter rejections are collected on
  the request and thrown via `assertNoFileValidationErrors`.
- **Uniqueness:** `(passportNumber, evisaNumber)` is a unique constraint; the service maps MySQL
  `ER_DUP_ENTRY` to a 409 `ConflictException`.
- **DB config falls back to Railway `MYSQL*` vars** in both `app.module.ts` and `data-source.ts` —
  keep the two in sync if you change connection logic.
- **CORS** default origin is set in `main.ts` (`CORS_ORIGIN`, production frontend domain).
  Override via env for local dev (Vite on :5173).
- Env reference lives in `.env.example` (DB, `JWT_SECRET`, `JWT_EXPIRES_IN`, admin seed, uploads).

## Adding a migration (schema change)
1. Edit the entity. 2. `npm run migration:generate -- src/database/migrations/<Name>`.
3. Review the generated SQL. 4. `npm run migration:run`. Never rely on `synchronize`.
