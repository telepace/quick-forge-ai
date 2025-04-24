FROM node:20.0.0-alpine AS builder

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy project files
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy all source code
COPY . .

# Ensure the public directory exists
RUN mkdir -p public

# Build the application
RUN npm run build
RUN npm run postbuild

# Production environment runtime stage
FROM node:20.0.0-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy dependencies and build products
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/out ./out
# Create public directory in case it doesn't exist in the builder stage
RUN mkdir -p ./public
# In Docker 19.03+ we can use --ignore-missing flag, but for compatibility we use this approach
COPY --from=builder /app/public/ ./public/ 

# Expose port
EXPOSE 3000

# Install static server
RUN npm install -g serve

# Start static server
CMD ["serve", "-s", "out", "-p", "3000"] 