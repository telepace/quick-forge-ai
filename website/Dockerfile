# Stage 1: Build the application
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy dependency definition files
COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Set environment variables (if any needed during build)
# ARG NEXT_PUBLIC_...=...
# ENV NEXT_PUBLIC_...=$NEXT_PUBLIC_...

# Build the Next.js application
RUN pnpm build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Set environment variables for production
# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1
# Add any other production environment variables here
# ENV FOO=bar

# Install pnpm only to leverage the deploy command if needed,
# otherwise, copy artifacts directly if using standalone output.
# Using standalone output is generally preferred for Next.js.
# Check your next.config.ts if output: 'standalone' is configured.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 8000

# Command to run the application
CMD ["node", "server.js"]