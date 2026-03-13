# -------- Build Stage --------
FROM node:20-alpine AS builder
WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable

# Copy dependency files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies with frozen lockfile and limited concurrency
RUN pnpm install --frozen-lockfile --network-concurrency 1

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# -------- Runtime Stage --------
FROM gcr.io/distroless/nodejs:20 AS runtime

# Set working directory
WORKDIR /app

# Use the non-root user provided by distroless (uid 65532)
USER 65532

# Copy only necessary built artifacts
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Health check (optional, adjust as needed)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["server.js"]