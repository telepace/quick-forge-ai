#!/usr/bin/env bash

# Build and push Docker containers
# This script builds the Docker image of the project and pushes it to the Docker repository

# Strict mode, exit immediately if any command fails
set -e

# Get the absolute path of the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Check the necessary environment variables
if [ -z "$TAG" ]; then
  echo "❌ Error: TAG environment variable not set"
  echo "Example: TAG=latest ./scripts/build-push.sh"
  exit 1
fi

echo "🔨 Building and pushing Docker image with tag $TAG..."

# Set default values
FRONTEND_ENV=${FRONTEND_ENV:-production}

# Execute the build script
"$SCRIPT_DIR/build.sh" || {
  echo "❌ Docker build failed"
  exit 1
}

# Push to Docker repository
cd "$PROJECT_ROOT"
echo "🚀 Pushing Docker image to the repository..."
docker-compose -f docker-compose.yml push || {
  echo "❌ Docker push failed"
  exit 1
}

echo "✅ Build and push completed successfully"
