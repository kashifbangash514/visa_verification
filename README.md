# VISA Verification App

A full-stack VISA verification application: a NestJS API backed by MySQL, with a React (Vite) single-page
app served as static files by the same NestJS process in production.

- `/backend` — NestJS API (TypeORM, MySQL, JWT auth, file uploads)
- `/frontend` — React + TypeScript SPA (Vite build, client-side routing via `react-router-dom`)

## Running locally with Docker Compose

1. Copy the root environment file and fill in real secrets:

   ```sh
   cp .env.example .env
   ```

2. Build and start everything (MySQL + the NestJS app, which also serves the built frontend):

   ```sh
   docker compose up --build
   ```

   On startup, the `app` container automatically runs any pending TypeORM migrations before starting the
   server. The app will be available at `http://localhost:3000` (or whatever `PORT` you set in `.env`).

3. Create the first admin user (only needs to be run once). This calls the seed script inside the running
   `app` container, which reads `ADMIN_USERNAME` / `ADMIN_PASSWORD` from the environment and is safe to
   re-run (it skips creation if that username already exists):

   ```sh
   docker compose exec app npm run seed:admin:prod
   ```

4. Sign in at `http://localhost:3000/admin/login` with the admin credentials from your `.env`.

Uploaded files (visa PDFs, photos, documents) are stored in a Docker volume mounted at `/app/uploads`
inside the `app` container, so they persist across `docker compose restart` / rebuilds. They are never
served as static files — they're only reachable through the authenticated/DB-validated API routes.

## Running locally without Docker

You'll need a local MySQL 8 instance and Node.js 20+.

**Backend:**

```sh
cd backend
cp .env.example .env   # fill in your local MySQL credentials and a JWT secret
npm install
npm run migration:run  # applies the schema
npm run seed:admin     # creates the first admin user from ADMIN_USERNAME / ADMIN_PASSWORD in .env
npm run start:dev
```

**Frontend:**

```sh
cd frontend
cp .env.example .env   # VITE_API_BASE_URL should point at the backend, e.g. http://localhost:3000
npm install
npm run dev
```

In this mode the frontend runs on its own Vite dev server port (e.g. `http://localhost:5173`) and calls the
backend on a different port, so the backend needs `CORS_ORIGIN` set (in `backend/.env`) to the frontend's
dev URL.

For a single combined production-like build (no Docker), build the frontend and copy its output into the
backend's `public` folder, then run the compiled backend:

```sh
cd frontend && npm run build
cp -r dist/* ../backend/public/
cd ../backend && npm run build && npm run start:prod
```

## Project structure notes

- The backend serves the API directly at `/auth/*` and `/visas/*` (no `/api` prefix), and serves the
  built frontend's static assets plus an `index.html` fallback for the client-side `/admin` and
  `/admin/login` routes from the same process/port in production.
- `GET /visas/:id/download` streams the uploaded PDF inline (`Content-Disposition: inline`, opened in a
  new tab by the frontend) after re-validating the record against the database — uploaded files are never
  exposed through static-file middleware.
- `POST /visas/lookup` is rate-limited to 5 requests/minute per IP via `@nestjs/throttler`.

## Production deployment note

This repo only runs the Node/NestJS process and MySQL — it does not terminate TLS. Put a reverse proxy
(e.g. [Caddy](https://caddyserver.com/)) in front of it in production to handle HTTPS; that's outside the
scope of this repo.
