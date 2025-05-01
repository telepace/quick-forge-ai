#!/usr/bin/env bash

# Run backend tests with coverage
# This script runs pytest with coverage reporting

# Strict mode, exit immediately if any command fails
set -e

# Get the absolute path of the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "🧪 Running backend tests with coverage..."

# Enter backend directory
cd "$BACKEND_DIR"

# Set default title for coverage report
TITLE="${@:-coverage}"

# Run tests with coverage
echo "🧪 Running tests..."
coverage run --source=app -m pytest || {
  echo "❌ Tests failed"
  exit 1
}

# Generate coverage report
echo "📊 Generating coverage report..."
coverage report --show-missing || {
  echo "❌ Failed to generate coverage report"
  exit 1
}

# Generate HTML coverage report
echo "📄 Generating HTML coverage report..."
coverage html --title "$TITLE" || {
  echo "❌ Failed to generate HTML coverage report"
  exit 1
}

echo "✅ Tests completed successfully"
