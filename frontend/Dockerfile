# -------- Build Stage --------
FROM node:24-alpine AS builder
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

# Install all dependencies needed for build, skip scripts like husky
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm build

# -------- Runtime Stage --------
FROM gcr.io/distroless/nodejs24-debian12:nonroot AS runtime
WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

CMD ["server.js"]