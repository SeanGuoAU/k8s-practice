# -------- Build Stage --------
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --network-concurrency 1

COPY . .
RUN pnpm build

# -------- Runtime Stage --------
FROM gcr.io/distroless/nodejs:20 AS runtime
WORKDIR /app

# Non-root user
RUN addgroup -S appgroup && adduser -S -G appgroup -u 1001 appuser
USER appuser

# Copy only built artifacts
COPY --from=builder /app/.next/standalone ./ 
COPY --from=builder /app/.next/static .next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]