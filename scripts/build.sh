#!/usr/bin/env bash

# Build Docker container
# This script builds the Docker image for the project

# Strict mode, exit immediately if any command fails
set -e

# Get the absolute path of the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Check for necessary environment variables
if [ -z "$TAG" ]; then
  echo "❌ Error: TAG environment variable not set"
  echo "Example: TAG=latest ./scripts/build.sh"
  exit 1
fi

echo "🔨 Building Docker image with tag $TAG..."

# Set default values
FRONTEND_ENV=${FRONTEND_ENV:-production}

# Execute docker-compose build
cd "$PROJECT_ROOT"
docker-compose -f docker-compose.yml build || {
  echo "❌ Docker build failed"
  exit 1
}

echo "✅ Build completed successfully"
