# --- Stage 1: build the React (Vite) frontend into static files ---
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# --- Stage 2: build the NestJS backend ---
FROM node:20-slim AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# --- Stage 3: production runtime, serves the API and the built frontend ---
FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=frontend-builder /app/frontend/dist ./public
COPY backend/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh && mkdir -p ./uploads

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
