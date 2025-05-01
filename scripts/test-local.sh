#!/usr/bin/env bash

# Local testing environment
# This script runs tests in the local environment

# Strict mode, exit immediately if any command fails
set -e

# Get the absolute path of the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "🧪 Running tests in the local environment..."

# Enter the project root directory
cd "$PROJECT_ROOT"

# Clean up existing containers
echo "🧹 Cleaning up previous containers..."
docker-compose down -v --remove-orphans || {
  echo "⚠️ Container cleanup warning, proceeding..."
}

# Clean up Python cache files (only on Linux)
if [ "$(uname -s)" = "Linux" ]; then
    echo "🧹 Cleaning up Python cache files..."
    sudo find . -type d -name __pycache__ -exec rm -r {} \+ 2>/dev/null || true
fi

# Build containers
echo "🔨 Building Docker containers..."
docker-compose build || {
  echo "❌ Docker build failed"
  exit 1
}

# Start containers
echo "▶️ Starting Docker containers..."
docker-compose up -d || {
  echo "❌ Container start failed"
  exit 1
}

# Execute tests
echo "🧪 Running tests..."
docker-compose exec -T backend bash scripts/tests-start.sh "$@" || {
  echo "❌ Test failed"
  exit 1
}

echo "✅ Tests completed successfully"
