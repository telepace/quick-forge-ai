#!/usr/bin/env bash

# Run tests in Docker environment
# This script runs all tests in a Docker container

# Strict mode, exit immediately if any command fails
set -e

# Get the absolute path of the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "🧪 Running tests in Docker environment..."

# Enter the project root directory
cd "$PROJECT_ROOT"

# Build container
echo "🔨 Building Docker container..."
docker compose build || {
  echo "❌ Docker build failed"
  exit 1
}

# Clean up existing containers
echo "🧹 Cleaning up previous containers..."
docker compose down -v --remove-orphans || {
  echo "⚠️ Container cleanup warning, proceeding..."
}

# Start container
echo "▶️ Starting Docker container..."
docker compose up -d || {
  echo "❌ Container startup failed"
  exit 1
}

# Execute tests
echo "🧪 Running tests..."
docker compose exec -T backend bash scripts/tests-start.sh "$@" || {
  echo "❌ Test failed"
  docker compose down -v --remove-orphans
  exit 1
}

# Clean up containers
echo "🧹 Cleaning up containers after testing..."
docker compose down -v --remove-orphans

echo "✅ Tests completed successfully"
