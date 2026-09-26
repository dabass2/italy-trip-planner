# Stage 1: Builder
# Debian (glibc) in both stages so better-sqlite3's native binary built here
# can load at runtime.
FROM node:24-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:24-slim AS production

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# TanStack Start / Nitro creates a standalone server in .output
# This contains its own minimal node_modules and the bundled server code.
COPY --from=builder /app/.output ./.output

# If your app needs the public assets (often bundled in .output/public)
# Nitro handles this automatically via the server entry point.

# Handle the SQLite DB file permissions
# We touch it to ensure it exists so we can chown it before the volume mounts.
RUN touch italy.db && chown -R node:node /app

USER node

EXPOSE 3000

# Start the Nitro server
CMD ["node", ".output/server/index.mjs"]